import"./modulepreload-polyfill-B5Qt9EMX.js";(function(){const L="olivar_consultation_draft_v2",_="olivar_lang",B=Date.now();function T(){try{const n=new URLSearchParams(window.location.search),i=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","gclid","ttclid","twclid"],e={};let o=!1;i.forEach(d=>{const u=n.get(d);u&&(e[d]=u,o=!0)});const a=new Date().toISOString();if(!localStorage.getItem("olivar_attribution_first")){const d={utm_source:e.utm_source||"",utm_medium:e.utm_medium||"",utm_campaign:e.utm_campaign||"",utm_content:e.utm_content||"",utm_term:e.utm_term||"",fbclid:e.fbclid||"",gclid:e.gclid||"",ttclid:e.ttclid||"",twclid:e.twclid||"",initial_referrer:document.referrer||"Direct",landing_page:window.location.pathname+window.location.search,captured_at:a};localStorage.setItem("olivar_attribution_first",JSON.stringify(d))}if(o||!sessionStorage.getItem("olivar_attribution_last")){const d={utm_source:e.utm_source||"",utm_medium:e.utm_medium||"",utm_campaign:e.utm_campaign||"",utm_content:e.utm_content||"",utm_term:e.utm_term||"",fbclid:e.fbclid||"",gclid:e.gclid||"",ttclid:e.ttclid||"",twclid:e.twclid||"",referrer:document.referrer||"Direct",landing_page:window.location.pathname+window.location.search,captured_at:a};sessionStorage.setItem("olivar_attribution_last",JSON.stringify(d)),localStorage.setItem("olivar_attribution_last",JSON.stringify(d))}}catch{}}function j(){let n={},i={};try{n=JSON.parse(localStorage.getItem("olivar_attribution_first")||"{}"),i=JSON.parse(sessionStorage.getItem("olivar_attribution_last")||localStorage.getItem("olivar_attribution_last")||"{}")}catch{}const e=window.innerWidth<768||/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);return{utm_source:i.utm_source||n.utm_source||"Direct",utm_medium:i.utm_medium||n.utm_medium||"",utm_campaign:i.utm_campaign||n.utm_campaign||"",utm_content:i.utm_content||n.utm_content||"",utm_term:i.utm_term||n.utm_term||"",fbclid:i.fbclid||n.fbclid||"",gclid:i.gclid||n.gclid||"",ttclid:i.ttclid||n.ttclid||"",initial_referrer:n.initial_referrer||document.referrer||"Direct",landing_page:n.landing_page||window.location.pathname,first_touch:n,last_touch:i,device_type:e?"Mobile":"Desktop"}}T();function A(){try{const n=new URLSearchParams(window.location.search).get("lang");if(n==="ar"||n==="en")return localStorage.setItem(_,n),n;const i=localStorage.getItem(_);if(i==="ar"||i==="en")return i}catch{}return"en"}let f=A();const x={step:0,services:[],projectType:"",projectTypeOther:"",city:"",district:"",area:"",stage:"",stageOther:"",timeline:"",description:"",fullName:"",phone:"",email:"",honeypot:"",idempotencyKey:"OD-"+Date.now().toString(36).toUpperCase()+"-"+Math.random().toString(36).substring(2,6).toUpperCase()};let t={...x};try{const n=sessionStorage.getItem(L);if(n){const i=JSON.parse(n);i&&typeof i=="object"&&(t={...x,...i},t.step===8&&(t.step=0))}}catch{}let p={},v=!1,$=null;function y(){try{sessionStorage.setItem(L,JSON.stringify(t))}catch{}}const S={en:{topbarBrand:"← Olivar Design",footerPortfolio:"Portfolio →",footerCopy:"© 2026 OLIVAR DESIGN",back:"← Back",next:"Continue →",optionalTag:"Optional",requiredError:"Please complete this field to continue.",phoneError:"Please enter a valid WhatsApp / phone number.",emailError:"Please enter a valid email address or leave it blank.",intro:{eyebrow:"BOOK A CONSULTATION",headline:"Tell us a little about your project.",promise:"Our team will review your request and contact you <strong>within the same day</strong> to coordinate your consultation.",cta:"Get Started →"},step1:{num:"01 / 07",question:"How can we help with your project?",hint:"Select one or more services that apply to your project.",options:[{id:"Architecture Design",title:"Architecture Design",sub:"Space planning, massing, façades, 3D architectural design, and landscape design."},{id:"Interior Design",title:"Interior Design",sub:"Interior architecture, materiality, lighting & furniture curation"},{id:"Execution & Project Management",title:"Execution & Project Management",sub:"Managing and coordinating project execution from approved design through delivery."},{id:"Not Sure Yet",title:"Not Sure Yet",sub:"We would like Olivar’s guidance during the consultation"}]},step2:{num:"02 / 07",question:"What type of project is this?",hint:"Select the primary typology of your project.",options:[{id:"Villa",title:"Villa"},{id:"Istiraha",title:"Istiraha"},{id:"Chalet",title:"Chalet"},{id:"Resort",title:"Resort"},{id:"Farm / Private Estate",title:"Farm / Private Estate"},{id:"Commercial",title:"Commercial"},{id:"Other",title:"Other"}],otherLabel:"Please specify your project type",otherPlaceholder:"e.g., Boutique Hotel, Equestrian Estate, Majlis Pavilion..."},step3:{num:"03 / 07",question:"Where is your project located?",hint:"Enter the city or region where your project is located.",cityLabel:"City / Region",cityPlaceholder:"e.g., Riyadh, Jeddah, Al Khobar, AlUla...",districtLabel:"District / Neighborhood",districtPlaceholder:"Optional — e.g., Hittin, Al Ammariyah, Obhur..."},step4:{num:"04 / 07",question:"Project details & current stage",hint:"Approximate details are completely fine.",areaLabelArch:"Approximate Plot / Project Area",areaLabelInterior:"Approximate Interior / Built-Up Area",areaLabelExecution:"Approximate Project Size / Area",areaPlaceholder:"e.g., 1,200 m² (optional if not yet determined)",stageQuestion:"What stage is your project currently at?",stagesDefault:[{id:"Land / Starting from Scratch",title:"Land / Starting from Scratch"},{id:"Design Stage",title:"Design Stage"},{id:"Existing Property / Renovation",title:"Existing Property / Renovation"},{id:"Under Construction",title:"Under Construction"},{id:"Other",title:"Other"}],stagesInterior:[{id:"Architectural Plans Ready",title:"Architectural Plans Ready (New Build)"},{id:"Under Construction",title:"Under Construction"},{id:"Existing Property / Renovation",title:"Existing Property / Renovation"},{id:"Land / Starting from Scratch",title:"Land / Starting from Scratch"},{id:"Other",title:"Other"}],stagesExecution:[{id:"Design Complete — Ready for Execution",title:"Design Complete — Ready for Execution"},{id:"Design Stage",title:"Currently in Design Stage"},{id:"Under Construction",title:"Already Under Construction"},{id:"Existing Property / Renovation",title:"Existing Property / Renovation"},{id:"Other",title:"Other"}],stageOtherPlaceholder:"Briefly describe the current stage..."},step5:{num:"05 / 07",question:"When would you like to start?",hint:"Select your preferred target timeline.",options:[{id:"As soon as possible",title:"As soon as possible"},{id:"Within 1–3 months",title:"Within 1–3 months"},{id:"Within 3–6 months",title:"Within 3–6 months"},{id:"Later / Planning Ahead",title:"Later / Planning Ahead"}]},step6:{num:"06 / 07",question:"Tell us a little about your project.",hint:"Optional — share any thoughts, spatial requirements, or vision you have in mind.",label:"Project Overview",placeholder:"Share as much or as little as you like..."},step7:{num:"07 / 07",question:"Your contact information",hint:"Our team will personally reach out to coordinate your consultation.",nameLabel:"Full Name",namePlaceholder:"Enter your full name",phoneLabel:"WhatsApp / Phone Number",phonePlaceholder:"+966 5X XXX XXXX",emailLabel:"Email Address",emailPlaceholder:"name@example.com",privacyNote:"Your information is kept strictly confidential and used solely by Olivar Design to review your project and coordinate your consultation.",submitBtn:"Request Consultation",submittingBtn:"Sending Request...",errorTitle:"We could not complete your request due to a connection issue.",errorDesc:"Please try submitting again, or if your connection is interrupted, you may send your project details directly to our team via WhatsApp below.",fallbackWaLabel:"Send via WhatsApp Instead →"},confirmation:{title:"Thank you.",subtitle:"Your consultation request has been received.",body1:"Our team will review your project details and contact you <strong>within the same day</strong> to coordinate and confirm your consultation.",body2:"We look forward to learning more about your project.",signoff:"OLIVAR DESIGN",homeBtn:"Return to Website",portfolioBtn:"Explore Portfolio →"}},ar:{topbarBrand:"أوليفار ديزاين →",footerPortfolio:"← ملف الأعمال",footerCopy:"© ٢٠٢٦ أوليفار ديزاين",back:"→ السابق",next:"← التالي",optionalTag:"اختياري",requiredError:"يرجى إكمال هذا الحقل للمتابعة.",phoneError:"يرجى إدخال رقم جوال / واتساب صحيح.",emailError:"يرجى إدخال بريد إلكتروني صحيح أو ترك الحقل فارغاً.",intro:{eyebrow:"احجز استشارة",headline:"أخبرنا قليلاً عن مشروعك.",promise:"سيقوم فريقنا بمراجعة طلبك والتواصل معك <strong>في نفس اليوم</strong> لتنسيق موعد الاستشارة.",cta:"← ابدأ الآن"},step1:{num:"٠١ / ٠٧",question:"كيف يمكننا مساعدتك في مشروعك؟",hint:"يمكنك اختيار خدمة واحدة أو أكثر حسب احتياج مشروعك.",options:[{id:"Architecture Design",title:"التصميم المعماري",sub:"تخطيط المساحات، الكتل المعمارية، الواجهات، التصميم المعماري ثلاثي الأبعاد، وتصميم اللاندسكيب."},{id:"Interior Design",title:"التصميم الداخلي",sub:"توزيع الفراغات الداخلية، الخامات، الإضاءة، وتنسيق الأثاث"},{id:"Execution & Project Management",title:"التنفيذ وإدارة المشاريع",sub:"إدارة وتنسيق تنفيذ المشروع من التصميم المعتمد وحتى التسليم."},{id:"Not Sure Yet",title:"غير متأكد بعد",sub:"نرغب في استشارة فريق أوليفار لتحديد النطاق الأنسب"}]},step2:{num:"٠٢ / ٠٧",question:"ما هو نوع مشروعك؟",hint:"اختر التصنيف الرئيسي لمشروعك.",options:[{id:"Villa",title:"فيلا"},{id:"Istiraha",title:"استراحة"},{id:"Chalet",title:"شاليه"},{id:"Resort",title:"منتجع"},{id:"Farm / Private Estate",title:"مزرعة / ملكية خاصة"},{id:"Commercial",title:"تجاري"},{id:"Other",title:"أخرى"}],otherLabel:"يرجى توضيح نوع المشروع",otherPlaceholder:"مثال: فندق بوتيك، قصر خاص، مجلس ضيافة..."},step3:{num:"٠٣ / ٠٧",question:"أين يقع مشروعك؟",hint:"أدخل المدينة أو المنطقة التي يقع فيها المشروع.",cityLabel:"المدينة / المنطقة",cityPlaceholder:"مثال: الرياض، جدة، الخبر، العلا...",districtLabel:"الحي / الموقع",districtPlaceholder:"اختياري — مثال: حطين، العمارية، أبحر..."},step4:{num:"٠٤ / ٠٧",question:"تفاصيل المشروع والمرحلة الحالية",hint:"المعلومات التقريبية كافية تماماً في هذه المرحلة.",areaLabelArch:"مساحة الأرض / المشروع التقريبية",areaLabelInterior:"مساحة الفراغات الداخلية / البناء التقريبية",areaLabelExecution:"مساحة المشروع التقريبية",areaPlaceholder:"مثال: ١٢٠٠ م² (اختياري)",stageQuestion:"ما هي المرحلة الحالية لمشروعك؟",stagesDefault:[{id:"Land / Starting from Scratch",title:"أرض فضاء / البداية من الصفر"},{id:"Design Stage",title:"في مرحلة التصميم"},{id:"Existing Property / Renovation",title:"عقار قائم / ترميم وتطوير"},{id:"Under Construction",title:"تحت الإنشاء"},{id:"Other",title:"أخرى"}],stagesInterior:[{id:"Architectural Plans Ready",title:"المخططات المعمارية جاهزة (بناء جديد)"},{id:"Under Construction",title:"تحت الإنشاء"},{id:"Existing Property / Renovation",title:"عقار قائم / ترميم وتطوير"},{id:"Land / Starting from Scratch",title:"أرض فضاء / البداية من الصفر"},{id:"Other",title:"أخرى"}],stagesExecution:[{id:"Design Complete — Ready for Execution",title:"التصميم مكتمل — جاهز للتنفيذ"},{id:"Design Stage",title:"في مرحلة التصميم حالياً"},{id:"Under Construction",title:"تحت الإنشاء حالياً"},{id:"Existing Property / Renovation",title:"عقار قائم / ترميم وتطوير"},{id:"Other",title:"أخرى"}],stageOtherPlaceholder:"يرجى وصف المرحلة الحالية باختصار..."},step5:{num:"٠٥ / ٠٧",question:"متى ترغب في البدء؟",hint:"اختر الإطار الزمني المفضل لديك.",options:[{id:"As soon as possible",title:"في أقرب وقت ممكن"},{id:"Within 1–3 months",title:"خلال ١ إلى ٣ أشهر"},{id:"Within 3–6 months",title:"خلال ٣ إلى ٦ أشهر"},{id:"Later / Planning Ahead",title:"لاحقاً / في مرحلة التخطيط المبكر"}]},step6:{num:"٠٦ / ٠٧",question:"أخبرنا قليلاً عن مشروعك.",hint:"اختياري — شاركنا أي تفاصيل أو تطلعات خاصة تود مناقشتها خلال الاستشارة.",label:"نبذة عن المشروع",placeholder:"يمكنك كتابة نبذة مختصرة أو تخطي هذه الخطوة..."},step7:{num:"٠٧ / ٠٧",question:"بيانات التواصل",hint:"سيتواصل معك فريقنا شخصياً لتنسيق وتأكيد موعد الاستشارة.",nameLabel:"الاسم الكامل",namePlaceholder:"أدخل اسمك الكامل",phoneLabel:"رقم الواتساب / الجوال",phonePlaceholder:"+966 5X XXX XXXX",emailLabel:"البريد الإلكتروني",emailPlaceholder:"name@example.com",privacyNote:"تُحفظ جميع بياناتك بسرية تامة وتُستخدم حصرياً من قِبل فريق أوليفار ديزاين لمراجعة مشروعك وتنسيق موعد الاستشارة.",submitBtn:"طلب استشارة",submittingBtn:"جاري إرسال الطلب...",errorTitle:"تعذر إرسال الطلب بسبب مشكلة في الاتصال.",errorDesc:"يرجى المحاولة مرة أخرى، أو في حال استمرار انقطاع الاتصال يمكنك إرسال تفاصيل مشروعك مباشرة عبر الواتساب أدناه.",fallbackWaLabel:"← الإرسال عبر الواتساب"},confirmation:{title:"شكراً لك.",subtitle:"تم استلام طلب الاستشارة الخاص بمشروعك.",body1:"سيقوم فريقنا بمراجعة تفاصيل مشروعك والتواصل معك <strong>في نفس اليوم</strong> لتنسيق وتأكيد موعد الاستشارة.",body2:"نتطلع للتعرف أكثر على مشروعك.",signoff:"أوليفار ديزاين · OLIVAR DESIGN",homeBtn:"العودة للرئيسية",portfolioBtn:"← استكشف ملف الأعمال"}}};function r(n){return String(n||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function D(n){const i=String(n||"").trim(),e=i.replace(/[^\d+]/g,"");return/^05\d{8}$/.test(e)?"+966"+e.substring(1):/^5\d{8}$/.test(e)?"+966"+e:i}function q(n){const i=String(n||"").replace(/\D/g,"");return i.length>=8&&i.length<=15}function N(n){const i=String(n||"").trim();return i?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i):!0}function C(n){const i=t.services,e=i.includes("Architecture Design"),o=i.includes("Interior Design"),a=i.includes("Execution & Project Management");return!e&&o&&!a?{areaLabel:n.step4.areaLabelInterior,stages:n.step4.stagesInterior}:!e&&!o&&a?{areaLabel:n.step4.areaLabelExecution,stages:n.step4.stagesExecution}:{areaLabel:n.step4.areaLabelArch,stages:n.step4.stagesDefault}}const h=document.getElementById("consultation-stage"),E=document.getElementById("step-indicator-pill"),I=document.getElementById("consultation-progress-bar"),w=document.getElementById("consultation-lang-toggle"),k=document.getElementById("topbar-brand-text"),O=document.getElementById("footer-copy"),P=document.getElementById("footer-portfolio-link");function R(){const n=S[f];document.documentElement.lang=f,document.documentElement.dir=f==="ar"?"rtl":"ltr",w&&(w.textContent=f==="en"?"AR":"EN"),k&&(k.textContent=n.topbarBrand),O&&(O.textContent=n.footerCopy),P&&(P.textContent=n.footerPortfolio);try{localStorage.setItem(_,f)}catch{}}function M(){const n=S[f];if(t.step>=1&&t.step<=7){const i=n["step"+t.step];E.textContent=i.num,E.classList.remove("hidden"),I.style.width=(t.step/7*100).toFixed(1)+"%"}else t.step===8?(E.classList.add("hidden"),I.style.width="100%"):(E.classList.add("hidden"),I.style.width="0%")}function b(n=!0){R(),M(),y();const i=S[f];if(n&&(h.classList.remove("step-stage"),h.offsetWidth,h.classList.add("step-stage")),t.step===0){h.innerHTML=`
                <div class="consultation-intro">
                    <svg class="intro-emblem" viewBox="0 175 595.28 265" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M290.69,326l-28.93,28.93c10.8.02,21.27.35,32.78,3.27-28.48,11.16-87.74,37.15-87.74,37.15l8.12,11.07c6.08-.93,89.32-43.82,155.81.66,0,0,22.34-27.88,22.68-28.86-15.94-8.4-69.26-35.71-102.72-52.21"/>
                        <path d="M289.79,307.32l-10.58-39.52c-5.41,9.35-10.94,18.24-19.22,26.76,4.58-30.24,11.7-94.56,11.7-94.56l-13.65,1.5c-2.23,5.73-6.71,99.26-78.47,134.6,0,0,12.97,33.29,13.65,34.08,15.25-9.61,65.56-42.12,96.58-62.85"/>
                        <path d="M306.42,315.89l39.52,10.59c-5.38-9.36-10.33-18.59-13.56-30.02,23.9,19.09,76.04,57.41,76.04,57.41l5.53-12.57c-3.85-4.8-82.6-55.44-77.33-135.26,0,0-35.31-5.41-36.34-5.22.7,18.01,3.7,77.84,6.15,115.06"/>
                    </svg>
                    <span class="intro-eyebrow">${i.intro.eyebrow}</span>
                    <h1 class="intro-headline">${i.intro.headline}</h1>
                    <p class="intro-promise">${i.intro.promise}</p>
                    <button type="button" id="btn-start" class="btn-step-primary">${i.intro.cta}</button>
                </div>
            `,document.getElementById("btn-start").addEventListener("click",()=>m(1));return}if(t.step===1){const e=i.step1,o=e.options.map(a=>{const c=t.services.includes(a.id);return`
                    <button type="button" class="choice-card ${c?"selected":""}" data-service="${r(a.id)}" aria-pressed="${c}">
                        <div class="choice-card-body">
                            <span class="choice-card-title">${r(a.title)}</span>
                            <span class="choice-card-sub">${r(a.sub)}</span>
                        </div>
                        <span class="choice-indicator" aria-hidden="true">${c?"✓":""}</span>
                    </button>
                `}).join("");h.innerHTML=`
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${e.num}</span>
                        <h1 class="step-question">${e.question}</h1>
                        <p class="step-hint">${e.hint}</p>
                    </div>
                    <div class="cards-grid cards-grid--two">${o}</div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${i.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${t.services.length===0?"disabled":""}>${i.next}</button>
                    </div>
                </div>
            `,h.querySelectorAll("[data-service]").forEach(a=>{a.addEventListener("click",()=>{const c=a.getAttribute("data-service");c==="Not Sure Yet"?t.services=t.services.includes("Not Sure Yet")?[]:["Not Sure Yet"]:(t.services=t.services.filter(d=>d!=="Not Sure Yet"),t.services.includes(c)?t.services=t.services.filter(d=>d!==c):t.services.push(c)),b(!1)})}),document.getElementById("btn-back").addEventListener("click",()=>m(0)),document.getElementById("btn-next").addEventListener("click",()=>{t.services.length>0&&m(2)});return}if(t.step===2){const e=i.step2,o=e.options.map(l=>{const s=t.projectType===l.id;return`
                    <button type="button" class="choice-card ${s?"selected":""}" data-ptype="${r(l.id)}" aria-pressed="${s}">
                        <span class="choice-card-title">${r(l.title)}</span>
                        <span class="choice-indicator" aria-hidden="true">${s?"✓":""}</span>
                    </button>
                `}).join(""),c=t.projectType==="Other"?`
                <div class="inline-other-wrap">
                    <label class="field-label" for="ptype-other-input">${e.otherLabel}</label>
                    <input type="text" id="ptype-other-input" class="olivar-text-input" value="${r(t.projectTypeOther)}" placeholder="${r(e.otherPlaceholder)}" autocomplete="off">
                    ${p.projectTypeOther?`<p class="field-error-msg">${i.requiredError}</p>`:""}
                </div>
            `:"",d=t.projectType&&(t.projectType!=="Other"||t.projectTypeOther.trim().length>0);h.innerHTML=`
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${e.num}</span>
                        <h1 class="step-question">${e.question}</h1>
                        <p class="step-hint">${e.hint}</p>
                    </div>
                    <div class="cards-grid cards-grid--two">${o}</div>
                    ${c}
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${i.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${d?"":"disabled"}>${i.next}</button>
                    </div>
                </div>
            `,h.querySelectorAll("[data-ptype]").forEach(l=>{l.addEventListener("click",()=>{const s=l.getAttribute("data-ptype");if(t.projectType=s,p={},b(!1),s==="Other"){const g=document.getElementById("ptype-other-input");g&&g.focus()}})});const u=document.getElementById("ptype-other-input");u&&(u.addEventListener("input",l=>{t.projectTypeOther=l.target.value,y();const s=document.getElementById("btn-next");s&&(s.disabled=t.projectTypeOther.trim().length===0)}),u.addEventListener("keydown",l=>{l.key==="Enter"&&t.projectTypeOther.trim().length>0&&(l.preventDefault(),m(3))})),document.getElementById("btn-back").addEventListener("click",()=>m(1)),document.getElementById("btn-next").addEventListener("click",()=>{if(t.projectType==="Other"&&!t.projectTypeOther.trim()){p.projectTypeOther=!0,b(!1);return}t.projectType&&m(3)});return}if(t.step===3){const e=i.step3;h.innerHTML=`
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${e.num}</span>
                        <h1 class="step-question">${e.question}</h1>
                        <p class="step-hint">${e.hint}</p>
                    </div>
                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="city-input">
                                <span>${e.cityLabel} *</span>
                            </label>
                            <input type="text" id="city-input" class="olivar-text-input" value="${r(t.city)}" placeholder="${r(e.cityPlaceholder)}" autocomplete="address-level2">
                            ${p.city?`<p class="field-error-msg">${i.requiredError}</p>`:""}
                        </div>
                        <div class="field-group">
                            <label class="field-label" for="district-input">
                                <span>${e.districtLabel}</span>
                                <span class="field-optional-tag">${i.optionalTag}</span>
                            </label>
                            <input type="text" id="district-input" class="olivar-text-input" value="${r(t.district)}" placeholder="${r(e.districtPlaceholder)}" autocomplete="address-level3">
                        </div>
                    </div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${i.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${t.city.trim()?"":"disabled"}>${i.next}</button>
                    </div>
                </div>
            `;const o=document.getElementById("city-input"),a=document.getElementById("district-input"),c=document.getElementById("btn-next");o.addEventListener("input",u=>{t.city=u.target.value,y(),c&&(c.disabled=!t.city.trim())}),a.addEventListener("input",u=>{t.district=u.target.value,y()});const d=u=>{u.key==="Enter"&&t.city.trim()&&(u.preventDefault(),m(4))};o.addEventListener("keydown",d),a.addEventListener("keydown",d),document.getElementById("btn-back").addEventListener("click",()=>m(2)),c.addEventListener("click",()=>{if(!t.city.trim()){p.city=!0,b(!1);return}p={},m(4)});return}if(t.step===4){const e=i.step4,o=C(i),a=o.stages.map(s=>{const g=t.stage===s.id;return`
                    <button type="button" class="choice-card ${g?"selected":""}" data-stage="${r(s.id)}" aria-pressed="${g}">
                        <span class="choice-card-title">${r(s.title)}</span>
                        <span class="choice-indicator" aria-hidden="true">${g?"✓":""}</span>
                    </button>
                `}).join(""),d=t.stage==="Other"?`
                <div class="inline-other-wrap">
                    <input type="text" id="stage-other-input" class="olivar-text-input" value="${r(t.stageOther)}" placeholder="${r(e.stageOtherPlaceholder)}">
                </div>
            `:"";h.innerHTML=`
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${e.num}</span>
                        <h1 class="step-question">${e.question}</h1>
                        <p class="step-hint">${e.hint}</p>
                    </div>
                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="area-input">
                                <span>${o.areaLabel}</span>
                                <span class="field-optional-tag">${i.optionalTag}</span>
                            </label>
                            <input type="text" id="area-input" class="olivar-text-input" value="${r(t.area)}" placeholder="${r(e.areaPlaceholder)}">
                        </div>
                        <div class="field-group">
                            <label class="field-label" style="margin-bottom: 0.65rem;">
                                <span>${e.stageQuestion} *</span>
                            </label>
                            <div class="cards-grid cards-grid--two" style="margin-bottom: 0.5rem;">${a}</div>
                            ${d}
                        </div>
                    </div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${i.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${t.stage?"":"disabled"}>${i.next}</button>
                    </div>
                </div>
            `;const u=document.getElementById("area-input");u&&u.addEventListener("input",s=>{t.area=s.target.value,y()}),h.querySelectorAll("[data-stage]").forEach(s=>{s.addEventListener("click",()=>{t.stage=s.getAttribute("data-stage"),b(!1)})});const l=document.getElementById("stage-other-input");l&&l.addEventListener("input",s=>{t.stageOther=s.target.value,y()}),document.getElementById("btn-back").addEventListener("click",()=>m(3)),document.getElementById("btn-next").addEventListener("click",()=>{t.stage&&m(5)});return}if(t.step===5){const e=i.step5,o=e.options.map(a=>{const c=t.timeline===a.id;return`
                    <button type="button" class="choice-card ${c?"selected":""}" data-timeline="${r(a.id)}" aria-pressed="${c}">
                        <span class="choice-card-title">${r(a.title)}</span>
                        <span class="choice-indicator" aria-hidden="true">${c?"✓":""}</span>
                    </button>
                `}).join("");h.innerHTML=`
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${e.num}</span>
                        <h1 class="step-question">${e.question}</h1>
                        <p class="step-hint">${e.hint}</p>
                    </div>
                    <div class="cards-grid cards-grid--two">${o}</div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${i.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary" ${t.timeline?"":"disabled"}>${i.next}</button>
                    </div>
                </div>
            `,h.querySelectorAll("[data-timeline]").forEach(a=>{a.addEventListener("click",()=>{t.timeline=a.getAttribute("data-timeline"),b(!1)})}),document.getElementById("btn-back").addEventListener("click",()=>m(4)),document.getElementById("btn-next").addEventListener("click",()=>{t.timeline&&m(6)});return}if(t.step===6){const e=i.step6;h.innerHTML=`
                <div>
                    <div class="step-header">
                        <span class="step-number-label">${e.num}</span>
                        <h1 class="step-question">${e.question}</h1>
                        <p class="step-hint">${e.hint}</p>
                    </div>
                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="desc-input">
                                <span>${e.label}</span>
                                <span class="field-optional-tag">${i.optionalTag}</span>
                            </label>
                            <textarea id="desc-input" class="olivar-textarea" placeholder="${r(e.placeholder)}">${r(t.description)}</textarea>
                        </div>
                    </div>
                    <div class="step-actions">
                        <button type="button" id="btn-back" class="btn-step-back">${i.back}</button>
                        <button type="button" id="btn-next" class="btn-step-primary">${i.next}</button>
                    </div>
                </div>
            `,document.getElementById("desc-input").addEventListener("input",a=>{t.description=a.target.value,y()}),document.getElementById("btn-back").addEventListener("click",()=>m(5)),document.getElementById("btn-next").addEventListener("click",()=>m(7));return}if(t.step===7){const e=i.step7;let o="";if($){const l=["Hello Olivar Design, I would like to request a consultation.",`Name: ${t.fullName}`,`Services: ${t.services.join(", ")}`,`Project Type: ${t.projectType==="Other"?t.projectTypeOther:t.projectType}`,`Location: ${t.city}${t.district?" ("+t.district+")":""}`,`Stage: ${t.stage==="Other"?t.stageOther:t.stage}`,`Timeline: ${t.timeline}`],s=`https://wa.me/966565047027?text=${encodeURIComponent(l.join(`
`))}`;o=`
                    <div class="submission-error-box" role="alert">
                        <p class="submission-error-title">${e.errorTitle}</p>
                        <p class="submission-error-desc">${e.errorDesc}</p>
                        <a href="${s}" target="_blank" rel="noopener" class="fallback-wa-btn">${e.fallbackWaLabel}</a>
                    </div>
                `}h.innerHTML=`
                <form id="consultation-final-form" novalidate>
                    <div class="step-header">
                        <span class="step-number-label">${e.num}</span>
                        <h1 class="step-question">${e.question}</h1>
                        <p class="step-hint">${e.hint}</p>
                    </div>

                    <!-- Invisible Honeypot Spam Trap -->
                    <div class="hp-field-trap" aria-hidden="true">
                        <label for="company_website_url">Company Website</label>
                        <input type="text" id="company_website_url" name="company_website_url" tabindex="-1" autocomplete="off" value="${r(t.honeypot)}">
                    </div>

                    <div class="fields-stack">
                        <div class="field-group">
                            <label class="field-label" for="fullname-input">
                                <span>${e.nameLabel} *</span>
                            </label>
                            <input type="text" id="fullname-input" class="olivar-text-input" value="${r(t.fullName)}" placeholder="${r(e.namePlaceholder)}" autocomplete="name" required>
                            ${p.fullName?`<p class="field-error-msg">${i.requiredError}</p>`:""}
                        </div>

                        <div class="field-group">
                            <label class="field-label" for="phone-input">
                                <span>${e.phoneLabel} *</span>
                            </label>
                            <input type="tel" inputmode="tel" dir="ltr" id="phone-input" class="olivar-text-input" value="${r(t.phone)}" placeholder="${r(e.phonePlaceholder)}" autocomplete="tel" required>
                            ${p.phone?`<p class="field-error-msg">${i.phoneError}</p>`:""}
                        </div>

                        <div class="field-group">
                            <label class="field-label" for="email-input">
                                <span>${e.emailLabel}</span>
                                <span class="field-optional-tag">${i.optionalTag}</span>
                            </label>
                            <input type="email" inputmode="email" dir="ltr" id="email-input" class="olivar-text-input" value="${r(t.email)}" placeholder="${r(e.emailPlaceholder)}" autocomplete="email">
                            ${p.email?`<p class="field-error-msg">${i.emailError}</p>`:""}
                        </div>
                    </div>

                    <p class="privacy-note">${e.privacyNote}</p>

                    ${o}

                    <div class="step-actions step-actions--stack-mobile">
                        <button type="button" id="btn-back" class="btn-step-back" ${v?"disabled":""}>${i.back}</button>
                        <button type="submit" id="btn-submit" class="btn-step-primary" ${v?"disabled":""}>
                            ${v?e.submittingBtn:e.submitBtn}
                        </button>
                    </div>
                </form>
            `;const a=document.getElementById("fullname-input"),c=document.getElementById("phone-input"),d=document.getElementById("email-input"),u=document.getElementById("company_website_url");a.addEventListener("input",l=>{t.fullName=l.target.value,p.fullName&&delete p.fullName,y()}),c.addEventListener("input",l=>{t.phone=l.target.value,p.phone&&delete p.phone,y()}),d.addEventListener("input",l=>{t.email=l.target.value,p.email&&delete p.email,y()}),u.addEventListener("input",l=>{t.honeypot=l.target.value}),document.getElementById("btn-back").addEventListener("click",()=>m(6)),document.getElementById("consultation-final-form").addEventListener("submit",W);return}if(t.step===8){const e=i.confirmation;h.innerHTML=`
                <div class="consultation-confirmation">
                    <svg class="intro-emblem" viewBox="0 175 595.28 265" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M290.69,326l-28.93,28.93c10.8.02,21.27.35,32.78,3.27-28.48,11.16-87.74,37.15-87.74,37.15l8.12,11.07c6.08-.93,89.32-43.82,155.81.66,0,0,22.34-27.88,22.68-28.86-15.94-8.4-69.26-35.71-102.72-52.21"/>
                        <path d="M289.79,307.32l-10.58-39.52c-5.41,9.35-10.94,18.24-19.22,26.76,4.58-30.24,11.7-94.56,11.7-94.56l-13.65,1.5c-2.23,5.73-6.71,99.26-78.47,134.6,0,0,12.97,33.29,13.65,34.08,15.25-9.61,65.56-42.12,96.58-62.85"/>
                        <path d="M306.42,315.89l39.52,10.59c-5.38-9.36-10.33-18.59-13.56-30.02,23.9,19.09,76.04,57.41,76.04,57.41l5.53-12.57c-3.85-4.8-82.6-55.44-77.33-135.26,0,0-35.31-5.41-36.34-5.22.7,18.01,3.7,77.84,6.15,115.06"/>
                    </svg>
                    <h1 class="confirmation-title">${e.title}</h1>
                    <p class="confirmation-subtitle">${e.subtitle}</p>
                    <p class="confirmation-body">${e.body1}</p>
                    <p class="confirmation-body">${e.body2}</p>
                    <div class="confirmation-signoff">${e.signoff}</div>
                    <div class="confirmation-links">
                        <a href="/" class="confirmation-link-btn">${e.homeBtn}</a>
                        <a href="/portfolio" class="confirmation-link-btn">${e.portfolioBtn}</a>
                    </div>
                </div>
            `;return}}function m(n,i=!0){if(p={},$=null,t.step=n,window.scrollTo({top:0,behavior:"smooth"}),i)try{window.history.pushState({step:n},"",window.location.pathname+window.location.search)}catch{}b(!0)}window.addEventListener("popstate",n=>{n.state&&typeof n.state.step=="number"?m(n.state.step,!1):t.step>0&&t.step<8&&m(t.step-1,!1)});async function W(n){if(n.preventDefault(),v)return;if(p={},$=null,t.fullName.trim()||(p.fullName=!0),q(t.phone)||(p.phone=!0),N(t.email)||(p.email=!0),Object.keys(p).length>0){b(!1);return}v=!0,b(!1);const i=D(t.phone),e=i.replace(/\D/g,""),o=t.projectType==="Other"?`Other: ${t.projectTypeOther.trim()}`:t.projectType,a=t.stage==="Other"&&t.stageOther.trim()?`Other: ${t.stageOther.trim()}`:t.stage,c=f==="ar"?`مرحباً ${t.fullName.trim()}، معك فريق أوليفار ديزاين بخصوص طلب الاستشارة لمشروعك (${o}) في ${t.city.trim()}.`:`Hello ${t.fullName.trim()}, this is the Olivar Design team reaching out regarding your consultation request for your ${o} project in ${t.city.trim()}.`,d=j(),u={idempotency_key:t.idempotencyKey,status:"NEW LEAD",assigned_to:"",consultation_datetime:"",internal_notes:"",submitted_at_iso:new Date().toISOString(),submitted_at_riyadh:new Date().toLocaleString("en-GB",{timeZone:"Asia/Riyadh",dateStyle:"medium",timeStyle:"short"}),notification_recipient:"design@olivardesign.com",client:{full_name:t.fullName.trim(),phone_raw:t.phone.trim(),phone_normalized:i,email:t.email.trim()||"",preferred_language:f==="ar"?"Arabic (AR)":"English (EN)",whatsapp_quick_link:`https://wa.me/${e}?text=${encodeURIComponent(c)}`},project:{services:t.services,services_formatted:t.services.join(", "),project_type:o,city:t.city.trim(),district:t.district.trim()||"",area:t.area.trim()||"",stage:a,timeline:t.timeline,description:t.description.trim()||""},attribution:{...d,submission_page:window.location.pathname+window.location.search},security:{honeypot_Triggered:!!t.honeypot,completion_seconds:Math.round((Date.now()-B)/1e3)}},l=new URLSearchParams(window.location.search).get("simulate_error")==="1";try{if(l)throw new Error("Simulated network error");const s=await fetch("/api/consultation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)});let g=null;try{g=await s.json()}catch{}if(!s.ok||!g||g.ok!==!0)throw new Error((g==null?void 0:g.error)||"Server returned "+s.status);sessionStorage.removeItem(L),v=!1,m(8)}catch(s){v=!1,$=s.message||"Network Error",b(!1)}}w&&w.addEventListener("click",()=>{f=f==="en"?"ar":"en",b(!1)}),b(!0)})();
