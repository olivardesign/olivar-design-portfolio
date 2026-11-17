// ============================================================================
// Olivar Design — Vercel Serverless Endpoint: /api/consultation
// Validates lead submission, enforces invisible spam & rate-limit protection,
// and forwards structured payload to Google Apps Script Webhook (Google Sheet +
// instant notification email to design@olivardesign.com).
// ============================================================================

const NOTIFICATION_EMAIL = process.env.OLIVAR_NOTIFICATION_EMAIL || 'design@olivardesign.com';
const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzVHtfiMCMGLo7Wf-BVtbe5AWyrXfnLW3cJt-w8FjptKLpJBZTjccrRpOU-_Q6lk5a-BQ/exec';

// Lightweight in-memory rate limit & idempotency cache per serverless instance
const seenIdempotencyKeys = new Map(); // idempotency_key -> response payload
const ipRateMap = new Map();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

        // 1. Invisible Spam Protection: Honeypot & Minimum Completion Time
        if (body?.security?.honeypot_Triggered) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: true, status: 'filtered' }));
        }
        if (typeof body?.security?.completion_seconds === 'number' && body.security.completion_seconds < 2) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: true, status: 'filtered' }));
        }

        // 2. Idempotency Guard (Prevent duplicate double-submissions)
        const idempotencyKey = body?.idempotency_key || body?.lead_id || '';
        if (idempotencyKey && seenIdempotencyKeys.has(idempotencyKey)) {
            const cachedResult = seenIdempotencyKeys.get(idempotencyKey);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
                ...cachedResult,
                duplicate_ignored: true
            }));
        }

        // 3. Per-IP Rate Limit (Max 10 submissions per 10 minutes per IP)
        const forwardedFor = req.headers?.['x-forwarded-for'];
        const clientIp = (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') || req.socket?.remoteAddress || 'unknown';
        const now = Date.now();
        const ipHistory = (ipRateMap.get(clientIp) || []).filter(ts => now - ts < 10 * 60 * 1000);
        if (ipHistory.length >= 10) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: 'Too many requests. Please try again shortly.' }));
        }
        ipHistory.push(now);
        ipRateMap.set(clientIp, ipHistory);

        // 4. Required Field Validation (Full Name, Phone, Services, Project Type, City, Stage, Timeline)
        const fullName = body?.client?.full_name?.trim();
        const phone = body?.client?.phone_normalized?.trim() || body?.client?.phone_raw?.trim();
        const city = body?.project?.city?.trim();
        const services = body?.project?.services;
        const projectType = body?.project?.project_type?.trim();
        const stage = body?.project?.stage?.trim();
        const timeline = body?.project?.timeline?.trim();

        if (!fullName || !phone || !city || !projectType || !stage || !timeline || !Array.isArray(services) || services.length === 0) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: 'Missing required consultation fields.' }));
        }

        const webhookUrl = process.env.OLIVAR_GOOGLE_SCRIPT_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
        if (!webhookUrl) {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
                ok: false,
                error: 'Lead database connection (OLIVAR_GOOGLE_SCRIPT_WEBHOOK_URL) is not configured yet.'
            }));
        }

        const enrichedPayload = {
            ...body,
            notification_recipient: process.env.OLIVAR_NOTIFICATION_EMAIL || NOTIFICATION_EMAIL
        };

        // 5. Forward to Google Apps Script Webhook (Google redirects 302 on Web Apps; fetch follows redirects)
        const webhookRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(enrichedPayload),
            redirect: 'follow'
        });

        const responseText = await webhookRes.text();
        let scriptResult = null;
        try {
            scriptResult = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Invalid JSON from Google Apps Script (HTTP ${webhookRes.status}): ${responseText.slice(0, 180)}`);
        }

        if (!webhookRes.ok || !scriptResult || scriptResult.ok !== true) {
            throw new Error(scriptResult?.error || `Google Script Webhook failed with HTTP ${webhookRes.status}`);
        }

        const successResponse = {
            ok: true,
            lead_id: scriptResult.lead_id,
            status: scriptResult.status || 'NEW LEAD',
            submitted_at: scriptResult.submitted_at,
            recipient: enrichedPayload.notification_recipient
        };

        if (idempotencyKey) {
            seenIdempotencyKeys.set(idempotencyKey, successResponse);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(successResponse));
    } catch (error) {
        console.error('[Olivar /api/consultation Error]:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
            ok: false,
            error: error?.message || 'Unable to process consultation request.'
        }));
    }
}
