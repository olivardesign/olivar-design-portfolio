/* ==========================================================================
   Olivar Design — /consultation Progressive Qualification Controller
   Bilingual (EN / AR RTL) · 7-Step Flow · Conditional Step 04 · Attribution
   ========================================================================== */

(function () {
    const STORAGE_STATE_KEY = 'olivar_consultation_draft_v2';
    const LANG_STORAGE_KEY = 'olivar_lang';
    const pageLoadTimestamp = Date.now();

    // 1. Capture / Update Invisible Marketing Attribution (First-Touch & Last-Touch)
    function captureAttribution() {
        try {
            const params = new URLSearchParams(window.location.search);
            const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ttclid', 'twclid'];
            const current = {};
            let hasUrlParams = false;

            keys.forEach(k => {
                const v = params.get(k);
                if (v) {
                    current[k] = v;
                    hasUrlParams = true;
                }
            });

            const nowIso = new Date().toISOString();
            const firstRaw = localStorage.getItem('olivar_attribution_first');
            if (!firstRaw) {
                const firstTouch = {
                    utm_source: current.utm_source || '',
                    utm_medium: current.utm_medium || '',
                    utm_campaign: current.utm_campaign || '',
                    utm_content: current.utm_content || '',
                    utm_term: current.utm_term || '',
                    fbclid: current.fbclid || '',
                    gclid: current.gclid || '',
                    ttclid: current.ttclid || '',
                    twclid: current.twclid || '',
                    initial_referrer: document.referrer || 'Direct',
                    landing_page: window.location.pathname + window.location.search,
                    captured_at: nowIso
                };
                localStorage.setItem('olivar_attribution_first', JSON.stringify(firstTouch));
            }

            if (hasUrlParams || !sessionStorage.getItem('olivar_attribution_last')) {
                const lastTouch = {
                    utm_source: current.utm_source || '',
                    utm_medium: current.utm_medium || '',
                    utm_campaign: current.utm_campaign || '',
                    utm_content: current.utm_content || '',
                    utm_term: current.utm_term || '',
                    fbclid: current.fbclid || '',
                    gclid: current.gclid || '',
                    ttclid: current.ttclid || '',
                    twclid: current.twclid || '',
                    referrer: document.referrer || 'Direct',
                    landing_page: window.location.pathname + window.location.search,
                    captured_at: nowIso
                };
                sessionStorage.setItem('olivar_attribution_last', JSON.stringify(lastTouch));
                localStorage.setItem('olivar_attribution_last', JSON.stringify(lastTouch));
            }
        } catch (e) {}
    }

    function getAttributionPayload() {
        let first = {};
        let last = {};
        try {
            first = JSON.parse(localStorage.getItem('olivar_attribution_first') || '{}');
            last = JSON.parse(sessionStorage.getItem('olivar_attribution_last') || localStorage.getItem('olivar_attribution_last') || '{}');
        } catch (e) {}

        const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        return {
            utm_source: last.utm_source || first.utm_source || 'Direct',
            utm_medium: last.utm_medium || first.utm_medium || '',
            utm_campaign: last.utm_campaign || first.utm_campaign || '',
            utm_content: last.utm_content || first.utm_content || '',
            utm_term: last.utm_term || first.utm_term || '',
            fbclid: last.fbclid || first.fbclid || '',
            gclid: last.gclid || first.gclid || '',
            ttclid: last.ttclid || first.ttclid || '',
            initial_referrer: first.initial_referrer || document.referrer || 'Direct',
            landing_page: first.landing_page || window.location.pathname,
            first_touch: first,
            last_touch: last,
            device_type: isMobile ? 'Mobile' : 'Desktop'
        };
    }

    captureAttribution();

    // 2. Determine Initial Language (URL ?lang=ar|en -> localStorage('olivar_lang') -> 'en')
    function detectInitialLang() {
        try {
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang === 'ar' || urlLang === 'en') {
                localStorage.setItem(LANG_STORAGE_KEY, urlLang);
                return urlLang;
            }
            const saved = localStorage.getItem(LANG_STORAGE_KEY);
            if (saved === 'ar' || saved === 'en') return saved;
        } catch (e) {}
        return 'en';
    }

    let lang = detectInitialLang();

    // 3. State Management & Session Persistence
    const defaultState = {
        step: 0, // 0 = Intro, 1..7 = Questionnaire Steps, 8 = Confirmation
        services: [],
        projectType: '',
        projectTypeOther: '',
        city: '',
        district: '',
        area: '',
        stage: '',
        stageOther: '',
        timeline: '',
        description: '',
        fullName: '',
        phone: '',
        email: '',
        honeypot: '',
        idempotencyKey: 'OD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    };

    let state = { ...defaultState };
    try {
        const savedDraft = sessionStorage.getItem(STORAGE_STATE_KEY);
        if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            if (parsed && typeof parsed === 'object') {
                state = { ...defaultState, ...parsed };
                if (state.step === 8) state.step = 0; // Fresh session if previously completed
            }
        }
    } catch (e) {}

    let validationErrors = {};
    let isSubmitting = false;
    let submissionNetworkError = null;

    function saveDraft() {
        try {
            sessionStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
        } catch (e) {}
    }

    // 4. Bilingual Copy Dictionary
    const i18n = {
        en: {
            topbarBrand: '← Olivar Design',
            footerPortfolio: 'Portfolio →',
            footerCopy: '© 2026 OLIVAR DESIGN',
            back: '← Back',
            next: 'Continue →',
            optionalTag: 'Optional',
            requiredError: 'Please complete this field to continue.',
            phoneError: 'Please enter a valid WhatsApp / phone number.',
            emailError: 'Please enter a valid email address or leave it blank.',
            intro: {
                eyebrow: 'BOOK A CONSULTATION',
                headline: 'Tell us a little about your project.',
                promise: 'Our team will review your request and contact you <strong>within the same day</strong> to coordinate your consultation.',
                cta: 'Get Started →'
            },
            step1: {
                num: '01 / 07',
                question: 'How can we help with your project?',
                hint: 'Select one or more services that apply to your project.',
                options: [
                    { id: 'Architecture Design', title: 'Architecture Design', sub: 'Space planning, massing, façades, 3D architectural design, and landscape design.' },
                    { id: 'Interior Design', title: 'Interior Design', sub: 'Interior architecture, materiality, lighting & furniture curation' },
                    { id: 'Execution & Project Management', title: 'Execution & Project Management', sub: 'Managing and coordinating project execution from approved design through delivery.' },
                    { id: 'Not Sure Yet', title: 'Not Sure Yet', sub: 'We would like Olivar’s guidance during the consultation' }
                ]
            },
            step2: {
                num: '02 / 07',
                question: 'What type of project is this?',
                hint: 'Select the primary typology of your project.',
                options: [
                    { id: 'Villa', title: 'Villa' },
                    { id: 'Istiraha', title: 'Istiraha' },
                    { id: 'Chalet', title: 'Chalet' },
                    { id: 'Resort', title: 'Resort' },
                    { id: 'Farm / Private Estate', title: 'Farm / Private Estate' },
                    { id: 'Commercial', title: 'Commercial' },
                    { id: 'Other', title: 'Other' }
                ],
                otherLabel: 'Please specify your project type',
                otherPlaceholder: 'e.g., Boutique Hotel, Equestrian Estate, Majlis Pavilion...'
            },
            step3: {
                num: '03 / 07',
                question: 'Where is your project located?',
                hint: 'Enter the city or region where your project is located.',
                cityLabel: 'City / Region',
                cityPlaceholder: 'e.g., Riyadh, Jeddah, Al Khobar, AlUla...',
                districtLabel: 'District / Neighborhood',
                districtPlaceholder: 'Optional — e.g., Hittin, Al Ammariyah, Obhur...'
            },
            step4: {
                num: '04 / 07',
                question: 'Project details & current stage',
                hint: 'Approximate details are completely fine.',
                areaLabelArch: 'Approximate Plot / Project Area',
                areaLabelInterior: 'Approximate Interior / Built-Up Area',
                areaLabelExecution: 'Approximate Project Size / Area',
                areaPlaceholder: 'e.g., 1,200 m² (optional if not yet determined)',
                stageQuestion: 'What stage is your project currently at?',
                stagesDefault: [
                    { id: 'Land / Starting from Scratch', title: 'Land / Starting from Scratch' },
                    { id: 'Design Stage', title: 'Design Stage' },
                    { id: 'Existing Property / Renovation', title: 'Existing Property / Renovation' },
                    { id: 'Under Construction', title: 'Under Construction' },
                    { id: 'Other', title: 'Other' }
                ],
                stagesInterior: [
                    { id: 'Architectural Plans Ready', title: 'Architectural Plans Ready (New Build)' },
                    { id: 'Under Construction', title: 'Under Construction' },
                    { id: 'Existing Property / Renovation', title: 'Existing Property / Renovation' },
                    { id: 'Land / Starting from Scratch', title: 'Land / Starting from Scratch' },
                    { id: 'Other', title: 'Other' }
                ],
                stagesExecution: [
                    { id: 'Design Complete — Ready for Execution', title: 'Design Complete — Ready for Execution' },
                    { id: 'Design Stage', title: 'Currently in Design Stage' },
                    { id: 'Under Construction', title: 'Already Under Construction' },
                    { id: 'Existing Property / Renovation', title: 'Existing Property / Renovation' },
                    { id: 'Other', title: 'Other' }
                ],
                stageOtherPlaceholder: 'Briefly describe the current stage...'
            },
            step5: {
                num: '05 / 07',
                question: 'When would you like to start?',
                hint: 'Select your preferred target timeline.',
                options: [
                    { id: 'As soon as possible', title: 'As soon as possible' },
                    { id: 'Within 1–3 months', title: 'Within 1–3 months' },
                    { id: 'Within 3–6 months', title: 'Within 3–6 months' },
                    { id: 'Later / Planning Ahead', title: 'Later / Planning Ahead' }
                ]
            },
            step6: {
                num: '06 / 07',
                question: 'Tell us a little about your project.',
                hint: 'Optional — share any thoughts, spatial requirements, or vision you have in mind.',
                label: 'Project Overview',
                placeholder: 'Share as much or as little as you like...'
            },
            step7: {
                num: '07 / 07',
                question: 'Your contact information',
                hint: 'Our team will personally reach out to coordinate your consultation.',
                nameLabel: 'Full Name',
                namePlaceholder: 'Enter your full name',
                phoneLabel: 'WhatsApp / Phone Number',
                phonePlaceholder: '+966 5X XXX XXXX',
                emailLabel: 'Email Address',
                emailPlaceholder: 'name@example.com',
                privacyNote: 'Your information is kept strictly confidential and used solely by Olivar Design to review your project and coordinate your consultation.',
                submitBtn: 'Request Consultation',
                submittingBtn: 'Sending Request...',
                errorTitle: 'We could not complete your request due to a connection issue.',
                errorDesc: 'Please try submitting again, or if your connection is interrupted, you may send your project details directly to our team via WhatsApp below.',
                fallbackWaLabel: 'Send via WhatsApp Instead →'
            },
            confirmation: {
                title: 'Thank you.',
                subtitle: 'Your consultation request has been received.',
                body1: 'Our team will review your project details and contact you <strong>within the same day</strong> to coordinate and confirm your consultation.',
                body2: 'We look forward to learning more about your project.',
                signoff: 'OLIVAR DESIGN',
                homeBtn: 'Return to Website',
                portfolioBtn: 'Explore Portfolio →'
            }
        },
        ar: {
            topbarBrand: 'أوليفار ديزاين →',
            footerPortfolio: '← ملف الأعمال',
            footerCopy: '© ٢٠٢٦ أوليفار ديزاين',
            back: '→ السابق',
            next: '← التالي',
            optionalTag: 'اختياري',
            requiredError: 'يرجى إكمال هذا الحقل للمتابعة.',
            phoneError: 'يرجى إدخال رقم جوال / واتساب صحيح.',
            emailError: 'يرجى إدخال بريد إلكتروني صحيح أو ترك الحقل فارغاً.',
            intro: {
                eyebrow: 'احجز استشارة',
                headline: 'أخبرنا قليلاً عن مشروعك.',
                promise: 'سيقوم فريقنا بمراجعة طلبك والتواصل معك <strong>في نفس اليوم</strong> لتنسيق موعد الاستشارة.',
                cta: '← ابدأ الآن'
            },
            step1: {
                num: '٠١ / ٠٧',
                question: 'كيف يمكننا مساعدتك في مشروعك؟',
                hint: 'يمكنك اختيار خدمة واحدة أو أكثر حسب احتياج مشروعك.',
                options: [
                    { id: 'Architecture Design', title: 'التصميم المعماري', sub: 'تخطيط المساحات، الكتل المعمارية، الواجهات، التصميم المعماري ثلاثي الأبعاد، وتصميم اللاندسكيب.' },
                    { id: 'Interior Design', title: 'التصميم الداخلي', sub: 'توزيع الفراغات الداخلية، الخامات، الإضاءة، وتنسيق الأثاث' },
                    { id: 'Execution & Project Management', title: 'التنفيذ وإدارة المشاريع', sub: 'إدارة وتنسيق تنفيذ المشروع من التصميم المعتمد وحتى التسليم.' },
                    { id: 'Not Sure Yet', title: 'غير متأكد بعد', sub: 'نرغب في استشارة فريق أوليفار لتحديد النطاق الأنسب' }
                ]
            },
            step2: {
                num: '٠٢ / ٠٧',
                question: 'ما هو نوع مشروعك؟',
                hint: 'اختر التصنيف الرئيسي لمشروعك.',
                options: [
                    { id: 'Villa', title: 'فيلا' },
                    { id: 'Istiraha', title: 'استراحة' },
                    { id: 'Chalet', title: 'شاليه' },
                    { id: 'Resort', title: 'منتجع' },
                    { id: 'Farm / Private Estate', title: 'مزرعة / ملكية خاصة' },
                    { id: 'Commercial', title: 'تجاري' },
                    { id: 'Other', title: 'أخرى' }
                ],
                otherLabel: 'يرجى توضيح نوع المشروع',
                otherPlaceholder: 'مثال: فندق بوتيك، قصر خاص، مجلس ضيافة...'
            },
            step3: {
                num: '٠٣ / ٠٧',
                question: 'أين يقع مشروعك؟',
                hint: 'أدخل المدينة أو المنطقة التي يقع فيها المشروع.',
                cityLabel: 'المدينة / المنطقة',
                cityPlaceholder: 'مثال: الرياض، جدة، الخبر، العلا...',
                districtLabel: 'الحي / الموقع',
                districtPlaceholder: 'اختياري — مثال: حطين، العمارية، أبحر...'
            },
            step4: {
                num: '٠٤ / ٠٧',
                question: 'تفاصيل المشروع والمرحلة الحالية',
                hint: 'المعلومات التقريبية كافية تماماً في هذه المرحلة.',
                areaLabelArch: 'مساحة الأرض / المشروع التقريبية',
                areaLabelInterior: 'مساحة الفراغات الداخلية / البناء التقريبية',
                areaLabelExecution: 'مساحة المشروع التقريبية',
                areaPlaceholder: 'مثال: ١٢٠٠ م² (اختياري)',
                stageQuestion: 'ما هي المرحلة الحالية لمشروعك؟',
                stagesDefault: [
                    { id: 'Land / Starting from Scratch', title: 'أرض فضاء / البداية من الصفر' },
                    { id: 'Design Stage', title: 'في مرحلة التصميم' },
                    { id: 'Existing Property / Renovation', title: 'عقار قائم / ترميم وتطوير' },
                    { id: 'Under Construction', title: 'تحت الإنشاء' },
                    { id: 'Other', title: 'أخرى' }
                ],
                stagesInterior: [
                    { id: 'Architectural Plans Ready', title: 'المخططات المعمارية جاهزة (بناء جديد)' },
                    { id: 'Under Construction', title: 'تحت الإنشاء' },
                    { id: 'Existing Property / Renovation', title: 'عقار قائم / ترميم وتطوير' },
                    { id: 'Land / Starting from Scratch', title: 'أرض فضاء / البداية من الصفر' },
                    { id: 'Other', title: 'أخرى' }
                ],
                stagesExecution: [
                    { id: 'Design Complete — Ready for Execution', title: 'التصميم مكتمل — جاهز للتنفيذ' },
                    { id: 'Design Stage', title: 'في مرحلة التصميم حالياً' },
                    { id: 'Under Construction', title: 'تحت الإنشاء حالياً' },
                    { id: 'Existing Property / Renovation', title: 'عقار قائم / ترميم وتطوير' },
                    { id: 'Other', title: 'أخرى' }
                ],
                stageOtherPlaceholder: 'يرجى وصف المرحلة الحالية باختصار...'
            },
            step5: {
                num: '٠٥ / ٠٧',
                question: 'متى ترغب في البدء؟',
                hint: 'اختر الإطار الزمني المفضل لديك.',
                options: [
                    { id: 'As soon as possible', title: 'في أقرب وقت ممكن' },
                    { id: 'Within 1–3 months', title: 'خلال ١ إلى ٣ أشهر' },
                    { id: 'Within 3–6 months', title: 'خلال ٣ إلى ٦ أشهر' },
                    { id: 'Later / Planning Ahead', title: 'لاحقاً / في مرحلة التخطيط المبكر' }
                ]
            },
            step6: {
                num: '٠٦ / ٠٧',
                question: 'أخبرنا قليلاً عن مشروعك.',
                hint: 'اختياري — شاركنا أي تفاصيل أو تطلعات خاصة تود مناقشتها خلال الاستشارة.',
                label: 'نبذة عن المشروع',
                placeholder: 'يمكنك كتابة نبذة مختصرة أو تخطي هذه الخطوة...'
            },
            step7: {
                num: '٠٧ / ٠٧',
                question: 'بيانات التواصل',
                hint: 'سيتواصل معك فريقنا شخصياً لتنسيق وتأكيد موعد الاستشارة.',
                nameLabel: 'الاسم الكامل',
                namePlaceholder: 'أدخل اسمك الكامل',
                phoneLabel: 'رقم الواتساب / الجوال',
                phonePlaceholder: '+966 5X XXX XXXX',
                emailLabel: 'البريد الإلكتروني',
                emailPlaceholder: 'name@example.com',
                privacyNote: 'تُحفظ جميع بياناتك بسرية تامة وتُستخدم حصرياً من قِبل فريق أوليفار ديزاين لمراجعة مشروعك وتنسيق موعد الاستشارة.',
                submitBtn: 'طلب استشارة',
                submittingBtn: 'جاري إرسال الطلب...',
                errorTitle: 'تعذر إرسال الطلب بسبب مشكلة في الاتصال.',
                errorDesc: 'يرجى المحاولة مرة أخرى، أو في حال استمرار انقطاع الاتصال يمكنك إرسال تفاصيل مشروعك مباشرة عبر الواتساب أدناه.',
                fallbackWaLabel: '← الإرسال عبر الواتساب'
            },
            confirmation: {
                title: 'شكراً لك.',
                subtitle: 'تم استلام طلب الاستشارة الخاص بمشروعك.',
                body1: 'سيقوم فريقنا بمراجعة تفاصيل مشروعك والتواصل معك <strong>في نفس اليوم</strong> لتنسيق وتأكيد موعد الاستشارة.',
                body2: 'نتطلع للتعرف أكثر على مشروعك.',
                signoff: 'أوليفار ديزاين · OLIVAR DESIGN',
                homeBtn: 'العودة للرئيسية',
                portfolioBtn: '← استكشف ملف الأعمال'
            }
        }
    };

    // 5. Helper Utilities
    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function normalizePhone(raw) {
        const cleaned = String(raw || '').trim();
        const digits = cleaned.replace(/[^\d+]/g, '');
        // Convert local Saudi 05XXXXXXXX to +9665XXXXXXXX for clean WhatsApp links
        if (/^05\d{8}$/.test(digits)) {
            return '+966' + digits.substring(1);
        }
        if (/^5\d{8}$/.test(digits)) {
            return '+966' + digits;
        }
        return cleaned;
    }

    function isValidPhone(raw) {
        const digitsOnly = String(raw || '').replace(/\D/g, '');
        return digitsOnly.length >= 8 && digitsOnly.length <= 15;
    }

    function isValidEmail(raw) {
        const val = String(raw || '').trim();
        if (!val) return true; // Email is optional
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    function getStep4Config(t) {
        const s = state.services;
        const hasArch = s.includes('Architecture Design');
        const hasInterior = s.includes('Interior Design');
        const hasExecOrPm = s.includes('Execution & Project Management');

        if (!hasArch && hasInterior && !hasExecOrPm) {
            return {
                areaLabel: t.step4.areaLabelInterior,
                stages: t.step4.stagesInterior
            };
        }
        if (!hasArch && !hasInterior && hasExecOrPm) {
            return {
                areaLabel: t.step4.areaLabelExecution,
                stages: t.step4.stagesExecution
            };
        }
        return {
            areaLabel: t.step4.areaLabelArch,
            stages: t.step4.stagesDefault
        };
    }

    // 6. DOM References & Rendering
    const stageEl = document.getElementById('consultation-stage');
    const indicatorEl = document.getElementById('step-indicator-pill');
    const progressEl = document.getElementById('consultation-progress-bar');
    const langBtn = document.getElementById('consultation-lang-toggle');
    const topbarBrandText = document.getElementById('topbar-brand-text');
    const footerCopy = document.getElementById('footer-copy');
    const footerPortfolio = document.getElementById('footer-portfolio-link');

    function applyChromeLanguage() {
        const t = i18n[lang];
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        if (langBtn) langBtn.textContent = lang === 'en' ? 'AR' : 'EN';
        if (topbarBrandText) topbarBrandText.textContent = t.topbarBrand;
        if (footerCopy) footerCopy.textContent = t.footerCopy;
        if (footerPortfolio) footerPortfolio.textContent = t.footerPortfolio;
        try {
            localStorage.setItem(LANG_STORAGE_KEY, lang);
        } catch (e) {}
    }

    function updateProgressUI() {
        const t = i18n[lang];
        if (state.step >= 1 && state.step <= 7) {
            const stepData = t['step' + state.step];
            indicatorEl.textContent = stepData.num;
            indicatorEl.classList.remove('hidden');
            progressEl.style.width = ((state.step / 7) * 100).toFixed(1) + '%';
        } else if (state.step === 8) {
            indicatorEl.classList.add('hidden');
            progressEl.style.width = '100%';
        } else {
            indicatorEl.classList.add('hidden');
            progressEl.style.width = '0%';
        }
    }

    function renderStep(animate = true) {
        applyChromeLanguage();
        updateProgressUI();
        saveDraft();

        const t = i18n[lang];

        if (animate) {
            stageEl.classList.remove('step-stage');
            void stageEl.offsetWidth;
            stageEl.classList.add('step-stage');
        }

        // STEP 0: INTRO
        if (state.step === 0) {
            stageEl.innerHTML = `
                <div class="consultation-intro">
                    <svg class="intro-emblem" viewBox="0 175 595.28 265" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M290.69,326l-28.93,28.93c10.8.02,21.27.35,32.78,3.27-28.48,11.16-87.74,37.15-87.74,37.15l8.12,11.07c6.08-.93,89.32-43.82,155.81.66,0,0,22.34-27.88,22.68-28.86-15.94-8.4-69.26-35.71-102.72-52.21"/>
                        <path d="M289.79,307.32l-10.58-39.52c-5.41,9.35-10.94,18.24-19.22,26.76,4.58-30.24,11.7-94.56,11.7-94.56l-13.65,1.5c-2.23,5.73-6.71,99.26-78.47,134.6,0,0,12.97,33.29,13.65,34.08,15.25-9.61,65.56-42.12,96.58-62.85"/>
                        <path d="M306.42,315.89l39.52,10.59c-5.38-9.36-10.33-18.59-13.56-30.02,23.9,19.09,76.04,57.41,76.04,57.41l5.53-12.57c-3.85-4.8-82.6-55.44-77.33-135.26,0,0-35.31-5.41-36.34-5.22.7,18.01,3.7,77.84,6.15,115.06"/>
                    </svg>
                    <span class="intro-eyebrow">${t.intro.eyebrow}</span>
                    <h1 class="intro-headline">${t.intro.headline}</h1>
                    <p class="intro-promise">${t.intro.promise}</p>
                    <button type="button" id="btn-start" class="btn-step-primary">${t.intro.cta}</button>
                </div>
            `;
            document.getElementById('btn-start').addEventListener('click', () => goToStep(1));
            return;
        }

        // STEP 1: SERVICE
        if (state.step === 1) {
            const s = t.step1;
            const cardsHtml = s.options.map(opt => {
                const selected = state.services.includes(opt.id);
                return `
                    <button type="button" class="choice-card ${selected ? 'selected' : ''}" data-service="${escapeHtml(opt.id)}" aria-pressed="${selected}">
                        <div class="choice-card-body">
                            <span class="choice-card-title">${escapeHtml(opt.title)}</span>
                            <span class="choice-card-sub">${escapeHtml(opt.sub)}</span>
                        </div>
                        <span class="choice-indicator" aria-hidden="true">${selected ? '✓' : ''}</span>
                    </button>
                `;
            }).join('');

            stageEl.innerHTML = `
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${s.num}</span>
                        <h1 class="step-question">${s.question}</h1>
                        <p class="step-hint">${s.hint}</p>
                    </div>
                    <div class="cards-grid cards-grid--two">${cardsHtml}</div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${t.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${state.services.length === 0 ? 'disabled' : ''}>${t.next}</button>
                    </div>
                </div>
            `;

            stageEl.querySelectorAll('[data-service]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-service');
                    if (id === 'Not Sure Yet') {
                        state.services = state.services.includes('Not Sure Yet') ? [] : ['Not Sure Yet'];
                    } else {
                        state.services = state.services.filter(x => x !== 'Not Sure Yet');
                        if (state.services.includes(id)) {
                            state.services = state.services.filter(x => x !== id);
                        } else {
                            state.services.push(id);
                        }
                    }
                    renderStep(false);
                });
            });

            document.getElementById('btn-back').addEventListener('click', () => goToStep(0));
            document.getElementById('btn-next').addEventListener('click', () => {
                if (state.services.length > 0) goToStep(2);
            });
            return;
        }

        // STEP 2: PROJECT TYPE
        if (state.step === 2) {
            const s = t.step2;
            const cardsHtml = s.options.map(opt => {
                const selected = state.projectType === opt.id;
                return `
                    <button type="button" class="choice-card ${selected ? 'selected' : ''}" data-ptype="${escapeHtml(opt.id)}" aria-pressed="${selected}">
                        <span class="choice-card-title">${escapeHtml(opt.title)}</span>
                        <span class="choice-indicator" aria-hidden="true">${selected ? '✓' : ''}</span>
                    </button>
                `;
            }).join('');

            const showOther = state.projectType === 'Other';
            const otherHtml = showOther ? `
                <div class="inline-other-wrap">
                    <label class="field-label" for="ptype-other-input">${s.otherLabel}</label>
                    <input type="text" id="ptype-other-input" class="olivar-text-input" value="${escapeHtml(state.projectTypeOther)}" placeholder="${escapeHtml(s.otherPlaceholder)}" autocomplete="off">
                    ${validationErrors.projectTypeOther ? `<p class="field-error-msg">${t.requiredError}</p>` : ''}
                </div>
            ` : '';

            const canContinue = state.projectType && (state.projectType !== 'Other' || state.projectTypeOther.trim().length > 0);

            stageEl.innerHTML = `
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${s.num}</span>
                        <h1 class="step-question">${s.question}</h1>
                        <p class="step-hint">${s.hint}</p>
                    </div>
                    <div class="cards-grid cards-grid--two">${cardsHtml}</div>
                    ${otherHtml}
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${t.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${!canContinue ? 'disabled' : ''}>${t.next}</button>
                    </div>
                </div>
            `;

            stageEl.querySelectorAll('[data-ptype]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.getAttribute('data-ptype');
                    state.projectType = val;
                    validationErrors = {};
                    renderStep(false);
                    if (val === 'Other') {
                        const input = document.getElementById('ptype-other-input');
                        if (input) input.focus();
                    }
                });
            });

            const otherInput = document.getElementById('ptype-other-input');
            if (otherInput) {
                otherInput.addEventListener('input', (e) => {
                    state.projectTypeOther = e.target.value;
                    saveDraft();
                    const nextBtn = document.getElementById('btn-next');
                    if (nextBtn) nextBtn.disabled = state.projectTypeOther.trim().length === 0;
                });
                otherInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && state.projectTypeOther.trim().length > 0) {
                        e.preventDefault();
                        goToStep(3);
                    }
                });
            }

            document.getElementById('btn-back').addEventListener('click', () => goToStep(1));
            document.getElementById('btn-next').addEventListener('click', () => {
                if (state.projectType === 'Other' && !state.projectTypeOther.trim()) {
                    validationErrors.projectTypeOther = true;
                    renderStep(false);
                    return;
                }
                if (state.projectType) goToStep(3);
            });
            return;
        }

        // STEP 3: PROJECT LOCATION (Pure Free-Text City / Region + Optional District)
        if (state.step === 3) {
            const s = t.step3;
            stageEl.innerHTML = `
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${s.num}</span>
                        <h1 class="step-question">${s.question}</h1>
                        <p class="step-hint">${s.hint}</p>
                    </div>
                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="city-input">
                                <span>${s.cityLabel} *</span>
                            </label>
                            <input type="text" id="city-input" class="olivar-text-input" value="${escapeHtml(state.city)}" placeholder="${escapeHtml(s.cityPlaceholder)}" autocomplete="address-level2">
                            ${validationErrors.city ? `<p class="field-error-msg">${t.requiredError}</p>` : ''}
                        </div>
                        <div class="field-group">
                            <label class="field-label" for="district-input">
                                <span>${s.districtLabel}</span>
                                <span class="field-optional-tag">${t.optionalTag}</span>
                            </label>
                            <input type="text" id="district-input" class="olivar-text-input" value="${escapeHtml(state.district)}" placeholder="${escapeHtml(s.districtPlaceholder)}" autocomplete="address-level3">
                        </div>
                    </div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${t.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${!state.city.trim() ? 'disabled' : ''}>${t.next}</button>
                    </div>
                </div>
            `;

            const cityInput = document.getElementById('city-input');
            const districtInput = document.getElementById('district-input');
            const nextBtn = document.getElementById('btn-next');

            cityInput.addEventListener('input', (e) => {
                state.city = e.target.value;
                saveDraft();
                if (nextBtn) nextBtn.disabled = !state.city.trim();
            });

            districtInput.addEventListener('input', (e) => {
                state.district = e.target.value;
                saveDraft();
            });

            const handleEnter = (e) => {
                if (e.key === 'Enter' && state.city.trim()) {
                    e.preventDefault();
                    goToStep(4);
                }
            };
            cityInput.addEventListener('keydown', handleEnter);
            districtInput.addEventListener('keydown', handleEnter);

            document.getElementById('btn-back').addEventListener('click', () => goToStep(2));
            nextBtn.addEventListener('click', () => {
                if (!state.city.trim()) {
                    validationErrors.city = true;
                    renderStep(false);
                    return;
                }
                validationErrors = {};
                goToStep(4);
            });
            return;
        }

        // STEP 4: PROJECT DETAILS & CONDITIONAL STAGE
        if (state.step === 4) {
            const s = t.step4;
            const cfg = getStep4Config(t);

            const stageCardsHtml = cfg.stages.map(st => {
                const selected = state.stage === st.id;
                return `
                    <button type="button" class="choice-card ${selected ? 'selected' : ''}" data-stage="${escapeHtml(st.id)}" aria-pressed="${selected}">
                        <span class="choice-card-title">${escapeHtml(st.title)}</span>
                        <span class="choice-indicator" aria-hidden="true">${selected ? '✓' : ''}</span>
                    </button>
                `;
            }).join('');

            const showStageOther = state.stage === 'Other';
            const stageOtherHtml = showStageOther ? `
                <div class="inline-other-wrap">
                    <input type="text" id="stage-other-input" class="olivar-text-input" value="${escapeHtml(state.stageOther)}" placeholder="${escapeHtml(s.stageOtherPlaceholder)}">
                </div>
            ` : '';

            stageEl.innerHTML = `
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${s.num}</span>
                        <h1 class="step-question">${s.question}</h1>
                        <p class="step-hint">${s.hint}</p>
                    </div>
                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="area-input">
                                <span>${cfg.areaLabel}</span>
                                <span class="field-optional-tag">${t.optionalTag}</span>
                            </label>
                            <input type="text" id="area-input" class="olivar-text-input" value="${escapeHtml(state.area)}" placeholder="${escapeHtml(s.areaPlaceholder)}">
                        </div>
                        <div class="field-group">
                            <label class="field-label" style="margin-bottom: 0.65rem;">
                                <span>${s.stageQuestion} *</span>
                            </label>
                            <div class="cards-grid cards-grid--two" style="margin-bottom: 0.5rem;">${stageCardsHtml}</div>
                            ${stageOtherHtml}
                        </div>
                    </div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${t.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${!state.stage ? 'disabled' : ''}>${t.next}</button>
                    </div>
                </div>
            `;

            const areaInput = document.getElementById('area-input');
            if (areaInput) {
                areaInput.addEventListener('input', (e) => {
                    state.area = e.target.value;
                    saveDraft();
                });
            }

            stageEl.querySelectorAll('[data-stage]').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.stage = btn.getAttribute('data-stage');
                    renderStep(false);
                });
            });

            const stageOtherInput = document.getElementById('stage-other-input');
            if (stageOtherInput) {
                stageOtherInput.addEventListener('input', (e) => {
                    state.stageOther = e.target.value;
                    saveDraft();
                });
            }

            document.getElementById('btn-back').addEventListener('click', () => goToStep(3));
            document.getElementById('btn-next').addEventListener('click', () => {
                if (state.stage) goToStep(5);
            });
            return;
        }

        // STEP 5: TIMELINE
        if (state.step === 5) {
            const s = t.step5;
            const cardsHtml = s.options.map(opt => {
                const selected = state.timeline === opt.id;
                return `
                    <button type="button" class="choice-card ${selected ? 'selected' : ''}" data-timeline="${escapeHtml(opt.id)}" aria-pressed="${selected}">
                        <span class="choice-card-title">${escapeHtml(opt.title)}</span>
                        <span class="choice-indicator" aria-hidden="true">${selected ? '✓' : ''}</span>
                    </button>
                `;
            }).join('');

            stageEl.innerHTML = `
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${s.num}</span>
                        <h1 class="step-question">${s.question}</h1>
                        <p class="step-hint">${s.hint}</p>
                    </div>
                    <div class="cards-grid cards-grid--two">${cardsHtml}</div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${t.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${!state.timeline ? 'disabled' : ''}>${t.next}</button>
                    </div>
                </div>
            `;

            stageEl.querySelectorAll('[data-timeline]').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.timeline = btn.getAttribute('data-timeline');
                    renderStep(false);
                });
            });

            document.getElementById('btn-back').addEventListener('click', () => goToStep(4));
            document.getElementById('btn-next').addEventListener('click', () => {
                if (state.timeline) goToStep(6);
            });
            return;
        }

        // STEP 6: PROJECT DESCRIPTION (OPTIONAL, NO FILE UPLOADS)
        if (state.step === 6) {
            const s = t.step6;
            stageEl.innerHTML = `
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${s.num}</span>
                        <h1 class="step-question">${s.question}</h1>
                        <p class="step-hint">${s.hint}</p>
                    </div>
                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="desc-input">
                                <span>${s.label}</span>
                                <span class="field-optional-tag">${t.optionalTag}</span>
                            </label>
                            <textarea id="desc-input" class="olivar-textarea" placeholder="${escapeHtml(s.placeholder)}">${escapeHtml(state.description)}</textarea>
                        </div>
                    </div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${t.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary">${t.next}</button>
                    </div>
                </div>
            `;

            const descInput = document.getElementById('desc-input');
            descInput.addEventListener('input', (e) => {
                state.description = e.target.value;
                saveDraft();
            });

            document.getElementById('btn-back').addEventListener('click', () => goToStep(5));
            document.getElementById('btn-next').addEventListener('click', () => goToStep(7));
            return;
        }

        // STEP 7: CONTACT INFORMATION & SUBMISSION
        if (state.step === 7) {
            const s = t.step7;

            // Build WhatsApp fallback URL ONLY if a real submission error occurred
            let errorBoxHtml = '';
            if (submissionNetworkError) {
                const summaryLines = [
                    `Hello Olivar Design, I would like to request a consultation.`,
                    `Name: ${state.fullName}`,
                    `Services: ${state.services.join(', ')}`,
                    `Project Type: ${state.projectType === 'Other' ? state.projectTypeOther : state.projectType}`,
                    `Location: ${state.city}${state.district ? ' (' + state.district + ')' : ''}`,
                    `Stage: ${state.stage === 'Other' ? state.stageOther : state.stage}`,
                    `Timeline: ${state.timeline}`
                ];
                const waHref = `https://wa.me/966565047027?text=${encodeURIComponent(summaryLines.join('\n'))}`;
                errorBoxHtml = `
                    <div class="submission-error-box" role="alert">
                        <p class="submission-error-title">${s.errorTitle}</p>
                        <p class="submission-error-desc">${s.errorDesc}</p>
                        <a href="${waHref}" target="_blank" rel="noopener" class="fallback-wa-btn">${s.fallbackWaLabel}</a>
                    </div>
                `;
            }

            stageEl.innerHTML = `
                <form id="consultation-final-form" novalidate>
                    <div class="step-header">
                        <span class="step-number-label">${s.num}</span>
                        <h1 class="step-question">${s.question}</h1>
                        <p class="step-hint">${s.hint}</p>
                    </div>

                    <!-- Invisible Honeypot Spam Trap -->
                    <div class="hp-field-trap" aria-hidden="true">
                        <label for="company_website_url">Company Website</label>
                        <input type="text" id="company_website_url" name="company_website_url" tabindex="-1" autocomplete="off" value="${escapeHtml(state.honeypot)}">
                    </div>

                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="fullname-input">
                                <span>${s.nameLabel} *</span>
                            </label>
                            <input type="text" id="fullname-input" class="olivar-text-input" value="${escapeHtml(state.fullName)}" placeholder="${escapeHtml(s.namePlaceholder)}" autocomplete="name" required>
                            ${validationErrors.fullName ? `<p class="field-error-msg">${t.requiredError}</p>` : ''}
                        </div>

                        <div class="field-group">
                            <label class="field-label" for="phone-input">
                                <span>${s.phoneLabel} *</span>
                            </label>
                            <input type="tel" inputmode="tel" dir="ltr" id="phone-input" class="olivar-text-input" value="${escapeHtml(state.phone)}" placeholder="${escapeHtml(s.phonePlaceholder)}" autocomplete="tel" required>
                            ${validationErrors.phone ? `<p class="field-error-msg">${t.phoneError}</p>` : ''}
                        </div>

                        <div class="field-group">
                            <label class="field-label" for="email-input">
                                <span>${s.emailLabel}</span>
                                <span class="field-optional-tag">${t.optionalTag}</span>
                            </label>
                            <input type="email" inputmode="email" dir="ltr" id="email-input" class="olivar-text-input" value="${escapeHtml(state.email)}" placeholder="${escapeHtml(s.emailPlaceholder)}" autocomplete="email">
                            ${validationErrors.email ? `<p class="field-error-msg">${t.emailError}</p>` : ''}
                        </div>
                    </div>

                    <p class="privacy-note">${s.privacyNote}</p>

                    ${errorBoxHtml}

                    <div class="step-actions step-actions--stack-mobile">
                        <button type="button" id="btn-back" class="btn-step-back" ${isSubmitting ? 'disabled' : ''}>${t.back}</button>
                        <button type="submit" id="btn-submit" class="btn-step-primary" ${isSubmitting ? 'disabled' : ''}>
                            ${isSubmitting ? s.submittingBtn : s.submitBtn}
                        </button>
                    </div>
                </form>
            `;

            const nameInput = document.getElementById('fullname-input');
            const phoneInput = document.getElementById('phone-input');
            const emailInput = document.getElementById('email-input');
            const hpInput = document.getElementById('company_website_url');

            nameInput.addEventListener('input', (e) => {
                state.fullName = e.target.value;
                if (validationErrors.fullName) {
                    delete validationErrors.fullName;
                }
                saveDraft();
            });

            phoneInput.addEventListener('input', (e) => {
                state.phone = e.target.value;
                if (validationErrors.phone) {
                    delete validationErrors.phone;
                }
                saveDraft();
            });

            emailInput.addEventListener('input', (e) => {
                state.email = e.target.value;
                if (validationErrors.email) {
                    delete validationErrors.email;
                }
                saveDraft();
            });

            hpInput.addEventListener('input', (e) => {
                state.honeypot = e.target.value;
            });

            document.getElementById('btn-back').addEventListener('click', () => goToStep(6));
            document.getElementById('consultation-final-form').addEventListener('submit', handleFinalSubmit);
            return;
        }

        // STEP 8: CONFIRMATION SCREEN
        if (state.step === 8) {
            const c = t.confirmation;
            stageEl.innerHTML = `
                <div class="consultation-confirmation">
                    <svg class="intro-emblem" viewBox="0 175 595.28 265" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M290.69,326l-28.93,28.93c10.8.02,21.27.35,32.78,3.27-28.48,11.16-87.74,37.15-87.74,37.15l8.12,11.07c6.08-.93,89.32-43.82,155.81.66,0,0,22.34-27.88,22.68-28.86-15.94-8.4-69.26-35.71-102.72-52.21"/>
                        <path d="M289.79,307.32l-10.58-39.52c-5.41,9.35-10.94,18.24-19.22,26.76,4.58-30.24,11.7-94.56,11.7-94.56l-13.65,1.5c-2.23,5.73-6.71,99.26-78.47,134.6,0,0,12.97,33.29,13.65,34.08,15.25-9.61,65.56-42.12,96.58-62.85"/>
                        <path d="M306.42,315.89l39.52,10.59c-5.38-9.36-10.33-18.59-13.56-30.02,23.9,19.09,76.04,57.41,76.04,57.41l5.53-12.57c-3.85-4.8-82.6-55.44-77.33-135.26,0,0-35.31-5.41-36.34-5.22.7,18.01,3.7,77.84,6.15,115.06"/>
                    </svg>
                    <h1 class="confirmation-title">${c.title}</h1>
                    <p class="confirmation-subtitle">${c.subtitle}</p>
                    <p class="confirmation-body">${c.body1}</p>
                    <p class="confirmation-body">${c.body2}</p>
                    <div class="confirmation-signoff">${c.signoff}</div>
                    <div class="confirmation-links">
                        <a href="/" class="confirmation-link-btn">${c.homeBtn}</a>
                        <a href="/portfolio" class="confirmation-link-btn">${c.portfolioBtn}</a>
                    </div>
                </div>
            `;
            return;
        }
    }

    function goToStep(nextStepNum, pushHistory = true) {
        validationErrors = {};
        submissionNetworkError = null;
        state.step = nextStepNum;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (pushHistory) {
            try {
                window.history.pushState({ step: nextStepNum }, '', window.location.pathname + window.location.search);
            } catch (e) {}
        }
        renderStep(true);
    }

    window.addEventListener('popstate', (event) => {
        if (event.state && typeof event.state.step === 'number') {
            goToStep(event.state.step, false);
        } else if (state.step > 0 && state.step < 8) {
            goToStep(state.step - 1, false);
        }
    });

    // 7. Final Submission Handler (With Safe Local Mock Mode + Production API Compatibility)
    async function handleFinalSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        validationErrors = {};
        submissionNetworkError = null;

        if (!state.fullName.trim()) {
            validationErrors.fullName = true;
        }
        if (!isValidPhone(state.phone)) {
            validationErrors.phone = true;
        }
        if (!isValidEmail(state.email)) {
            validationErrors.email = true;
        }

        if (Object.keys(validationErrors).length > 0) {
            renderStep(false);
            return;
        }

        isSubmitting = true;
        renderStep(false);

        const normalizedPhone = normalizePhone(state.phone);
        const waDigits = normalizedPhone.replace(/\D/g, '');
        const resolvedProjectType = state.projectType === 'Other'
            ? `Other: ${state.projectTypeOther.trim()}`
            : state.projectType;
        const resolvedStage = state.stage === 'Other' && state.stageOther.trim()
            ? `Other: ${state.stageOther.trim()}`
            : state.stage;

        const waPrefillText = lang === 'ar'
            ? `مرحباً ${state.fullName.trim()}، معك فريق أوليفار ديزاين بخصوص طلب الاستشارة لمشروعك (${resolvedProjectType}) في ${state.city.trim()}.`
            : `Hello ${state.fullName.trim()}, this is the Olivar Design team reaching out regarding your consultation request for your ${resolvedProjectType} project in ${state.city.trim()}.`;

        const attribution = getAttributionPayload();

        const leadPayload = {
            idempotency_key: state.idempotencyKey,
            status: 'NEW LEAD',
            assigned_to: '',
            consultation_datetime: '',
            internal_notes: '',
            submitted_at_iso: new Date().toISOString(),
            submitted_at_riyadh: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Riyadh', dateStyle: 'medium', timeStyle: 'short' }),
            notification_recipient: 'design@olivardesign.com',
            client: {
                full_name: state.fullName.trim(),
                phone_raw: state.phone.trim(),
                phone_normalized: normalizedPhone,
                email: state.email.trim() || '',
                preferred_language: lang === 'ar' ? 'Arabic (AR)' : 'English (EN)',
                whatsapp_quick_link: `https://wa.me/${waDigits}?text=${encodeURIComponent(waPrefillText)}`
            },
            project: {
                services: state.services,
                services_formatted: state.services.join(', '),
                project_type: resolvedProjectType,
                city: state.city.trim(),
                district: state.district.trim() || '',
                area: state.area.trim() || '',
                stage: resolvedStage,
                timeline: state.timeline,
                description: state.description.trim() || ''
            },
            attribution: {
                ...attribution,
                submission_page: window.location.pathname + window.location.search
            },
            security: {
                honeypot_Triggered: Boolean(state.honeypot),
                completion_seconds: Math.round((Date.now() - pageLoadTimestamp) / 1000)
            }
        };

        // Allow testing the network-failure fallback UI locally via ?simulate_error=1
        const forceError = new URLSearchParams(window.location.search).get('simulate_error') === '1';

        try {
            if (forceError) {
                throw new Error('Simulated network error');
            }

            const response = await fetch('/api/consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadPayload)
            });

            let result = null;
            try {
                result = await response.json();
            } catch (e) {}

            if (!response.ok || !result || result.ok !== true) {
                throw new Error(result?.error || ('Server returned ' + response.status));
            }

            // Clear draft and show confirmation screen ONLY after real backend storage succeeds
            sessionStorage.removeItem(STORAGE_STATE_KEY);
            isSubmitting = false;
            goToStep(8);
        } catch (err) {
            isSubmitting = false;
            submissionNetworkError = err.message || 'Network Error';
            renderStep(false);
        }
    }

    // Language toggle button
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            lang = lang === 'en' ? 'ar' : 'en';
            renderStep(false);
        });
    }

    // Initialize
    renderStep(true);
})();
