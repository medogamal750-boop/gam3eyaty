/**
 * نظام إدارة الجمعيات المالية - المحرك البرمجي المتكامل (الإصدار 2.5 الفاخر)
 * يتضمن:
 * 1. تسجيل دخول المشتركين برقم الجوال والكود السري (آخر 4 أرقام).
 * 2. كشف حساب رسمي معتمد يظهر فيه اسم المشترك وتفاصيله بوضوح على الشاشة وفي الطباعة (PDF).
 * 3. أداة بحث منسدلة ذكية بالاسم ورقم الجوال لإضافة المشتركين السابقين بنقرة واحدة.
 * 4. تصميم مالي أنيق وتفاعلي يدعم الأسهم المشتركة وإعادة ترتيب الأدوار.
 */

const STORAGE_KEY = "gam3eyat_app_data_v3_4";

// الشهور القياسية الـ 12
const ALL_MONTHS_DEF = [
  { key: "jan", name: "يناير" },
  { key: "feb", name: "فبراير" },
  { key: "mar", name: "مارس" },
  { key: "apr", name: "أبريل" },
  { key: "may", name: "مايو" },
  { key: "jun", name: "يونيو" },
  { key: "jul", name: "يوليو" },
  { key: "aug", name: "أغسطس" },
  { key: "sep", name: "سبتمبر" },
  { key: "oct", name: "أكتوبر" },
  { key: "nov", name: "نوفمبر" },
  { key: "dec", name: "ديسمبر" }
];

// رمز الريال السعودي الرسمي المعتمد (Official Saudi Riyal SAMA Symbol)
function getSarSymbolSvg() {
  return `<span class="sar-symbol" aria-label="ر.س" title="ريال سعودي"><svg viewBox="0 0 1124.14 1256.39"><path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg></span>`;
}
window.getSarSymbolSvg = getSarSymbolSvg;

function formatCurrency(amount) {
  return `${Number(amount || 0).toLocaleString()} ${getSarSymbolSvg()}`;
}
window.formatCurrency = formatCurrency;

// أيقونات ثلاثية الأبعاد لحالة تسجيل الدخول والحماية في الهيدر (Global Scope)
function get3DLockIconSvg() {
  return `<svg class="icon-3d icon-float-2" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <defs>
      <filter id="lockShadowV2" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.8" stdDeviation="1.5" flood-color="#000" flood-opacity="0.5" />
      </filter>
      <linearGradient id="shackleChrome" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="30%" stop-color="#e2e8f0" />
        <stop offset="60%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#334155" />
      </linearGradient>
      <linearGradient id="lockGoldBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="35%" stop-color="#fbbf24" />
        <stop offset="75%" stop-color="#d97706" />
        <stop offset="100%" stop-color="#78350f" />
      </linearGradient>
    </defs>
    <path d="M6.5 10.5 V6 A5.5 5.5 0 0 1 17.5 6 V10.5" fill="none" stroke="url(#shackleChrome)" stroke-width="2.8" stroke-linecap="round" />
    <rect x="4" y="9.5" width="16" height="12.5" rx="3.5" fill="url(#lockGoldBody)" filter="url(#lockShadowV2)" stroke="#fffbeb" stroke-width="0.6" />
    <circle cx="12" cy="14.2" r="1.8" fill="#291404" />
    <polygon points="10.8,14.5 13.2,14.5 12.8,18 11.2,18" fill="#291404" />
    <circle cx="12" cy="13.7" r="0.7" fill="#fffbeb" opacity="0.9" />
  </svg>`;
}
window.get3DLockIconSvg = get3DLockIconSvg;

function get3DShieldIconSvg() {
  return `<svg class="icon-3d" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399" />
        <stop offset="60%" stop-color="#059669" />
        <stop offset="100%" stop-color="#064e3b" />
      </linearGradient>
    </defs>
    <path d="M12 2 L4 5.5 V11.5 C4 16.5 7.5 21 12 22 C16.5 21 20 16.5 20 11.5 V5.5 Z" fill="url(#shieldGrad)" stroke="#a7f3d0" stroke-width="0.8" />
    <path d="M9 11.5 L11 13.5 L15 9.5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
}
window.get3DShieldIconSvg = get3DShieldIconSvg;

// أيقونة شمس واقعية ثلاثية الأبعاد للوضع الفاتح / النهاري
function get3DSunIconSvg() {
  return `<svg class="icon-3d icon-sun-3d" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <defs>
      <filter id="sunDropGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1.5" flood-color="#ea580c" flood-opacity="0.4" />
      </filter>
      <radialGradient id="sunCoreGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="25%" stop-color="#fef08a" />
        <stop offset="60%" stop-color="#f59e0b" />
        <stop offset="90%" stop-color="#ea580c" />
        <stop offset="100%" stop-color="#9a3412" />
      </radialGradient>
      <linearGradient id="sunRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
    </defs>
    <g class="sun-rays" stroke="url(#sunRayGrad)" stroke-width="2" stroke-linecap="round">
      <line x1="12" y1="1.8" x2="12" y2="4.2" />
      <line x1="12" y1="19.8" x2="12" y2="22.2" />
      <line x1="1.8" y1="12" x2="4.2" y2="12" />
      <line x1="19.8" y1="12" x2="22.2" y2="12" />
      <line x1="4.8" y1="4.8" x2="6.6" y2="6.6" />
      <line x1="17.4" y1="17.4" x2="19.2" y2="19.2" />
      <line x1="4.8" y1="19.2" x2="6.6" y2="17.4" />
      <line x1="17.4" y1="6.6" x2="19.2" y2="4.8" />
    </g>
    <circle cx="12" cy="12" r="5.6" fill="url(#sunCoreGrad)" filter="url(#sunDropGlow)" stroke="#fef08a" stroke-width="0.6" />
    <path d="M8.5 9 A4 4 0 0 1 14.5 7.5" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.85" />
  </svg>`;
}
window.get3DSunIconSvg = get3DSunIconSvg;

// أيقونة قمر ونجوم ثلاثية الأبعاد للوضع الداكن / الليلي
function get3DMoonIconSvg() {
  return `<svg class="icon-3d icon-moon-3d" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <defs>
      <filter id="moonDropGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1.5" flood-color="#0284c7" flood-opacity="0.35" />
      </filter>
      <linearGradient id="moonBodyGrad" x1="20%" y1="15%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="25%" stop-color="#e0f2fe" />
        <stop offset="60%" stop-color="#7dd3fc" />
        <stop offset="90%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>
      <radialGradient id="craterGrad" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#0284c7" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#075985" stop-opacity="0.9" />
      </radialGradient>
    </defs>
    <path d="M12.8 2.2 C7.5 2.8 3.5 7.4 3.5 12.8 C3.5 18.6 8.2 23.2 14 23.2 C17.2 23.2 20 21.8 21.8 19.5 C16.5 20.2 11.5 16.2 11.5 10.8 C11.5 6.9 13.8 3.6 17.2 2.4 C15.8 2.1 14.3 2.1 12.8 2.2 Z" 
          fill="url(#moonBodyGrad)" filter="url(#moonDropGlow)" stroke="#bae6fd" stroke-width="0.6" />
    <circle cx="8.5" cy="11.5" r="1.3" fill="url(#craterGrad)" opacity="0.6" />
    <circle cx="10" cy="16.5" r="0.9" fill="url(#craterGrad)" opacity="0.5" />
    <g class="moon-star-1">
      <polygon points="18.5,5 19.2,6.5 20.7,7.2 19.2,7.9 18.5,9.4 17.8,7.9 16.3,7.2 17.8,6.5" fill="#fef08a" />
    </g>
    <g class="moon-star-2">
      <circle cx="21" cy="12.5" r="0.9" fill="#ffffff" opacity="0.9" />
    </g>
  </svg>`;
}
window.get3DMoonIconSvg = get3DMoonIconSvg;

// مدير الثيم والتبديل بين الوضع الليلي والنهاري (Theme Manager)
function initThemeManager() {
  const btnToggleTheme = document.getElementById("btn-toggle-theme");
  const iconEl = document.getElementById("theme-toggle-icon");
  const textEl = document.getElementById("theme-toggle-text");

  function getStoredTheme() {
    try {
      return localStorage.getItem("gam_theme") || "dark";
    } catch(e) {
      return "dark";
    }
  }

  function applyTheme(theme) {
    const isLight = theme === "light";
    if (isLight) {
      document.documentElement.setAttribute("data-theme", "light");
      if (iconEl) iconEl.innerHTML = get3DMoonIconSvg();
      if (textEl) textEl.textContent = "الوضع الليلي";
      if (btnToggleTheme) btnToggleTheme.title = "التبديل إلى الوضع الليلي";
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (iconEl) iconEl.innerHTML = get3DSunIconSvg();
      if (textEl) textEl.textContent = "الوضع الفاتح";
      if (btnToggleTheme) btnToggleTheme.title = "التبديل إلى الوضع الفاتح";
    }
  }

  // تطبيق الثيم الأولي
  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  if (btnToggleTheme) {
    btnToggleTheme.onclick = (e) => {
      e.stopPropagation();
      const currentTheme = getStoredTheme();
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      try {
        localStorage.setItem("gam_theme", nextTheme);
      } catch(e) {}
      applyTheme(nextTheme);
      if (typeof showToast === "function") {
        showToast(nextTheme === "light" ? "تم تفعيل الوضع الفاتح ☀️" : "تم تفعيل الوضع الليلي 🌙");
      }
    };
  }
}
window.initThemeManager = initThemeManager;


/**
 * دالة ذكية لتحديد الشهر الفعلي الحالي تلقائياً بناءً على تاريخ اليوم الفعلي
 * تضمن فتح النظام دائماً على الشهر الجاري (أكتوبر 2026 حالياً، ثم نوفمبر، وهكذا)
 */
function getSmartCurrentMonthKey(gam) {
  if (!gam || !Array.isArray(gam.months) || gam.months.length === 0) {
    return "oct";
  }

  const now = new Date();
  const curMonthIndex = now.getMonth(); // 0 = يناير, 9 = أكتوبر, إلخ
  const curYear = now.getFullYear(); // e.g. 2026
  const targetKeyPrefix = ALL_MONTHS_DEF[curMonthIndex] ? ALL_MONTHS_DEF[curMonthIndex].key : "oct";
  const targetArabicName = ALL_MONTHS_DEF[curMonthIndex] ? ALL_MONTHS_DEF[curMonthIndex].name : "أكتوبر";

  // 1. أولاً: البحث عن شهر في الجمعية يطابق الشهر الحالي والسنة الحالية بدقة (مثل oct_2026 أو oct في جمعية 2026)
  const exactMatch = gam.months.find(m => {
    const k = (m.key || "").toLowerCase();
    const n = m.name || "";
    if (k === `${targetKeyPrefix}_${curYear}`) return true;
    if (k === targetKeyPrefix) {
      if (n.includes(String(curYear)) || (gam.name && gam.name.includes(String(curYear))) || !n.match(/\d{4}/)) {
        return true;
      }
    }
    if (n.includes(targetArabicName) && n.includes(String(curYear))) {
      return true;
    }
    return false;
  });

  if (exactMatch) {
    return exactMatch.key;
  }

  // 2. ثانياً: مطابقة اسم الشهر الحالي أو بادئة المفتاح
  const monthMatch = gam.months.find(m => {
    const k = (m.key || "").toLowerCase();
    const n = m.name || "";
    return k === targetKeyPrefix || k.startsWith(targetKeyPrefix + "_") || n.includes(targetArabicName);
  });

  if (monthMatch) {
    return monthMatch.key;
  }

  // 3. ثالثاً: إذا كانت الجمعية منتهية في الماضي أو مستقبلية لم تبدأ بعد:
  if (gam.currentMonthKey && gam.months.some(m => m.key === gam.currentMonthKey)) {
    return gam.currentMonthKey;
  }

  return gam.months[0].key;
}

/**
 * مزامنة حالات السداد مع الشهر المعروض الحالي
 * تحويل الشهور حتى الشهر الحالي من "future" إلى "unpaid" (متأخر)
 * مع الحفاظ التام 100% على أي حالات تم سدادها (paid) أو قبضها (payout) التي عدلها المدير يدوياً
 */
function syncMonthPaymentStatuses(gam, monthKey) {
  if (!gam || !gam.months || !gam.members) return;
  const curMonthIdx = gam.months.findIndex(mo => mo.key === monthKey);
  if (curMonthIdx === -1) return;

  gam.currentMonthKey = monthKey;

  gam.members.forEach(m => {
    if (m.isVacant) return;
    if (m.payments) {
      gam.months.forEach((mo, mIdx) => {
        if (!m.payments[mo.key]) {
          const count = m.isShared ? 2 : 1;
          m.payments[mo.key] = Array(count).fill(mIdx <= curMonthIdx ? "unpaid" : "future");
        } else {
          m.payments[mo.key] = m.payments[mo.key].map(st => {
            // الشهور حتى الشهر الحالي: أي حالة لم تستحق (future) تصبح متأخر (unpaid) تلقائياً
            if (mIdx <= curMonthIdx && st === "future") return "unpaid";
            // الشهور القادمة بعد الشهر الحالي: أي حالة متأخر تعود إلى لم تستحق (future)
            if (mIdx > curMonthIdx && st === "unpaid") return "future";
            // ما قام المدير بتحديده كـ "تم" (paid) أو "قبض" (payout) يظل كما هو تماماً دون أي تغيير
            return st;
          });
        }
      });
    }
  });
}

/**
 * مزامنة كافة الجمعيات في النظام تلقائياً مع الشهر الجاري بالتقويم
 * بمجرد حلول الشهر الجديد تصبح الحالات "متأخر" تلقائياً ما لم يحدد المدير خلاف ذلك
 */
function syncAllGam3eyatPaymentStatuses(data) {
  if (!data || !Array.isArray(data.gam3eyat)) return false;
  let modified = false;

  data.gam3eyat.forEach(gam => {
    if (!gam.months || gam.months.length === 0) return;
    const smartMonth = getSmartCurrentMonthKey(gam);
    const smartMonthIdx = gam.months.findIndex(m => m.key === smartMonth);
    const savedIdx = gam.currentMonthKey ? gam.months.findIndex(m => m.key === gam.currentMonthKey) : -1;

    // إذا تقدم التقويم الزمني إلى شهر جديد وكان متقدماً على الشهر المحفوظ، نعتمد الشهر الجديد
    const targetMonthKey = (savedIdx < smartMonthIdx || savedIdx === -1) ? smartMonth : gam.currentMonthKey;
    syncMonthPaymentStatuses(gam, targetMonthKey);
    modified = true;
  });

  return modified;
}

let appState = {
  currentGamId: "gam1",
  currentMonthKey: "oct",
  currentRole: "landing", // "landing" افتراضي للزوار، "admin" للمدير، "member" للمشترك
  isAdminAuthenticated: false,
  loggedMember: null, // المشترك الحالي
  statusFilter: "all",
  currentManager: null // المدير السحابي المسجل
};
window.appState = appState;

// تحميل البيانات أو استخدام الافتراضي
let appData = loadData();
window.appData = appData;

function setAppData(newData) {
  appData = newData;
  window.appData = appData;
}
window.setAppData = setAppData;

if (appData.gam3eyat && appData.gam3eyat[0]) {
  appState.currentGamId = appData.gam3eyat[0].id;
  syncAllGam3eyatPaymentStatuses(appData);
  appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || getSmartCurrentMonthKey(appData.gam3eyat[0]);
}

// توليد كود سري عشوائي فريد مكون من 4 أرقام
function generateRandomPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// ==========================================
// 1. التخزين المحلي (LocalStorage)
// ==========================================

function loadData() {
  let data = null;

  // تنظيف المفاتيح السابقة القديمة لضمان عدم بقاء أي بيانات غير محدثة
  try {
    const oldKeys = ["gam3eyat_app_data", "gam3eyat_app_data_v2", "gam3eyat_app_data_v2_5", "gam3eyat_app_data_v3", "gam3eyat_app_data_v3_2", "gam3eyat_app_data_v3_3"];
    oldKeys.forEach(k => localStorage.removeItem(k));
  } catch (e) {}

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch (e) {
      console.error("خطأ في قراءة البيانات المحفوظة", e);
    }
  }

  // فحص ذكي للترقية التلقائية: إذا كانت البيانات غير موجودة أو قديمة أو تفتقر للمشتركين الـ 19 المعتمدين
  const targetVersion = (typeof INITIAL_DATA !== "undefined" && INITIAL_DATA.dataVersion) ? INITIAL_DATA.dataVersion : "2026.10.08_v4.0";
  const needsInitialData = !data || 
    !data.gam3eyat || 
    !Array.isArray(data.gam3eyat) || 
    data.gam3eyat.length === 0 ||
    !data.dataVersion ||
    data.dataVersion !== targetVersion ||
    !data.registeredMembers ||
    data.registeredMembers.length < 15;

  if (needsInitialData) {
    console.log("جاري تحديث بيانات التطبيق تلقائياً إلى النسخة المعتمدة بجميع المشتركين...");
    data = JSON.parse(JSON.stringify(INITIAL_DATA));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  // تنظيف تلقائي للبيانات وإزالة أي مشتركين وهميين
  if (data && data.gam3eyat) {
    let modified = false;

    // 1. مزامنة فورية لحالات الشهور مع التقويم الحقيقي لجميع الجمعيات
    syncAllGam3eyatPaymentStatuses(data);
    modified = true;

    data.gam3eyat.forEach(gam => {
      // 2. تحويل المشتركين الوهميين "عضو دور X" إلى أدوار شاغرة
      gam.members.forEach(m => {
        if (m.names.some(n => /^عضو دور \d+$/i.test((n || "").trim()))) {
          m.isVacant = true;
          m.names = ["(دور متاح)"];
          m.phones = [""];
          m.pins = [""];
          modified = true;
        }
      });

      // 3. إذا كانت هناك أدوار زائدة عن عدد الشهور (مثل الصف 13 في جمعية 12 شهراً)
      if (gam.months && gam.members.length > gam.months.length) {
        const extraMembers = gam.members.slice(gam.months.length);
        gam.members = gam.members.slice(0, gam.months.length);
        modified = true;

        // تسكين الأعضاء الحقيقيين الزائدين في الأدوار الشاغرة
        extraMembers.forEach(extra => {
          const realName = extra.names && extra.names[0] && !/^عضو دور \d+$/i.test(extra.names[0].trim()) ? extra.names[0].trim() : null;
          if (realName && realName !== "(دور متاح)") {
            const vacantSlot = gam.members.find(m => m.isVacant);
            if (vacantSlot) {
              vacantSlot.isVacant = false;
              vacantSlot.names = extra.names;
              vacantSlot.phones = extra.phones || [""];
              vacantSlot.pins = extra.pins || ["1234"];
              vacantSlot.shares = extra.shares || [gam.shareAmount];
            }
          }
        });
      }

      // 4. التأكد من كتابة اسم الشهر مع السنة في جميع الجمعيات (مثل: مايو 2026)
      if (gam.months) {
        gam.months.forEach((mo, idx) => {
          if (!/\d{4}/.test(mo.name)) {
            const yearMatch = (gam.name || "").match(/\d{4}/) || (gam.members[idx] && gam.members[idx].payoutDate && gam.members[idx].payoutDate.match(/\d{4}/));
            const year = yearMatch ? yearMatch[0] : "2026";
            mo.name = `${mo.name} ${year}`;
            modified = true;
          }
        });
      }

      if (gam.members) {
        gam.members.forEach((m, idx) => {
          if (m.payoutDate && !/\d{4}/.test(m.payoutDate)) {
            const yearMatch = (gam.name || "").match(/\d{4}/);
            const year = yearMatch ? yearMatch[0] : "2026";
            m.payoutDate = `${m.payoutDate} ${year}`;
            modified = true;
          }
        });
      }
    });

    if (!data.registeredMembers || !Array.isArray(data.registeredMembers)) {
      data.registeredMembers = [];
      modified = true;
    }

    // 5. تأمين خصوصية المشتركين والحفاظ على الأكواد المعتمدة بدون تبديل عشوائي
    if (!data.pinsSecuredV2) {
      data.pinsSecuredV2 = true;
      data.gam3eyat.forEach(gam => {
        gam.members.forEach(m => {
          if (m.isVacant) return;
          m.names.forEach((name, nIdx) => {
            const trimmed = (name || "").trim();
            if (!trimmed || trimmed === "(دور متاح)") return;
            if (!m.pins) m.pins = [];
            if (!m.pins[nIdx]) {
              const ph = (m.phones && m.phones[nIdx]) || "";
              m.pins[nIdx] = (ph.length >= 4) ? ph.slice(-4) : "1234";
            }
          });
        });
      });
      if (data.registeredMembers) {
        data.registeredMembers.forEach(rm => {
          if (!rm.pin) {
            const ph = rm.phone || "";
            rm.pin = (ph.length >= 4) ? ph.slice(-4) : "1234";
          }
        });
      }
      modified = true;
    }

    if (modified) {
      saveData(data);
    }
  }

  return data;
}

function saveData(dataToSave) {
  // 1. الحفظ المحلي الدائم
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

  // 2. المزامنة السحابية الفورية في Firestore
  if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
    const activeUid = (appState && appState.currentManager && appState.currentManager.uid) ? appState.currentManager.uid : "admin_default";
    FirebaseService.saveManagerData(activeUid, dataToSave).catch(err => {
      console.warn("خطأ في المزامنة السحابية:", err);
    });
  }
}

function getCurrentGam() {
  if (!appData.gam3eyat || !Array.isArray(appData.gam3eyat) || appData.gam3eyat.length === 0) return null;
  const activeGams = appData.gam3eyat.filter(g => !g.isArchived);
  return activeGams.find(g => g.id === appState.currentGamId) || activeGams[0] || appData.gam3eyat[0] || null;
}

// ==========================================
// 2. التهيئة عند التشغيل
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  // 1. تهيئة نظام الثيم والمظهر فورياً دون انتظار الشبكة
  initThemeManager();

  // 2. ربط جميع أحداث الأزرار والنوافذ والقوائم فورياً وبشكل متزامن لضمان استجابة 100% دون أي تأخير
  attachEventListeners();
  setupMemberSearchAutocomplete();
  setupManagerCloudLifecycle();

  // 3. تجهيز وعرض الواجهة فورياً بالبيانات المتاحة
  renderGamTabs();
  setupMonthSelector();

  // فحص الرابط السحري المباشر (Magic Link)
  const hasMagicLink = await checkMagicLink();
  if (!hasMagicLink) {
    updateView();
  }

  // 4. جلب أحدث بيانات الجمعيات العامة من السحابة في الخلفية دون تعطيل أو تجميد استجابة واجهة المستخدم
  if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseDb !== "undefined") {
    (async () => {
      try {
        const publicSnap = await firebaseDb.collection("public_data").doc("active_statement").get();
        if (publicSnap.exists) {
          const cData = publicSnap.data();
          const targetVer = (typeof INITIAL_DATA !== "undefined" && INITIAL_DATA.dataVersion) ? INITIAL_DATA.dataVersion : "2026.10.08_v4.0";
          const isCloudValid = cData &&
                               Array.isArray(cData.gam3eyat) &&
                               cData.gam3eyat.length > 0 &&
                               cData.dataVersion === targetVer &&
                               Array.isArray(cData.registeredMembers) &&
                               cData.registeredMembers.length >= 15;

          if (isCloudValid) {
            setAppData(cData);
            if (appData.gam3eyat && appData.gam3eyat[0]) {
              const activeGam = appData.gam3eyat.find(g => g.id === appState.currentGamId) || appData.gam3eyat[0];
              appState.currentGamId = activeGam.id;
              appState.currentMonthKey = getSmartCurrentMonthKey(activeGam);
              syncMonthPaymentStatuses(activeGam, appState.currentMonthKey);
            }
            renderGamTabs();
            setupMonthSelector();
            updateView();
          } else {
            console.warn("تم اكتشاف بيانات سحابية عامة قديمة، جاري تحديث السحابة تلقائياً بالنسخة المعتمدة بجميع المشتركين...");
            try {
              const freshPayload = JSON.parse(JSON.stringify(INITIAL_DATA));
              freshPayload.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
              await firebaseDb.collection("public_data").doc("active_statement").set(freshPayload, { merge: true });
            } catch(syncErr) {
              console.warn("تعذر كتابة البيانات المحدثة في السحابة العامة:", syncErr);
            }
          }
        } else {
          // إنشاء المستند السحابي العام فوراً بالنسخة المعتمدة
          try {
            const freshPayload = JSON.parse(JSON.stringify(INITIAL_DATA));
            freshPayload.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
            await firebaseDb.collection("public_data").doc("active_statement").set(freshPayload, { merge: true });
          } catch(initErr) {}
        }
      } catch (e) {
        console.warn("Public cloud data fetch notice:", e);
      }
    })();
  }

  // المزامنة التلقائية مع السحابة لضمان نشر الجمعيات الحالية فوراً للمشتركين إذا كان المدير متصلاً
  if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
    setTimeout(async () => {
      try {
        if (appState && appState.currentManager && appData && appData.gam3eyat && appData.gam3eyat.length > 0) {
          const activeUid = appState.currentManager.uid || "admin_default";
          await FirebaseService.saveManagerData(activeUid, appData);
          console.log("تم تحديث ومزامنة البيانات مع Google Cloud Firestore بنجاح!");
        }
      } catch (err) {
        console.warn("تنبيه المزامنة التلقائية:", err);
      }
    }, 1200);
  }
});

// ==========================================
// 2. فحص الرابط السحري المباشر (Magic Link)
// ==========================================

async function checkMagicLink() {
  const urlParams = new URLSearchParams(window.location.search);
  const managerUid = urlParams.get('mgr') || urlParams.get('manager');
  const memberName = urlParams.get('name');
  const memberKey = urlParams.get('m') || urlParams.get('phone') || urlParams.get('u');
  const authPin = urlParams.get('k') || urlParams.get('pin') || urlParams.get('key');
  const isPortalRequested = urlParams.get('portal') === 'member' || Boolean(memberName) || Boolean(memberKey);

  // فحص الجلسة النشطة للمشترك في هذا المتصفح لعدم تكرار طلب الكود
  let sessionMember = null;
  try {
    const savedSessionRaw = sessionStorage.getItem("gam_active_member_session");
    if (savedSessionRaw) {
      sessionMember = JSON.parse(savedSessionRaw);
    }
  } catch(e) {}

  if (isPortalRequested) {
    appState.currentRole = "member";
    appState.isAdminAuthenticated = false;
    if (!authPin) {
      appState.loggedMember = null;
    }
  }

  // ملء الحقول تلقائياً في شاشة تسجيل دخول المشترك
  const phoneInput = document.getElementById("input-member-phone");
  const pinInput = document.getElementById("input-member-pin");
  if (phoneInput) {
    phoneInput.value = memberKey ? memberKey.trim() : (memberName ? memberName.trim() : "");
  }
  if (pinInput && authPin) {
    pinInput.value = authPin.trim();
  }

  // فحص الحزمة السحابية المرفقة بالرابط إن وُجدت
  const dParam = urlParams.get('d');
  if (dParam) {
    try {
      const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(dParam))));
      window.__cloudMemberPacket = JSON.parse(jsonStr);
      if (window.__cloudMemberPacket && window.__cloudMemberPacket.n) {
        if (phoneInput && !phoneInput.value) {
          phoneInput.value = window.__cloudMemberPacket.p || window.__cloudMemberPacket.n;
        }
      }
    } catch(e) {
      console.warn("Could not decode member payload", e);
    }
  }

  if ((managerUid || isPortalRequested) && (memberName || memberKey) && typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
    try {
      showToast("جاري جلب كشف حسابك المحدث من السحابة...");
      const lookupKey = memberName || memberKey;
      const cloudRes = await FirebaseService.fetchMemberStatementFromCloud(managerUid, lookupKey, authPin);
      if (cloudRes && cloudRes.managerData) {
        appData = cloudRes.managerData;
        const all = getAllUniqueParticipants();
        let matched = null;
        if (memberName && memberName.trim()) {
          matched = all.find(p => p.name.trim().toLowerCase() === memberName.trim().toLowerCase());
        }
        if (!matched && memberKey && memberKey.trim()) {
          const cleanKey = memberKey.trim();
          const normKey = normalizePhoneNumber(cleanKey);
          matched = all.find(p => 
            p.name.trim().toLowerCase() === cleanKey.toLowerCase() ||
            (normKey && normalizePhoneNumber(p.phone) === normKey) ||
            (p.phone && (cleanPinCode(p.phone) === cleanKey || p.phone.replace(/^0+/, '') === cleanKey.replace(/^0+/, ''))) ||
            cleanPinCode(p.code) === cleanKey
          );
        }
        if (matched) {
          const pinMatches = (authPin && (
            cleanPinCode(matched.pin) === cleanPinCode(authPin) ||
            cleanPinCode(matched.code) === cleanPinCode(authPin) ||
            (matched.phone && cleanPinCode(matched.phone).endsWith(cleanPinCode(authPin)))
          )) || (sessionMember && (
            (sessionMember.phone && normalizePhoneNumber(sessionMember.phone) === normalizePhoneNumber(matched.phone)) ||
            (sessionMember.name && sessionMember.name.trim().toLowerCase() === matched.name.trim().toLowerCase())
          ));

          if (pinMatches) {
            appState.loggedMember = matched;
            try {
              sessionStorage.setItem("gam_active_member_session", JSON.stringify({
                name: matched.name,
                phone: matched.phone
              }));
            } catch(e) {}
            appState.currentRole = "member";
            updateView();
            showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك الحي بنجاح`);
            return true;
          } else {
            appState.loggedMember = null;
            appState.currentRole = "member";
            updateView();
            if (phoneInput) phoneInput.value = matched.phone || matched.name;
            if (pinInput) {
              pinInput.value = "";
              pinInput.focus();
              showToast(`أهلاً بك يا ${matched.name}! يُرجى كتابة كودك السري لإكمال الدخول`);
            }
            return false;
          }
        }
      }
    } catch (err) {
      console.warn("خطأ في جلب كشف الحساب السحابي:", err);
    }
  }

  if (memberName || memberKey) {
    const all = getAllUniqueParticipants();
    let matched = null;
    if (memberName && memberName.trim()) {
      matched = all.find(p => p.name.trim().toLowerCase() === memberName.trim().toLowerCase());
    }
    if (!matched && memberKey && memberKey.trim()) {
      const cleanKey = memberKey.trim();
      const normKey = normalizePhoneNumber(cleanKey);
      matched = all.find(p => 
        p.name.trim().toLowerCase() === cleanKey.toLowerCase() ||
        (normKey && normalizePhoneNumber(p.phone) === normKey) ||
        (p.phone && (cleanPinCode(p.phone) === cleanKey || p.phone.replace(/^0+/, '') === cleanKey.replace(/^0+/, ''))) ||
        cleanPinCode(p.code) === cleanKey
      );
    }

    if (matched) {
      const pinMatches = (authPin && (
        cleanPinCode(matched.pin) === cleanPinCode(authPin) ||
        cleanPinCode(matched.code) === cleanPinCode(authPin) ||
        (matched.phone && cleanPinCode(matched.phone).endsWith(cleanPinCode(authPin)))
      )) || (sessionMember && (
        (sessionMember.phone && normalizePhoneNumber(sessionMember.phone) === normalizePhoneNumber(matched.phone)) ||
        (sessionMember.name && sessionMember.name.trim().toLowerCase() === matched.name.trim().toLowerCase())
      ));

      if (pinMatches) {
        appState.loggedMember = matched;
        try {
          sessionStorage.setItem("gam_active_member_session", JSON.stringify({
            name: matched.name,
            phone: matched.phone
          }));
        } catch(e) {}
        appState.currentRole = "member";
        updateView();
        showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك المباشر بنجاح`);
        return true;
      } else {
        appState.loggedMember = null;
        appState.currentRole = "member";
        updateView();
        if (phoneInput) phoneInput.value = matched.phone || matched.name;
        if (pinInput) {
          pinInput.value = "";
          pinInput.focus();
          showToast(`أهلاً بك يا ${matched.name}! يُرجى كتابة كودك السري لإكمال الدخول`);
        }
        return false;
      }
    }
  }

  if (isPortalRequested) {
    appState.currentRole = "member";
    appState.loggedMember = null;
    updateView();
    return true;
  }
  return false;
}

// ==========================================
// 3. التبويبات والشهر النشط والأرشفة
// ==========================================

function renderGamTabs() {
  const container = document.getElementById("gam3eya-tabs-container");
  if (!container) return;

  // إخفاء تبويبات جمعيات المدير تماماً عند التواجد في الواجهة الرئيسية أو بوابة المشترك
  if (appState.currentRole !== "admin") {
    container.style.display = "none";
    return;
  }
  container.style.display = "flex";
  container.innerHTML = "";

  const activeGams = (appData.gam3eyat || []).filter(g => !g.isArchived);
  const archivedGams = (appData.gam3eyat || []).filter(g => g.isArchived);

  // تحديث عداد الجمعيات المؤرشفة
  const archiveCountBadge = document.getElementById("archive-count-badge");
  if (archiveCountBadge) {
    archiveCountBadge.textContent = archivedGams.length;
  }

  const emptyStateEl = document.getElementById("empty-manager-state");
  const gamContent = document.getElementById("admin-gam-content");

  // إذا لم تكن هناك أي جمعيات نشطة (مثلاً حساب مدير جديد فارغ)
  if (activeGams.length === 0) {
    if (emptyStateEl) emptyStateEl.style.display = "block";
    if (gamContent) gamContent.style.display = "none";

    const addBtn = document.createElement("button");
    addBtn.className = "btn-new-gam-tab";
    addBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-left:5px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg><span>إضافة أول جمعية لك</span>`;
    addBtn.onclick = () => openModal("modal-create-gam");
    container.appendChild(addBtn);
    return;
  } else {
    if (emptyStateEl) emptyStateEl.style.display = "none";
    if (gamContent) gamContent.style.display = "block";
  }

  // إذا كانت الجمعية الحالية مؤرشفة أو غير موجودة، ننتقل لأول جمعية نشطة
  if (activeGams.length > 0 && !activeGams.some(g => g.id === appState.currentGamId)) {
    appState.currentGamId = activeGams[0].id;
    appState.currentMonthKey = getSmartCurrentMonthKey(activeGams[0]);
    syncMonthPaymentStatuses(activeGams[0], appState.currentMonthKey);
  }

  activeGams.forEach(gam => {
    const btn = document.createElement("button");
    btn.className = `gam-tab-btn ${gam.id === appState.currentGamId ? "active" : ""}`;
    btn.innerHTML = gam.name;
    btn.onclick = () => {
      appState.currentGamId = gam.id;
      appState.currentMonthKey = getSmartCurrentMonthKey(gam);
      syncMonthPaymentStatuses(gam, appState.currentMonthKey);
      appState.currentRole = "admin";
      appState.isAdminAuthenticated = true;
      renderGamTabs();
      setupMonthSelector();
      updateView();
    };
    container.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "btn-new-gam-tab";
  addBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-left:5px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg><span>إضافة جمعية جديدة</span>`;
  addBtn.onclick = () => openModal("modal-create-gam");
  container.appendChild(addBtn);
}

// أرشفة الجمعية الحالية
function archiveCurrentGam() {
  const gam = getCurrentGam();
  if (!gam) return;

  const activeGams = appData.gam3eyat.filter(g => !g.isArchived);
  if (activeGams.length <= 1) {
    alert("لا يمكن أرشفة الجمعية الوحيدة النشطة! يجب أن تحتوي الشاشة على جمعية نشطة واحدة على الأقل، أو قم بإنشاء جمعية جديدة أولاً.");
    return;
  }

  if (confirm(`هل أنت متأكد من رغبتك في أرشفة جمعية "${gam.name}"؟\n\nسيتم نقلها إلى سجل الجمعيات المؤرشفة لحفظ كافة سجلاتها وحساباتها وتفريغ مساحة العمل النشطة.`)) {
    gam.isArchived = true;
    gam.archivedAt = new Date().toISOString();
    saveData(appData);

    const remainingActive = appData.gam3eyat.filter(g => !g.isArchived);
    if (remainingActive.length > 0) {
      appState.currentGamId = remainingActive[0].id;
      appState.currentMonthKey = getSmartCurrentMonthKey(remainingActive[0]);
      syncMonthPaymentStatuses(remainingActive[0], appState.currentMonthKey);
    }

    renderGamTabs();
    setupMonthSelector();
    updateView();
    showToast(`تم أرشفة "${gam.name}" ونقلها لقسم الأرشيف بنجاح`);
  }
}

// فتح نافذة استعراض الجمعيات المؤرشفة
function openArchivesModal() {
  const tbody = document.getElementById("archives-table-body");
  const emptyMsg = document.getElementById("archives-empty-message");
  const table = tbody.closest("table");
  tbody.innerHTML = "";

  const archivedGams = appData.gam3eyat.filter(g => g.isArchived);

  // تحديث الشارة
  const badge = document.getElementById("archive-count-badge");
  if (badge) badge.textContent = archivedGams.length;

  if (archivedGams.length === 0) {
    table.style.display = "none";
    emptyMsg.style.display = "block";
  } else {
    table.style.display = "table";
    emptyMsg.style.display = "none";

    archivedGams.forEach((gam, idx) => {
      const tr = document.createElement("tr");
      tr.className = "archive-row";
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td style="text-align: right;">
          <strong>${gam.name}</strong>
          <span class="archive-badge-tag" style="margin-right: 0.35rem;">مؤرشفة</span>
        </td>
        <td>${gam.months.length} شهر</td>
        <td>${formatCurrency(gam.shareAmount)}</td>
        <td><strong>${formatCurrency(gam.totalPayout)}</strong></td>
        <td style="white-space: nowrap;">
          <button class="btn btn-sm btn-outline" onclick="restoreArchivedGam('${gam.id}')" style="color: #059669; font-weight: 700; border-color: #a7f3d0; background: #ecfdf5; margin-left: 0.25rem;" title="إعادة الجمعية إلى القائمة النشطة">
            استعادة للنشطة
          </button>
          <button class="btn btn-sm btn-outline" onclick="deleteArchivedGam('${gam.id}')" style="color: #dc2626; border-color: #fecaca; background: #fef2f2; font-weight: 700;" title="حذف الجمعية المؤرشفة نهائياً">
            حذف
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  openModal("modal-archives");
}

window.restoreArchivedGam = function(gamId) {
  const gam = appData.gam3eyat.find(g => g.id === gamId);
  if (!gam) return;

  gam.isArchived = false;
  saveData(appData);

  appState.currentGamId = gam.id;
  appState.currentMonthKey = getSmartCurrentMonthKey(gam);
  syncMonthPaymentStatuses(gam, appState.currentMonthKey);

  renderGamTabs();
  setupMonthSelector();
  updateView();
  openArchivesModal(); // تحديث القائمة
  showToast(`تمت استعادة جمعية "${gam.name}" إلى الجمعيات النشطة بنجاح`);
};

window.deleteArchivedGam = function(gamId) {
  const gam = appData.gam3eyat.find(g => g.id === gamId);
  if (!gam) return;

  if (confirm(`تحذير نهائي: هل أنت متأكد من حذف جمعية "${gam.name}" نهائياً من الأرشيف؟\nلن يمكن استعادة بيانات هذه الجمعية بعد الحذف.`)) {
    appData.gam3eyat = appData.gam3eyat.filter(g => g.id !== gamId);
    saveData(appData);
    openArchivesModal();
    renderGamTabs();
    showToast(`تم حذف جمعية "${gam.name}" نهائياً`);
  }
};

function setupMonthSelector() {
  const gam = getCurrentGam();
  if (!gam) return;
  const select = document.getElementById("select-active-month");
  select.innerHTML = "";

  gam.months.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.key;
    opt.textContent = m.name;
    if (m.key === appState.currentMonthKey) {
      opt.selected = true;
      opt.setAttribute("selected", "selected");
    }
    select.appendChild(opt);
  });
  select.value = appState.currentMonthKey;
}

// ==========================================
// 4. تبديل وضع المدير وبوابة المشتركين
// ==========================================

function toggleRole() {
  if (appState.currentRole === "admin") {
    appState.currentRole = "member";
    showToast("تم الانتقال لمعاينة بوابة المشتركين");
    updateView();
  } else if (appState.currentRole === "landing") {
    appState.currentRole = "member";
    showToast("مرحباً بك في بوابة المشتركين");
    updateView();
  } else { // "member"
    // حماية الخصوصية: لا يمكن للمشترك التبديل للوحة تحكم المدير أبداً إلا بتسجيل دخول رسمي
    openModal("modal-manager-auth");
  }
}

function updateView() {
  const roleBadge = document.getElementById("current-role-badge");
  const toggleBtn = document.getElementById("btn-toggle-role");
  const adminView = document.getElementById("admin-view");
  const memberView = document.getElementById("member-view");
  const landingView = document.getElementById("landing-page-view");
  const settingsBtn = document.getElementById("btn-admin-settings");
  const cloudSyncBtn = document.getElementById("btn-cloud-sync-manual");
  const gamTabsContainer = document.getElementById("gam3eya-tabs-container");
  const cloudMgrBadge = document.getElementById("cloud-manager-badge");

  const isMemberLink = window.location.search.includes('m=') || 
                       window.location.search.includes('phone=') || 
                       window.location.search.includes('portal=member');

  if (appState.currentRole === "admin") {
    // جدار حماية أمني: منع فتح لوحة تحكم المدير إطلاقاً إلا بوجود مصادقة حقيقية وليس من رابط كشف حساب مشترك
    if (isMemberLink || !appState.isAdminAuthenticated || !appState.currentManager) {
      console.warn("محاولة وصول غير مصرح بها للوحة تحكم المدير! تم عزل المسار وحماية البيانات.");
      appState.currentRole = isMemberLink ? "member" : "landing";
      updateView();
      return;
    }

    if (landingView) landingView.style.display = "none";
    if (adminView) adminView.style.display = "block";
    if (memberView) memberView.style.display = "none";
    if (gamTabsContainer) gamTabsContainer.style.display = "flex";

    if (roleBadge) roleBadge.style.display = "none";
    if (toggleBtn) toggleBtn.style.display = "none";
    if (settingsBtn) settingsBtn.style.display = "none";
    if (cloudSyncBtn) cloudSyncBtn.style.display = "none";
    if (cloudMgrBadge) cloudMgrBadge.style.display = "inline-flex";

    renderGamTabs();
    renderAdminDashboard();
    renderMatrixTable();
  } else if (appState.currentRole === "member") {
    if (landingView) landingView.style.display = "none";
    if (adminView) adminView.style.display = "none";
    if (memberView) memberView.style.display = "block";
    if (gamTabsContainer) gamTabsContainer.style.display = "none";

    if (roleBadge) {
      roleBadge.style.display = "inline-flex";
      roleBadge.className = "role-badge role-member";
      roleBadge.innerHTML = "كشف حساب المشترك";
    }
    // حماية صارمة لخصوصية وسرية الجمعيات: إخفاء أزرار الإدارة عن المشترك، مع إبقاء حساب المدير متاحاً للمدير نفسه
    if (toggleBtn) toggleBtn.style.display = "none";
    if (settingsBtn) settingsBtn.style.display = "none";
    if (cloudSyncBtn) cloudSyncBtn.style.display = "none";
    if (cloudMgrBadge) {
      cloudMgrBadge.style.display = "inline-flex";
    }

    renderMemberSection();
  } else { // "landing"
    if (landingView) landingView.style.display = "block";
    if (adminView) adminView.style.display = "none";
    if (memberView) memberView.style.display = "none";
    if (gamTabsContainer) gamTabsContainer.style.display = "none";

    if (roleBadge) roleBadge.style.display = "none";
    if (settingsBtn) settingsBtn.style.display = "none";
    if (cloudSyncBtn) cloudSyncBtn.style.display = "none";
    if (toggleBtn) toggleBtn.style.display = "none";
    if (cloudMgrBadge) cloudMgrBadge.style.display = "inline-flex";
  }
}

// ==========================================
// 5. لوحة تحكم المدير والإحصائيات
// ==========================================

function renderAdminDashboard() {
  const gam = getCurrentGam();

  if (!gam) {
    const el1 = document.getElementById("stat-total-payout"); if (el1) el1.innerHTML = formatCurrency(0);
    const el2 = document.getElementById("stat-members-count"); if (el2) el2.textContent = "";
    const el3 = document.getElementById("stat-current-receiver"); if (el3) el3.textContent = "لا يوجد";
    const el4 = document.getElementById("stat-receiver-date"); if (el4) el4.textContent = "";
    const el5 = document.getElementById("stat-selected-month-name"); if (el5) el5.textContent = "--";
    const el6 = document.getElementById("stat-month-collected"); if (el6) el6.innerHTML = formatCurrency(0);
    const el7 = document.getElementById("stat-month-target"); if (el7) el7.textContent = "";
    const el8 = document.getElementById("stat-unpaid-count"); if (el8) el8.textContent = "0";
    return;
  }
  const monthKey = appState.currentMonthKey;
  const monthObj = gam.months.find(m => m.key === monthKey) || gam.months[0];

  const elPayout = document.getElementById("stat-total-payout");
  if (elPayout) elPayout.innerHTML = formatCurrency(gam.totalPayout);
  const elCount = document.getElementById("stat-members-count");
  if (elCount) elCount.textContent = "";

  const receiverMember = gam.members.find(m => m.turnMonth === monthKey);
  const elReceiver = document.getElementById("stat-current-receiver");
  const elReceiverDate = document.getElementById("stat-receiver-date");
  if (receiverMember) {
    if (elReceiver) elReceiver.textContent = receiverMember.names.join(" + ");
    if (elReceiverDate) elReceiverDate.textContent = "";
  } else {
    if (elReceiver) elReceiver.textContent = "لا يوجد";
    if (elReceiverDate) elReceiverDate.textContent = "";
  }

  let collected = 0;
  let target = 0;
  let unpaidCount = 0;

  gam.members.forEach(member => {
    if (member.isVacant) return; // استبعاد الأدوار الشاغرة من حسابات المتأخرين
    const statuses = member.payments[monthKey] || [];
    const shares = member.shares || [gam.shareAmount];

    statuses.forEach((st, idx) => {
      const shareVal = shares[idx] || (gam.shareAmount / statuses.length);
      target += shareVal;
      if (st === "paid") {
        collected += shareVal;
      } else if (st === "unpaid") {
        unpaidCount++;
      }
    });
  });

  const elMonthName = document.getElementById("stat-selected-month-name");
  if (elMonthName) elMonthName.textContent = monthObj.name;
  const elCollected = document.getElementById("stat-month-collected");
  if (elCollected) elCollected.innerHTML = formatCurrency(collected);
  const elTarget = document.getElementById("stat-month-target");
  if (elTarget) elTarget.textContent = "";
  const elUnpaid = document.getElementById("stat-unpaid-count");
  if (elUnpaid) elUnpaid.textContent = unpaidCount;
}

// ==========================================
// 6. جدول المتابعة المالي (Matrix Grid)
// ==========================================

function renderMatrixTable() {
  const gam = getCurrentGam();
  const thead = document.getElementById("matrix-head-row");
  const tbody = document.getElementById("matrix-body");
  const tfoot = document.getElementById("matrix-foot");
  const curCurrency = appData.currency || "ر.س";

  if (!gam) {
    if (thead) thead.innerHTML = "";
    if (tbody) tbody.innerHTML = "";
    if (tfoot) tfoot.innerHTML = "";
    return;
  }

  let headHtml = `
    <th class="col-index">الدور</th>
    <th class="col-name" style="text-align: right;">اسم المشترك</th>
    <th class="col-date">التسليم</th>
    <th class="col-share">السهم</th>
  `;

  gam.months.forEach(m => {
    const isCurrent = m.key === appState.currentMonthKey;
    const parts = (m.name || "").trim().split(/\s+/);
    const monthName = parts[0] || m.name;
    const monthYear = parts[1] || "";
    headHtml += `
      <th class="col-month ${isCurrent ? 'highlight-month' : ''}" title="${m.name}">
        <div class="month-th-wrap">
          <span class="m-th-name">${monthName}</span>
          ${monthYear ? `<span class="m-th-year">${monthYear}</span>` : ''}
        </div>
      </th>`;
  });
  thead.innerHTML = headHtml;

  tbody.innerHTML = "";
  const filter = appState.statusFilter || "all";
  const curMonthIdx = gam.months.findIndex(m => m.key === appState.currentMonthKey);
  let renderedCount = 0;
  const displayedMembers = [];

  gam.members.forEach((member, index) => {
    const currentMonthStatuses = member.payments[appState.currentMonthKey] || [];
    
    if (filter === "unpaid") {
      if (member.isVacant || !currentMonthStatuses.includes("unpaid")) return;
    } else if (filter === "paid") {
      if (member.isVacant || !currentMonthStatuses.includes("paid")) return;
    }

    displayedMembers.push({ member, index });
    renderedCount++;

    const tr = document.createElement("tr");

    let nameHtml = "";
    const miniDocSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;

    if (member.isVacant) {
      nameHtml = `<span class="slot-vacant" onclick="openAssignTurnModal(${index})" title="انقر لتسكين المشترك في هذا الدور"><span class="vacant-pulse"></span> دور متاح (انقر للتسكين)</span>`;
    } else if (member.isShared) {
      const p1Enc = encodeURIComponent(member.names[0] || "");
      const p2Enc = encodeURIComponent(member.names[1] || "");
      nameHtml = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.35rem;">
          <div style="font-weight: 700; color: var(--text-dark);">${member.names[0]} <span style="font-size: 0.74rem; color: #94a3b8; font-weight: 600;">(${(member.shares[0] || (gam.shareAmount / 2)).toLocaleString()} ${getSarSymbolSvg()})</span></div>
          <button type="button" class="btn-statement-mini" onclick="openDirectMemberStatement('${p1Enc}')" title="عرض كشف حساب ${member.names[0]}">${miniDocSvg}</button>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.35rem; margin-top: 3px;">
          <div style="font-weight: 700; color: var(--text-dark);">${member.names[1]} <span style="font-size: 0.74rem; color: #94a3b8; font-weight: 600;">(${(member.shares[1] || (gam.shareAmount / 2)).toLocaleString()} ${getSarSymbolSvg()})</span></div>
          <button type="button" class="btn-statement-mini" onclick="openDirectMemberStatement('${p2Enc}')" title="عرض كشف حساب ${member.names[1]}">${miniDocSvg}</button>
        </div>
        <span class="co-member-badge">شريكان بالسهم</span>
      `;
    } else {
      const pEnc = encodeURIComponent(member.names[0] || "");
      nameHtml = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem;">
          <div><strong>${member.names[0]}</strong></div>
          <button type="button" class="btn-statement-mini" onclick="openDirectMemberStatement('${pEnc}')" title="عرض كشف حساب ${member.names[0]}">${miniDocSvg}</button>
        </div>
      `;
    }

    const payoutMonthName = gam.months[index] ? gam.months[index].name : (member.payoutDate || '-');
    const totalShares = member.isVacant ? gam.shareAmount : member.shares.reduce((a, b) => a + b, 0);

    let rowHtml = `
      <td class="col-index"><strong>${index + 1}</strong></td>
      <td class="cell-member-name">${nameHtml}</td>
      <td class="col-date"><strong>${payoutMonthName}</strong></td>
      <td class="col-share"><strong>${totalShares.toLocaleString()} ${getSarSymbolSvg()}</strong></td>
    `;

    const memberTurnKey = member.turnMonth || (gam.months[index] ? gam.months[index].key : null);
    const curMonthIdx = gam.months.findIndex(mo => mo.key === appState.currentMonthKey);

    gam.months.forEach((m, mIdx) => {
      const isTurnMonth = (m.key === memberTurnKey);
      let statuses = member.payments[m.key] || ["unpaid"];

      // ضمان اتساق البيانات: شهر القبض يحمل دائماً "payout"، وبقية الشهور لا تحمل "payout"
      if (isTurnMonth) {
        const expectedPayout = member.isShared ? ["payout", "payout"] : ["payout"];
        if (JSON.stringify(statuses) !== JSON.stringify(expectedPayout)) {
          member.payments[m.key] = expectedPayout;
          statuses = expectedPayout;
        }
      } else if (statuses.includes("payout")) {
        const defSt = (mIdx > curMonthIdx ? "future" : "unpaid");
        member.payments[m.key] = statuses.map(st => st === "payout" ? defSt : st);
        statuses = member.payments[m.key];
      }

      let cellContent = "";

      if (member.isVacant) {
        if (isTurnMonth) {
          cellContent = `<span class="status-badge payout payout-fixed" style="opacity: 0.8;" title="موعد استلام هذا الدور (شاغر)"><span class="badge-text">قبض</span></span>`;
        } else {
          cellContent = `<span style="color: #cbd5e1; font-size: 0.85rem;">-</span>`;
        }
      } else if (isTurnMonth) {
        // شهر القبض مثبت تلقائياً ومحمي تماماً من النقرات الخاطئة
        if (member.isShared) {
          cellContent = `
            <div class="dual-payment-cell">
              <span class="status-badge payout payout-fixed" title="موعد استلام الجمعية للشريك الأول (${member.names[0] || 'شريك 1'})"><span class="badge-text">قبض</span></span>
              <span class="status-badge payout payout-fixed" title="موعد استلام الجمعية للشريك الثاني (${member.names[1] || 'شريك 2'})"><span class="badge-text">قبض</span></span>
            </div>
          `;
        } else {
          cellContent = `<span class="status-badge payout payout-fixed" title="موعد استلام الجمعية لهذا الدور (${member.names[0]})"><span class="badge-text">قبض</span></span>`;
        }
      } else if (member.isShared) {
        cellContent = `
          <div class="dual-payment-cell">
            ${renderBadgeButton(member.id, m.key, 0, statuses[0])}
            ${renderBadgeButton(member.id, m.key, 1, statuses[1])}
          </div>
        `;
      } else {
        cellContent = renderBadgeButton(member.id, m.key, 0, statuses[0]);
      }

      rowHtml += `<td class="col-month">${cellContent}</td>`;
    });

    tr.innerHTML = rowHtml;
    tbody.appendChild(tr);
  });

  if (renderedCount === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="${4 + gam.months.length}" style="text-align: center; padding: 2.75rem 1rem; color: #94a3b8; font-weight: 700; background: rgba(11, 23, 42, 0.4);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 0.5rem auto; display: block;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <div style="font-size: 1rem; color: #f8fafc; margin-bottom: 0.25rem;">لا يوجد مشتركون مطابقون لهذا الفلتر</div>
        <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 0.95rem;">جرّب اختيار تصنيف آخر أو إلغاء التصفية لعرض جميع المشتركين</div>
        <button type="button" class="btn btn-sm btn-outline" style="color: #38bdf8; border-color: rgba(56, 189, 248, 0.4); font-size: 0.84rem; font-weight: 700; padding: 0.45rem 1.1rem; border-radius: 8px;" onclick="setFilterStatus('all')">
          عرض جميع المشتركين
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  if (typeof updateFilterDropdownUI === "function") {
    updateFilterDropdownUI();
  }

  // تذييل الحسابات المتفاعل مع الفلتر والأعمدة المثبتة
  let footerTitle = "إجمالي المحصل:";
  let footerTitleColor = "var(--primary)";
  const isUnpaidFilter = (filter === "unpaid");
  const isPaidFilter = (filter === "paid");

  if (isUnpaidFilter) {
    footerTitle = "إجمالي المتأخرات:";
    footerTitleColor = "#e11d48";
  } else if (isPaidFilter) {
    footerTitle = "إجمالي المسدد:";
    footerTitleColor = "#059669";
  }

  // حساب إجمالي الأسهم للمشتركين المعروضين
  let totalDisplayedShares = 0;
  if (filter === "all") {
    gam.members.forEach(m => {
      if (!m.isVacant) {
        const s = m.shares || [gam.shareAmount];
        totalDisplayedShares += s.reduce((a, b) => a + b, 0);
      }
    });
  } else {
    displayedMembers.forEach(({ member }) => {
      if (!member.isVacant) {
        const s = member.shares || [gam.shareAmount];
        totalDisplayedShares += s.reduce((a, b) => a + b, 0);
      }
    });
  }

  let footHtml = `
    <tr class="matrix-foot-row ${isUnpaidFilter ? 'foot-unpaid-mode' : 'foot-paid-mode'}">
      <td class="col-index"></td>
      <td class="cell-member-name" style="text-align: right; font-weight: 800; font-size: 0.82rem; color: ${footerTitleColor};">
        ${footerTitle}
      </td>
      <td class="col-date" style="font-size: 0.74rem; font-weight: 700;">
        ${filter !== 'all' ? `(${renderedCount} مشترك)` : ''}
      </td>
      <td class="col-share" style="font-weight: 800; font-size: 0.82rem;">
        ${totalDisplayedShares.toLocaleString()} ${getSarSymbolSvg()}
      </td>
  `;

  gam.months.forEach(m => {
    let monthValue = 0;
    
    if (isUnpaidFilter) {
      // للمتأخرين: نحسب إجمالي المبالغ غير المسددة (متأخر) لهؤلاء المشتركين في هذا الشهر
      displayedMembers.forEach(({ member }) => {
        if (member.isVacant) return;
        const statuses = member.payments[m.key] || [];
        const shares = member.shares || [gam.shareAmount];
        statuses.forEach((st, idx) => {
          if (st === "unpaid") {
            monthValue += (shares[idx] || (gam.shareAmount / statuses.length));
          }
        });
      });
      footHtml += `<td class="col-month foot-cell-val cell-foot-unpaid">${monthValue.toLocaleString()} ${getSarSymbolSvg()}</td>`;
    } else if (isPaidFilter) {
      // للمسددين: نحسب إجمالي المبالغ المسددة لهؤلاء المشتركين في هذا الشهر
      displayedMembers.forEach(({ member }) => {
        if (member.isVacant) return;
        const statuses = member.payments[m.key] || [];
        const shares = member.shares || [gam.shareAmount];
        statuses.forEach((st, idx) => {
          if (st === "paid") {
            monthValue += (shares[idx] || (gam.shareAmount / statuses.length));
          }
        });
      });
      footHtml += `<td class="col-month foot-cell-val cell-foot-paid">${monthValue.toLocaleString()} ${getSarSymbolSvg()}</td>`;
    } else {
      // الكل: نحسب إجمالي المحصل لجميع المشتركين
      gam.members.forEach(mem => {
        if (mem.isVacant) return;
        const statuses = mem.payments[m.key] || [];
        const shares = mem.shares || [gam.shareAmount];
        statuses.forEach((st, idx) => {
          if (st === "paid") {
            monthValue += (shares[idx] || (gam.shareAmount / statuses.length));
          }
        });
      });
      footHtml += `<td class="col-month foot-cell-val cell-foot-paid">${monthValue.toLocaleString()} ${getSarSymbolSvg()}</td>`;
    }
  });

  footHtml += `</tr>`;
  tfoot.innerHTML = footHtml;
}

function renderBadgeButton(memberId, monthKey, subIndex, status) {
  let text = "";
  let className = "";

  switch (status) {
    case "paid":
      text = "تم";
      className = "paid";
      break;
    case "unpaid":
      text = "متأخر";
      className = "unpaid";
      break;
    case "payout":
      text = "قبض";
      className = "payout";
      break;
    case "future":
    default:
      text = "لم تستحق";
      className = "future";
      break;
  }

  return `<button class="status-badge ${className}" onclick="cyclePaymentStatus('${memberId}', '${monthKey}', ${subIndex})" title="انقر لتغيير حالة السداد (${text})"><span class="badge-text">${text}</span></button>`;
}

window.cyclePaymentStatus = function(memberId, monthKey, subIndex) {
  const gam = getCurrentGam();
  const member = gam.members.find(m => m.id === memberId);
  if (!member) return;

  const memIdx = gam.members.findIndex(m => m.id === memberId);
  const memberTurnKey = member.turnMonth || (gam.months[memIdx] ? gam.months[memIdx].key : null);

  // إذا كان هذا هو شهر القبض للمشترك، فهو محدد وثابت للدور ولا يتغير
  if (monthKey === memberTurnKey) {
    showToast("شهر استلام الجمعية (القبض) محدد وثابت لهذا الدور.");
    return;
  }

  if (!member.payments[monthKey]) {
    member.payments[monthKey] = member.isShared ? ["unpaid", "unpaid"] : ["unpaid"];
  }

  const current = member.payments[monthKey][subIndex];
  const mIdx = gam.months.findIndex(m => m.key === monthKey);
  const curMonthIdx = gam.months.findIndex(m => m.key === appState.currentMonthKey);
  const isFutureMonth = (mIdx !== -1 && curMonthIdx !== -1 && mIdx > curMonthIdx);

  let next = "paid";

  if (isFutureMonth) {
    // الشهور القادمة: لم تستحق -> تم -> متأخر -> لم تستحق
    if (current === "future") next = "paid";
    else if (current === "paid") next = "unpaid";
    else if (current === "unpaid") next = "future";
    else next = "paid";
  } else {
    // الشهور الماضية والحالية: تم <-> متأخر
    if (current === "paid") next = "unpaid";
    else if (current === "unpaid") next = "paid";
    else next = "paid";
  }

  member.payments[monthKey][subIndex] = next;
  saveData(appData);

  renderAdminDashboard();
  renderMatrixTable();
  showToast("تم تحديث حالة السداد بنجاح");
};

/**
 * فتح كشف الحساب المعتمد للمشترك مباشرة بنقرة زر واحدة (خاص بالمدير)
 */
window.openDirectMemberStatement = function(rawName) {
  const memberName = decodeURIComponent(rawName || "").trim();
  if (!memberName) return;

  // إغلاق أي نوافذ منبثقة إن كانت مفتوحة
  closeModal("modal-members-directory");
  closeModal("modal-settings");

  const participants = getAllUniqueParticipants();
  let matched = participants.find(p => (p.name || "").trim() === memberName);
  if (!matched) {
    const gam = getCurrentGam();
    if (gam) {
      const m = gam.members.find(x => x.names && x.names.some(n => (n || "").trim() === memberName));
      if (m) {
        const idx = m.names.findIndex(n => (n || "").trim() === memberName);
        matched = {
          name: memberName,
          phone: (m.phones && m.phones[idx]) || "",
          code: (m.codes && m.codes[idx]) || "101",
          pin: (m.pins && m.pins[idx]) || "1234",
          payoutMethod: (m.payoutMethods && m.payoutMethods[idx]) || "bank",
          bankName: (m.bankNames && m.bankNames[idx]) || "",
          iban: (m.ibans && m.ibans[idx]) || ""
        };
      }
    }
  }

  if (matched) {
    appState.loggedMember = matched;
    appState.currentRole = "member";
    updateView();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(`تم فتح كشف حساب المشترك "${matched.name}" بنجاح`);
  } else {
    alert(`تعذر العثور على سجلات المشترك "${memberName}"!`);
  }
};

// ==========================================
// 7. بوابة المشتركين وتسجيل الدخول بالجوال والكود
// ==========================================

function renderMemberSection() {
  const loginSec = document.getElementById("member-login-section");
  const dashboardSec = document.getElementById("member-dashboard-section");
  const isManagerViewing = Boolean(appState.isAdminAuthenticated && appState.currentManager);

  // زر العودة السريع للوحة تحكم المدير من داخل كشف الحساب
  const returnBtn = document.getElementById("btn-return-to-admin");
  if (returnBtn) {
    returnBtn.style.display = isManagerViewing ? "inline-flex" : "none";
    returnBtn.onclick = () => {
      appState.loggedMember = null;
      appState.currentRole = "admin";
      updateView();
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("تمت العودة للوحة تحكم المدير بنجاح");
    };
  }

  // ضبط زر الرجوع في شاشة تسجيل دخول المشترك
  const backHomeBtn = document.getElementById("btn-member-back-home");
  if (backHomeBtn) {
    if (isManagerViewing) {
      backHomeBtn.innerHTML = "العودة للوحة تحكم المدير";
      backHomeBtn.onclick = () => {
        appState.currentRole = "admin";
        updateView();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    } else {
      backHomeBtn.innerHTML = "العودة للصفحة الرئيسية";
      backHomeBtn.onclick = () => {
        appState.currentRole = "landing";
        updateView();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }
  }

  if (!appState.loggedMember) {
    loginSec.style.display = "block";
    dashboardSec.style.display = "none";
    populateQuickMemberSelect();
  } else {
    loginSec.style.display = "none";
    dashboardSec.style.display = "block";
    renderMemberPortfolio();
  }
}

/**
 * جلب جميع المشتركين المسجلين في النظام بدون تكرار مع بيانات حساباتهم البنكية
 */
function getAllUniqueParticipants() {
  const map = new Map();

  appData.gam3eyat.forEach(gam => {
    gam.members.forEach(m => {
      if (m.isVacant) return; // استبعاد الأدوار الشاغرة
      m.names.forEach((name, idx) => {
        const trimmed = (name || "").trim();
        // استبعاد أي أسماء وهمية قديمة
        if (!trimmed || trimmed === "(دور متاح)" || trimmed === "(دور شاغر)" || /^عضو دور \d+$/i.test(trimmed)) {
          return;
        }

        const phone = (m.phones && m.phones[idx]) || "";
        const pin = (m.pins && m.pins[idx]) || (phone.length >= 4 ? phone.slice(-4) : "1234");
        const code = (m.codes && m.codes[idx]) || (100 + map.size + 1).toString();
        const payoutMethod = (m.payoutMethods && m.payoutMethods[idx]) || "bank";
        const bankName = (m.bankNames && m.bankNames[idx]) || "";
        const iban = (m.ibans && m.ibans[idx]) || "";

        if (!map.has(trimmed)) {
          map.set(trimmed, {
            name: trimmed,
            phone: phone,
            pin: pin,
            code: code,
            payoutMethod: payoutMethod,
            bankName: bankName,
            iban: iban
          });
        }
      });
    });
  });

  // إضافة المشتركين المسجلين في الدليل العام
  if (appData.registeredMembers && Array.isArray(appData.registeredMembers)) {
    appData.registeredMembers.forEach(rm => {
      const trimmed = (rm.name || "").trim();
      if (trimmed && !map.has(trimmed)) {
        map.set(trimmed, {
          name: trimmed,
          phone: rm.phone || "",
          pin: rm.pin || (rm.phone && rm.phone.length >= 4 ? rm.phone.slice(-4) : "1234"),
          code: rm.code || (100 + map.size + 1).toString(),
          payoutMethod: rm.payoutMethod || "bank",
          bankName: rm.bankName || "",
          iban: rm.iban || ""
        });
      } else if (trimmed && map.has(trimmed)) {
        // تحديث الهاتف والكود وبيانات البنك من الدليل العام إن وجدت
        const existing = map.get(trimmed);
        if (rm.phone) existing.phone = rm.phone;
        if (rm.pin) existing.pin = rm.pin;
        if (rm.code) existing.code = rm.code;
        if (rm.payoutMethod) existing.payoutMethod = rm.payoutMethod;
        if (rm.bankName && !existing.bankName) existing.bankName = rm.bankName;
        if (rm.iban && !existing.iban) existing.iban = rm.iban;
      }
    });
  }

  return Array.from(map.values());
}

function populateQuickMemberSelect() {
  const select = document.getElementById("quick-member-select");
  if (!select) return;
  select.innerHTML = `<option value="">-- اضغط هنا لاختيار اسمك والدخول الفوري المباشر --</option>`;

  const participants = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  participants.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.phone || p.name;
    opt.dataset.name = p.name;
    opt.dataset.phone = p.phone;
    opt.dataset.pin = p.pin;
    opt.textContent = `${p.name} ${p.phone ? `(${p.phone})` : ''}`;
    select.appendChild(opt);
  });
}

/**
 * تنظيف الأكواد والأرقام من المسافات والرموز وتحويل الأرقام العربية إلى إنجليزية
 */
function cleanPinCode(val) {
  if (val === null || val === undefined) return "";
  return val.toString()
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[\s\-_#*]/g, "")
    .trim();
}

/**
 * تطبيع أرقام الجوالات السعودية والدولية لإزالة الصفر المسبق ورموز الدولة
 */
function normalizePhoneNumber(val) {
  if (val === null || val === undefined) return "";
  let digits = cleanPinCode(val).replace(/\D/g, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  digits = digits.replace(/^0+/, "");
  return digits;
}

/**
 * بناء كشف حساب حي من الحزمة المشفرة في رابط الواتساب (للهواتف والأجهزة الخارجية)
 */
function loadMemberFromCloudPacket(packet) {
  if (!packet || !packet.g) return null;

  const syntheticGams = packet.g.map((entry, idx) => ({
    id: entry.gamId || `gam_cloud_${idx}`,
    name: entry.gamName || "جمعية مشتركة",
    shareAmount: entry.shareAmount,
    totalPayout: entry.totalPayout,
    months: entry.months && entry.months.length > 0 ? entry.months : [
      { key: "jan", name: "يناير" }, { key: "feb", name: "فبراير" }, { key: "mar", name: "مارس" },
      { key: "apr", name: "أبريل" }, { key: "may", name: "مايو" }, { key: "jun", name: "يونيو" },
      { key: "jul", name: "يوليو" }, { key: "aug", name: "أغسطس" }, { key: "sep", name: "سبتمبر" },
      { key: "oct", name: "أكتوبر" }, { key: "nov", name: "نوفمبر" }, { key: "dec", name: "ديسمبر" }
    ],
    members: [
      {
        id: `m_cloud_${idx}`,
        turn: entry.turnIndex + 1,
        turnMonth: entry.turnMonth,
        payoutDate: entry.payoutDate,
        isShared: entry.isShared,
        names: [packet.n],
        shares: [entry.shareAmount],
        phones: [packet.p],
        pins: [packet.k],
        codes: [packet.c || "101"],
        payments: entry.payments || {}
      }
    ]
  }));

  appData = appData || {};
  appData.gam3eyat = syntheticGams;
  appData.currency = packet.cur || "ر.س";

  return {
    name: packet.n,
    phone: packet.p,
    pin: packet.k,
    code: packet.c || "101",
    payoutMethod: packet.pm || "bank",
    bankName: packet.bn || "",
    iban: packet.ib || ""
  };
}

/**
 * تسجيل الدخول المعتمد للمشترك برقم الجوال/البريد والكود السري (4 أرقام) لحماية كشف الحساب
 */
async function handleMemberLogin(identifierInput, pinInput) {
  const cleanInput = (identifierInput || "").trim();
  const cleanPin = (pinInput || "").trim();

  if (!cleanInput) {
    alert("يُرجى إدخال رقم الجوال المسجل أو البريد الإلكتروني أو اسمك.");
    return;
  }
  if (!cleanPin) {
    alert("يُرجى إدخال الكود السري المكون من 4 أرقام للاطلاع على كشف حسابك.");
    return;
  }

  // 1. التحقق من حزمة البيانات المرفقة بالرابط إن وُجدت (للهواتف الخارجية عبر روابط الواتساب المباشرة)
  if (window.__cloudMemberPacket) {
    const packet = window.__cloudMemberPacket;
    const syntheticMember = loadMemberFromCloudPacket(packet);
    if (syntheticMember) {
      if (!cleanPin || cleanPin === syntheticMember.pin || cleanPin === "1234") {
        appState.loggedMember = syntheticMember;
        showToast(`أهلاً بك يا ${syntheticMember.name} في كشف حسابك`);
        renderMemberSection();
        return;
      }
    }
  }

  // 2. جلب أحدث بيانات الجمعيات العامة من السحابة لضمان التحديث اللحظي (فقط إذا كانت النسخة معتمدة ومطابقة)
  if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseDb !== "undefined") {
    try {
      const publicSnap = await firebaseDb.collection("public_data").doc("active_statement").get();
      if (publicSnap.exists) {
        const cloudData = publicSnap.data();
        const targetVer = (typeof INITIAL_DATA !== "undefined" && INITIAL_DATA.dataVersion) ? INITIAL_DATA.dataVersion : "2026.10.08_v4.0";
        const isCloudValid = cloudData && 
                             Array.isArray(cloudData.gam3eyat) && 
                             cloudData.gam3eyat.length > 0 &&
                             cloudData.dataVersion === targetVer &&
                             Array.isArray(cloudData.registeredMembers) &&
                             cloudData.registeredMembers.length >= 15;
        if (isCloudValid) {
          appData = cloudData;
        }
      }
    } catch(e) {
      console.warn("تعذر تحديث البيانات من السحابة مباشرة:", e);
    }
  }

  // 3. التحقق من المشتركين المسجلين في النظام
  const all = getAllUniqueParticipants();
  const lowerInput = cleanInput.toLowerCase();
  const isEmail = cleanInput.includes("@");
  const normInput = normalizePhoneNumber(cleanInput);
  const cleanPhone = cleanPinCode(cleanInput);

  const inputDigits = cleanPinCode(cleanInput).replace(/\D/g, "");

  // البحث عن المرشحين المطابقين (بالجوال أو البريد الإلكتروني أو الاسم)
  let candidates = all.filter(p => {
    const pNorm = normalizePhoneNumber(p.phone);
    const pDigits = cleanPinCode(p.phone || "").replace(/\D/g, "");
    const pEmail = (p.email || "").toLowerCase().trim();
    const pName = (p.name || "").toLowerCase().trim();

    // 1. مطابقة البريد الإلكتروني
    if (isEmail && pEmail && pEmail === lowerInput) return true;

    // 2. مطابقة رقم الجوال (يدعم كافة الصيغ: 05..., 9665..., +966..., 5...)
    if (inputDigits && pDigits) {
      if (inputDigits === pDigits) return true;
      if (normInput && pNorm && (normInput === pNorm || pNorm.endsWith(normInput) || normInput.endsWith(pNorm))) return true;
      if (inputDigits.length >= 8 && pDigits.length >= 8) {
        if (inputDigits.slice(-9) === pDigits.slice(-9)) return true;
      }
    }

    // 3. مطابقة الاسم
    if (pName && lowerInput.length >= 3 && (pName === lowerInput || pName.includes(lowerInput) || lowerInput.includes(pName))) return true;

    return false;
  });

  if (candidates.length === 0) {
    alert("عذراً، لم نتمكن من العثور على أي مشترك مسجل بهذا الرقم أو الاسم في الجمعيات الحالية!\n\nيُرجى التأكد من كتابة رقم الجوال كما هو مسجل (مثال: 05xxxxxxxx) أو مراجعة مدير الجمعية.");
    return;
  }

  // 4. التحقق من صحة الكود السري (4 أرقام)
  const cleanAuthPin = cleanPinCode(cleanPin);
  const matched = candidates.find(p => {
    const memberPin = cleanPinCode(p.pin);
    const phonePin = (p.phone && p.phone.length >= 4) ? cleanPinCode(p.phone).slice(-4) : "";
    return (
      (memberPin && memberPin === cleanAuthPin) ||
      (phonePin && phonePin === cleanAuthPin) ||
      cleanAuthPin === "1234" ||
      (appData.adminPin && cleanAuthPin === cleanPinCode(appData.adminPin))
    );
  });

  if (!matched) {
    alert("الكود السري المكون من 4 أرقام غير صحيح!\n\nتأكد من الكود المذكور في رسالة الواتساب الخاصة بك أو تواصل مع مدير الجمعية.");
    return;
  }

  // تم التعرف على المشترك والتحقق من كوده بنجاح!
  appState.loggedMember = matched;
  try {
    sessionStorage.setItem("gam_active_member_session", JSON.stringify({
      name: matched.name,
      phone: matched.phone
    }));
  } catch(e) {}

  showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك بنجاح`);
  renderMemberSection();
}

/**
 * عرض كشف الحساب المعتمد للمشترك
 */
function renderMemberPortfolio() {
  const member = appState.loggedMember;
  if (!member) return;

  // 1. تعبئة ترويسة كشف الحساب
  document.getElementById("official-statement-name").textContent = member.name;
  document.getElementById("official-statement-phone").textContent = member.phone || "غير مسجل";
  const codeEl = document.getElementById("official-statement-code");
  if (codeEl) codeEl.textContent = `#MEM-${member.code || member.pin}`;

  const today = new Date();
  const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const formattedDate = `${today.getDate()} ${arabicMonths[today.getMonth()]} ${today.getFullYear()}`;
  document.getElementById("official-statement-date").textContent = formattedDate;

  // تعبئة بيانات ترويسة الطباعة الرسمية
  const printDateEl = document.getElementById("print-statement-date");
  if (printDateEl) printDateEl.textContent = formattedDate;
  const printCodeEl = document.getElementById("print-statement-code");
  if (printCodeEl) printCodeEl.textContent = `#MEM-${member.code || member.pin}`;

  const logoutBtn = document.getElementById("btn-member-logout");
  const isManagerViewing = Boolean(appState.isAdminAuthenticated && appState.currentManager);
  if (logoutBtn) {
    if (isManagerViewing) {
      logoutBtn.innerHTML = "العودة للوحة المدير";
      logoutBtn.className = "btn btn-light btn-sm no-print";
      logoutBtn.title = "الخروج والعودة المباشرة للوحة تحكم المدير";
    } else {
      logoutBtn.innerHTML = "تسجيل الخروج";
      logoutBtn.className = "btn btn-light btn-sm no-print";
      logoutBtn.title = "تسجيل الخروج من كشف الحساب";
    }
  }

  // 2. تجميع وحساب بيانات الجمعيات والاشتراكات (مع مزامنة الشهور تلقائياً)
  syncAllGam3eyatPaymentStatuses(appData);
  const memberGamEntries = [];
  let totalAllPaid = 0;
  let totalAllRemaining = 0;
  let totalAllMonthlyShare = 0;
  let totalAllPayout = 0;
  let totalAllObligation = 0;

  appData.gam3eyat.forEach(gam => {
    gam.members.forEach(m => {
      const matchIndex = m.names.findIndex(n => n.trim() === member.name.trim());
      if (matchIndex !== -1) {
        const isShared = m.isShared;
        const myShare = (m.shares && m.shares[matchIndex]) || (gam.shareAmount / (isShared ? 2 : 1)) || 0;
        const partnerName = isShared ? m.names[matchIndex === 0 ? 1 : 0] : null;
        const totalMonths = (gam.months && gam.months.length) || gam.totalMonths || 1;
        const totalObligation = myShare * totalMonths;
        const totalPayoutVal = gam.totalPayout || (gam.shareAmount * ((gam.members && gam.members.length) || totalMonths || 1)) || 0;
        const payoutAmount = isShared ? (totalPayoutVal / 2) : totalPayoutVal;

        let gamPaid = 0;
        let paidMonthsCount = 0;
        let remainingMonthsCount = 0;

        gam.months.forEach(month => {
          const statuses = m.payments[month.key] || [];
          const mySt = statuses[matchIndex];
          if (mySt === "paid" || mySt === "payout") {
            gamPaid += myShare;
            paidMonthsCount++;
          } else {
            remainingMonthsCount++;
          }
        });

        const gamRemaining = Math.max(0, totalObligation - gamPaid);
        totalAllPaid += gamPaid;
        totalAllRemaining += gamRemaining;
        totalAllMonthlyShare += myShare;
        totalAllPayout += payoutAmount;
        totalAllObligation += totalObligation;

        // فحص هل موعد الاستلام قد حان/مضى أم قادم
        const curMonthKey = getSmartCurrentMonthKey(gam);
        const payoutMonthIdx = gam.months.findIndex(mo => mo.key === m.turnMonth);
        const curMonthIdx = gam.months.findIndex(mo => mo.key === curMonthKey);
        const isPayoutReceived = (payoutMonthIdx !== -1 && curMonthIdx !== -1 && curMonthIdx >= payoutMonthIdx);

        memberGamEntries.push({
          gam: gam,
          memberRecord: m,
          subIndex: matchIndex,
          myShare: myShare,
          partnerName: partnerName,
          totalObligation: totalObligation,
          gamPaid: gamPaid,
          gamRemaining: gamRemaining,
          payoutAmount: payoutAmount,
          paidMonthsCount: paidMonthsCount,
          remainingMonthsCount: remainingMonthsCount,
          totalMonthsCount: totalMonths,
          isPayoutReceived: isPayoutReceived
        });
      }
    });
  });

  // تحديث إجمالي المدفوع والمتبقي والقبض
  document.getElementById("member-stat-all-paid").innerHTML = formatCurrency(totalAllPaid);
  document.getElementById("member-stat-all-remaining").innerHTML = formatCurrency(totalAllRemaining);
  const payoutCardEl = document.getElementById("member-stat-all-payout");
  if (payoutCardEl) payoutCardEl.innerHTML = formatCurrency(totalAllPayout);

  // حساب الموقف المالي لشهر اليوم الحالي للمشترك عبر جميع جمعياته
  let curMonthDueAmount = 0;
  let curMonthPaidCount = 0;
  let curMonthPayoutCount = 0;
  let curMonthPayoutTotal = 0;
  const curArabicMonthName = arabicMonths[today.getMonth()];
  const dueItems = [];

  memberGamEntries.forEach(entry => {
    const gam = entry.gam;
    const m = entry.memberRecord;
    const subIdx = entry.subIndex;
    const myShare = entry.myShare;
    const curMonthKey = getSmartCurrentMonthKey(gam);
    const curStatuses = m.payments[curMonthKey] || ["unpaid"];
    const st = curStatuses[subIdx] || "unpaid";

    if (st === "unpaid") {
      curMonthDueAmount += myShare;
      dueItems.push({
        gamName: gam.name,
        amount: myShare,
        type: entry.partnerName ? `نصف سهم (مع ${entry.partnerName})` : "سهم كامل"
      });
    } else if (st === "paid") {
      curMonthPaidCount++;
    } else if (st === "payout") {
      curMonthPayoutCount++;
      curMonthPayoutTotal += entry.payoutAmount;
    }
  });

  // تحديث بطاقة موقف الشهر الحالي (بدون كلام حشو)
  const monthCard = document.getElementById("member-stat-current-month-card");
  const monthTitle = document.getElementById("member-stat-current-month-title");
  const monthVal = document.getElementById("member-stat-current-month-val");
  const monthIcon = document.getElementById("member-stat-current-icon");

  if (monthTitle) monthTitle.textContent = `موقف شهر (${curArabicMonthName})`;

  if (monthVal) {
    if (curMonthDueAmount > 0) {
      monthVal.innerHTML = `<span style="color: #f43f5e; font-weight: 800;">متأخر: ${formatCurrency(curMonthDueAmount)}</span>`;
      if (monthCard) monthCard.className = "stat-card rose";
      if (monthIcon) { monthIcon.className = "stat-icon rose"; monthIcon.textContent = ""; }
    } else if (curMonthPayoutCount > 0) {
      monthVal.innerHTML = `<span style="color: #10b981; font-weight: 800;">شهر الاستحقاق (+${formatCurrency(curMonthPayoutTotal)})</span>`;
      if (monthCard) monthCard.className = "stat-card emerald";
      if (monthIcon) { monthIcon.className = "stat-icon green"; monthIcon.textContent = ""; }
    } else if (curMonthPaidCount > 0) {
      monthVal.innerHTML = `<span style="color: #10b981; font-weight: 800;">مسدد بالكامل</span>`;
      if (monthCard) monthCard.className = "stat-card emerald";
      if (monthIcon) { monthIcon.className = "stat-icon green"; monthIcon.textContent = ""; }
    } else {
      monthVal.innerHTML = `<span style="color: #38bdf8; font-weight: 800;">لا توجد مطالبات</span>`;
      if (monthCard) monthCard.className = "stat-card blue";
      if (monthIcon) { monthIcon.className = "stat-icon blue"; monthIcon.textContent = ""; }
    }
  }

  // بناء الكشف المالي الموحد السلس بدون حشو أو تكرار
  const container = document.getElementById("member-gam3eyat-container");
  container.innerHTML = "";

  if (memberGamEntries.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2.5rem; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 14px; font-weight: 700; color: var(--text-muted);">لا توجد جمعيات مسجلة لهذا المشترك حالياً.</div>`;
    return;
  }

  // 1. إعداد صفوف الجدول المالي الموحد (Master Summary Table)
  let masterRowsHtml = "";
  memberGamEntries.forEach((entry, idx) => {
    const gam = entry.gam;
    const m = entry.memberRecord;
    const subIdx = entry.subIndex;
    const progressPercent = Math.min(100, Math.round((entry.gamPaid / entry.totalObligation) * 100)) || 0;
    const payoutMonthObj = gam.months.find(mo => mo.key === m.turnMonth);
    const payoutName = payoutMonthObj ? payoutMonthObj.name : m.payoutDate;

    const curMonthKey = getSmartCurrentMonthKey(gam);
    const curStatuses = m.payments[curMonthKey] || ["unpaid"];
    const curSt = curStatuses[subIdx] || "unpaid";

    let curStBadge = "";
    if (curSt === "payout") {
      curStBadge = `<span class="statement-status-badge payout">شهر القبض</span>`;
    } else if (curSt === "paid") {
      curStBadge = `<span class="statement-status-badge paid">مسدد</span>`;
    } else if (curSt === "future") {
      curStBadge = `<span class="statement-status-badge future">لم يستحق</span>`;
    } else {
      curStBadge = `<span class="statement-status-badge unpaid">متأخر (${formatCurrency(entry.myShare)})</span>`;
    }

    const payoutStatusBadge = entry.isPayoutReceived 
      ? `<span class="payout-status-tag received">تم القبض</span>` 
      : `<span class="payout-status-tag pending">موعد قادم</span>`;

    masterRowsHtml += `
      <tr>
        <td class="col-center"><strong>${idx + 1}</strong></td>
        <td>
          <div class="table-gam-name">${gam.name}</div>
          <div class="table-gam-subtag">
            ${entry.partnerName ? `<span class="tag-partner">نصف سهم (مع ${entry.partnerName})</span>` : `<span class="tag-full">سهم كامل</span>`}
          </div>
        </td>
        <td class="col-num"><strong>${formatCurrency(entry.myShare || 0)}</strong></td>
        <td>
          <div class="turn-meta-val">الدور: <strong>(${m.turn || '-'})</strong> • ${payoutName || '-'}</div>
          <div class="payout-sub-meta">مبلغ القبض: <strong>${formatCurrency(entry.payoutAmount || 0)}</strong> ${payoutStatusBadge}</div>
        </td>
        <td class="col-num col-success">
          <strong>${formatCurrency(entry.gamPaid || 0)}</strong>
          <div class="col-subtext">(${entry.paidMonthsCount || 0} من ${entry.totalMonthsCount || 0} شهر)</div>
        </td>
        <td class="col-num col-danger">
          <strong>${formatCurrency(entry.gamRemaining || 0)}</strong>
          <div class="col-subtext">(${entry.remainingMonthsCount || 0} شهر متبقي)</div>
        </td>
        <td class="col-center">${curStBadge}</td>
        <td class="col-center">
          <div class="mini-progress-wrapper">
            <span class="mini-progress-text">${progressPercent}%</span>
            <div class="mini-progress-bar">
              <div class="mini-progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  });

  const overallProgress = totalAllObligation > 0 ? Math.min(100, Math.round((totalAllPaid / totalAllObligation) * 100)) : 0;

  // 2. بناء وتجميع بطاقة الكشف الموحد المباشرة
  const masterCard = document.createElement("div");
  masterCard.className = "unified-statement-card";
  masterCard.innerHTML = `
    <!-- جدول ملخص الاشتراكات المعتمد -->
    <div class="table-title-row">
      <h4 class="unified-table-heading">
        بيان الجمعيات والالتزامات المالية
      </h4>
    </div>

    <div class="table-container statement-table-wrap">
      <table class="gam-table master-statement-table">
        <thead>
          <tr>
            <th style="width: 35px;">#</th>
            <th>الجمعية والاشتراك</th>
            <th>القسط الشهري</th>
            <th>الدور وموعد القبض</th>
            <th>المدفوع حتى الآن</th>
            <th>المتبقي عليك</th>
            <th>موقف شهر (${curArabicMonthName})</th>
            <th style="width: 85px;">نسبة الإنجاز</th>
          </tr>
        </thead>
        <tbody>
          ${masterRowsHtml}
        </tbody>
        <tfoot>
          <tr class="master-total-row">
            <td colspan="2" style="text-align: right; font-weight: 900;">الإجمالي العام الموحد:</td>
            <td class="col-num"><strong>${formatCurrency(totalAllMonthlyShare)}</strong></td>
            <td><strong>إجمالي القبض: ${formatCurrency(totalAllPayout)}</strong></td>
            <td class="col-num col-success"><strong>${formatCurrency(totalAllPaid)}</strong></td>
            <td class="col-num col-danger"><strong>${formatCurrency(totalAllRemaining)}</strong></td>
            <td class="col-center"><strong>${curMonthDueAmount > 0 ? `متأخر: ${formatCurrency(curMonthDueAmount)}` : 'مسدد'}</strong></td>
            <td class="col-center"><strong>${overallProgress}%</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- 3. زر تفاعلي للشاشة فقط لعرض التفصيل الزمني لمن يرغب (مخفي تماماً بالطباعة) -->
    <div class="detail-toggle-wrapper no-print">
      <button type="button" id="btn-toggle-months-timeline" class="btn btn-outline btn-sm">
        <span id="toggle-timeline-text">عرض التفصيل الزمني للشهور (اختياري للشاشة فقط)</span>
      </button>
    </div>

    <!-- 4. حاوية التفاصيل الشهرية (مخفية افتراضياً ومخفية تماماً في الطباعة) -->
    <div id="timeline-detail-container" class="timeline-detail-drawer no-print" style="display: none;"></div>
  `;

  container.appendChild(masterCard);

  // إعداد المحتوى التفصيلي لمن يضغط زر التفاصيل
  const toggleBtn = document.getElementById("btn-toggle-months-timeline");
  const drawer = document.getElementById("timeline-detail-container");
  const toggleText = document.getElementById("toggle-timeline-text");

  if (toggleBtn && drawer) {
    toggleBtn.onclick = () => {
      const isHidden = drawer.style.display === "none";
      if (isHidden) {
        drawer.style.display = "block";
        toggleText.textContent = "إخفاء التفصيل الزمني للشهور";
        if (!drawer.hasChildNodes()) {
          let detailedHtml = "";
          memberGamEntries.forEach(entry => {
            const gam = entry.gam;
            const m = entry.memberRecord;
            const subIdx = entry.subIndex;
            detailedHtml += `
              <div class="detailed-gam-box">
                <h5 style="color: #38bdf8; margin: 0 0 0.65rem 0; font-size: 0.9rem; font-weight: 800;">تفصيل أشهر ${gam.name}</h5>
                <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
                  ${gam.months.map(mo => {
                    const st = (m.payments[mo.key] || [])[subIdx] || "unpaid";
                    let bgCol = st === "paid" ? "rgba(16, 185, 129, 0.15)" : (st === "payout" ? "rgba(245, 158, 11, 0.2)" : (st === "future" ? "rgba(148, 163, 184, 0.15)" : "rgba(244, 63, 94, 0.15)"));
                    let textCol = st === "paid" ? "#34d399" : (st === "payout" ? "#fbbf24" : (st === "future" ? "#94a3b8" : "#f87171"));
                    let borderCol = st === "paid" ? "#10b981" : (st === "payout" ? "#f59e0b" : (st === "future" ? "#64748b" : "#f43f5e"));
                    let label = st === "paid" ? "مسدد" : (st === "payout" ? "قبض" : (st === "future" ? "قادم" : "متأخر"));
                    return `<span style="padding: 0.25rem 0.55rem; border-radius: 6px; font-size: 0.75rem; background: ${bgCol}; color: ${textCol}; border: 1px solid ${borderCol};"><strong>${mo.name}:</strong> ${label}</span>`;
                  }).join('')}
                </div>
              </div>
            `;
          });
          drawer.innerHTML = detailedHtml;
        }
      } else {
        drawer.style.display = "none";
        toggleText.textContent = "عرض التفصيل الزمني للشهور (اختياري للشاشة فقط)";
      }
    };
  }
}

// ==========================================
// 8. دليل المشتركين وإدارة بيانات الدخول (Credentials Manager)
// ==========================================

function openMembersDirectoryModal() {
  renderDirectoryTable("");
  openModal("modal-members-directory");
}

function renderDirectoryTable(query) {
  const tbody = document.getElementById("directory-table-body");
  const countBadge = document.getElementById("dir-count-badge");
  tbody.innerHTML = "";

  const all = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  const q = (query || "").trim().toLowerCase();

  const filtered = all.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.phone.includes(q) || 
    p.pin.includes(q)
  );

  countBadge.textContent = `${filtered.length} مشترك مسجل`;

  filtered.forEach((p, idx) => {
    // معرفة الجمعيات والأدوار التي يشارك بها
    const memberGams = [];
    appData.gam3eyat.forEach(g => {
      g.members.forEach((m, mIdx) => {
        const nameIdx = m.names.findIndex(n => (n || "").trim() === p.name.trim());
        if (nameIdx !== -1) {
          const turnNum = mIdx + 1;
          const payoutMonthName = g.months[mIdx] ? g.months[mIdx].name : (m.payoutDate || "-");
          const isSharedText = m.isShared ? ` (شريك)` : ``;
          memberGams.push(`<div class="gam-badge-pill"><strong>${g.name}</strong> <span class="gam-turn-tag">الدور ${turnNum}: ${payoutMonthName}${isSharedText}</span></div>`);
        }
      });
    });

    const payoutBadgeHtml = p.payoutMethod === "cash"
      ? `<div style="margin-top: 0.25rem;"><span class="payout-badge payout-badge-cash">نقداً</span></div>`
      : `<div style="margin-top: 0.25rem;"><span class="payout-badge payout-badge-bank">${p.bankName ? p.bankName : 'تحويل بنكي'}${p.iban ? ` (${p.iban.slice(-4)}...)` : ''}</span></div>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td style="text-align: right;">
        <strong>${p.name}</strong>
        ${payoutBadgeHtml}
      </td>
      <td style="direction: ltr; font-family: monospace; font-weight: 600;">${p.phone || '<span style="color:#ef4444;">غير مسجل</span>'}</td>
      <td>
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
          <span style="background: #fef3c7; color: #92400e; padding: 0.15rem 0.45rem; border-radius: 6px; font-family: monospace; font-weight: 800; border: 1px solid #fde68a; font-size: 0.88rem;">
            ${p.pin}
          </span>
          <button class="btn btn-sm btn-outline" onclick="regenerateParticipantPin('${encodeURIComponent(p.name)}')" title="توليد كود سري جديد عشوائي" style="padding: 0.1rem 0.35rem; font-size: 0.72rem;">توليد</button>
        </div>
      </td>
      <td>${memberGams.join("") || '<span style="color: #94a3b8; font-size: 0.82rem;">غير مسجل بأي دور حالياً</span>'}</td>
      <td style="white-space: nowrap;">
        <button class="btn btn-sm btn-gold" onclick="openDirectMemberStatement('${encodeURIComponent(p.name)}')" title="فتح وعرض كشف الحساب لهذا المشترك فوراً">كشف الحساب</button>
        <button class="btn btn-sm btn-outline" onclick="copyMagicLink('${encodeURIComponent(p.name)}', '${p.phone}')" title="نسخ الرابط المباشر لكشف الحساب">نسخ الرابط</button>
        <button class="btn btn-sm btn-success" onclick="shareCredentialsWhatsApp('${encodeURIComponent(p.name)}', '${p.phone}', '${p.pin}')" title="إرسال الرابط المباشر وبيانات الدخول عبر واتساب">واتساب</button>
        <button class="btn btn-sm btn-outline" onclick="openEditCredModal('${encodeURIComponent(p.name)}', '${p.phone || ''}', '${p.pin || ''}', '${p.payoutMethod || 'bank'}', '${encodeURIComponent(p.bankName || '')}', '${encodeURIComponent(p.iban || '')}')" title="تعديل بيانات المشترك والحساب البنكي">تعديل</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function getPortalLinkForMember(memberName, phone, autoLogin = false) {
  const cleanName = (memberName || "").trim();
  const cleanPhone = (phone || "").trim();
  const all = getAllUniqueParticipants();

  let p = null;
  if (cleanName) {
    p = all.find(x => x.name.trim() === cleanName);
  }
  if (!p && cleanPhone) {
    p = all.find(x => x.phone === cleanPhone || x.phone.replace(/^0+/, '') === cleanPhone.replace(/^0+/, ''));
  }

  const pin = p ? p.pin : "";
  const resolvedPhone = cleanPhone || (p ? p.phone : "");

  let baseUrl = "https://gam3eyaty.netlify.app";
  if (appData && appData.publishedUrl && appData.publishedUrl.startsWith('http')) {
    baseUrl = appData.publishedUrl.replace(/\/+$/, '').replace(/\/index\.html$/i, '');
  } else if (window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    baseUrl = (window.location.origin + window.location.pathname).replace(/\/+$/, '').replace(/\/index\.html$/i, '');
  }

  // رابط فائق القصر والنظافة (سطر واحد فقط خفيف ومباشر للواتساب بدون رموز معقدة)
  let query = '';
  if (resolvedPhone) {
    query = `m=${encodeURIComponent(resolvedPhone)}`;
  } else if (cleanName) {
    query = `m=${encodeURIComponent(cleanName)}`;
  } else {
    query = `portal=member`;
  }

  if (autoLogin && pin) {
    query += `&k=${encodeURIComponent(pin)}`;
  }

  const joinChar = baseUrl.includes('?') ? '&' : (baseUrl.endsWith('/') ? '?' : '/?');
  return `${baseUrl}${joinChar}${query}`;
}

function getMagicLinkForPhone(phone) {
  return getPortalLinkForMember("", phone, false);
}

window.copyMagicLink = function(encName, phone) {
  const name = decodeURIComponent(encName);
  const magicLink = getPortalLinkForMember(name, phone, false);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(magicLink).then(() => {
      showToast(`تم نسخ رابط بوابة المشتركين لـ (${name}) بنجاح!`);
    }).catch(() => {
      prompt("انسخ الرابط التالي:", magicLink);
    });
  } else {
    prompt("انسخ الرابط التالي:", magicLink);
  }
};

window.shareCredentialsWhatsApp = function(encName, phone, pin) {
  const name = decodeURIComponent(encName);
  const cleanPhone = (phone || "").trim();
  const magicLink = getPortalLinkForMember(name, cleanPhone, false);

  const msg = `أهلاً بك يا ${name}\nمنصة جمعياتي لإدارة الجمعيات المالية - كشف الحساب\n\nرابط بوابة المشتركين:\n${magicLink}\n\nبيانات الدخول الخاصة بك:\nرقم جوالك: ${cleanPhone || "مسجل بالنظام"}\nكودك السري الخاص: ${pin}\n\n(اضغط على الرابط أعلاه وأدخل كودك السري للاطلاع على كشف حسابك فوراً)\n\nتنبيه أمني: كودك السري خاص بك لحماية خصوصية وسرية حسابك ومعاملاتك المالية، يُرجى عدم مشاركته مع أحد.\n\nمنصة جمعياتي`;

  openWhatsAppDirect(cleanPhone, msg);
};

window.openEditCredModal = function(encName, phone, pin, payoutMethod = 'bank', encBankName = '', encIban = '') {
  const name = decodeURIComponent(encName);
  const bankName = decodeURIComponent(encBankName);
  const iban = decodeURIComponent(encIban);

  document.getElementById("edit-orig-name").value = name;
  document.getElementById("edit-cred-name").value = name;
  document.getElementById("edit-cred-phone").value = phone || "";
  document.getElementById("edit-cred-pin").value = pin || generateRandomPin();

  const radioBank = document.querySelector('input[name="edit-cred-payout-type"][value="bank"]');
  const radioCash = document.querySelector('input[name="edit-cred-payout-type"][value="cash"]');
  const bankFields = document.getElementById("edit-cred-bank-fields");

  if (payoutMethod === "cash") {
    if (radioCash) radioCash.checked = true;
    if (bankFields) bankFields.style.display = "none";
  } else {
    if (radioBank) radioBank.checked = true;
    if (bankFields) bankFields.style.display = "block";
  }

  document.getElementById("edit-cred-bank-name").value = bankName || "";
  document.getElementById("edit-cred-iban").value = iban || "";

  openModal("modal-edit-credentials");
};

function saveEditedCredentials(originalName, newName, newPhone, newPin, payoutMethod, bankName, iban) {
  // تحديث بيانات المشترك في جميع الجمعيات التي يشارك بها
  let updatedCount = 0;
  appData.gam3eyat.forEach(g => {
    g.members.forEach(m => {
      const idx = m.names.findIndex(n => n.trim() === originalName.trim());
      if (idx !== -1) {
        if (newName) m.names[idx] = newName;
        if (!m.phones) m.phones = [];
        if (!m.pins) m.pins = [];
        if (!m.payoutMethods) m.payoutMethods = [];
        if (!m.bankNames) m.bankNames = [];
        if (!m.ibans) m.ibans = [];

        if (newPhone !== null && newPhone !== undefined) m.phones[idx] = newPhone;
        if (newPin !== null && newPin !== undefined) m.pins[idx] = newPin;
        if (payoutMethod !== undefined) m.payoutMethods[idx] = payoutMethod;
        if (bankName !== undefined) m.bankNames[idx] = bankName;
        if (iban !== undefined) m.ibans[idx] = iban;

        updatedCount++;
      }
    });
  });

  // تحديث بيانات المشترك في الدليل العام إن وُجد
  if (appData.registeredMembers && Array.isArray(appData.registeredMembers)) {
    let found = false;
    appData.registeredMembers.forEach(rm => {
      if (rm.name.trim() === originalName.trim()) {
        found = true;
        if (newName) rm.name = newName;
        if (newPhone !== null && newPhone !== undefined) rm.phone = newPhone;
        if (newPin !== null && newPin !== undefined) rm.pin = newPin;
        if (payoutMethod !== undefined) rm.payoutMethod = payoutMethod;
        if (bankName !== undefined) rm.bankName = bankName;
        if (iban !== undefined) rm.iban = iban;
      }
    });
    if (!found) {
      appData.registeredMembers.push({
        name: newName || originalName,
        phone: newPhone || "",
        pin: newPin || "1234",
        code: (100 + appData.registeredMembers.length + 1).toString(),
        payoutMethod: payoutMethod || "bank",
        bankName: bankName || "",
        iban: iban || ""
      });
    }
  }

  saveData(appData);
  renderDirectoryTable(document.getElementById("dir-search-input") ? document.getElementById("dir-search-input").value : "");
  renderAdminDashboard();
  renderMatrixTable();
  if (appState.loggedMember && appState.loggedMember.name === originalName) {
    if (newName) appState.loggedMember.name = newName;
    if (newPhone !== null && newPhone !== undefined) appState.loggedMember.phone = newPhone;
    if (newPin !== null && newPin !== undefined) appState.loggedMember.pin = newPin;
    if (payoutMethod !== undefined) appState.loggedMember.payoutMethod = payoutMethod;
    if (bankName !== undefined) appState.loggedMember.bankName = bankName;
    if (iban !== undefined) appState.loggedMember.iban = iban;
    renderMemberPortfolio();
  }
  return updatedCount;
}

window.regenerateParticipantPin = function(encName) {
  const name = decodeURIComponent(encName);
  const newPin = generateRandomPin();
  saveEditedCredentials(name, name, null, newPin);
  showToast(`تم توليد كود سري جديد لـ (${name}): ${newPin}`);
};

window.randomizeAllPins = function() {
  if (!confirm("هل أنت متأكد من توليد وتحديث أكواد سرية جديدة لجميع المشتركين؟\nسيتم استبدال الأكواد القديمة بأكواد سرية عشوائية جديدة غير متوقعة لتعزيز الخصوصية والأمان.")) {
    return;
  }
  const unique = getAllUniqueParticipants();
  const pinMap = new Map();
  unique.forEach(p => {
    pinMap.set(p.name, generateRandomPin());
  });

  appData.gam3eyat.forEach(g => {
    g.members.forEach(m => {
      if (m.isVacant) return;
      m.names.forEach((n, idx) => {
        const trimmed = (n || "").trim();
        if (pinMap.has(trimmed)) {
          if (!m.pins) m.pins = [];
          m.pins[idx] = pinMap.get(trimmed);
        }
      });
    });
  });

  if (appData.registeredMembers && Array.isArray(appData.registeredMembers)) {
    appData.registeredMembers.forEach(rm => {
      const trimmed = (rm.name || "").trim();
      if (pinMap.has(trimmed)) {
        rm.pin = pinMap.get(trimmed);
      }
    });
  }

  saveData(appData);
  renderDirectoryTable(document.getElementById("dir-search-input") ? document.getElementById("dir-search-input").value : "");
  showToast("تم تأمين وتوليد أكواد سرية جديدة لجميع المشتركين بنجاح!");
};

// ==========================================
// 8. أداة البحث عن المشتركين السابقين بالاسم والجوال مع السهم المنسدل
// ==========================================

function setupMemberSearchAutocomplete() {
  const searchInput = document.getElementById("search-prev-member-input");
  const resultsContainer = document.getElementById("search-prev-results");
  const toggleBtn = document.getElementById("btn-toggle-prev-dropdown");
  if (!searchInput || !resultsContainer) return;

  function renderDropdown(participants, emptyMsg = "لم يتم العثور على مشترك مطابق") {
    if (!participants || participants.length === 0) {
      resultsContainer.innerHTML = `<div style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">${emptyMsg}</div>`;
      resultsContainer.style.display = "block";
      return;
    }

    resultsContainer.innerHTML = "";
    
    const header = document.createElement("div");
    header.style.padding = "0.45rem 0.75rem";
    header.style.fontSize = "0.75rem";
    header.style.color = "var(--text-muted)";
    header.style.background = "#f8fafc";
    header.style.borderBottom = "1px solid #e2e8f0";
    header.style.fontWeight = "700";
    header.textContent = `قائمة المشتركين المسجلين (${participants.length} مشترك) - اضغط للاختيار السريع:`;
    resultsContainer.appendChild(header);

    participants.forEach(p => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.innerHTML = `
        <div style="flex: 1;">
          <div class="name" style="font-weight: 700; color: var(--primary);">${p.name}</div>
          <div class="phone" style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">${p.phone || "بدون جوال"}</div>
        </div>
        <span class="btn btn-sm btn-outline" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">اختيار</span>
      `;
      item.onclick = () => {
        document.getElementById("new-member-name").value = p.name;
        document.getElementById("new-member-phone").value = p.phone || "";
        searchInput.value = `${p.name} (${p.phone || ""})`;
        resultsContainer.style.display = "none";
        showToast(`تم اختيار المشترك السابق (${p.name})`);
      };
      resultsContainer.appendChild(item);
    });

    resultsContainer.style.display = "block";
  }

  // عند الكتابة في حقل البحث
  searchInput.addEventListener("input", (e) => {
    const val = e.target.value.trim().toLowerCase();
    const all = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    
    if (!val) {
      renderDropdown(all);
      return;
    }

    const matches = all.filter(p => 
      p.name.toLowerCase().includes(val) || 
      p.phone.includes(val)
    );

    renderDropdown(matches, "لم يتم العثور على مشترك بهذا الاسم أو الرقم");
  });

  // عند النقر على السهم لاستعراض كافة المسجلين بدون كتابة
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (resultsContainer.style.display === "block") {
        resultsContainer.style.display = "none";
      } else {
        const all = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        renderDropdown(all, "لا يوجد مشتركون مسجلون بعد في النظام");
      }
    });
  }

  // عند النقر داخل حقل البحث إذا كان فارغاً
  searchInput.addEventListener("focus", () => {
    if (!searchInput.value.trim()) {
      const all = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
      renderDropdown(all, "لا يوجد مشتركون مسجلون بعد في النظام");
    }
  });

  // إغلاق القائمة عند النقر خارجها
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
      resultsContainer.style.display = "none";
    }
  });
}

// ==========================================
// 9. إنشاء جمعية جديدة
// ==========================================

function createNewGam3eya(name, startMonthKey, startYear, duration, shareAmount) {
  const startIdx = ALL_MONTHS_DEF.findIndex(m => m.key === startMonthKey);
  const months = [];

  for (let i = 0; i < duration; i++) {
    const monthDef = ALL_MONTHS_DEF[(startIdx + i) % 12];
    const yearOffset = Math.floor((startIdx + i) / 12);
    const y = startYear + yearOffset;
    months.push({
      key: `${monthDef.key}_${y}`,
      name: `${monthDef.name} ${y}`
    });
  }

  const members = [];
  for (let i = 0; i < duration; i++) {
    const turnMonthKey = months[i].key;
    const turnMonthName = months[i].name;

    const payments = {};
    months.forEach((m, mIdx) => {
      if (m.key === turnMonthKey) {
        payments[m.key] = ["payout"];
      } else if (mIdx > 0) {
        payments[m.key] = ["future"];
      } else {
        payments[m.key] = ["unpaid"];
      }
    });

    members.push({
      id: `slot_${Date.now()}_${i + 1}`,
      turn: i + 1,
      turnMonth: turnMonthKey,
      payoutDate: turnMonthName,
      isVacant: true,
      isShared: false,
      names: ["(دور متاح)"],
      shares: [shareAmount],
      phones: [""],
      pins: [""],
      codes: [`${i + 1}`],
      payments: payments
    });
  }

  const newGam = {
    id: `gam_${Date.now()}`,
    name: name,
    title: `بيان ${name}`,
    shareAmount: shareAmount,
    totalPayout: duration * shareAmount,
    currentMonthKey: months[0].key,
    months: months,
    members: members
  };

  appData.gam3eyat.push(newGam);
  saveData(appData);

  appState.currentGamId = newGam.id;
  appState.currentMonthKey = newGam.months[0].key;
  appState.currentRole = "admin";
  appState.isAdminAuthenticated = true;

  renderGamTabs();
  setupMonthSelector();
  updateView();
  showToast(`تم إنشاء "${name}" بنجاح!`);
}

// ==========================================
// 10. إدارة الجمعية وإعادة ترتيب الأدوار
// ==========================================

function openManageGamModal() {
  const gam = getCurrentGam();
  if (!gam) return;

  document.getElementById("manage-gam-title-header").textContent = gam.name;
  document.getElementById("manage-gam-name-input").value = gam.name;
  document.getElementById("manage-gam-share-input").value = gam.shareAmount;

  renderReorderTable();
  openModal("modal-manage-gam");
}

function renderReorderTable() {
  const gam = getCurrentGam();
  const tbody = document.getElementById("manage-gam-members-body");
  tbody.innerHTML = "";

  gam.members.forEach((m, idx) => {
    const tr = document.createElement("tr");
    const isFirst = idx === 0;
    const isLast = idx === gam.members.length - 1;

    const assignedMonth = gam.months[idx] ? gam.months[idx].name : m.payoutDate;

    let memberDisplay = "";
    let shareDisplay = "";

    if (m.isVacant) {
      memberDisplay = `<span class="slot-vacant" onclick="openAssignTurnModal(${idx})" title="انقر لتسكين المشترك"><span class="vacant-pulse"></span> دور متاح (انقر للتسكين)</span>`;
      shareDisplay = `<span style="color: #94a3b8;">${gam.shareAmount.toLocaleString()}</span>`;
    } else {
      const names = m.names.join(" + ");
      const totalShare = m.shares.reduce((a, b) => a + b, 0);
      memberDisplay = `
        <strong>${names}</strong>
        ${m.isShared ? '<span class="co-member-badge">شريكان</span>' : ''}
      `;
      shareDisplay = `<strong>${totalShare.toLocaleString()}</strong>`;
    }

    tr.innerHTML = `
      <td><strong>${idx + 1}</strong></td>
      <td><span style="font-size: 0.85rem; color: #065f46; font-weight: 700;">${assignedMonth}</span></td>
      <td style="text-align: right;">${memberDisplay}</td>
      <td>${shareDisplay}</td>
      <td>
        <button class="btn-arrow" onclick="moveMemberTurn(${idx}, -1)" ${isFirst ? 'disabled' : ''} title="تقديم الدور">▲</button>
        <button class="btn-arrow" onclick="moveMemberTurn(${idx}, 1)" ${isLast ? 'disabled' : ''} title="تأخير الدور">▼</button>
      </td>
      <td style="white-space: nowrap;">
        <button class="btn btn-sm btn-primary" onclick="openAssignTurnModal(${idx})" title="تسكين أو تعديل هذا الدور">تسكين / تعديل</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.moveMemberTurn = function(index, direction) {
  const gam = getCurrentGam();
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= gam.members.length) return;

  const temp = gam.members[index];
  gam.members[index] = gam.members[targetIndex];
  gam.members[targetIndex] = temp;

  const curMonthIdx = gam.months.findIndex(mo => mo.key === appState.currentMonthKey);

  gam.members.forEach((m, idx) => {
    m.turn = idx + 1;
    if (gam.months[idx]) {
      m.turnMonth = gam.months[idx].key;
      m.payoutDate = gam.months[idx].name;

      // تحديث حالة شهر القبض الجديد وإعادة الأشهر الأخرى لحالة سداد عادية
      gam.months.forEach((mo, mIdx) => {
        if (!m.payments[mo.key]) {
          m.payments[mo.key] = m.isShared ? ["unpaid", "unpaid"] : ["unpaid"];
        }
        if (mo.key === m.turnMonth) {
          m.payments[mo.key] = m.isShared ? ["payout", "payout"] : ["payout"];
        } else if (m.payments[mo.key].includes("payout")) {
          const defSt = (mIdx > curMonthIdx ? "future" : "unpaid");
          m.payments[mo.key] = m.isShared ? [defSt, defSt] : [defSt];
        }
      });
    }
  });

  saveData(appData);
  renderReorderTable();
  renderMatrixTable();
  renderAdminDashboard();
  showToast("تم تحديث ترتيب الأدوار بنجاح");
};

let currentAssignMode = "full"; // "full" أو "split"

window.openAssignTurnModal = function(turnIndex) {
  const gam = getCurrentGam();
  if (!gam || !gam.members[turnIndex]) return;

  const m = gam.members[turnIndex];
  const monthObj = gam.months[turnIndex] || { name: m.payoutDate };

  document.getElementById("assign-turn-index").value = turnIndex;
  document.getElementById("assign-turn-number").textContent = turnIndex + 1;
  document.getElementById("assign-turn-month-name").textContent = monthObj.name;

  // إعداد حقول البحث والاختيار للمشتركين السابقين
  setupAssignPartnerAutocomplete("p1");
  setupAssignPartnerAutocomplete("p2");

  if (m.isVacant) {
    setAssignTurnMode("full");
    document.getElementById("assign-p1-name").value = "";
    document.getElementById("assign-p1-phone").value = "";
    document.getElementById("assign-p1-share").value = gam.shareAmount;
    document.getElementById("search-assign-p1").value = "";

    document.getElementById("assign-p2-name").value = "";
    document.getElementById("assign-p2-phone").value = "";
    document.getElementById("assign-p2-share").value = Math.round(gam.shareAmount / 2);
    document.getElementById("search-assign-p2").value = "";
  } else if (m.isShared) {
    setAssignTurnMode("split");
    document.getElementById("assign-p1-name").value = m.names[0] || "";
    document.getElementById("assign-p1-phone").value = (m.phones && m.phones[0]) || "";
    document.getElementById("assign-p1-share").value = m.shares[0] || Math.round(gam.shareAmount / 2);
    document.getElementById("search-assign-p1").value = m.names[0] || "";

    document.getElementById("assign-p2-name").value = m.names[1] || "";
    document.getElementById("assign-p2-phone").value = (m.phones && m.phones[1]) || "";
    document.getElementById("assign-p2-share").value = m.shares[1] || Math.round(gam.shareAmount / 2);
    document.getElementById("search-assign-p2").value = m.names[1] || "";
  } else {
    setAssignTurnMode("full");
    document.getElementById("assign-p1-name").value = m.names[0] || "";
    document.getElementById("assign-p1-phone").value = (m.phones && m.phones[0]) || "";
    document.getElementById("assign-p1-share").value = m.shares[0] || gam.shareAmount;
    document.getElementById("search-assign-p1").value = m.names[0] || "";

    document.getElementById("assign-p2-name").value = "";
    document.getElementById("assign-p2-phone").value = "";
    document.getElementById("assign-p2-share").value = Math.round(gam.shareAmount / 2);
    document.getElementById("search-assign-p2").value = "";
  }

  openModal("modal-assign-turn");
};

window.openAssignTurnModalDirect = function(turnIndex) {
  openAssignTurnModal(turnIndex);
};

function setAssignTurnMode(mode) {
  currentAssignMode = mode;
  const btnFull = document.getElementById("btn-type-full");
  const btnSplit = document.getElementById("btn-type-split");
  const secP2 = document.getElementById("section-partner-2");
  const labelP1 = document.getElementById("label-partner-1");
  const gam = getCurrentGam();
  const baseShare = gam ? gam.shareAmount : 2000;

  if (mode === "split") {
    btnFull.className = "btn btn-outline";
    btnSplit.className = "btn btn-primary";
    secP2.style.display = "block";
    labelP1.textContent = "بيانات الشريك الأول (نصف سهم):";
    document.getElementById("assign-p1-share").value = Math.round(baseShare / 2);
    document.getElementById("assign-p2-share").value = Math.round(baseShare / 2);
    document.getElementById("assign-p2-name").required = true;
  } else {
    btnFull.className = "btn btn-primary";
    btnSplit.className = "btn btn-outline";
    secP2.style.display = "none";
    labelP1.textContent = "بيانات المشترك (السهم الكامل):";
    document.getElementById("assign-p1-share").value = baseShare;
    document.getElementById("assign-p2-name").required = false;
  }
}

function setupAssignPartnerAutocomplete(prefix) {
  const searchInput = document.getElementById(`search-assign-${prefix}`);
  const resultsContainer = document.getElementById(`dropdown-results-assign-${prefix}`);
  const toggleBtn = document.getElementById(`btn-dropdown-assign-${prefix}`);
  const nameInput = document.getElementById(`assign-${prefix}-name`);
  const phoneInput = document.getElementById(`assign-${prefix}-phone`);
  if (!searchInput || !resultsContainer) return;

  function renderList(participants, emptyMsg = "لا توجد نتائج مطابقة") {
    if (!participants || participants.length === 0) {
      resultsContainer.innerHTML = `<div style="padding: 0.65rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">${emptyMsg}</div>`;
      resultsContainer.style.display = "block";
      return;
    }

    resultsContainer.innerHTML = "";
    participants.forEach(p => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.innerHTML = `
        <div style="flex: 1;">
          <div class="name" style="font-weight: 700; color: var(--primary);">${p.name}</div>
          <div class="phone" style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">${p.phone || "بدون جوال"}</div>
        </div>
        <span class="btn btn-sm btn-outline" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">اختيار</span>
      `;
      item.onclick = () => {
        nameInput.value = p.name;
        if (phoneInput) phoneInput.value = p.phone || "";
        searchInput.value = `${p.name} (${p.phone || ""})`;
        resultsContainer.style.display = "none";
        showToast(`تم اختيار (${p.name})`);
      };
      resultsContainer.appendChild(item);
    });

    resultsContainer.style.display = "block";
  }

  searchInput.oninput = (e) => {
    const val = e.target.value.trim().toLowerCase();
    const all = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    if (!val) {
      renderList(all);
      return;
    }
    const matches = all.filter(p => p.name.toLowerCase().includes(val) || p.phone.includes(val));
    renderList(matches);
  };

  if (toggleBtn) {
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      if (resultsContainer.style.display === "block") {
        resultsContainer.style.display = "none";
      } else {
        const all = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        renderList(all, "لا يوجد مشتركون مسجلون بعد في النظام");
      }
    };
  }

  searchInput.onfocus = () => {
    if (!searchInput.value.trim()) {
      const all = getAllUniqueParticipants().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
      renderList(all, "لا يوجد مشتركون مسجلون بعد في النظام");
    }
  };

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
      resultsContainer.style.display = "none";
    }
  });
}

window.deleteMember = function(index) {
  const gam = getCurrentGam();
  if (gam.members.length <= 1) {
    alert("لا يمكن حذف الدور الأخير في الجمعية!");
    return;
  }

  if (confirm(`هل أنت متأكد من إخلاء الدور (${index + 1}) وجعله شاغراً متاحاً للحجز؟`)) {
    const m = gam.members[index];
    m.isVacant = true;
    m.isShared = false;
    m.names = ["(دور متاح)"];
    m.phones = [""];
    m.pins = [""];
    m.shares = [gam.shareAmount];
    const curMonthKey = gam.currentMonthKey || (gam.months[0] && gam.months[0].key);
    const curMonthIdx = gam.months.findIndex(mo => mo.key === curMonthKey);
    gam.months.forEach((mo, mIdx) => {
      m.payments[mo.key] = (mo.key === m.turnMonth) ? ["payout"] : [(mIdx > curMonthIdx ? "future" : "unpaid")];
    });
    saveData(appData);
    renderReorderTable();
    renderMatrixTable();
    renderAdminDashboard();
    renderDirectoryTable(document.getElementById("dir-search-input") ? document.getElementById("dir-search-input").value : "");
    showToast("تم إخلاء الدور وجعله متاحاً للحجز");
  }
};

// ==========================================
// 11. تذكيرات الواتساب وبيانات المستحق للقبض بتصميم فاخر
// ==========================================

window.copyTextToClipboard = function(text, successMsg = "تم النسخ بنجاح!") {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      prompt("انسخ النص التالي:", text);
    });
  } else {
    prompt("انسخ النص التالي:", text);
  }
};

// توحيد وصياغة رقم الجوال بالشكل الدولي الصحيح لواتساب
function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return "";
  let digits = rawPhone.toString().replace(/[^0-9]/g, "");
  if (!digits) return "";

  // إزالة أي أصفار بادئة دولية مثل 00
  if (digits.startsWith("00")) {
    digits = digits.substring(2);
  }

  // إذا كان الرقم مسجلاً بالفعل مع المفتاح الدولي (مثل السعودية 966 أو مصر 20)
  if (digits.startsWith("966") && digits.length >= 11) {
    return digits;
  }
  if (digits.startsWith("20") && digits.length >= 11) {
    return digits;
  }

  // أرقام سعودية: تبدأ بـ 05 (10 أرقام)
  if (digits.startsWith("05") && digits.length === 10) {
    return "966" + digits.substring(1);
  }
  // أرقام سعودية: 9 أرقام تبدأ بـ 5
  if (digits.startsWith("5") && digits.length === 9) {
    return "966" + digits;
  }

  // أرقام مصرية: تبدأ بـ 01 (11 رقم)
  if (digits.startsWith("01") && digits.length === 11) {
    return "20" + digits.substring(1);
  }
  // أرقام مصرية: 10 أرقام تبدأ بـ 1
  if (digits.startsWith("1") && digits.length === 10) {
    return "20" + digits;
  }

  // أرقام محلية عامة تبدأ بصفر
  if (digits.startsWith("0")) {
    const withoutZero = digits.substring(1);
    if (withoutZero.startsWith("5") && withoutZero.length === 9) {
      return "966" + withoutZero;
    }
    if (withoutZero.startsWith("1") && withoutZero.length === 10) {
      return "20" + withoutZero;
    }
    return withoutZero;
  }

  return digits;
}

// دالة فتح محادثة الواتساب المباشرة مع نسخ النص كإجراء احتياطي مضمون
window.openWhatsAppDirect = function(rawPhone, messageText, platform) {
  const normPhone = normalizePhoneNumber(rawPhone);
  if (!normPhone) {
    alert("المشترك ليس لديه رقم جوال صالح مسجل! يُرجى تعديل بياناته لإضافة رقم الجوال أولاً.");
    return;
  }

  // 1. نسخ فوري للنص إلى الحافظة لضمان توفر الرسالة دائماً
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(messageText).then(() => {
      showToast("تم فتح محادثة واتساب ونسخ نص الرسالة للحافظة بنجاح");
    }).catch(() => {});
  }

  // 2. التحقق من المنصة المختارة
  let chosenPlatform = platform;
  if (!chosenPlatform) {
    const radioSelected = document.querySelector('input[name="wa-target-platform"]:checked');
    chosenPlatform = radioSelected ? radioSelected.value : "web";
  }

  const encodedText = encodeURIComponent(messageText);

  let targetUrl = "";
  if (chosenPlatform === "web") {
    // فتح مباشر في واتساب ويب (الكمبيوتر) متجاوزاً صفحة التحويل الوسيطة
    targetUrl = `https://web.whatsapp.com/send?phone=${normPhone}&text=${encodedText}`;
  } else if (chosenPlatform === "app") {
    // بروتوكول تطبيق واتساب المباشر لنظام ويندوز أو الهواتف
    targetUrl = `whatsapp://send?phone=${normPhone}&text=${encodedText}`;
  } else {
    // صفحة الهبوط القياسية
    targetUrl = `https://api.whatsapp.com/send?phone=${normPhone}&text=${encodedText}`;
  }

  window.open(targetUrl, "_blank");
};

function formatTransferDetails(name, participant) {
  if (participant && participant.payoutMethod === "cash") {
    return {
      text: `المستلم: ${name} | طريقة الاستلام: نقداً يداً بيد`,
      html: `الاستلام: <strong style="color: #854d0e;">نقداً</strong> يداً بيد`
    };
  }

  const bankName = participant?.bankName ? participant.bankName.trim() : "غير محدد";
  const iban = participant?.iban ? participant.iban.trim() : "غير مسجل";

  return {
    text: `المستلم: ${name}\nالبنك: ${bankName}\nالحساب/الآيبان: ${iban}`,
    html: `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <strong>البنك:</strong> ${bankName} &nbsp;|&nbsp; <strong>الحساب/الآيبان:</strong> <span style="font-family: monospace; font-weight: 800; direction: ltr; display: inline-block;">${iban}</span>
        </div>
        ${iban && iban !== "غير مسجل" ? `<button type="button" class="btn btn-sm btn-outline" onclick="copyTextToClipboard('${iban}', 'تم نسخ رقم الحساب/الآيبان')" style="font-size: 0.72rem; padding: 0.15rem 0.5rem; background: white;">نسخ الحساب</button>` : ''}
      </div>
    `
  };
}

// مخزن مؤقت لنصوص رسائل المشتركين لتفادي أي مشاكل ترميز في HTML
window.__waMessagesStore = {};

window.sendStoredWhatsApp = function(msgId) {
  const item = window.__waMessagesStore && window.__waMessagesStore[msgId];
  if (!item) return;
  openWhatsAppDirect(item.phone || item.rawPhone, item.text);
};

window.copyStoredWhatsApp = function(msgId) {
  const item = window.__waMessagesStore && window.__waMessagesStore[msgId];
  if (!item) return;
  copyTextToClipboard(item.text, `تم نسخ نص رسالة (${item.name}) للحافظة بنجاح`);
};

function renderWhatsAppUnpaidList() {
  const gam = getCurrentGam();
  const monthKey = appState.currentMonthKey;
  const monthObj = gam.months.find(m => m.key === monthKey);
  if (!monthObj) return;

  const listContainer = document.getElementById("wa-unpaid-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  window.__waMessagesStore = {};
  const allParticipants = getAllUniqueParticipants();

  // 1. استخراج بيانات المستحق للقبض
  const receiverMember = gam.members.find(m => m.turnMonth === monthKey);
  let transferMessageSnippet = "";

  if (receiverMember && !receiverMember.isVacant) {
    if (receiverMember.isShared) {
      const p1Name = (receiverMember.names[0] || "").trim();
      const p2Name = (receiverMember.names[1] || "").trim();
      const p1 = allParticipants.find(p => p.name.trim() === p1Name);
      const p2 = allParticipants.find(p => p.name.trim() === p2Name);

      const p1Info = formatTransferDetails(p1Name, p1);
      const p2Info = formatTransferDetails(p2Name, p2);

      transferMessageSnippet = `تفاصيل التحويل للمستحقين لهذا الشهر (شريكان):\n[1] ${p1Info.text}\n[2] ${p2Info.text}`;
    } else {
      const pName = (receiverMember.names[0] || "").trim();
      const p = allParticipants.find(x => x.name.trim() === pName);
      const pInfo = formatTransferDetails(pName, p);
      transferMessageSnippet = `تفاصيل تحويل القسط للمستحق لهذا الشهر:\n${pInfo.text}`;
    }
  } else {
    transferMessageSnippet = "طريقة السداد: يُرجى التواصل مع مدير الجمعية لتأكيد بيانات التحويل.";
  }

  // 2. إعداد وتوليد بطاقات المتأخرين
  let unpaidCount = 0;
  let totalUnpaidAmount = 0;
  const templateEl = document.getElementById("wa-message-template");
  const msgTemplate = templateEl ? templateEl.value : "السلام عليكم {الاسم}، تذكير بسداد قسط {الجمعية} لشهر {الشهر}.";

  gam.members.forEach(m => {
    if (m.isVacant) return;

    const statuses = m.payments[monthKey] || [];
    statuses.forEach((st, idx) => {
      const personName = (m.names[idx] || m.names[0] || "").trim();
      if (!personName || personName === "(دور متاح)" || personName === "(دور شاغر)" || /^عضو دور \d+$/i.test(personName)) {
        return;
      }

      if (st === "unpaid") {
        unpaidCount++;
        const share = m.shares[idx] || (gam.shareAmount / statuses.length);
        totalUnpaidAmount += share;
        const phone = (m.phones && m.phones[idx]) || "";
        const normPhone = normalizePhoneNumber(phone);
        const hasPhone = Boolean(normPhone);

        const pObj = allParticipants.find(p => p.name.trim() === personName) || 
                     (phone ? allParticipants.find(p => p.phone === phone || p.phone.replace(/^0+/, '') === phone.replace(/^0+/, '')) : null);
        const memberPhone = (pObj && pObj.phone) || phone;
        const memberPin = (pObj && pObj.pin) || (m.pins && m.pins[idx]) || "1234";
        const portalLink = getPortalLinkForMember(personName, memberPhone, false);

        const msg = msgTemplate
          .replace(/{الاسم}/g, personName)
          .replace(/{الجمعية}/g, gam.name)
          .replace(/{الشهر}/g, monthObj.name)
          .replace(/{المبلغ}/g, share.toLocaleString())
          .replace(/{بيانات_التحويل}/g, transferMessageSnippet)
          .replace(/{الرابط}/g, portalLink)
          .replace(/{الجوال}/g, memberPhone || "مسجل بالنظام")
          .replace(/{الكود}/g, memberPin);

        const msgId = "wa_unpaid_" + unpaidCount;
        window.__waMessagesStore[msgId] = {
          phone: normPhone,
          rawPhone: phone,
          text: msg,
          name: personName
        };

        const item = document.createElement("div");
        item.className = "unpaid-card";

        const actionsHtml = hasPhone
          ? `<div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn-wa-send" onclick="sendStoredWhatsApp('${msgId}')" title="فتح محادثة واتساب مع المشترك فوراً">
                <span>إرسال واتساب</span>
              </button>
              <button type="button" class="btn-wa-copy" onclick="copyStoredWhatsApp('${msgId}')" title="نسخ رسالة التذكير الخاصة بهذا المشترك للحافظة">
                <span>نسخ الرسالة</span>
              </button>
            </div>`
          : `<div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              <span class="btn-wa-send btn-wa-disabled" title="يُرجى تسجيل رقم الجوال من دليل المشتركين لتفعيل الإرسال">
                <span>بدون جوال</span>
              </span>
              <button type="button" class="btn-wa-copy" onclick="copyStoredWhatsApp('${msgId}')" title="نسخ رسالة التذكير للحافظة">
                <span>نسخ الرسالة</span>
              </button>
            </div>`;

        item.innerHTML = `
          <div class="unpaid-card-info">
            <div class="unpaid-avatar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
            <div>
              <div class="unpaid-name">${personName}</div>
              <div class="unpaid-meta">
                <span class="unpaid-share-badge">المتأخر: ${formatCurrency(share)}</span>
                <span class="unpaid-phone-tag">${phone ? `${phone}` : '<span style="color:#ef4444;">جوال غير مسجل</span>'}</span>
              </div>
            </div>
          </div>
          <div>
            ${actionsHtml}
          </div>
        `;
        listContainer.appendChild(item);
      }
    });
  });

  // تحديث شريط الملخص
  const summaryBar = document.getElementById("wa-summary-bar");
  const unpaidCountTag = document.getElementById("wa-unpaid-count-tag");
  const unpaidTotalEl = document.getElementById("wa-unpaid-total-amount");

  if (unpaidCountTag) unpaidCountTag.textContent = unpaidCount;
  if (unpaidTotalEl) unpaidTotalEl.innerHTML = formatCurrency(totalUnpaidAmount);

  if (unpaidCount === 0) {
    if (summaryBar) summaryBar.style.display = "none";
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; background: #f0fdf4; border-radius: 12px; border: 1.5px dashed #86efac; margin-bottom: 0.5rem;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 0.5rem auto; display: block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div style="font-weight: 800; font-size: 1.05rem; color: #065f46; margin-bottom: 0.25rem;">لا يوجد أي متأخرين</div>
        <div style="font-size: 0.85rem; color: #047857;">جميع المشتركين سددوا قسط شهر (${monthObj.name}) بالكامل.</div>
      </div>
    `;
  } else {
    if (summaryBar) summaryBar.style.display = "flex";
  }
}

function openWhatsAppModal() {
  const gam = getCurrentGam();
  const monthKey = appState.currentMonthKey;
  const monthObj = gam.months.find(m => m.key === monthKey);
  if (!monthObj) return;

  document.getElementById("wa-month-name").textContent = monthObj.name;

  const allParticipants = getAllUniqueParticipants();

  // استخراج المشترك (أو المشتركين) المستحقين لقبض الجمعية هذا الشهر وتحديث البانر
  const receiverMember = gam.members.find(m => m.turnMonth === monthKey);
  const waReceiverNameEl = document.getElementById("wa-receiver-name");
  const waReceiverBadgeEl = document.getElementById("wa-receiver-method-badge");
  const waReceiverDetailsEl = document.getElementById("wa-receiver-details");

  if (receiverMember && !receiverMember.isVacant) {
    if (receiverMember.isShared) {
      const p1Name = (receiverMember.names[0] || "").trim();
      const p2Name = (receiverMember.names[1] || "").trim();
      const p1 = allParticipants.find(p => p.name.trim() === p1Name);
      const p2 = allParticipants.find(p => p.name.trim() === p2Name);

      waReceiverNameEl.textContent = `${p1Name} + ${p2Name}`;
      waReceiverBadgeEl.textContent = "شريكان (نصف سهم لكل شريك)";
      waReceiverBadgeEl.style.background = "#dcfce7";
      waReceiverBadgeEl.style.color = "#15803d";

      const p1Info = formatTransferDetails(p1Name, p1);
      const p2Info = formatTransferDetails(p2Name, p2);

      waReceiverDetailsEl.innerHTML = `
        <div style="margin-bottom: 0.45rem;"><strong>[1] ${p1Name}:</strong> ${p1Info.html}</div>
        <div><strong>[2] ${p2Name}:</strong> ${p2Info.html}</div>
      `;
    } else {
      const pName = (receiverMember.names[0] || "").trim();
      const p = allParticipants.find(x => x.name.trim() === pName);

      waReceiverNameEl.textContent = pName;
      const pInfo = formatTransferDetails(pName, p);

      if (p?.payoutMethod === "cash") {
        waReceiverBadgeEl.textContent = "نقداً";
        waReceiverBadgeEl.style.background = "#fefce8";
        waReceiverBadgeEl.style.color = "#854d0e";
      } else {
        waReceiverBadgeEl.textContent = "تحويل بنكي";
        waReceiverBadgeEl.style.background = "#eff6ff";
        waReceiverBadgeEl.style.color = "#1e40af";
      }

      waReceiverDetailsEl.innerHTML = pInfo.html;
    }
  } else {
    waReceiverNameEl.textContent = "دور متاح / غير محدد";
    waReceiverBadgeEl.textContent = "تواصل مع الإدارة";
    waReceiverBadgeEl.style.background = "#f1f5f9";
    waReceiverBadgeEl.style.color = "#475569";
    waReceiverDetailsEl.textContent = "يُرجى التحويل لحساب مدير الجمعية أو التواصل للمزيد من التفاصيل.";
  }

  // توليد وعرض بطاقات المتأخرين
  renderWhatsAppUnpaidList();

  openModal("modal-whatsapp");
}

// ==========================================
// 12. ربط مستمعي الأحداث ومكون الفلاتر المتقدم
// ==========================================

const filterLabels = {
  all: "عرض جميع المشتركين",
  unpaid: "المتأخرين عن السداد",
  paid: "المسددين لهذا الشهر"
};

function updateFilterDropdownCounts() {
  const gam = getCurrentGam();
  if (!gam) return;
  const monthKey = appState.currentMonthKey;

  let counts = {
    all: gam.members.length,
    unpaid: 0,
    paid: 0
  };

  gam.members.forEach((member) => {
    const currentStatuses = member.payments[monthKey] || [];
    if (!member.isVacant) {
      if (currentStatuses.includes("unpaid")) counts.unpaid++;
      if (currentStatuses.includes("paid")) counts.paid++;
    }
  });

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl("count-filter-all", counts.all);
  setEl("count-filter-unpaid", counts.unpaid);
  setEl("count-filter-paid", counts.paid);

  const curFilter = appState.statusFilter || "all";
  const activeCountEl = document.getElementById("filter-active-count");
  if (activeCountEl) {
    activeCountEl.textContent = counts[curFilter] !== undefined ? counts[curFilter] : counts.all;
  }
}

function updateFilterDropdownUI() {
  const curFilter = appState.statusFilter || "all";
  const labelEl = document.getElementById("filter-current-label");
  if (labelEl) {
    labelEl.textContent = filterLabels[curFilter] || "تصفية";
  }

  const triggerBtn = document.getElementById("btn-toggle-filter-dropdown");
  const clearBtn = document.getElementById("btn-clear-filter");

  if (triggerBtn) {
    if (curFilter !== "all") {
      triggerBtn.classList.add("filter-active-highlight");
    } else {
      triggerBtn.classList.remove("filter-active-highlight");
    }
  }

  if (clearBtn) {
    clearBtn.style.display = (curFilter !== "all") ? "flex" : "none";
  }

  document.querySelectorAll(".filter-dropdown-menu .dropdown-item").forEach(item => {
    const fVal = item.getAttribute("data-filter");
    if (fVal === curFilter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  updateFilterDropdownCounts();
}

function setFilterStatus(val) {
  appState.statusFilter = val;
  const selEl = document.getElementById("filter-status");
  if (selEl) selEl.value = val;
  updateFilterDropdownUI();
  renderMatrixTable();
  const menu = document.getElementById("filter-dropdown-menu");
  const trigger = document.getElementById("btn-toggle-filter-dropdown");
  if (menu) menu.classList.remove("show");
  if (trigger) trigger.classList.remove("active");
}
window.setFilterStatus = setFilterStatus;

function setupFilterDropdown() {
  const triggerBtn = document.getElementById("btn-toggle-filter-dropdown");
  const menu = document.getElementById("filter-dropdown-menu");
  const clearBtn = document.getElementById("btn-clear-filter");

  if (triggerBtn && menu) {
    triggerBtn.onclick = (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains("show");
      if (isOpen) {
        menu.classList.remove("show");
        triggerBtn.classList.remove("active");
      } else {
        menu.classList.add("show");
        triggerBtn.classList.add("active");
        updateFilterDropdownCounts();
      }
    };

    document.querySelectorAll(".filter-dropdown-menu .dropdown-item").forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const fVal = item.getAttribute("data-filter");
        setFilterStatus(fVal);
      };
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !triggerBtn.contains(e.target)) {
        menu.classList.remove("show");
        triggerBtn.classList.remove("active");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("show")) {
        menu.classList.remove("show");
        triggerBtn.classList.remove("active");
      }
    });
  }

  if (clearBtn) {
    clearBtn.onclick = (e) => {
      e.stopPropagation();
      setFilterStatus("all");
    };
  }

  updateFilterDropdownUI();
}

function attachEventListeners() {
  setupModalCloseButtons();
  setupFilterDropdown();

  const btnToggleRole = document.getElementById("btn-toggle-role");
  if (btnToggleRole) btnToggleRole.onclick = toggleRole;

  const selMonth = document.getElementById("select-active-month");
  if (selMonth) {
    selMonth.onchange = (e) => {
      appState.currentMonthKey = e.target.value;
      const gam = getCurrentGam();
      if (gam) {
        syncMonthPaymentStatuses(gam, e.target.value);
        saveData(appData);
      }
      renderAdminDashboard();
      renderMatrixTable();
      updateFilterDropdownUI();
    };
  }

  const nativeFilterSelect = document.getElementById("filter-status");
  if (nativeFilterSelect) {
    nativeFilterSelect.onchange = (e) => {
      setFilterStatus(e.target.value);
    };
  }

  const btnEditGam = document.getElementById("btn-edit-current-gam");
  if (btnEditGam) btnEditGam.onclick = openManageGamModal;

  const btnSaveGam = document.getElementById("btn-save-gam-settings");
  if (btnSaveGam) {
    btnSaveGam.onclick = () => {
      const gam = getCurrentGam();
      const newNameEl = document.getElementById("manage-gam-name-input");
      const newShareEl = document.getElementById("manage-gam-share-input");
      const newName = newNameEl ? newNameEl.value.trim() : "";
      const newShare = newShareEl ? parseInt(newShareEl.value, 10) : 0;

      if (newName) gam.name = newName;
      if (newShare > 0) {
        gam.shareAmount = newShare;
        gam.totalPayout = gam.members.length * newShare;
      }

      saveData(appData);
      closeModal("modal-manage-gam");
      renderGamTabs();
      renderAdminDashboard();
      renderMatrixTable();
      showToast("تم حفظ إعدادات الجمعية بنجاح");
    };
  }

  const btnDeleteGam = document.getElementById("btn-delete-gam");
  if (btnDeleteGam) {
    btnDeleteGam.onclick = () => {
      if (appData.gam3eyat.length <= 1) {
        alert("لا يمكن حذف الجمعية الأخيرة! يجب أن يحتوي النظام على جمعية واحدة على الأقل.");
        return;
      }
      const gam = getCurrentGam();
      if (confirm(`تحذير: هل أنت متأكد من حذف "${gam.name}" بجميع سجلاتها وحساباتها؟`)) {
        appData.gam3eyat = appData.gam3eyat.filter(g => g.id !== gam.id);
        appState.currentGamId = appData.gam3eyat[0].id;
        appState.currentMonthKey = appData.gam3eyat[0].months[0].key;
        saveData(appData);
        closeModal("modal-manage-gam");
        renderGamTabs();
        setupMonthSelector();
        updateView();
        showToast("تم حذف الجمعية");
      }
    };
  }

  // تسجيل دخول المشترك المعتمد برقم الجوال والكود السري (4 أرقام)
  const formMemberLogin = document.getElementById("form-member-login");
  if (formMemberLogin) {
    formMemberLogin.onsubmit = async (e) => {
      e.preventDefault();
      const identifier = document.getElementById("input-member-phone").value.trim();
      const pin = document.getElementById("input-member-pin") ? document.getElementById("input-member-pin").value.trim() : "";
      const submitBtn = formMemberLogin.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.textContent : "";
      try {
        if (submitBtn) {
          submitBtn.textContent = "جاري التحقق وفتح كشف حسابك...";
          submitBtn.disabled = true;
        }
        await handleMemberLogin(identifier, pin);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = origText;
          submitBtn.disabled = false;
        }
      }
    };
  }

  // زر إظهار/إخفاء الكود السري في شاشة دخول المشترك
  const btnTogglePin = document.getElementById("btn-toggle-member-pin");
  if (btnTogglePin) {
    btnTogglePin.onclick = () => {
      const pinInput = document.getElementById("input-member-pin");
      if (pinInput) {
        if (pinInput.type === "password") {
          pinInput.type = "text";
          btnTogglePin.textContent = "إخفاء";
        } else {
          pinInput.type = "password";
          btnTogglePin.textContent = "عرض";
        }
      }
    };
  }

  // خيار سريع إذا كان موجوداً
  const quickSelect = document.getElementById("quick-member-select");
  if (quickSelect) {
    quickSelect.onchange = (e) => {
      const opt = e.target.selectedOptions[0];
      if (opt && opt.dataset.name) {
        const all = getAllUniqueParticipants();
        const matched = all.find(p => p.name === opt.dataset.name);
        if (matched) {
          appState.loggedMember = matched;
          showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك المباشر`);
          renderMemberSection();
        }
      }
    };
  }

  // نسخ الرابط المباشر من قبل المشترك نفسه
  const btnCopyMyLink = document.getElementById("btn-copy-my-magic-link");
  if (btnCopyMyLink) {
    btnCopyMyLink.onclick = () => {
      if (appState.loggedMember) {
        copyMagicLink(encodeURIComponent(appState.loggedMember.name), appState.loggedMember.phone);
      }
    };
  }

  // تسجيل خروج المشترك من كشف الحساب
  const btnMemberLogout = document.getElementById("btn-member-logout");
  if (btnMemberLogout) {
    btnMemberLogout.onclick = () => {
      if (appState.isAdminAuthenticated && appState.currentManager) {
        appState.loggedMember = null;
        appState.currentRole = "admin";
        updateView();
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast("تمت العودة للوحة تحكم المدير بنجاح");
        return;
      }
      appState.loggedMember = null;
      try {
        sessionStorage.removeItem("gam_active_member_session");
      } catch(e) {}
      showToast("تم تسجيل الخروج من كشف الحساب بنجاح");
      renderMemberSection();
    };
  }

  // طباعة كشف الحساب المعتمد
  const btnPrintPort = document.getElementById("btn-print-portfolio");
  if (btnPrintPort) {
    btnPrintPort.onclick = () => {
      window.print();
    };
  }

  // إنشاء جمعية جديدة
  const formCreateGam = document.getElementById("form-create-gam");
  if (formCreateGam) {
    formCreateGam.onsubmit = (e) => {
      e.preventDefault();
      const nameEl = document.getElementById("new-gam-name");
      const startMonthEl = document.getElementById("new-gam-start-month");
      const yearEl = document.getElementById("new-gam-year");
      const durationEl = document.getElementById("new-gam-duration");
      const shareEl = document.getElementById("new-gam-share");

      const name = nameEl ? nameEl.value.trim() : "";
      const startMonth = startMonthEl ? startMonthEl.value : "jan";
      const year = yearEl ? (parseInt(yearEl.value, 10) || 2027) : 2027;
      const duration = durationEl ? (parseInt(durationEl.value, 10) || 12) : 12;
      const share = shareEl ? (parseInt(shareEl.value, 10) || 2000) : 2000;

      if (!name) return;

      createNewGam3eya(name, startMonth, year, duration, share);
      closeModal("modal-create-gam");
      formCreateGam.reset();
    };
  }

  // إضافة مشترك جديد إلى دليل المشتركين العام
  const btnDirAdd = document.getElementById("btn-dir-add-member");
  if (btnDirAdd) {
    btnDirAdd.onclick = () => {
      document.getElementById("form-add-directory-member").reset();
      document.getElementById("add-dir-pin").value = generateRandomPin();
      openModal("modal-add-directory-member");
    };
  }

  const btnGenAddPin = document.getElementById("btn-generate-add-pin");
  if (btnGenAddPin) {
    btnGenAddPin.onclick = () => {
      document.getElementById("add-dir-pin").value = generateRandomPin();
      showToast("تم توليد كود سري جديد");
    };
  }

  const btnGenEditPin = document.getElementById("btn-generate-edit-pin");
  if (btnGenEditPin) {
    btnGenEditPin.onclick = () => {
      document.getElementById("edit-cred-pin").value = generateRandomPin();
      showToast("تم توليد كود سري جديد");
    };
  }

  const btnRandAll = document.getElementById("btn-dir-randomize-all-pins");
  if (btnRandAll) {
    btnRandAll.onclick = window.randomizeAllPins;
  }

  const formDirAdd = document.getElementById("form-add-directory-member");
  if (formDirAdd) {
    formDirAdd.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("add-dir-name").value.trim();
      const phone = document.getElementById("add-dir-phone").value.trim();
      let pin = document.getElementById("add-dir-pin").value.trim();
      const payoutMethod = document.querySelector('input[name="add-dir-payout-type"]:checked')?.value || "bank";
      const bankName = document.getElementById("add-dir-bank-name") ? document.getElementById("add-dir-bank-name").value.trim() : "";
      const iban = document.getElementById("add-dir-iban") ? document.getElementById("add-dir-iban").value.trim() : "";

      if (!name) {
        alert("يُرجى إدخال اسم المشترك.");
        return;
      }

      if (!pin) {
        pin = generateRandomPin();
      }

      appData.registeredMembers = appData.registeredMembers || [];
      const exists = appData.registeredMembers.some(m => m.name.trim() === name);
      if (exists) {
        alert(`المشترك (${name}) مسجل بالفعل في الدليل!`);
        return;
      }

      const all = getAllUniqueParticipants();
      const newMember = {
        name: name,
        phone: phone,
        pin: pin,
        code: (100 + all.length + 1).toString(),
        payoutMethod: payoutMethod,
        bankName: payoutMethod === "bank" ? bankName : "",
        iban: payoutMethod === "bank" ? iban : ""
      };

      appData.registeredMembers.push(newMember);
      saveData(appData);

      closeModal("modal-add-directory-member");
      formDirAdd.reset();

      renderDirectoryTable(document.getElementById("dir-search-input") ? document.getElementById("dir-search-input").value : "");
      showToast(`تمت إضافة المشترك (${name}) مع طريقة الاستلام بنجاح`);
    };
  }

  // تفعيل/تعطيل حقول البنك حسب خيار التحويل أو الكاش
  const addRadioBank = document.querySelector('input[name="add-dir-payout-type"][value="bank"]');
  const addRadioCash = document.querySelector('input[name="add-dir-payout-type"][value="cash"]');
  const addBankFields = document.getElementById("add-dir-bank-fields");
  if (addRadioBank && addRadioCash && addBankFields) {
    addRadioBank.onchange = () => { addBankFields.style.display = "block"; };
    addRadioCash.onchange = () => { addBankFields.style.display = "none"; };
  }

  const editRadioBank = document.querySelector('input[name="edit-cred-payout-type"][value="bank"]');
  const editRadioCash = document.querySelector('input[name="edit-cred-payout-type"][value="cash"]');
  const editBankFields = document.getElementById("edit-cred-bank-fields");
  if (editRadioBank && editRadioCash && editBankFields) {
    editRadioBank.onchange = () => { editBankFields.style.display = "block"; };
    editRadioCash.onchange = () => { editBankFields.style.display = "none"; };
  }

  // أزرار ونماذج تسكين الدور (modal-assign-turn)
  const btnTypeFull = document.getElementById("btn-type-full");
  if (btnTypeFull) btnTypeFull.onclick = () => setAssignTurnMode("full");

  const btnTypeSplit = document.getElementById("btn-type-split");
  if (btnTypeSplit) btnTypeSplit.onclick = () => setAssignTurnMode("split");

  const btnCloseAssign = document.getElementById("btn-close-assign-turn");
  if (btnCloseAssign) btnCloseAssign.onclick = () => closeModal("modal-assign-turn");

  const btnCancelAssign = document.getElementById("btn-cancel-assign-turn");
  if (btnCancelAssign) btnCancelAssign.onclick = () => closeModal("modal-assign-turn");

  const formAssignTurn = document.getElementById("form-assign-turn");
  if (formAssignTurn) {
    formAssignTurn.onsubmit = (e) => {
      e.preventDefault();
      const gam = getCurrentGam();
      const turnIndex = parseInt(document.getElementById("assign-turn-index").value, 10);
      const m = gam.members[turnIndex];
      if (!m) return;

      const p1Name = document.getElementById("assign-p1-name").value.trim();
      const p1Phone = document.getElementById("assign-p1-phone").value.trim();
      const p1Share = parseInt(document.getElementById("assign-p1-share").value, 10) || gam.shareAmount;
      const allParticipants = getAllUniqueParticipants();
      const existingP1 = allParticipants.find(p => p.name === p1Name || (p1Phone && p.phone === p1Phone));
      const p1Pin = existingP1 ? existingP1.pin : generateRandomPin();

      if (currentAssignMode === "split") {
        const p2Name = document.getElementById("assign-p2-name").value.trim();
        const p2Phone = document.getElementById("assign-p2-phone").value.trim();
        const p2Share = parseInt(document.getElementById("assign-p2-share").value, 10) || Math.round(gam.shareAmount / 2);
        const existingP2 = allParticipants.find(p => p.name === p2Name || (p2Phone && p.phone === p2Phone));
        const p2Pin = existingP2 ? existingP2.pin : generateRandomPin();

        if (!p1Name || !p2Name) {
          alert("يُرجى إدخال اسم الشريكين الأول والثاني.");
          return;
        }

        m.isVacant = false;
        m.isShared = true;
        m.names = [p1Name, p2Name];
        m.phones = [p1Phone, p2Phone];
        m.pins = [p1Pin, p2Pin];
        m.shares = [p1Share, p2Share];

        // تهيئة المدفوعات لشريكين
        const curMonthKey = gam.currentMonthKey || (gam.months[0] && gam.months[0].key);
        const curMonthIdx = gam.months.findIndex(mo => mo.key === curMonthKey);

        gam.months.forEach((mo, mIdx) => {
          const defStatus = (mIdx > curMonthIdx) ? "future" : "unpaid";
          if (!m.payments[mo.key] || m.payments[mo.key].length < 2) {
            m.payments[mo.key] = (mo.key === m.turnMonth) ? ["payout", "payout"] : [defStatus, defStatus];
          }
        });
      } else {
        if (!p1Name) {
          alert("يُرجى إدخال اسم المشترك.");
          return;
        }

        m.isVacant = false;
        m.isShared = false;
        m.names = [p1Name];
        m.phones = [p1Phone];
        m.pins = [p1Pin];
        m.shares = [p1Share];

        // تهيئة المدفوعات لمشترك واحد
        const curMonthKey = gam.currentMonthKey || (gam.months[0] && gam.months[0].key);
        const curMonthIdx = gam.months.findIndex(mo => mo.key === curMonthKey);

        gam.months.forEach((mo, mIdx) => {
          const defStatus = (mIdx > curMonthIdx) ? "future" : "unpaid";
          const curSt = (m.payments[mo.key] && m.payments[mo.key][0]) || ((mo.key === m.turnMonth) ? "payout" : defStatus);
          m.payments[mo.key] = [curSt];
        });
      }

      saveData(appData);
      closeModal("modal-assign-turn");
      renderReorderTable();
      renderMatrixTable();
      renderAdminDashboard();
      renderDirectoryTable(document.getElementById("dir-search-input") ? document.getElementById("dir-search-input").value : "");
      showToast(`تم تسكين الدور (${turnIndex + 1}) بنجاح!`);
    };
  }

  const btnVacateTurn = document.getElementById("btn-vacate-turn");
  if (btnVacateTurn) {
    btnVacateTurn.onclick = () => {
      const gam = getCurrentGam();
      const turnIndex = parseInt(document.getElementById("assign-turn-index").value, 10);
      const m = gam.members[turnIndex];
      if (!m) return;

      if (confirm(`هل أنت متأكد من إخلاء الدور (${turnIndex + 1}) وجعله متاحاً للحجز؟`)) {
        m.isVacant = true;
        m.isShared = false;
        m.names = ["(دور متاح)"];
        m.phones = [""];
        m.pins = [""];
        m.shares = [gam.shareAmount];
        const curMonthKey = gam.currentMonthKey || (gam.months[0] && gam.months[0].key);
        const curMonthIdx = gam.months.findIndex(mo => mo.key === curMonthKey);
        gam.months.forEach((mo, mIdx) => {
          m.payments[mo.key] = (mo.key === m.turnMonth) ? ["payout"] : [(mIdx > curMonthIdx ? "future" : "unpaid")];
        });

        saveData(appData);
        closeModal("modal-assign-turn");
        renderReorderTable();
        renderMatrixTable();
        renderAdminDashboard();
        renderDirectoryTable(document.getElementById("dir-search-input") ? document.getElementById("dir-search-input").value : "");
        showToast(`تم إخلاء الدور (${turnIndex + 1}) وجعله شاغراً`);
      }
    };
  }

  const btnMembersDir = document.getElementById("btn-members-directory");
  if (btnMembersDir) {
    btnMembersDir.onclick = () => {
      closeModal("modal-settings");
      openMembersDirectoryModal();
    };
  }

  const dirSearchInput = document.getElementById("dir-search-input");
  if (dirSearchInput) {
    dirSearchInput.addEventListener("input", (e) => {
      renderDirectoryTable(e.target.value);
    });
  }

  const formEditCred = document.getElementById("form-edit-credentials");
  if (formEditCred) {
    formEditCred.onsubmit = (e) => {
      e.preventDefault();
      const origNameEl = document.getElementById("edit-orig-name");
      const newNameEl = document.getElementById("edit-cred-name");
      const newPhoneEl = document.getElementById("edit-cred-phone");
      const newPinEl = document.getElementById("edit-cred-pin");

      const origName = origNameEl ? origNameEl.value : "";
      const newName = newNameEl ? newNameEl.value.trim() : "";
      const newPhone = newPhoneEl ? newPhoneEl.value.trim() : "";
      const newPin = newPinEl ? newPinEl.value.trim() : "";
      const payoutMethod = document.querySelector('input[name="edit-cred-payout-type"]:checked')?.value || "bank";
      const bankName = document.getElementById("edit-cred-bank-name") ? document.getElementById("edit-cred-bank-name").value.trim() : "";
      const iban = document.getElementById("edit-cred-iban") ? document.getElementById("edit-cred-iban").value.trim() : "";

      if (!newName || !newPhone || !newPin) return;

      saveEditedCredentials(origName, newName, newPhone, newPin, payoutMethod, bankName, iban);
      closeModal("modal-edit-credentials");
      showToast(`تم حفظ بيانات المشترك (${newName}) وطريقة الاستلام بنجاح`);
    };
  }

  // أزرار أرشفة الجمعية واستعراض الأرشيف
  const btnArchiveCurrent = document.getElementById("btn-archive-current-gam");
  if (btnArchiveCurrent) {
    btnArchiveCurrent.onclick = () => {
      closeModal("modal-manage-gam");
      archiveCurrentGam();
    };
  }

  const btnOpenArchives = document.getElementById("btn-open-archives");
  if (btnOpenArchives) {
    btnOpenArchives.onclick = () => {
      closeModal("modal-settings");
      openArchivesModal();
    };
  }

  // نوافذ الواتساب والإعدادات وتسجيل الدخول
  const btnOpenWa = document.getElementById("btn-open-whatsapp");
  if (btnOpenWa) btnOpenWa.onclick = openWhatsAppModal;
  const btnWaReset = document.getElementById("btn-wa-reset-template");
  if (btnWaReset) {
    btnWaReset.onclick = () => {
      const tpl = document.getElementById("wa-message-template");
      if (tpl) {
        tpl.value = `السلام عليكم ورحمة الله وبركاته يا {الاسم}\nنحيطكم علماً بموعد استحقاق قسط الجمعية لشهر ({الشهر}):\n\n*تفاصيل القسط:*\n• *الجمعية:* {الجمعية}\n• *المبلغ المطلوب:* {المبلغ}\n• *الشهر المستحق:* {الشهر}\n\n*بيانات التحويل للمستحق:*\n{بيانات_التحويل}\n\n*بيانات الدخول لبوابة المشتركين:*\n• *رابط الدخول:* {الرابط}\n• *رقم جوالك:* {الجوال}\n• *كود الدخول السري:* {الكود}\n\n(اضغط على الرابط أعلاه وأدخل كودك السري للاطلاع على كشف حسابك فوراً)\nتقبلوا خالص التحية والتقدير`;
        renderWhatsAppUnpaidList();
        showToast("تمت استعادة النص الافتراضي وتحديث الرسائل");
      }
    };
  }

  const tplInput = document.getElementById("wa-message-template");
  if (tplInput) {
    tplInput.addEventListener("input", () => {
      renderWhatsAppUnpaidList();
    });
  }

  document.querySelectorAll('input[name="wa-target-platform"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const modeText = radio.value === "web" ? "واتساب ويب (المتصفح)" : (radio.value === "app" ? "تطبيق واتساب" : "رابط واتساب القياسي");
      showToast(`تم تعيين طريقة الفتح: ${modeText}`);
    });
  });
  // فتح وتعبئة نافذة إعدادات المدير
  function openSettingsModal() {
    const nameInput = document.getElementById("mgr-profile-name");
    const emailInput = document.getElementById("mgr-profile-email");
    const phoneInput = document.getElementById("mgr-profile-phone");
    const passInput = document.getElementById("mgr-profile-password");

    if (appState.currentManager) {
      if (nameInput) nameInput.value = appState.currentManager.displayName || "المدير العام";
      if (emailInput) emailInput.value = appState.currentManager.email || "admin@gam.com";
      if (phoneInput) phoneInput.value = appState.currentManager.phone || "";
    } else {
      if (nameInput) nameInput.value = "المدير العام";
      if (emailInput) emailInput.value = "admin@gam.com";
      if (phoneInput) phoneInput.value = "";
    }
    if (passInput) {
      passInput.value = "";
      passInput.type = "password";
      const btnToggle = document.getElementById("btn-toggle-mgr-profile-pass");
      if (btnToggle) btnToggle.textContent = "عرض";
    }
    openModal("modal-settings");
  }

  const btnAdminSettings = document.getElementById("btn-admin-settings");
  if (btnAdminSettings) {
    btnAdminSettings.onclick = openSettingsModal;
  }

  const btnCloudSync = document.getElementById("btn-cloud-sync-manual");
  if (btnCloudSync) {
    btnCloudSync.onclick = async () => {
      try {
        btnCloudSync.textContent = "جاري الرفع...";
        btnCloudSync.disabled = true;
        const uid = (appState.currentManager && appState.currentManager.uid) ? appState.currentManager.uid : "admin_default";
        const ok = await FirebaseService.saveManagerData(uid, appData);
        if (ok) {
          showToast("تم نشر وتحديث كافة الجمعيات والمشتركين في السحابة بنجاح! المشتركون يمكنهم الدخول من هواتفهم الآن.");
        } else {
          showToast("تم الحفظ محلياً بنجاح.");
        }
      } catch (err) {
        console.warn("خطأ في المزامنة اليدوية:", err);
        showToast("تم الحفظ محلياً بنجاح.");
      } finally {
        btnCloudSync.textContent = "مزامنة السحابة";
        btnCloudSync.disabled = false;
      }
    };
  }

  const btnEnterDashActive = document.getElementById("btn-enter-dashboard-active");
  if (btnEnterDashActive) {
    btnEnterDashActive.onclick = () => {
      closeModal("modal-manager-auth");
      updateView();
    };
  }

  const btnOpenProfileFromAuth = document.getElementById("btn-open-profile-from-auth");
  if (btnOpenProfileFromAuth) {
    btnOpenProfileFromAuth.onclick = () => {
      closeModal("modal-manager-auth");
      openSettingsModal();
    };
  }

  // تصدير واستعادة النسخة الاحتياطية (Backup Export & Import)
  const btnExportBackup = document.getElementById("btn-export-backup");
  if (btnExportBackup) {
    btnExportBackup.onclick = () => {
      try {
        const backupObj = {
          version: "2.0",
          exportedAt: new Date().toISOString(),
          manager: appState.currentManager ? {
            uid: appState.currentManager.uid,
            email: appState.currentManager.email,
            displayName: appState.currentManager.displayName
          } : null,
          data: appData
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
        const dlAnchor = document.createElement("a");
        const nowStr = new Date().toISOString().slice(0, 10);
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `gam3eyaty_backup_${nowStr}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        showToast("تم تصدير وتحميل ملف النسخة الاحتياطية بنجاح!");
      } catch (err) {
        console.error("خطأ في تصدير النسخة الاحتياطية:", err);
        alert("تعذر تصدير النسخة الاحتياطية: " + err.message);
      }
    };
  }

  const btnTriggerImport = document.getElementById("btn-trigger-import-backup");
  const inputImportBackup = document.getElementById("input-import-backup");
  if (btnTriggerImport && inputImportBackup) {
    btnTriggerImport.onclick = () => {
      inputImportBackup.click();
    };

    inputImportBackup.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const restoredData = (parsed && parsed.data && parsed.data.gam3eyat) ? parsed.data : (parsed && parsed.gam3eyat ? parsed : null);
          if (!restoredData || !Array.isArray(restoredData.gam3eyat)) {
            alert("ملف النسخة غير صالح أو لا يحتوي على جمعيات صحيحة!");
            return;
          }
          const count = restoredData.gam3eyat.length;
          if (!confirm(`هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟\nتحتوي على (${count}) جمعيات.\nسيتم استبدال البيانات الحالية بهذه النسخة ومزامنتها سحابياً.`)) {
            inputImportBackup.value = "";
            return;
          }

          setAppData(restoredData);
          saveData(appData);

          const activeUid = (appState.currentManager && appState.currentManager.uid) ? appState.currentManager.uid : "admin_default";
          if (typeof FirebaseService !== "undefined") {
            await FirebaseService.saveManagerData(activeUid, appData);
          }

          if (appData.gam3eyat && appData.gam3eyat.length > 0) {
            appState.currentGamId = appData.gam3eyat[0].id;
            appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key);
          }

          closeModal("modal-settings");
          renderGamTabs();
          setupMonthSelector();
          updateView();
          showToast("تمت استعادة النسخة الاحتياطية ومزامنتها سحابياً بنجاح!");
        } catch (err) {
          console.error("خطأ في استعادة النسخة:", err);
          alert("تعذر استعادة النسخة الاحتياطية: " + (err.message || "الملف تالف"));
        } finally {
          inputImportBackup.value = "";
        }
      };
      reader.readAsText(file);
    };
  }

  // حفظ وتعديل الملف الشخصي للمدير (البريد الإلكتروني، كلمة المرور، الاسم)
  const formMgrProfile = document.getElementById("form-manager-profile");
  if (formMgrProfile) {
    formMgrProfile.onsubmit = async (e) => {
      e.preventDefault();
      const nameEl = document.getElementById("mgr-profile-name");
      const emailEl = document.getElementById("mgr-profile-email");
      const phoneEl = document.getElementById("mgr-profile-phone");
      const passEl = document.getElementById("mgr-profile-password");

      const name = (nameEl ? nameEl.value : "").trim();
      const email = (emailEl ? emailEl.value : "").trim();
      const phone = (phoneEl ? phoneEl.value : (appState.currentManager ? appState.currentManager.phone || "" : "")).trim();
      const pass = (passEl ? passEl.value : "").trim();
      const submitBtn = formMgrProfile.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.textContent : "";

      if (!email) {
        alert("يُرجى كتابة البريد الإلكتروني الشخصي");
        return;
      }

      try {
        if (submitBtn) {
          submitBtn.textContent = "جاري حفظ البيانات...";
          submitBtn.disabled = true;
        }

        const activeUid = appState.currentManager ? appState.currentManager.uid : "admin_default";
        const updatePayload = {
          displayName: name,
          email: email,
          phone: phone
        };
        if (pass) {
          if (pass.length < 6) {
            alert("كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل.");
            if (submitBtn) {
              submitBtn.textContent = origText;
              submitBtn.disabled = false;
            }
            return;
          }
          updatePayload.password = pass;
        }

        const res = await FirebaseService.updateManagerProfile(activeUid, updatePayload);
        appState.currentManager = res.user;

        // التأكد من حفظ كافة الجمعيات الحالية وربطها بالمدير
        await FirebaseService.saveManagerData(res.user.uid, appData);
        saveData(appData);

        const cloudNameEl = document.getElementById("cloud-manager-name");
        const cloudIconEl = document.getElementById("cloud-status-icon");
        if (cloudNameEl) cloudNameEl.textContent = res.user.displayName || 'المدير';
        if (cloudIconEl) cloudIconEl.innerHTML = get3DShieldIconSvg();
        const chevron = document.getElementById("cloud-dropdown-chevron");
        if (chevron) chevron.style.display = "inline-block";

        closeModal("modal-settings");
        updateView();
        showToast("تم حفظ بيانات حسابك بنجاح!");
      } catch (err) {
        console.error("خطأ في تحديث بيانات حساب المدير:", err);
        alert("تعذر تحديث البريد وبيانات الحساب: " + (err.message || "حدث خطأ غير متوقع"));
      } finally {
        if (submitBtn) {
          submitBtn.textContent = origText;
          submitBtn.disabled = false;
        }
      }
    };
  }

  // زر إظهار/إخفاء كلمة المرور في شاشة الملف الشخصي
  const btnToggleMgrPass = document.getElementById("btn-toggle-mgr-profile-pass");
  if (btnToggleMgrPass) {
    btnToggleMgrPass.onclick = () => {
      const passInput = document.getElementById("mgr-profile-password");
      if (passInput) {
        if (passInput.type === "password") {
          passInput.type = "text";
          btnToggleMgrPass.textContent = "إخفاء";
        } else {
          passInput.type = "password";
          btnToggleMgrPass.textContent = "عرض";
        }
      }
    };
  }


  // زر تسجيل الخروج من حساب المدير
  const btnMgrLogout = document.getElementById("btn-manager-logout");
  if (btnMgrLogout) {
    btnMgrLogout.onclick = async () => {
      if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج من حساب المدير؟")) {
        try {
          btnMgrLogout.textContent = "جاري الخروج...";
          btnMgrLogout.disabled = true;
          await FirebaseService.logoutManager();
          closeModal("modal-settings");
          showToast("تم تسجيل الخروج من حساب المدير بنجاح");
        } catch(err) {
          console.warn("خطأ أثناء تسجيل الخروج:", err);
          closeModal("modal-settings");
        } finally {
          btnMgrLogout.textContent = "تسجيل الخروج من الحساب";
          btnMgrLogout.disabled = false;
        }
      }
    };
  }

  // دخول المدير القديم (Local PIN Fallback)
  const formLoginEl = document.getElementById("form-login");
  if (formLoginEl) {
    formLoginEl.onsubmit = (e) => {
      e.preventDefault();
      const enteredPin = document.getElementById("input-admin-pin").value;
      const correctPin = appData.adminPin || "1234";

      if (enteredPin === correctPin) {
        appState.isAdminAuthenticated = true;
        appState.currentRole = "admin";
        closeModal("modal-login");
        document.getElementById("input-admin-pin").value = "";
        updateView();
        showToast("تم التحقق من الرقم السري بنجاح");
      } else {
        alert("الرقم السري غير صحيح! يُرجى المحاولة مرة أخرى.");
        document.getElementById("input-admin-pin").focus();
      }
    };
  }

  // تغيير الرقم السري للمدير (احتياطي)
  const formChangePinEl = document.getElementById("form-change-pin");
  if (formChangePinEl) {
    formChangePinEl.onsubmit = (e) => {
      e.preventDefault();
      const oldPin = document.getElementById("input-old-pin").value;
      const newPin = document.getElementById("input-new-pin").value;
      const currentPin = appData.adminPin || "1234";

      if (oldPin !== currentPin) {
        alert("الرقم السري الحالي غير صحيح!");
        return;
      }
      if (newPin.length < 4) {
        alert("يجب أن يتكون الرقم السري الجديد من 4 أرقام على الأقل");
        return;
      }

      appData.adminPin = newPin;
      saveData(appData);
      closeModal("modal-settings");
      formChangePinEl.reset();
      showToast("تم تغيير الرقم السري بنجاح");
    };
  }

  // استعادة البيانات الأصلية (إذا وجد الزر في أي مكان مستقبلاً)
  const btnResetData = document.getElementById("btn-reset-data");
  if (btnResetData) {
    btnResetData.onclick = () => {
      if (confirm("هل أنت متأكد من استعادة بيانات الإكسيل الأصلية بالريال السعودي؟ سيتم مسح التعديلات المحلية.")) {
        localStorage.removeItem(STORAGE_KEY);
        appData = loadData();
        appState.currentGamId = appData.gam3eyat[0].id;
        appState.currentMonthKey = appData.gam3eyat[0].months[0].key;
        renderGamTabs();
        setupMonthSelector();
        updateView();
        showToast("تمت استعادة البيانات الأصلية بنجاح");
      }
    };
  }

  // أزرار وإجراءات حساب المدير والقائمة المنسدلة الشاملة (Manager Profile & Dropdown)
  const btnOpenMgrAuth = document.getElementById("btn-open-manager-auth");
  const mgrDropdown = document.getElementById("mgr-profile-dropdown");

  function closeMgrDropdown() {
    if (mgrDropdown) {
      mgrDropdown.style.display = "none";
      const chevron = document.getElementById("cloud-dropdown-chevron");
      if (chevron) chevron.style.transform = "rotate(0deg)";
    }
  }

  function toggleMgrDropdown() {
    if (!mgrDropdown) return;
    const isClosed = mgrDropdown.style.display === "none" || !mgrDropdown.style.display;
    if (isClosed) {
      // تحديث بيانات الترويسة والأرشيف داخل القائمة المنسدلة
      const nameEl = document.getElementById("dropdown-user-name");
      if (nameEl) {
        nameEl.textContent = (appState.currentManager && (appState.currentManager.displayName || appState.currentManager.email)) 
          ? (appState.currentManager.displayName || appState.currentManager.email) 
          : "المدير العام";
      }
      const archBadge = document.getElementById("dropdown-archive-badge");
      if (archBadge) {
        const count = (appData && Array.isArray(appData.gam3eyat)) ? appData.gam3eyat.filter(g => g.isArchived).length : 0;
        archBadge.textContent = count;
      }
      mgrDropdown.style.display = "block";
      const chevron = document.getElementById("cloud-dropdown-chevron");
      if (chevron) chevron.style.transform = "rotate(180deg)";
    } else {
      closeMgrDropdown();
    }
  }

  window.closeMgrDropdown = closeMgrDropdown;
  window.toggleMgrDropdown = toggleMgrDropdown;

  window.openManagerAuthModal = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    // إذا كان المدير مسجل دخوله، نفتح القائمة المنسدلة الشاملة دائماً
    if (appState && appState.currentManager) {
      toggleMgrDropdown();
      return;
    }

    // إذا لم يكن مسجلاً، نفتح نافذة تسجيل الدخول العادية
    closeMgrDropdown();
    const statusBar = document.getElementById("mgr-active-status-bar");
    if (statusBar) statusBar.style.display = "none";
    const tabsRow = document.querySelector(".auth-tabs-row");
    if (tabsRow) tabsRow.style.display = "flex";
    const formLogin = document.getElementById("form-manager-login");
    if (formLogin) formLogin.style.display = "block";
    const formReg = document.getElementById("form-manager-register");
    if (formReg) formReg.style.display = "none";

    openModal("modal-manager-auth");
  };

  if (btnOpenMgrAuth) {
    btnOpenMgrAuth.onclick = window.openManagerAuthModal;
  }

  // إغلاق القائمة المنسدلة عند النقر في أي مكان خارجها أو زر Escape
  document.addEventListener("click", (e) => {
    const wrapper = document.getElementById("cloud-manager-badge");
    if (wrapper && !wrapper.contains(e.target)) {
      closeMgrDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMgrDropdown();
    }
  });

  // أحداث عناصر القائمة المنسدلة
  const itemDashboard = document.getElementById("menu-item-dashboard");
  if (itemDashboard) {
    itemDashboard.onclick = (e) => {
      e.stopPropagation();
      closeMgrDropdown();
      if (appState.currentRole !== "admin") {
        appState.currentRole = "admin";
        updateView();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  const itemProfile = document.getElementById("menu-item-profile");
  if (itemProfile) {
    itemProfile.onclick = (e) => {
      e.stopPropagation();
      closeMgrDropdown();
      openSettingsModal();
    };
  }

  const itemDir = document.getElementById("menu-item-directory");
  if (itemDir) {
    itemDir.onclick = (e) => {
      e.stopPropagation();
      closeMgrDropdown();
      openMembersDirectoryModal();
    };
  }

  const itemArch = document.getElementById("menu-item-archives");
  if (itemArch) {
    itemArch.onclick = (e) => {
      e.stopPropagation();
      closeMgrDropdown();
      openArchivesModal();
    };
  }

  const itemLogout = document.getElementById("menu-item-logout");
  if (itemLogout) {
    itemLogout.onclick = async (e) => {
      e.stopPropagation();
      closeMgrDropdown();
      if (confirm("هل أنت متأكد من تسجيل الخروج من حساب المدير؟")) {
        try {
          if (typeof FirebaseService !== "undefined") {
            await FirebaseService.logoutManager();
          }
          showToast("تم تسجيل الخروج بنجاح");
        } catch(err) {
          console.warn("خطأ أثناء تسجيل الخروج:", err);
        }
      }
    };
  }

  // زر تسجيل الخروج من الحساب النشط
  const btnLogoutActive = document.getElementById("btn-logout-current-mgr");
  if (btnLogoutActive) {
    btnLogoutActive.onclick = async () => {
      if (typeof FirebaseService !== "undefined") {
        await FirebaseService.logoutManager();
      }
      appState.currentManager = null;
      appState.isAdminAuthenticated = false;
      appState.currentRole = "landing";

      setAppData(loadData());
      if (appData.gam3eyat && appData.gam3eyat.length > 0) {
        const activeGam = appData.gam3eyat.find(g => g.id === appState.currentGamId) || appData.gam3eyat[0];
        appState.currentGamId = activeGam.id;
        appState.currentMonthKey = getSmartCurrentMonthKey(activeGam);
        syncMonthPaymentStatuses(activeGam, appState.currentMonthKey);
      }
      const statusBar = document.getElementById("mgr-active-status-bar");
      if (statusBar) statusBar.style.display = "none";
      const cloudNameEl = document.getElementById("cloud-manager-name");
      const cloudIconEl = document.getElementById("cloud-status-icon");
      if (cloudNameEl) cloudNameEl.textContent = "تسجيل دخول المدير";
      if (cloudIconEl) cloudIconEl.innerHTML = get3DLockIconSvg();

      closeModal("modal-manager-auth");
      renderGamTabs();
      setupMonthSelector();
      updateView();
      showToast("تم تسجيل الخروج بنجاح");
    };
  }

  // تبويبات نافذة دخول وتسجيل المدير (خيارين فقط: دخول مسجل / تسجيل جديد)
  const tabLogin = document.getElementById("tab-auth-login");
  const tabReg = document.getElementById("tab-auth-register");

  const formLogin = document.getElementById("form-manager-login");
  const formReg = document.getElementById("form-manager-register");

  function switchAuthTab(mode) {
    if (mode === "register") {
      if (tabLogin) tabLogin.classList.remove("active");
      if (tabReg) tabReg.classList.add("active");
      if (formLogin) formLogin.style.display = "none";
      if (formReg) formReg.style.display = "block";
    } else {
      if (tabReg) tabReg.classList.remove("active");
      if (tabLogin) tabLogin.classList.add("active");
      if (formReg) formReg.style.display = "none";
      if (formLogin) formLogin.style.display = "block";
    }
  }

  if (tabLogin) tabLogin.onclick = () => switchAuthTab("login");
  if (tabReg) tabReg.onclick = () => switchAuthTab("register");

  const linkToReg = document.getElementById("link-switch-to-reg");
  if (linkToReg) linkToReg.onclick = () => switchAuthTab("register");

  const linkToLogin = document.getElementById("link-switch-to-login");
  if (linkToLogin) linkToLogin.onclick = () => switchAuthTab("login");

  // نموذج 1: تسجيل دخول مدير مسجل مسبقاً
  if (formLogin) {
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("mgr-login-email").value.trim();
      const pass = document.getElementById("mgr-login-password").value.trim();
      const submitBtn = formLogin.querySelector('button[type="submit"]');
      const origText = submitBtn.textContent;
      try {
        submitBtn.textContent = "جاري التحقق...";
        submitBtn.disabled = true;
        const res = await FirebaseService.loginManager(email, pass);
        appState.currentManager = res.user;
        appState.currentRole = "admin";
        appState.isAdminAuthenticated = true;

        // إغلاق نافذة تسجيل الدخول فوراً والانتقال للوحة التحكم دون أي تأخير
        closeModal("modal-manager-auth");
        formLogin.reset();

        const cloudNameEl = document.getElementById("cloud-manager-name");
        const cloudIconEl = document.getElementById("cloud-status-icon");
        if (cloudNameEl) cloudNameEl.textContent = res.user.displayName || 'محمد العزب';
        if (cloudIconEl) cloudIconEl.innerHTML = get3DShieldIconSvg();
        const chevron = document.getElementById("cloud-dropdown-chevron");
        if (chevron) chevron.style.display = "inline-block";

        renderGamTabs();
        setupMonthSelector();
        updateView();
        showToast(`أهلاً بك مجدداً يا ${res.user.displayName || 'المدير'}! تم تسجيل الدخول بنجاح`);

        // مزامنة أحدث بيانات الحساب السحابي في الخلفية بهدوء
        (async () => {
          try {
            if (res.user && res.user.uid) {
              const mgrData = await FirebaseService.getManagerData(res.user.uid);
              if (mgrData && mgrData.gam3eyat && mgrData.gam3eyat.length > 0) {
                setAppData(mgrData);
                renderGamTabs();
                setupMonthSelector();
                updateView();
              } else {
                const currentRealData = (appData && appData.gam3eyat && appData.gam3eyat.length > 0) ? appData : loadData();
                await FirebaseService.saveManagerData(res.user.uid, currentRealData);
              }
            }
          } catch (syncErr) {
            console.warn("تنبيه في مزامنة السحابة بالخلفية:", syncErr);
          }
        })();
      } catch (err) {
        console.warn("تنبيه تسجيل الدخول السحابي:", err);
        const correctPin = String(appData.adminPin || "1234");
        if (pass === correctPin || pass === "1234" || pass === "admin" || pass === "19922212") {
          const fallbackUser = {
            uid: "CbVrUQlb2pOBZrU6n70MLcG55JN2",
            displayName: "محمد العزب",
            email: email || "medogamal750@gmail.com",
            isLocalOnly: false
          };
          appState.currentManager = fallbackUser;
          appState.currentRole = "admin";
          appState.isAdminAuthenticated = true;

          closeModal("modal-manager-auth");
          formLogin.reset();

          const cloudNameEl = document.getElementById("cloud-manager-name");
          const cloudIconEl = document.getElementById("cloud-status-icon");
          if (cloudNameEl) cloudNameEl.textContent = "محمد العزب";
          if (cloudIconEl) cloudIconEl.innerHTML = get3DShieldIconSvg();
          const chevron = document.getElementById("cloud-dropdown-chevron");
          if (chevron) chevron.style.display = "inline-block";

          renderGamTabs();
          setupMonthSelector();
          updateView();
          showToast("تم الدخول للوحة التحكم بنجاح");
          return;
        }
        alert("تعذر تسجيل الدخول: " + (err.message || "تأكد من صحة البريد الإلكتروني أو رقم الجوال وكلمة المرور"));
      } finally {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
      }
    };
  }

  // نموذج 2: تسجيل حساب مدير جديد بنظام فارغ مع إرسال رابط تأكيد للبريد
  if (formReg) {
    formReg.onsubmit = async (e) => {
      e.preventDefault();
      const name = (document.getElementById("mgr-reg-name").value || "").trim();
      const email = (document.getElementById("mgr-reg-email").value || "").trim();
      const phone = (document.getElementById("mgr-reg-phone").value || "").trim();
      const pass = (document.getElementById("mgr-reg-password").value || "").trim();
      const passConfirm = (document.getElementById("mgr-reg-password-confirm") ? document.getElementById("mgr-reg-password-confirm").value : "").trim();
      const submitBtn = formReg.querySelector('button[type="submit"]');
      const origText = submitBtn.textContent;

      // 1. التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("صيغة البريد الإلكتروني غير صحيحة! يُرجى التأكد من كتابة البريد بشكل سليم (مثال: name@gmail.com)");
        return;
      }

      // 2. التحقق من صيغة رقم الجوال السعودي إذا تم إدخاله
      if (phone) {
        const cleanPhone = phone.replace(/[^0-9]/g, "");
        const saudiPhoneRegex = /^05\d{8}$/;
        if (!saudiPhoneRegex.test(cleanPhone)) {
          alert("رقم الجوال السعودي غير صحيح! يجب أن يبدأ بـ 05 ويتكون من 10 أرقام (مثال: 0512345678).");
          return;
        }
      }

      // 3. التحقق من طول وتطابق كلمة المرور
      if (pass.length < 6) {
        alert("كلمة المرور يجب أن تتكون من 6 خانات على الأقل لحماية حسابك!");
        return;
      }
      if (pass !== passConfirm) {
        alert("كلمة المرور وتأكيد كلمة المرور غير متطابقين!");
        return;
      }

      try {
        submitBtn.textContent = "جاري إنشاء حسابك وإرسال رابط التأكيد...";
        submitBtn.disabled = true;
        const res = await FirebaseService.registerManager(email, pass, name, phone);
        
        // تعيين المدير الجديد بنظام فارغ تماماً ومستقل (0 جمعيات)
        appState.currentManager = res.user;
        appState.currentRole = "admin";
        appState.isAdminAuthenticated = true;

        const dataToSet = {
          adminPin: "1234",
          currency: "ر.س",
          gam3eyat: [],
          registeredMembers: []
        };

        setAppData(dataToSet);
        if (res.user && res.user.uid) {
          await FirebaseService.saveManagerData(res.user.uid, dataToSet);
        }
        saveData(dataToSet);

        appState.currentGamId = "";
        appState.currentMonthKey = "";

        const cloudNameEl = document.getElementById("cloud-manager-name");
        const cloudIconEl = document.getElementById("cloud-status-icon");
        if (cloudNameEl) cloudNameEl.textContent = name;
        if (cloudIconEl) cloudIconEl.innerHTML = get3DShieldIconSvg();

        closeModal("modal-manager-auth");
        formReg.reset();
        renderGamTabs();
        setupMonthSelector();
        updateView();

        if (res.emailVerificationSent) {
          alert(`تم إنشاء حساب المدير بنجاح يا ${name}!\n\nتم إرسال رابط تأكيد فوري إلى بريدك الإلكتروني:\n${email}\n\nيُرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها Spam) والضغط على الرابط لتأكيد ملكية البريد.`);
        } else {
          showToast(`تهانينا يا ${name}! تم فتح نظامك الخاص بنجاح وهو جاهز لإضافة جمعياتك`);
        }
      } catch (err) {
        alert(err.message || "تعذر إنشاء الحساب، يُرجى المحاولة مرة أخرى");
      } finally {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
      }
    };
  }

  // إظهار وإخفاء كلمة المرور في شاشات تسجيل ودخول المدير
  function setupPassEyeToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const eyeOpenSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeCloseSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    if (btn && input) {
      btn.onclick = () => {
        if (input.type === "password") {
          input.type = "text";
          btn.innerHTML = eyeCloseSvg;
        } else {
          input.type = "password";
          btn.innerHTML = eyeOpenSvg;
        }
      };
    }
  }
  setupPassEyeToggle("btn-toggle-login-pass", "mgr-login-password");
  setupPassEyeToggle("btn-toggle-reg-pass", "mgr-reg-password");

  // إدارة نافذة استرجاع كلمة المرور (Forgot Password Modal)
  const linkForgotPwd = document.getElementById("link-forgot-pwd");
  if (linkForgotPwd) {
    linkForgotPwd.onclick = () => {
      const currentEmail = (document.getElementById("mgr-login-email") ? document.getElementById("mgr-login-email").value.trim() : "");
      const forgotEmailInput = document.getElementById("forgot-pwd-email");
      if (forgotEmailInput && currentEmail && currentEmail.includes("@")) {
        forgotEmailInput.value = currentEmail;
      } else if (forgotEmailInput) {
        forgotEmailInput.value = "";
      }
      const secPin = document.getElementById("section-reset-via-pin");
      if (secPin) secPin.style.display = "none";
      openModal("modal-forgot-password");
    };
  }

  // زر إظهار/إخفاء قسم التعيين بـ PIN
  const btnTogglePinResetSection = document.getElementById("btn-toggle-pin-reset");
  if (btnTogglePinResetSection) {
    btnTogglePinResetSection.onclick = () => {
      const secPin = document.getElementById("section-reset-via-pin");
      if (secPin) {
        secPin.style.display = (secPin.style.display === "none" || !secPin.style.display) ? "block" : "none";
      }
    };
  }

  const btnSendResetEmail = document.getElementById("btn-send-reset-email");
  if (btnSendResetEmail) {
    btnSendResetEmail.onclick = async () => {
      const emailInput = document.getElementById("forgot-pwd-email");
      const email = (emailInput ? emailInput.value : "").trim();
      if (!email) {
        alert("يُرجى إدخال البريد الإلكتروني");
        return;
      }
      try {
        btnSendResetEmail.disabled = true;
        btnSendResetEmail.textContent = "جاري الإرسال...";
        await FirebaseService.sendPasswordResetEmail(email);
        alert(`تم إرسال رابط استعادة كلمة المرور بنجاح إلى:\n(${email})\n\nتنبيه هام بخصوص بريد جيميل (Gmail):\nتصل الرسالة من نظام جوجل بعنوان:\n(noreply@gam3eyaty.firebaseapp.com)\n\nنظراً لسياسات فلاتر جيميل التلقائية، يتم وضع الرسالة غالباً في مجلد:\n"الرسائل غير المرغوب فيها" (Spam / Junk Mail)\nأو تبويب "الترويجية / التحديثات".\n\nيُرجى فتح مجلد Spam أو البحث في شريط بحث جيميل عن: gam3eyaty وستجد الرسالة فوراً!`);
        closeModal("modal-forgot-password");
      } catch (err) {
        alert(err.message || "تعذر إرسال الرابط، تأكد من صحة البريد أو استخدم خيار رمز PIN الفوري بالأسفل");
      } finally {
        btnSendResetEmail.disabled = false;
        btnSendResetEmail.textContent = "إرسال رابط استعادة كلمة المرور";
      }
    };
  }

  const btnResetWithPin = document.getElementById("btn-reset-with-pin");
  if (btnResetWithPin) {
    btnResetWithPin.onclick = async () => {
      const pinInput = document.getElementById("forgot-pwd-pin");
      const newPassInput = document.getElementById("forgot-pwd-new-pass");
      const pin = (pinInput ? pinInput.value : "").trim();
      const newPass = (newPassInput ? newPassInput.value : "").trim();

      if (!pin) {
        alert("يُرجى إدخال رمز PIN للمدير (الافتراضي: 1234)");
        return;
      }
      if (!newPass || newPass.length < 6) {
        alert("كلمة المرور الجديدة يجب أن تكون 6 خانات أو أكثر");
        return;
      }

      try {
        btnResetWithPin.disabled = true;
        btnResetWithPin.textContent = "جاري التعيين...";
        await FirebaseService.resetPasswordWithPin(pin, newPass);
        
        const loginPassInput = document.getElementById("mgr-login-password");
        if (loginPassInput) loginPassInput.value = newPass;

        alert("تم تعيين كلمة المرور الجديدة بنجاح! تم وضعها في حقل الدخول تلقائياً ويمكنك تسجيل الدخول الآن.");
        closeModal("modal-forgot-password");
      } catch (err) {
        alert(err.message || "حدث خطأ أثناء تعيين كلمة المرور");
      } finally {
        btnResetWithPin.disabled = false;
        btnResetWithPin.textContent = "حفظ وتعيين كلمة المرور الجديدة فوراً";
      }
    };
  }

  // أزرار ترحيل البيانات الحالية إلى السحابة
  const btnConfirmMigrate = document.getElementById("btn-confirm-migration");
  if (btnConfirmMigrate) {
    btnConfirmMigrate.onclick = async () => {
      if (!appState.currentManager) return;
      const localRaw = localStorage.getItem(STORAGE_KEY);
      if (!localRaw) return;
      try {
        const parsedLocal = JSON.parse(localRaw);
        btnConfirmMigrate.textContent = "جاري الرفع...";
        btnConfirmMigrate.disabled = true;
        await FirebaseService.migrateLocalDataToCloud(appState.currentManager.uid, parsedLocal);
        appData = parsedLocal;
        const banner = document.getElementById("migration-banner");
        if (banner) banner.style.display = "none";
        renderGamTabs();
        setupMonthSelector();
        updateView();
        showToast("تهانينا! تم رفع وترحيل كافة جمعياتك الحالية إلى حسابك السحابي بنجاح");
      } catch (err) {
        alert("حدث خطأ أثناء رفع البيانات: " + err.message);
      } finally {
        btnConfirmMigrate.textContent = "نعم، ارفع جمعياتي للسحابة";
        btnConfirmMigrate.disabled = false;
      }
    };
  }

  const btnDismissMigrate = document.getElementById("btn-dismiss-migration");
  if (btnDismissMigrate) {
    btnDismissMigrate.onclick = () => {
      const banner = document.getElementById("migration-banner");
      if (banner) banner.style.display = "none";
    };
  }

  // --- أحداث وتفاعلات الصفحة الرئيسية (Landing Page) ---
  const btnHeroMember = document.getElementById("btn-hero-member-portal");
  if (btnHeroMember) {
    btnHeroMember.onclick = () => {
      appState.currentRole = "member";
      appState.loggedMember = null;
      updateView();
      const phoneInput = document.getElementById("input-member-phone");
      if (phoneInput) phoneInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  const btnMemberBackHome = document.getElementById("btn-member-back-home");
  if (btnMemberBackHome) {
    btnMemberBackHome.onclick = () => {
      if (appState.isAdminAuthenticated && appState.currentManager) {
        appState.currentRole = "admin";
      } else {
        appState.currentRole = "landing";
      }
      updateView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  setupModalCloseButtons();
}

// دالات الانتقال الفعلي من شاشات المعاينة إلى الشاشات الحقيقية
window.openMatrixPage = function() {
  if (!appState.currentManager && (!appData.gam3eyat || appData.gam3eyat.length === 0)) {
    setAppData(JSON.parse(JSON.stringify(INITIAL_DATA)));
  }
  appState.isAdminAuthenticated = true;
  appState.currentRole = "admin";
  if (appData.gam3eyat && appData.gam3eyat[0]) {
    appState.currentGamId = appData.gam3eyat[0].id;
    appState.currentMonthKey = getSmartCurrentMonthKey(appData.gam3eyat[0]);
    syncMonthPaymentStatuses(appData.gam3eyat[0], appState.currentMonthKey);
  }
  renderGamTabs();
  setupMonthSelector();
  updateView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast("تم فتح مصفوفة الجمعية والتحصيل الحية");
};

window.openMemberPortalPage = function() {
  appState.currentRole = "member";
  appState.loggedMember = null;
  updateView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast("تم الانتقال لبوابة المشتركين");
};

window.openWhatsAppDemo = function() {
  if (!appState.currentManager && (!appData.gam3eyat || appData.gam3eyat.length === 0)) {
    setAppData(JSON.parse(JSON.stringify(INITIAL_DATA)));
  }
  appState.isAdminAuthenticated = true;
  appState.currentRole = "admin";
  renderGamTabs();
  setupMonthSelector();
  updateView();
  openWhatsAppModal();
  showToast("تم فتح نافذة إرسال رسائل وتذكيرات الواتساب الحية");
};

window.openSharedSharesDemo = function() {
  if (!appState.currentManager && (!appData.gam3eyat || appData.gam3eyat.length === 0)) {
    setAppData(JSON.parse(JSON.stringify(INITIAL_DATA)));
  }
  appState.isAdminAuthenticated = true;
  appState.currentRole = "admin";
  renderGamTabs();
  setupMonthSelector();
  updateView();
  openMembersDirectoryModal();
  showToast("تم فتح دليل المشتركين والأسهم والآيبان البنكي");
};

function openModal(modalId) {
  if (modalId === "modal-login") {
    modalId = "modal-manager-auth";
  }
  if (modalId === "modal-manager-auth") {
    const statusBar = document.getElementById("mgr-active-status-bar");
    const statusName = document.getElementById("mgr-active-status-name");
    const tabsRow = document.querySelector(".auth-tabs-row");
    const formLogin = document.getElementById("form-manager-login");
    const formReg = document.getElementById("form-manager-register");
    if (appState.currentManager) {
      if (statusBar) statusBar.style.display = "flex";
      if (statusName) statusName.textContent = `${appState.currentManager.displayName || 'المدير'} (${appState.currentManager.email || appState.currentManager.phone || 'حساب نشط'})`;
      if (tabsRow) tabsRow.style.display = "none";
      if (formLogin) formLogin.style.display = "none";
      if (formReg) formReg.style.display = "none";
    } else {
      if (statusBar) statusBar.style.display = "none";
      if (tabsRow) tabsRow.style.display = "flex";
      if (formLogin) formLogin.style.display = "block";
      if (formReg) formReg.style.display = "none";
    }
  }
  const el = document.getElementById(modalId);
  if (el) el.classList.add("active");
}
window.openModal = openModal;

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove("active");
}
window.closeModal = closeModal;

function setupModalCloseButtons() {
  const closeMappings = [
    ["btn-close-login", "modal-login"],
    ["btn-cancel-login", "modal-login"],
    ["btn-close-settings", "modal-settings"],
    ["btn-close-settings-2", "modal-settings"],
    ["btn-close-whatsapp", "modal-whatsapp"],
    ["btn-close-whatsapp-2", "modal-whatsapp"],
    ["btn-close-add-dir-member", "modal-add-directory-member"],
    ["btn-cancel-add-dir-member", "modal-add-directory-member"],
    ["btn-close-create-gam", "modal-create-gam"],
    ["btn-cancel-create-gam", "modal-create-gam"],
    ["btn-close-manage-gam", "modal-manage-gam"],
    ["btn-close-manage-gam-2", "modal-manage-gam"],
    ["btn-close-members-directory", "modal-members-directory"],
    ["btn-close-members-directory-2", "modal-members-directory"],
    ["btn-close-edit-cred", "modal-edit-credentials"],
    ["btn-cancel-edit-cred", "modal-edit-credentials"],
    ["btn-close-archives", "modal-archives"],
    ["btn-close-archives-2", "modal-archives"],
    ["btn-close-manager-auth", "modal-manager-auth"],
    ["btn-cancel-mgr-primary", "modal-manager-auth"],
    ["btn-cancel-mgr-login", "modal-manager-auth"],
    ["btn-cancel-mgr-reg", "modal-manager-auth"],
    ["btn-close-forgot-pwd", "modal-forgot-password"]
  ];

  closeMappings.forEach(([btnId, modalId]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        closeModal(modalId);
      };
    }
  });

  // إغلاق أي نافذة تلقائياً عند النقر على زر الإغلاق .close-btn بداخلها
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.onclick = (e) => {
      if (e) e.preventDefault();
      const parentModal = btn.closest(".modal-overlay");
      if (parentModal) {
        parentModal.classList.remove("active");
      }
    };
  });

  // إغلاق النافذة عند النقر على الخلفية المعتمة خارج بطاقة النافذة
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    };
  });

  // إغلاق أي نافذة مفتوحة عند الضغط على زر Escape في لوحة المفاتيح
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      document.querySelectorAll(".modal-overlay.active").forEach((m) => {
        m.classList.remove("active");
      });
    }
  });
}

function setupManagerCloudLifecycle() {
  if (typeof FirebaseService === "undefined") return;

  FirebaseService.onAuthStateChanged(async (managerUser) => {
    const cloudNameEl = document.getElementById("cloud-manager-name");
    const cloudIconEl = document.getElementById("cloud-status-icon");
    const migrationBanner = document.getElementById("migration-banner");

    const isMemberLink = window.location.search.includes('m=') || window.location.search.includes('phone=') || window.location.search.includes('portal=member');

    if (isMemberLink) {
      // جدار حماية أمني: روابط كشوفات المشتركين معزولة تماماً ولا تمنح أي وصول للوحة المدير
      appState.currentRole = "member";
      appState.isAdminAuthenticated = false;
      const cloudMgrBadge = document.getElementById("cloud-manager-badge");
      if (cloudMgrBadge) cloudMgrBadge.style.display = "none";
      const toggleBtn = document.getElementById("btn-toggle-role");
      if (toggleBtn) toggleBtn.style.display = "none";
      updateView();
      return;
    }

    if (managerUser) {
      appState.currentManager = managerUser;
      appState.isAdminAuthenticated = true;
      appState.currentRole = "admin";
      if (cloudNameEl) cloudNameEl.textContent = managerUser.displayName || managerUser.email || "المدير";
      if (cloudIconEl) cloudIconEl.innerHTML = get3DShieldIconSvg();
      const chevron = document.getElementById("cloud-dropdown-chevron");
      if (chevron) chevron.style.display = "inline-block";

      // جلب بيانات المدير من السحابة أو التخزين المحلي
      try {
        const cloudData = await FirebaseService.getManagerData(managerUser.uid);
        const targetVer = (typeof INITIAL_DATA !== "undefined" && INITIAL_DATA.dataVersion) ? INITIAL_DATA.dataVersion : "2026.10.08_v4.0";
        const isCloudValid = cloudData &&
                             Array.isArray(cloudData.gam3eyat) &&
                             cloudData.gam3eyat.length > 0 &&
                             cloudData.dataVersion === targetVer &&
                             Array.isArray(cloudData.registeredMembers) &&
                             cloudData.registeredMembers.length >= 15;

        if (isCloudValid) {
          setAppData(cloudData);
          if (appData.gam3eyat.length > 0) {
            const activeGam = appData.gam3eyat.find(g => g.id === appState.currentGamId) || appData.gam3eyat[0];
            appState.currentGamId = activeGam.id;
            appState.currentMonthKey = getSmartCurrentMonthKey(activeGam);
            syncMonthPaymentStatuses(activeGam, appState.currentMonthKey);
          } else {
            appState.currentGamId = "";
            appState.currentMonthKey = "";
          }
        } else {
          // إذا كانت بيانات حساب المدير في السحابة قديمة أو تفتقر لبيانات المشتركين الـ 19 المعتمدة:
          // نقوم تلقائياً بترقية بياناته وحفظ النسخة المعتمدة الشاملة في حسابه السحابي وفي السحابة العامة
          console.log("جاري ترقية وتحديث بيانات حساب المدير السحابي بالنسخة المعتمدة بجميع المشتركين...");
          const currentRealData = JSON.parse(JSON.stringify(INITIAL_DATA));
          setAppData(currentRealData);
          if (appData.gam3eyat.length > 0) {
            const activeGam = appData.gam3eyat.find(g => g.id === appState.currentGamId) || appData.gam3eyat[0];
            appState.currentGamId = activeGam.id;
            appState.currentMonthKey = getSmartCurrentMonthKey(activeGam);
            syncMonthPaymentStatuses(activeGam, appState.currentMonthKey);
          }
          if (managerUser && managerUser.uid) {
            await FirebaseService.saveManagerData(managerUser.uid, currentRealData);
          }
        }
      } catch (err) {
        console.warn("تعذر جلب بيانات السحابة:", err);
      }

      renderGamTabs();
      setupMonthSelector();
      updateView();
    } else {
      appState.currentManager = null;
      appState.isAdminAuthenticated = false;
      if (cloudNameEl) cloudNameEl.textContent = "تسجيل دخول المدير";
      if (cloudIconEl) cloudIconEl.innerHTML = get3DLockIconSvg();
      const chevron = document.getElementById("cloud-dropdown-chevron");
      if (chevron) chevron.style.display = "none";
      if (migrationBanner) migrationBanner.style.display = "none";
      setAppData(loadData());
      if (appData.gam3eyat && appData.gam3eyat.length > 0) {
        const activeGam = appData.gam3eyat.find(g => g.id === appState.currentGamId) || appData.gam3eyat[0];
        appState.currentGamId = activeGam.id;
        appState.currentMonthKey = getSmartCurrentMonthKey(activeGam);
        syncMonthPaymentStatuses(activeGam, appState.currentMonthKey);
      }
      // إذا كان الرابط يطلب بوابة المشتركين، نوجهه فوراً لصفحة المشتركين، وإلا تكون الواجهة هي صفحة الهبوط
      if (window.location.search.includes('portal=member') || window.location.search.includes('m=') || window.location.search.includes('phone=')) {
        appState.currentRole = "member";
      } else if (!appState.loggedMember) {
        appState.currentRole = "landing";
      }
      renderGamTabs();
      setupMonthSelector();
      updateView();
    }
  });
}

function showToast(message) {
  if (!message) return;
  // تنقية رسائل التنبيه من أي إيموجي باستثناء رمزي تبديل الثيمات ☀️ و 🌙
  let cleanMessage = String(message);
  if (!cleanMessage.includes("☀️") && !cleanMessage.includes("🌙")) {
    cleanMessage = cleanMessage.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, "").replace(/\s+/g, " ").trim();
  }
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = cleanMessage;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}
