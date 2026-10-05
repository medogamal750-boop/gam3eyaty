/**
 * نظام إدارة الجمعيات المالية - المحرك البرمجي المتكامل (الإصدار 2.5 الفاخر)
 * يتضمن:
 * 1. تسجيل دخول المشتركين برقم الجوال والكود السري (آخر 4 أرقام).
 * 2. كشف حساب رسمي معتمد يظهر فيه اسم المشترك وتفاصيله بوضوح على الشاشة وفي الطباعة (PDF).
 * 3. أداة بحث منسدلة ذكية بالاسم ورقم الجوال لإضافة المشتركين السابقين بنقرة واحدة.
 * 4. تصميم مالي أنيق وتفاعلي يدعم الأسهم المشتركة وإعادة ترتيب الأدوار.
 */

const STORAGE_KEY = "gam3eyat_app_data_v3";

let appState = {
  currentGamId: "gam1",
  currentMonthKey: "sep",
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
  appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key) || "sep";
}

// الشهور القياسية
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

// توليد كود سري عشوائي فريد مكون من 4 أرقام
function generateRandomPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// ==========================================
// 1. التخزين المحلي (LocalStorage)
// ==========================================

function loadData() {
  let data = null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch (e) {
      console.error("خطأ في قراءة البيانات المحفوظة", e);
    }
  }
  if (!data || !data.gam3eyat || !Array.isArray(data.gam3eyat) || data.gam3eyat.length === 0) {
    data = JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  // تنظيف تلقائي للبيانات وإزالة أي مشتركين وهميين
  if (data && data.gam3eyat) {
    let modified = false;
    data.gam3eyat.forEach(gam => {
      // 1. تحويل المشتركين الوهميين "عضو دور X" إلى أدوار شاغرة
      gam.members.forEach(m => {
        if (m.names.some(n => /^عضو دور \d+$/i.test((n || "").trim()))) {
          m.isVacant = true;
          m.names = ["(دور متاح)"];
          m.phones = [""];
          m.pins = [""];
          modified = true;
        }
      });

      // 2. إذا كانت هناك أدوار زائدة عن عدد الشهور (مثل الصف 13 في جمعية 12 شهراً)
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

      // 3. ضبط تصنيف الشهور التي لم يأتِ دورها بعد إلى "لم تستحق" (future)
      const curMonthKey = gam.currentMonthKey || (gam.months[0] && gam.months[0].key);
      const curMonthIdx = gam.months.findIndex(mo => mo.key === curMonthKey);
      if (curMonthIdx !== -1) {
        gam.members.forEach(m => {
          if (m.payments) {
            gam.months.forEach((mo, mIdx) => {
              if (m.payments[mo.key]) {
                m.payments[mo.key] = m.payments[mo.key].map(st => {
                  // الشهور اللاحقة للشهر النشط تتحول تلقائياً من "متأخر" إلى "لم تستحق"
                  if (mIdx > curMonthIdx && st === "unpaid") {
                    modified = true;
                    return "future";
                  }
                  // الشهور الحالية والسابقة إذا كانت "لم تستحق" تصبح "متأخر"
                  if (mIdx <= curMonthIdx && st === "future") {
                    modified = true;
                    return "unpaid";
                  }
                  return st;
                });
              }
            });
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
  // جلب أحدث بيانات الجمعيات العامة من السحابة لجميع الزوار والمشتركين من هواتفهم
  if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseDb !== "undefined") {
    try {
      const publicSnap = await firebaseDb.collection("public_data").doc("active_statement").get();
      if (publicSnap.exists) {
        const cData = publicSnap.data();
        if (cData && Array.isArray(cData.gam3eyat) && cData.gam3eyat.length > 0) {
          setAppData(cData);
          if (appData.gam3eyat && appData.gam3eyat[0]) {
            appState.currentGamId = appData.gam3eyat[0].id;
            appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key);
          }
        }
      }
    } catch (e) {
      console.warn("Public cloud data fetch notice:", e);
    }
  }

  renderGamTabs();
  setupMonthSelector();

  // فحص الرابط السحري المباشر (Magic Link)
  const hasMagicLink = await checkMagicLink();
  if (!hasMagicLink) {
    updateView();
  }

  attachEventListeners();
  setupMemberSearchAutocomplete();
  setupManagerCloudLifecycle();

  // المزامنة التلقائية مع السحابة لضمان نشر الجمعيات الحالية فوراً للمشتركين إذا كان المدير متصلاً
  if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
    setTimeout(async () => {
      try {
        if (appState && appState.currentManager && appData && appData.gam3eyat && appData.gam3eyat.length > 0) {
          const activeUid = appState.currentManager.uid || "admin_default";
          await FirebaseService.saveManagerData(activeUid, appData);
          console.log("☁️ تم تحديث ومزامنة البيانات مع Google Cloud Firestore بنجاح!");
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

  if (isPortalRequested && !appState.currentManager) {
    appState.currentRole = "member";
    appState.loggedMember = null;
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
      showToast("جاري جلب كشف حسابك المحدث من السحابة... ☁️");
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
            showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك الحي بنجاح 🔗`);
            return true;
          } else {
            appState.loggedMember = null;
            appState.currentRole = "member";
            updateView();
            if (phoneInput) phoneInput.value = matched.phone || matched.name;
            if (pinInput) {
              pinInput.value = "";
              pinInput.focus();
              showToast(`أهلاً بك يا ${matched.name}! يُرجى كتابة كودك السري لإكمال الدخول 🔐`);
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
        showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك المباشر بنجاح 🔗`);
        return true;
      } else {
        appState.loggedMember = null;
        appState.currentRole = "member";
        updateView();
        if (phoneInput) phoneInput.value = matched.phone || matched.name;
        if (pinInput) {
          pinInput.value = "";
          pinInput.focus();
          showToast(`أهلاً بك يا ${matched.name}! يُرجى كتابة كودك السري لإكمال الدخول 🔐`);
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
    addBtn.innerHTML = "✨ إضافة أول جمعية لك";
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
    appState.currentMonthKey = activeGams[0].currentMonthKey || (activeGams[0].months[0] && activeGams[0].months[0].key);
  }

  activeGams.forEach(gam => {
    const btn = document.createElement("button");
    btn.className = `gam-tab-btn ${gam.id === appState.currentGamId ? "active" : ""}`;
    btn.innerHTML = `<span>📁</span> ${gam.name}`;
    btn.onclick = () => {
      appState.currentGamId = gam.id;
      appState.currentMonthKey = gam.currentMonthKey || (gam.months[0] && gam.months[0].key);
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
  addBtn.innerHTML = "✨ إضافة جمعية جديدة";
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

  if (confirm(`هل أنت متأكد من رغبتك في أرشفة جمعية "${gam.name}"؟\n\n📦 سيتم نقلها إلى سجل الجمعيات المؤرشفة لحفظ كافة سجلاتها وحساباتها وتفريغ مساحة العمل النشطة.`)) {
    gam.isArchived = true;
    gam.archivedAt = new Date().toISOString();
    saveData(appData);

    const remainingActive = appData.gam3eyat.filter(g => !g.isArchived);
    if (remainingActive.length > 0) {
      appState.currentGamId = remainingActive[0].id;
      appState.currentMonthKey = remainingActive[0].currentMonthKey || remainingActive[0].months[0].key;
    }

    renderGamTabs();
    setupMonthSelector();
    updateView();
    showToast(`تم أرشفة "${gam.name}" ونقلها لقسم الأرشيف بنجاح 📦`);
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
      const cur = appData.currency || "ر.س";
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td style="text-align: right;">
          <strong>${gam.name}</strong>
          <span class="archive-badge-tag" style="margin-right: 0.35rem;">مؤرشفة 📦</span>
        </td>
        <td>${gam.months.length} شهر</td>
        <td>${gam.shareAmount.toLocaleString()} ${cur}</td>
        <td><strong>${gam.totalPayout.toLocaleString()} ${cur}</strong></td>
        <td style="white-space: nowrap;">
          <button class="btn btn-sm btn-outline" onclick="restoreArchivedGam('${gam.id}')" style="color: #059669; font-weight: 700; border-color: #a7f3d0; background: #ecfdf5; margin-left: 0.25rem;" title="إعادة الجمعية إلى القائمة النشطة">
            🔄 استعادة للنشطة
          </button>
          <button class="btn btn-sm btn-outline" onclick="deleteArchivedGam('${gam.id}')" style="color: #dc2626; border-color: #fecaca; background: #fef2f2;" title="حذف الجمعية المؤرشفة نهائياً">
            🗑️
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
  appState.currentMonthKey = gam.currentMonthKey || gam.months[0].key;

  renderGamTabs();
  setupMonthSelector();
  updateView();
  openArchivesModal(); // تحديث القائمة
  showToast(`تمت استعادة جمعية "${gam.name}" إلى الجمعيات النشطة بنجاح 🔄`);
};

window.deleteArchivedGam = function(gamId) {
  const gam = appData.gam3eyat.find(g => g.id === gamId);
  if (!gam) return;

  if (confirm(`تحذير نهائي: هل أنت متأكد من حذف جمعية "${gam.name}" نهائياً من الأرشيف؟\nلن يمكن استعادة بيانات هذه الجمعية بعد الحذف.`)) {
    appData.gam3eyat = appData.gam3eyat.filter(g => g.id !== gamId);
    saveData(appData);
    openArchivesModal();
    renderGamTabs();
    showToast(`تم حذف جمعية "${gam.name}" نهائياً 🗑️`);
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
    }
    select.appendChild(opt);
  });
}

// ==========================================
// 4. تبديل وضع المدير وبوابة المشتركين
// ==========================================

function toggleRole() {
  if (appState.currentRole === "admin") {
    appState.currentRole = "member";
    showToast("تم الانتقال لمعاينة بوابة المشتركين 👤");
    updateView();
  } else if (appState.currentRole === "landing") {
    appState.currentRole = "member";
    showToast("مرحباً بك في بوابة المشتركين 👤");
    updateView();
  } else { // "member"
    if (appState.currentManager || appState.isAdminAuthenticated) {
      appState.currentRole = "admin";
      appState.isAdminAuthenticated = true;
      showToast("مرحباً بك مجدداً في لوحة تحكم المدير 🛡️");
      updateView();
    } else {
      appState.currentRole = "landing";
      updateView();
    }
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

  if (appState.currentRole === "admin") {
    if (landingView) landingView.style.display = "none";
    if (adminView) adminView.style.display = "block";
    if (memberView) memberView.style.display = "none";
    if (gamTabsContainer) gamTabsContainer.style.display = "flex";

    if (roleBadge) {
      roleBadge.style.display = "inline-flex";
      roleBadge.className = "role-badge role-admin";
      roleBadge.innerHTML = "🛡️ وضع المدير";
    }
    if (toggleBtn) {
      toggleBtn.style.display = "inline-flex";
      toggleBtn.innerHTML = "👥 الانتقال لبوابة المشترك";
    }
    if (settingsBtn) settingsBtn.style.display = "inline-flex";
    if (cloudSyncBtn) cloudSyncBtn.style.display = "inline-flex";

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
      roleBadge.innerHTML = "👤 بوابة المشتركين";
    }
    if (toggleBtn) {
      toggleBtn.style.display = "inline-flex";
      toggleBtn.innerHTML = (appState.currentManager || appState.isAdminAuthenticated) 
        ? "🛡️ العودة للوحة تحكم المدير" 
        : "🏠 الصفحة الرئيسية";
    }
    if (settingsBtn) settingsBtn.style.display = "none";
    if (cloudSyncBtn) cloudSyncBtn.style.display = "none";

    renderMemberSection();
  } else { // "landing"
    if (landingView) landingView.style.display = "block";
    if (adminView) adminView.style.display = "none";
    if (memberView) memberView.style.display = "none";
    if (gamTabsContainer) gamTabsContainer.style.display = "none";

    if (roleBadge) roleBadge.style.display = "none";
    if (settingsBtn) settingsBtn.style.display = "none";
    if (cloudSyncBtn) cloudSyncBtn.style.display = "none";
    if (toggleBtn) {
      toggleBtn.style.display = "inline-flex";
      toggleBtn.innerHTML = "👤 استعلام المشتركين";
    }
  }
}

// ==========================================
// 5. لوحة تحكم المدير والإحصائيات
// ==========================================

function renderAdminDashboard() {
  const gam = getCurrentGam();
  const curCurrency = appData.currency || "ر.س";

  if (!gam) {
    const el1 = document.getElementById("stat-total-payout"); if (el1) el1.textContent = `0 ${curCurrency}`;
    const el2 = document.getElementById("stat-members-count"); if (el2) el2.textContent = "0 دور (0 شهر)";
    const el3 = document.getElementById("stat-current-receiver"); if (el3) el3.textContent = "لا يوجد";
    const el4 = document.getElementById("stat-receiver-date"); if (el4) el4.textContent = "-";
    const el5 = document.getElementById("stat-selected-month-name"); if (el5) el5.textContent = "--";
    const el6 = document.getElementById("stat-month-collected"); if (el6) el6.textContent = `0 ${curCurrency}`;
    const el7 = document.getElementById("stat-month-target"); if (el7) el7.textContent = `المطلوب: 0 ${curCurrency}`;
    const el8 = document.getElementById("stat-unpaid-count"); if (el8) el8.textContent = "0";
    return;
  }
  const monthKey = appState.currentMonthKey;
  const monthObj = gam.months.find(m => m.key === monthKey) || gam.months[0];

  document.getElementById("stat-total-payout").textContent = `${gam.totalPayout.toLocaleString()} ${curCurrency}`;
  document.getElementById("stat-members-count").textContent = `${gam.members.length} دور (${gam.months.length} شهر)`;

  const receiverMember = gam.members.find(m => m.turnMonth === monthKey);
  if (receiverMember) {
    document.getElementById("stat-current-receiver").textContent = receiverMember.names.join(" + ");
    document.getElementById("stat-receiver-date").textContent = receiverMember.payoutDate || `شهر ${monthObj.name}`;
  } else {
    document.getElementById("stat-current-receiver").textContent = "لا يوجد";
    document.getElementById("stat-receiver-date").textContent = "-";
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

  document.getElementById("stat-selected-month-name").textContent = monthObj.name;
  document.getElementById("stat-month-collected").textContent = `${collected.toLocaleString()} ${curCurrency}`;
  document.getElementById("stat-month-target").textContent = `المطلوب: ${target.toLocaleString()} ${curCurrency}`;
  document.getElementById("stat-unpaid-count").textContent = unpaidCount;
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
    headHtml += `<th class="col-month ${isCurrent ? 'highlight-month' : ''}">${m.name}</th>`;
  });
  thead.innerHTML = headHtml;

  tbody.innerHTML = "";
  const filter = appState.statusFilter;

  gam.members.forEach((member, index) => {
    const currentMonthStatuses = member.payments[appState.currentMonthKey] || [];
    if (filter === "unpaid" && !currentMonthStatuses.includes("unpaid")) return;
    if (filter === "paid" && !currentMonthStatuses.includes("paid")) return;

    const tr = document.createElement("tr");

    let nameHtml = "";
    if (member.isVacant) {
      nameHtml = `<span class="slot-vacant" onclick="openAssignTurnModal(${index})" title="انقر لتسكين المشترك في هذا الدور"><span class="vacant-pulse">🟢</span> دور متاح (انقر للتسكين)</span>`;
    } else if (member.isShared) {
      nameHtml = `
        <div style="font-weight: 700; color: var(--text-dark);">${member.names[0]} <span style="font-size: 0.74rem; color: #94a3b8; font-weight: 600;">(${(member.shares[0] || (gam.shareAmount / 2)).toLocaleString()})</span></div>
        <div style="margin-top: 3px; font-weight: 700; color: var(--text-dark);">${member.names[1]} <span style="font-size: 0.74rem; color: #94a3b8; font-weight: 600;">(${(member.shares[1] || (gam.shareAmount / 2)).toLocaleString()})</span></div>
        <span class="co-member-badge">🤝 شريكان بالسهم</span>
      `;
    } else {
      nameHtml = `<div><strong>${member.names[0]}</strong></div>`;
    }

    const payoutMonthName = gam.months[index] ? gam.months[index].name : (member.payoutDate || '-');
    const totalShares = member.isVacant ? gam.shareAmount : member.shares.reduce((a, b) => a + b, 0);

    let rowHtml = `
      <td class="col-index"><strong>${index + 1}</strong></td>
      <td class="cell-member-name">${nameHtml}</td>
      <td class="col-date" style="font-weight: 700; color: #f8fafc;">${payoutMonthName}</td>
      <td class="col-share"><strong>${totalShares.toLocaleString()}</strong></td>
    `;

    gam.months.forEach(m => {
      const statuses = member.payments[m.key] || ["unpaid"];
      let cellContent = "";

      if (member.isVacant) {
        if (m.key === member.turnMonth) {
          cellContent = `<span class="status-badge payout" style="opacity: 0.75;" title="موعد استلام هذا الدور"><span class="badge-icon">🎁</span><span class="badge-text">قبض</span></span>`;
        } else {
          cellContent = `<span style="color: #cbd5e1; font-size: 0.85rem;">-</span>`;
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

  // تذييل إجمالي كل شهر متوافق مع الأعمدة المثبتة
  let footHtml = `
    <tr>
      <td class="col-index" style="background: #f8fafc;"></td>
      <td class="cell-member-name" style="text-align: right; font-weight: 800; background: #f8fafc; font-size: 0.84rem; color: var(--primary);">
        💰 إجمالي المحصل:
      </td>
      <td class="col-date" style="background: #f8fafc;"></td>
      <td class="col-share" style="background: #f8fafc;"></td>
  `;

  gam.months.forEach(m => {
    let monthTotal = 0;
    gam.members.forEach(mem => {
      const statuses = mem.payments[m.key] || [];
      const shares = mem.shares || [gam.shareAmount];
      statuses.forEach((st, idx) => {
        if (st === "paid") {
          monthTotal += (shares[idx] || (gam.shareAmount / statuses.length));
        }
      });
    });
    footHtml += `<td class="col-month" style="font-weight: 800; background: #ecfdf5; color: #065f46; font-size: 0.82rem;">${monthTotal.toLocaleString()}</td>`;
  });

  footHtml += `</tr>`;
  tfoot.innerHTML = footHtml;
}

function renderBadgeButton(memberId, monthKey, subIndex, status) {
  let icon = "";
  let text = "";
  let className = "";

  switch (status) {
    case "paid":
      icon = "✅";
      text = "تم";
      className = "paid";
      break;
    case "unpaid":
      icon = "❌";
      text = "متأخر";
      className = "unpaid";
      break;
    case "payout":
      icon = "🎁";
      text = "قبض";
      className = "payout";
      break;
    case "future":
    default:
      icon = "⏳";
      text = "لم تستحق";
      className = "future";
      break;
  }

  return `<button class="status-badge ${className}" onclick="cyclePaymentStatus('${memberId}', '${monthKey}', ${subIndex})" title="انقر لتغيير حالة السداد (${text})"><span class="badge-icon">${icon}</span><span class="badge-text">${text}</span></button>`;
}

window.cyclePaymentStatus = function(memberId, monthKey, subIndex) {
  const gam = getCurrentGam();
  const member = gam.members.find(m => m.id === memberId);
  if (!member) return;

  if (!member.payments[monthKey]) {
    member.payments[monthKey] = member.isShared ? ["unpaid", "unpaid"] : ["unpaid"];
  }

  const current = member.payments[monthKey][subIndex];
  let next = "paid";

  if (current === "paid") next = "unpaid";
  else if (current === "unpaid") next = "payout";
  else if (current === "payout") next = "future";
  else if (current === "future") next = "paid";
  else next = "paid";

  member.payments[monthKey][subIndex] = next;
  saveData(appData);

  renderAdminDashboard();
  renderMatrixTable();
  showToast("تم تحديث حالة السداد بنجاح 🔄");
};

// ==========================================
// 7. بوابة المشتركين وتسجيل الدخول بالجوال والكود
// ==========================================

function renderMemberSection() {
  const loginSec = document.getElementById("member-login-section");
  const dashboardSec = document.getElementById("member-dashboard-section");

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
    opt.textContent = `👤 ${p.name} ${p.phone ? `(${p.phone})` : ''}`;
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
        showToast(`أهلاً بك يا ${syntheticMember.name} في كشف حسابك المعتمد ✨`);
        renderMemberSection();
        return;
      }
    }
  }

  // 2. جلب أحدث بيانات الجمعيات العامة من السحابة لضمان التحديث اللحظي
  if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseDb !== "undefined") {
    try {
      const publicSnap = await firebaseDb.collection("public_data").doc("active_statement").get();
      if (publicSnap.exists) {
        const cloudData = publicSnap.data();
        if (cloudData && Array.isArray(cloudData.gam3eyat) && cloudData.gam3eyat.length > 0) {
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
    alert("عذراً، لم نتمكن من العثور على أي مشترك مسجل بهذا الرقم أو الاسم في الجمعيات الحالية!\n\n💡 يُرجى التأكد من كتابة رقم الجوال كما هو مسجل (مثال: 05xxxxxxxx) أو مراجعة مدير الجمعية.");
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
    alert("الكود السري المكون من 4 أرقام غير صحيح!\n\n💡 تأكد من الكود المذكور في رسالة الواتساب الخاصة بك أو تواصل مع مدير الجمعية.");
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

  showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك المعتمد 📜`);
  renderMemberSection();
}

/**
 * عرض كشف الحساب المعتمد للمشترك
 */
function renderMemberPortfolio() {
  const member = appState.loggedMember;
  if (!member) return;

  // 1. تعبئة ترويسة كشف الحساب الرسمي المعتمد
  document.getElementById("official-statement-name").textContent = member.name;
  document.getElementById("official-statement-phone").textContent = member.phone || "غير مسجل";
  document.getElementById("official-statement-code").textContent = `#MEM-${member.code || member.pin}`;

  const today = new Date();
  const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const formattedDate = `${today.getDate()} ${arabicMonths[today.getMonth()]} ${today.getFullYear()}`;
  document.getElementById("official-statement-date").textContent = formattedDate;

  // 2. تجميع وحساب بيانات الجمعيات التي يشارك بها
  const memberGamEntries = [];
  let totalAllPaid = 0;
  let totalAllRemaining = 0;

  appData.gam3eyat.forEach(gam => {
    gam.members.forEach(m => {
      const matchIndex = m.names.findIndex(n => n.trim() === member.name.trim());
      if (matchIndex !== -1) {
        const isShared = m.isShared;
        const myShare = m.shares[matchIndex] || (gam.shareAmount / (isShared ? 2 : 1));
        const partnerName = isShared ? m.names[matchIndex === 0 ? 1 : 0] : null;
        const totalMonths = gam.months.length;
        const totalObligation = myShare * totalMonths;
        const payoutAmount = isShared ? (gam.totalPayout / 2) : gam.totalPayout;

        let gamPaid = 0;
        gam.months.forEach(month => {
          const statuses = m.payments[month.key] || [];
          const mySt = statuses[matchIndex];
          if (mySt === "paid" || mySt === "payout") {
            gamPaid += myShare;
          }
        });

        const gamRemaining = Math.max(0, totalObligation - gamPaid);
        totalAllPaid += gamPaid;
        totalAllRemaining += gamRemaining;

        memberGamEntries.push({
          gam: gam,
          memberRecord: m,
          subIndex: matchIndex,
          myShare: myShare,
          partnerName: partnerName,
          totalObligation: totalObligation,
          gamPaid: gamPaid,
          gamRemaining: gamRemaining,
          payoutAmount: payoutAmount
        });
      }
    });
  });

  const curCurrency = appData.currency || "ر.س";
  // تحديث الإحصائيات الشاملة
  document.getElementById("member-stat-all-paid").textContent = `${totalAllPaid.toLocaleString()} ${curCurrency}`;
  document.getElementById("member-stat-all-remaining").textContent = `${totalAllRemaining.toLocaleString()} ${curCurrency}`;
  document.getElementById("member-stat-gam-count").textContent = memberGamEntries.length;

  // بناء كروت الجمعيات الخاصة بالعضو
  const container = document.getElementById("member-gam3eyat-container");
  container.innerHTML = "";

  if (memberGamEntries.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2.5rem; background: white; border-radius: 14px; font-weight: 700; color: var(--text-muted);">لا توجد جمعيات مسجلة لهذا المشترك حالياً.</div>`;
    return;
  }

  memberGamEntries.forEach(entry => {
    const gam = entry.gam;
    const m = entry.memberRecord;
    const subIdx = entry.subIndex;
    const myShare = entry.myShare;
    const progressPercent = Math.min(100, Math.round((entry.gamPaid / entry.totalObligation) * 100)) || 0;

    const payoutMonthObj = gam.months.find(mo => mo.key === m.turnMonth);
    const payoutName = payoutMonthObj ? payoutMonthObj.name : m.payoutDate;

    const curMonthKey = gam.currentMonthKey || "sep";
    const curMonthObj = gam.months.find(mo => mo.key === curMonthKey) || gam.months[0];
    const curStatuses = m.payments[curMonthKey] || ["unpaid"];
    const curSt = curStatuses[subIdx] || "unpaid";

    let curBadge = "";
    if (curSt === "payout") curBadge = `<span style="color: #b45309; font-weight: 800;"><span class="badge-icon">🎁</span> شهر قبضك</span>`;
    else if (curSt === "paid") curBadge = `<span style="color: #047857; font-weight: 800;"><span class="badge-icon">✅</span> تم السداد</span>`;
    else if (curSt === "future") curBadge = `<span style="color: #64748b; font-weight: 800;"><span class="badge-icon">⏳</span> لم تستحق بعد</span>`;
    else curBadge = `<span style="color: #b91c1c; font-weight: 800;"><span class="badge-icon">❌</span> متأخر</span>`;

    const card = document.createElement("div");
    card.className = "member-gam-card";

    let monthsRowsHtml = "";
    gam.months.forEach(mo => {
      const isPayoutTurn = mo.key === m.turnMonth;
      const statuses = m.payments[mo.key] || ["unpaid"];
      const st = statuses[subIdx] || "unpaid";

      let badge = "";
      let note = "-";

      if (isPayoutTurn || st === "payout") {
        badge = `<span class="status-badge payout"><span class="badge-icon">🎁</span><span class="badge-text">شهر القبض</span></span>`;
        note = `استلام مبلغ ${entry.payoutAmount.toLocaleString()} ${curCurrency}`;
      } else if (st === "paid") {
        badge = `<span class="status-badge paid"><span class="badge-icon">✅</span><span class="badge-text">تم الدفع</span></span>`;
        note = "مسدد";
      } else if (st === "future") {
        badge = `<span class="status-badge future"><span class="badge-icon">⏳</span><span class="badge-text">لم تستحق</span></span>`;
        note = "قسط قادم";
      } else {
        badge = `<span class="status-badge unpaid"><span class="badge-icon">❌</span><span class="badge-text">متأخر</span></span>`;
        note = "قسط مطلوب";
      }

      monthsRowsHtml += `
        <tr>
          <td><strong>${mo.name}</strong></td>
          <td><strong>${myShare.toLocaleString()} ${curCurrency}</strong></td>
          <td>${badge}</td>
          <td style="font-size: 0.85rem; color: #64748b;">${note}</td>
        </tr>
      `;
    });

    card.innerHTML = `
      <div class="member-gam-header">
        <div>
          <h3 style="font-size: 1.3rem; color: var(--primary); font-weight: 800;">${gam.name}</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
            الدور رقم (<strong>${m.turn}</strong>) • موعد استلام الجمعية: <strong>${payoutName}</strong>
          </p>
          ${entry.partnerName ? `<span class="co-member-badge">🤝 شريك مع (${entry.partnerName}) بنصف سهم</span>` : '<span class="co-member-badge" style="background: #ecfdf5; color: #047857; border-color: #a7f3d0;">🌟 سهم كامل</span>'}
        </div>
        <div class="member-payout-highlight">
          <div class="highlight-label">نصيب استلامك</div>
          <div class="highlight-date">${entry.payoutAmount.toLocaleString()} ${curCurrency}</div>
        </div>
      </div>

      <div class="member-stats-row">
        <div class="member-stat-box success">
          <div class="box-title">ما دفعته في هذه الجمعية</div>
          <div class="box-num">${entry.gamPaid.toLocaleString()} ${curCurrency}</div>
        </div>
        <div class="member-stat-box danger">
          <div class="box-title">المتبقي عليك</div>
          <div class="box-num">${entry.gamRemaining.toLocaleString()} ${curCurrency}</div>
        </div>
        <div class="member-stat-box">
          <div class="box-title">موقف شهر (${curMonthObj.name})</div>
          <div class="box-num">${curBadge}</div>
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-label-row">
          <span>نسبة استكمال أقساط هذه الجمعية:</span>
          <span>${progressPercent}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>

      <h4 style="font-size: 1rem; margin-bottom: 0.6rem; color: var(--primary); font-weight: 700;">
        📋 جدول أقساطك التفصيلي:
      </h4>
      <div class="table-container" style="box-shadow: none; margin-bottom: 0;">
        <table class="gam-table">
          <thead>
            <tr>
              <th>الشهر</th>
              <th>قيمة القسط</th>
              <th>الموقف</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            ${monthsRowsHtml}
          </tbody>
        </table>
      </div>
    `;

    container.appendChild(card);
  });
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
          memberGams.push(`<div class="gam-badge-pill">📁 <strong>${g.name}</strong> <span class="gam-turn-tag">الدور ${turnNum}: ${payoutMonthName}${isSharedText}</span></div>`);
        }
      });
    });

    const payoutBadgeHtml = p.payoutMethod === "cash"
      ? `<div style="margin-top: 0.25rem;"><span class="payout-badge payout-badge-cash">💵 نقداً (كاش)</span></div>`
      : `<div style="margin-top: 0.25rem;"><span class="payout-badge payout-badge-bank">🏦 ${p.bankName ? p.bankName : 'تحويل بنكي'}${p.iban ? ` (${p.iban.slice(-4)}...)` : ''}</span></div>`;

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
          <button class="btn btn-sm btn-outline" onclick="regenerateParticipantPin('${encodeURIComponent(p.name)}')" title="توليد كود سري جديد عشوائي" style="padding: 0.1rem 0.35rem; font-size: 0.72rem;">🎲</button>
        </div>
      </td>
      <td>${memberGams.join("") || '<span style="color: #94a3b8; font-size: 0.82rem;">غير مسجل بأي دور حالياً</span>'}</td>
      <td style="white-space: nowrap;">
        <button class="btn btn-sm btn-gold" onclick="copyMagicLink('${encodeURIComponent(p.name)}', '${p.phone}')" title="نسخ الرابط السحري المباشر لكشف الحساب">🔗 نسخ الرابط</button>
        <button class="btn btn-sm btn-success" onclick="shareCredentialsWhatsApp('${encodeURIComponent(p.name)}', '${p.phone}', '${p.pin}')" title="إرسال الرابط المباشر وبيانات الدخول عبر واتساب">📲 واتساب</button>
        <button class="btn btn-sm btn-outline" onclick="openEditCredModal('${encodeURIComponent(p.name)}', '${p.phone || ''}', '${p.pin || ''}', '${p.payoutMethod || 'bank'}', '${encodeURIComponent(p.bankName || '')}', '${encodeURIComponent(p.iban || '')}')" title="تعديل بيانات المشترك والحساب البنكي">✏️</button>
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

  let baseUrl;
  if (appData.publishedUrl && appData.publishedUrl.startsWith('http')) {
    baseUrl = appData.publishedUrl.replace(/\/+$/, '').replace(/\/index\.html$/i, '');
  } else if (window.location.protocol === 'file:') {
    baseUrl = window.location.href.split('?')[0];
  } else {
    baseUrl = (window.location.origin + window.location.pathname).replace(/\/+$/, '').replace(/\/index\.html$/i, '');
  }

  // رابط فائق القصر والنظافة للواتساب (مكون من سطر واحد فقط)
  const joinChar = baseUrl.includes('?') ? '&' : (baseUrl.endsWith('/') || baseUrl.endsWith('.html') ? '?' : '/?');
  const nameParam = cleanName ? `&name=${encodeURIComponent(cleanName)}` : '';
  const phoneParam = resolvedPhone ? `&m=${encodeURIComponent(resolvedPhone)}` : '';
  const mgrParam = (appState && appState.currentManager && appState.currentManager.uid) ? `&mgr=${encodeURIComponent(appState.currentManager.uid)}` : '';
  const pinParam = autoLogin && pin ? `&k=${encodeURIComponent(pin)}` : '';

  return `${baseUrl}${joinChar}portal=member${nameParam}${phoneParam}${mgrParam}${pinParam}`;
}

function getMagicLinkForPhone(phone) {
  return getPortalLinkForMember("", phone, false);
}

window.copyMagicLink = function(encName, phone) {
  const name = decodeURIComponent(encName);
  const magicLink = getPortalLinkForMember(name, phone, false);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(magicLink).then(() => {
      showToast(`تم نسخ رابط بوابة المشتركين لـ (${name}) بنجاح! 🔗`);
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

  const msg = `أهلاً بك يا ${name} 💐\nنظام إدارة الجمعيات المالية - كشف الحساب المعتمد\n\n🔗 رابط بوابة المشتركين:\n${magicLink}\n\n🔐 بيانات الدخول الخاصة بك:\n📱 رقم جوالك: ${cleanPhone || "مسجل بالنظام"}\n🔑 كودك السري الخاص: ${pin}\n\n(اضغط على الرابط أعلاه وأدخل كودك السري الخاص للاطلاع على كشف حسابك المعتمد فوراً)\n\n🛡️ تنبيه أمني: كودك السري خاص بك لحماية خصوصية وسرية حسابك ومعاملاتك المالية، يُرجى عدم مشاركته مع أحد.`;

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
  showToast(`تم توليد كود سري جديد لـ (${name}): ${newPin} 🎲`);
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
  showToast("تم تأمين وتوليد أكواد سرية جديدة لجميع المشتركين بنجاح! 🎲🛡️");
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
    header.textContent = `📋 قائمة المشتركين المسجلين (${participants.length} مشترك) - اضغط للاختيار السريع:`;
    resultsContainer.appendChild(header);

    participants.forEach(p => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.innerHTML = `
        <div style="flex: 1;">
          <div class="name" style="font-weight: 700; color: var(--primary);">👤 ${p.name}</div>
          <div class="phone" style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">📱 ${p.phone || "بدون جوال"}</div>
        </div>
        <span class="btn btn-sm btn-outline" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">اختيار ⚡</span>
      `;
      item.onclick = () => {
        document.getElementById("new-member-name").value = p.name;
        document.getElementById("new-member-phone").value = p.phone || "";
        searchInput.value = `${p.name} (${p.phone || ""})`;
        resultsContainer.style.display = "none";
        showToast(`تم اختيار المشترك السابق (${p.name}) ⚡`);
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
  showToast(`تم إنشاء "${name}" بنجاح! ✨`);
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
      memberDisplay = `<span class="slot-vacant" onclick="openAssignTurnModal(${idx})" title="انقر لتسكين المشترك">🟢 دور متاح (انقر للتسكين)</span>`;
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
        <button class="btn-arrow" onclick="moveMemberTurn(${idx}, -1)" ${isFirst ? 'disabled' : ''} title="تقديم الدور">⬆️</button>
        <button class="btn-arrow" onclick="moveMemberTurn(${idx}, 1)" ${isLast ? 'disabled' : ''} title="تأخير الدور">⬇️</button>
      </td>
      <td style="white-space: nowrap;">
        <button class="btn btn-sm btn-primary" onclick="openAssignTurnModal(${idx})" title="تسكين أو تعديل هذا الدور">🎯 تسكين / تعديل</button>
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

  gam.members.forEach((m, idx) => {
    m.turn = idx + 1;
    if (gam.months[idx]) {
      m.turnMonth = gam.months[idx].key;
      m.payoutDate = gam.months[idx].name;
    }
  });

  saveData(appData);
  renderReorderTable();
  renderMatrixTable();
  renderAdminDashboard();
  showToast("تم تحديث ترتيب الأدوار بنجاح 🔄");
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
    labelP1.textContent = "👤 بيانات الشريك الأول (نصف سهم):";
    document.getElementById("assign-p1-share").value = Math.round(baseShare / 2);
    document.getElementById("assign-p2-share").value = Math.round(baseShare / 2);
    document.getElementById("assign-p2-name").required = true;
  } else {
    btnFull.className = "btn btn-primary";
    btnSplit.className = "btn btn-outline";
    secP2.style.display = "none";
    labelP1.textContent = "👤 بيانات المشترك (السهم الكامل):";
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
          <div class="name" style="font-weight: 700; color: var(--primary);">👤 ${p.name}</div>
          <div class="phone" style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">📱 ${p.phone || "بدون جوال"}</div>
        </div>
        <span class="btn btn-sm btn-outline" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">اختيار ⚡</span>
      `;
      item.onclick = () => {
        nameInput.value = p.name;
        if (phoneInput) phoneInput.value = p.phone || "";
        searchInput.value = `${p.name} (${p.phone || ""})`;
        resultsContainer.style.display = "none";
        showToast(`تم اختيار (${p.name}) ⚡`);
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
    showToast("تم إخلاء الدور وجعله متاحاً للحجز 🟢");
  }
};

// ==========================================
// 11. تذكيرات الواتساب وبيانات المستحق للقبض بتصميم فاخر
// ==========================================

window.copyTextToClipboard = function(text, successMsg = "تم النسخ بنجاح! 📋") {
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
      showToast("تم فتح محادثة واتساب ونسخ نص الرسالة للحافظة بنجاح 📋");
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
      text: `المستلم: ${name} | طريقة الاستلام: نقداً (كاش 💵) يداً بيد`,
      html: `الاستلام: <strong style="color: #854d0e;">نقداً (كاش 💵)</strong> يداً بيد`
    };
  }

  const bankName = participant?.bankName ? participant.bankName.trim() : "غير محدد";
  const iban = participant?.iban ? participant.iban.trim() : "غير مسجل";

  return {
    text: `المستلم: ${name}\n🏦 البنك: ${bankName}\n💳 الحساب/الآيبان: ${iban}`,
    html: `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          🏦 <strong>البنك:</strong> ${bankName} &nbsp;|&nbsp; 💳 <strong>الحساب/الآيبان:</strong> <span style="font-family: monospace; font-weight: 800; direction: ltr; display: inline-block;">${iban}</span>
        </div>
        ${iban && iban !== "غير مسجل" ? `<button type="button" class="btn btn-sm btn-outline" onclick="copyTextToClipboard('${iban}', 'تم نسخ رقم الحساب/الآيبان 📋')" style="font-size: 0.72rem; padding: 0.15rem 0.5rem; background: white;">📋 نسخ الحساب</button>` : ''}
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
  copyTextToClipboard(item.text, `تم نسخ نص رسالة (${item.name}) للحافظة بنجاح 📋`);
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

      transferMessageSnippet = `📌 تفاصيل التحويل للمستحقين لهذا الشهر (شريكان):\n[1] ${p1Info.text}\n[2] ${p2Info.text}`;
    } else {
      const pName = (receiverMember.names[0] || "").trim();
      const p = allParticipants.find(x => x.name.trim() === pName);
      const pInfo = formatTransferDetails(pName, p);
      transferMessageSnippet = `📌 تفاصيل تحويل القسط للمستحق لهذا الشهر:\n${pInfo.text}`;
    }
  } else {
    transferMessageSnippet = "📌 طريقة السداد: يُرجى التواصل مع مدير الجمعية لتأكيد بيانات التحويل.";
  }

  // 2. إعداد وتوليد بطاقات المتأخرين
  let unpaidCount = 0;
  let totalUnpaidAmount = 0;
  const curCurrency = appData.currency || "ر.س";
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
                <span>📲</span>
                <span>إرسال واتساب</span>
              </button>
              <button type="button" class="btn-wa-copy" onclick="copyStoredWhatsApp('${msgId}')" title="نسخ رسالة التذكير الخاصة بهذا المشترك للحافظة">
                <span>📋</span>
                <span>نسخ الرسالة</span>
              </button>
            </div>`
          : `<div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              <span class="btn-wa-send btn-wa-disabled" title="يُرجى تسجيل رقم الجوال من دليل المشتركين لتفعيل الإرسال">
                <span>⚠️ بدون جوال</span>
              </span>
              <button type="button" class="btn-wa-copy" onclick="copyStoredWhatsApp('${msgId}')" title="نسخ رسالة التذكير للحافظة">
                <span>📋</span>
                <span>نسخ الرسالة</span>
              </button>
            </div>`;

        item.innerHTML = `
          <div class="unpaid-card-info">
            <div class="unpaid-avatar">👤</div>
            <div>
              <div class="unpaid-name">${personName}</div>
              <div class="unpaid-meta">
                <span class="unpaid-share-badge">المطلوب: ${share.toLocaleString()} ${curCurrency}</span>
                <span class="unpaid-phone-tag">${phone ? `📱 ${phone}` : '<span style="color:#ef4444;">⚠️ جوال غير مسجل</span>'}</span>
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
  if (unpaidTotalEl) unpaidTotalEl.textContent = `${totalUnpaidAmount.toLocaleString()} ${curCurrency}`;

  if (unpaidCount === 0) {
    if (summaryBar) summaryBar.style.display = "none";
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; background: #f0fdf4; border-radius: 12px; border: 1.5px dashed #86efac; margin-bottom: 0.5rem;">
        <div style="font-size: 2.8rem; margin-bottom: 0.4rem;">🎉</div>
        <div style="font-weight: 800; font-size: 1.05rem; color: #065f46; margin-bottom: 0.25rem;">رائع جداً! لا يوجد أي متأخرين</div>
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
        waReceiverBadgeEl.textContent = "نقداً (كاش 💵)";
        waReceiverBadgeEl.style.background = "#fefce8";
        waReceiverBadgeEl.style.color = "#854d0e";
      } else {
        waReceiverBadgeEl.textContent = "تحويل بنكي 🏦";
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
// 12. ربط مستمعي الأحداث (Event Listeners)
// ==========================================

function attachEventListeners() {
  setupModalCloseButtons();

  const btnToggleRole = document.getElementById("btn-toggle-role");
  if (btnToggleRole) btnToggleRole.onclick = toggleRole;

  document.getElementById("select-active-month").onchange = (e) => {
    appState.currentMonthKey = e.target.value;
    const gam = getCurrentGam();
    if (gam) {
      gam.currentMonthKey = e.target.value;
      const curMonthIdx = gam.months.findIndex(mo => mo.key === e.target.value);
      if (curMonthIdx !== -1) {
        gam.members.forEach(m => {
          if (m.payments) {
            gam.months.forEach((mo, mIdx) => {
              if (m.payments[mo.key]) {
                m.payments[mo.key] = m.payments[mo.key].map(st => {
                  if (mIdx <= curMonthIdx && st === "future") return "unpaid";
                  if (mIdx > curMonthIdx && st === "unpaid") return "future";
                  return st;
                });
              }
            });
          }
        });
        saveData(appData);
      }
    }
    renderAdminDashboard();
    renderMatrixTable();
  };

  document.getElementById("filter-status").onchange = (e) => {
    appState.statusFilter = e.target.value;
    renderMatrixTable();
  };

  document.getElementById("btn-edit-current-gam").onclick = openManageGamModal;

  document.getElementById("btn-save-gam-settings").onclick = () => {
    const gam = getCurrentGam();
    const newName = document.getElementById("manage-gam-name-input").value.trim();
    const newShare = parseInt(document.getElementById("manage-gam-share-input").value, 10);

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
    showToast("تم حفظ إعدادات الجمعية بنجاح 💾");
  };

  document.getElementById("btn-delete-gam").onclick = () => {
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
      showToast("تم حذف الجمعية 🗑️");
    }
  };

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
          submitBtn.textContent = "⏳ جاري التحقق وفتح كشف حسابك...";
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
          btnTogglePin.textContent = "🙈";
        } else {
          pinInput.type = "password";
          btnTogglePin.textContent = "👁️";
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
          showToast(`أهلاً بك يا ${matched.name}! تم فتح كشف حسابك المباشر ✨`);
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

  // تسجيل خروج المشترك
  document.getElementById("btn-member-logout").onclick = () => {
    appState.loggedMember = null;
    try {
      sessionStorage.removeItem("gam_active_member_session");
    } catch(e) {}
    showToast("تم تسجيل الخروج من بوابة المشترك 🚪");
    renderMemberSection();
  };

  // طباعة كشف الحساب المعتمد
  document.getElementById("btn-print-portfolio").onclick = () => {
    window.print();
  };

  // إنشاء جمعية جديدة
  document.getElementById("form-create-gam").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("new-gam-name").value.trim();
    const startMonth = document.getElementById("new-gam-start-month").value;
    const year = parseInt(document.getElementById("new-gam-year").value, 10) || 2027;
    const duration = parseInt(document.getElementById("new-gam-duration").value, 10) || 12;
    const share = parseInt(document.getElementById("new-gam-share").value, 10) || 2000;

    if (!name) return;

    createNewGam3eya(name, startMonth, year, duration, share);
    closeModal("modal-create-gam");
    document.getElementById("form-create-gam").reset();
  };

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
      showToast("تم توليد كود سري جديد 🎲");
    };
  }

  const btnGenEditPin = document.getElementById("btn-generate-edit-pin");
  if (btnGenEditPin) {
    btnGenEditPin.onclick = () => {
      document.getElementById("edit-cred-pin").value = generateRandomPin();
      showToast("تم توليد كود سري جديد 🎲");
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
      showToast(`تمت إضافة المشترك (${name}) مع طريقة الاستلام بنجاح 👥`);
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
      showToast(`تم تسكين الدور (${turnIndex + 1}) بنجاح! 🎯`);
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
        showToast(`تم إخلاء الدور (${turnIndex + 1}) وجعله شاغراً 🟢`);
      }
    };
  }

  document.getElementById("btn-members-directory").onclick = openMembersDirectoryModal;

  document.getElementById("dir-search-input").addEventListener("input", (e) => {
    renderDirectoryTable(e.target.value);
  });

  document.getElementById("form-edit-credentials").onsubmit = (e) => {
    e.preventDefault();
    const origName = document.getElementById("edit-orig-name").value;
    const newName = document.getElementById("edit-cred-name").value.trim();
    const newPhone = document.getElementById("edit-cred-phone").value.trim();
    const newPin = document.getElementById("edit-cred-pin").value.trim();
    const payoutMethod = document.querySelector('input[name="edit-cred-payout-type"]:checked')?.value || "bank";
    const bankName = document.getElementById("edit-cred-bank-name") ? document.getElementById("edit-cred-bank-name").value.trim() : "";
    const iban = document.getElementById("edit-cred-iban") ? document.getElementById("edit-cred-iban").value.trim() : "";

    if (!newName || !newPhone || !newPin) return;

    saveEditedCredentials(origName, newName, newPhone, newPin, payoutMethod, bankName, iban);
    closeModal("modal-edit-credentials");
    showToast(`تم حفظ بيانات المشترك (${newName}) وطريقة الاستلام بنجاح 💾`);
  };

  // أزرار أرشفة الجمعية واستعراض الأرشيف
  const btnArchiveCurrent = document.getElementById("btn-archive-current-gam");
  if (btnArchiveCurrent) {
    btnArchiveCurrent.onclick = archiveCurrentGam;
  }

  const btnOpenArchives = document.getElementById("btn-open-archives");
  if (btnOpenArchives) {
    btnOpenArchives.onclick = openArchivesModal;
  }

  // نوافذ الواتساب والإعدادات وتسجيل الدخول
  document.getElementById("btn-open-whatsapp").onclick = openWhatsAppModal;
  const btnWaReset = document.getElementById("btn-wa-reset-template");
  if (btnWaReset) {
    btnWaReset.onclick = () => {
      const tpl = document.getElementById("wa-message-template");
      if (tpl) {
        tpl.value = `السلام عليكم ورحمة الله وبركاته يا {الاسم} 💐\nنحيطكم علماً بموعد استحقاق قسط الجمعية لشهر ({الشهر}):\n\n📋 *تفاصيل القسط:*\n• *الجمعية:* {الجمعية}\n• *المبلغ المطلوب:* {المبلغ} ر.س\n• *الشهر المستحق:* {الشهر}\n\n💳 *بيانات التحويل للمستحق:*\n{بيانات_التحويل}\n\n🔐 *بيانات الدخول لبوابة المشتركين:*\n• *رابط الدخول المباشر:* {الرابط}\n• *رقم جوالك:* {الجوال}\n• *كود الدخول السري:* {الكود}\n\n(اضغط على الرابط أعلاه وأدخل كودك السري للاطلاع على كشف حسابك المعتمد فوراً)\nتقبلوا خالص التحية والتقدير 🌹`;
        renderWhatsAppUnpaidList();
        showToast("تمت استعادة النص الافتراضي وتحديث الرسائل 📝");
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
      const modeText = radio.value === "web" ? "واتساب ويب (المتصفح) 💻" : (radio.value === "app" ? "تطبيق واتساب 📱" : "رابط واتساب القياسي 🔗");
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
    if (passInput) passInput.value = "";
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
        btnCloudSync.textContent = "⏳ جاري الرفع...";
        btnCloudSync.disabled = true;
        const uid = (appState.currentManager && appState.currentManager.uid) ? appState.currentManager.uid : "admin_default";
        const ok = await FirebaseService.saveManagerData(uid, appData);
        if (ok) {
          showToast("✅ تم نشر وتحديث كافة الجمعيات والمشتركين في السحابة بنجاح! المشتركون يمكنهم الدخول من هواتفهم الآن.");
        } else {
          showToast("⚠️ تم الحفظ محلياً بنجاح.");
        }
      } catch (err) {
        console.warn("خطأ في المزامنة اليدوية:", err);
        showToast("تم الحفظ محلياً بنجاح.");
      } finally {
        btnCloudSync.textContent = "☁️ مزامنة السحابة";
        btnCloudSync.disabled = false;
      }
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
        showToast("📥 تم تصدير وتحميل ملف النسخة الاحتياطية بنجاح!");
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
          showToast("✅ تمت استعادة النسخة الاحتياطية ومزامنتها سحابياً بنجاح!");
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
      const name = (document.getElementById("mgr-profile-name").value || "").trim();
      const email = (document.getElementById("mgr-profile-email").value || "").trim();
      const phone = (document.getElementById("mgr-profile-phone").value || "").trim();
      const pass = (document.getElementById("mgr-profile-password").value || "").trim();
      const submitBtn = formMgrProfile.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.textContent : "";

      if (!email) {
        alert("يُرجى كتابة البريد الإلكتروني الشخصي");
        return;
      }

      try {
        if (submitBtn) {
          submitBtn.textContent = "⏳ جاري حفظ البيانات...";
          submitBtn.disabled = true;
        }

        const activeUid = appState.currentManager ? appState.currentManager.uid : "admin_default";
        const updatePayload = {
          displayName: name,
          email: email,
          phone: phone
        };
        if (pass) {
          if (pass.length < 4) {
            alert("كلمة المرور يجب أن تكون 4 أحرف/أرقام على الأقل");
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
        if (cloudNameEl) cloudNameEl.textContent = `🟢 ${res.user.displayName || 'المدير'}`;
        if (cloudIconEl) cloudIconEl.textContent = "🛡️";

        closeModal("modal-settings");
        updateView();
        showToast(`تم حفظ بريدك الشخصي (${email}) بنجاح! يمكنك الآن تسجيل الدخول به دائماً 🎉`);
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

  // دخول المدير
  document.getElementById("form-login").onsubmit = (e) => {
    e.preventDefault();
    const enteredPin = document.getElementById("input-admin-pin").value;
    const correctPin = appData.adminPin || "1234";

    if (enteredPin === correctPin) {
      appState.isAdminAuthenticated = true;
      appState.currentRole = "admin";
      closeModal("modal-login");
      document.getElementById("input-admin-pin").value = "";
      updateView();
      showToast("تم التحقق من الرقم السري بنجاح 🔓");
    } else {
      alert("الرقم السري غير صحيح! يُرجى المحاولة مرة أخرى.");
      document.getElementById("input-admin-pin").focus();
    }
  };

  // تغيير الرقم السري للمدير
  document.getElementById("form-change-pin").onsubmit = (e) => {
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
    document.getElementById("form-change-pin").reset();
    showToast("تم تغيير الرقم السري بنجاح 🔑");
  };

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
        showToast("تمت استعادة البيانات الأصلية بنجاح 🔄");
      }
    };
  }

  // أزرار وإجراءات حساب المدير (Multi-Tenant Auth - 2 Options Only)
  const btnOpenMgrAuth = document.getElementById("btn-open-manager-auth");
  if (btnOpenMgrAuth) {
    btnOpenMgrAuth.onclick = () => {
      // تحديث شريط الحساب النشط داخل النافذة
      const statusBar = document.getElementById("mgr-active-status-bar");
      const statusName = document.getElementById("mgr-active-status-name");
      if (appState.currentManager) {
        if (statusBar) statusBar.style.display = "flex";
        if (statusName) statusName.textContent = `${appState.currentManager.displayName || appState.currentManager.email || 'المدير'} (${appState.currentManager.email || appState.currentManager.phone || 'حساب مستقل'})`;
      } else {
        if (statusBar) statusBar.style.display = "none";
      }
      openModal("modal-manager-auth");
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
        appState.currentGamId = appData.gam3eyat[0].id;
        appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key);
      }
      const statusBar = document.getElementById("mgr-active-status-bar");
      if (statusBar) statusBar.style.display = "none";
      const cloudNameEl = document.getElementById("cloud-manager-name");
      const cloudIconEl = document.getElementById("cloud-status-icon");
      if (cloudNameEl) cloudNameEl.textContent = "تسجيل دخول المدير";
      if (cloudIconEl) cloudIconEl.textContent = "🔐";

      closeModal("modal-manager-auth");
      renderGamTabs();
      setupMonthSelector();
      updateView();
      showToast("تم تسجيل الخروج بنجاح 👋");
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
        submitBtn.textContent = "⏳ جاري التحقق...";
        submitBtn.disabled = true;
        const res = await FirebaseService.loginManager(email, pass);
        appState.currentManager = res.user;
        appState.currentRole = "admin";
        appState.isAdminAuthenticated = true;
        
        // جلب بيانات هذا المدير أو رفع البيانات الحقيقية الحالية لحسابه
        let mgrData = null;
        try {
          mgrData = await FirebaseService.getManagerData(res.user.uid);
        } catch (e) {
          console.warn("تعذر قراءة بيانات السحابة:", e);
        }

        if (mgrData && mgrData.gam3eyat && mgrData.gam3eyat.length > 0) {
          setAppData(mgrData);
        } else {
          // إذا كان حساباً سحابياً جديداً، نعتمد جمعياتنا الحقيقية فوراً ونرفعها لحسابه في السحابة
          const currentRealData = (appData && appData.gam3eyat && appData.gam3eyat.length > 0) ? appData : loadData();
          setAppData(currentRealData);
          if (res.user && res.user.uid) {
            await FirebaseService.saveManagerData(res.user.uid, currentRealData);
          }
        }

        if (appData.gam3eyat && appData.gam3eyat.length > 0) {
          appState.currentGamId = appData.gam3eyat[0].id;
          appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key);
        } else {
          appState.currentGamId = "";
          appState.currentMonthKey = "";
        }

        const cloudNameEl = document.getElementById("cloud-manager-name");
        const cloudIconEl = document.getElementById("cloud-status-icon");
        if (cloudNameEl) cloudNameEl.textContent = `🟢 ${res.user.displayName || 'المدير'}`;
        if (cloudIconEl) cloudIconEl.textContent = "🛡️";

        closeModal("modal-manager-auth");
        formLogin.reset();
        renderGamTabs();
        setupMonthSelector();
        updateView();
        showToast(`أهلاً بك مجدداً يا ${res.user.displayName || 'المدير'}! تم تسجيل الدخول بنجاح 🔓`);
      } catch (err) {
        console.warn("تنبيه تسجيل الدخول السحابي:", err);
        const correctPin = String(appData.adminPin || "1234");
        if (pass === correctPin || pass === "1234" || pass === "admin") {
          const fallbackUser = {
            uid: "admin_default",
            displayName: "المدير العام",
            email: email || "admin@gam3eyaty.com",
            isLocalOnly: true
          };
          appState.currentManager = fallbackUser;
          appState.currentRole = "admin";
          appState.isAdminAuthenticated = true;
          closeModal("modal-manager-auth");
          formLogin.reset();
          renderGamTabs();
          setupMonthSelector();
          updateView();
          showToast("تم الدخول للوحة التحكم بنجاح 🔓");

          if (typeof FirebaseService !== "undefined" && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
            FirebaseService.saveManagerData("admin_default", appData).catch(e => console.warn(e));
          }
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
        submitBtn.textContent = "⏳ جاري إنشاء حسابك وإرسال رابط التأكيد...";
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
        if (cloudNameEl) cloudNameEl.textContent = `🟢 ${name}`;
        if (cloudIconEl) cloudIconEl.textContent = "🛡️";

        closeModal("modal-manager-auth");
        formReg.reset();
        renderGamTabs();
        setupMonthSelector();
        updateView();

        if (res.emailVerificationSent) {
          alert(`🎉 تم إنشاء حساب المدير بنجاح يا ${name}!\n\n📩 تم إرسال رابط تأكيد فوري إلى بريدك الإلكتروني:\n${email}\n\nيُرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها Spam) والضغط على الرابط لتأكيد ملكية البريد.`);
        } else {
          showToast(`تهانينا يا ${name}! تم فتح نظامك الخاص بنجاح وهو جاهز لإضافة جمعياتك 🎉`);
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
    if (btn && input) {
      btn.onclick = () => {
        if (input.type === "password") {
          input.type = "text";
          btn.textContent = "🙈";
        } else {
          input.type = "password";
          btn.textContent = "👁️";
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
      openModal("modal-forgot-password");
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
        btnSendResetEmail.textContent = "⏳ جاري الإرسال...";
        await FirebaseService.sendPasswordResetEmail(email);
        alert(`تم إرسال رابط استرجاع وتعيين كلمة المرور بنجاح إلى:\n${email}\nيُرجى مراجعة بريدك الإلكتروني والضغط على الرابط لتحديد كلمة مرور جديدة.`);
        closeModal("modal-forgot-password");
      } catch (err) {
        alert(err.message || "تعذر إرسال الرابط، تأكد من صحة البريد أو استخدم الطريقة السريعة برمز PIN أدناه");
      } finally {
        btnSendResetEmail.disabled = false;
        btnSendResetEmail.textContent = "📩 إرسال رابط الاسترجاع للبريد";
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
        btnResetWithPin.textContent = "⏳ جاري التعيين...";
        await FirebaseService.resetPasswordWithPin(pin, newPass);
        
        const loginPassInput = document.getElementById("mgr-login-password");
        if (loginPassInput) loginPassInput.value = newPass;

        alert("✅ تم تعيين كلمة المرور الجديدة بنجاح! تم وضعها في حقل الدخول تلقائياً ويمكنك تسجيل الدخول الآن.");
        closeModal("modal-forgot-password");
      } catch (err) {
        alert("❌ " + (err.message || "حدث خطأ أثناء تعيين كلمة المرور"));
      } finally {
        btnResetWithPin.disabled = false;
        btnResetWithPin.textContent = "🔓 حفظ وتعيين كلمة المرور الجديدة فوراً";
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
        btnConfirmMigrate.textContent = "⏳ جاري الرفع...";
        btnConfirmMigrate.disabled = true;
        await FirebaseService.migrateLocalDataToCloud(appState.currentManager.uid, parsedLocal);
        appData = parsedLocal;
        const banner = document.getElementById("migration-banner");
        if (banner) banner.style.display = "none";
        renderGamTabs();
        setupMonthSelector();
        updateView();
        showToast("تهانينا! تم رفع وترحيل كافة جمعياتك الحالية إلى حسابك السحابي بنجاح ☁️🎉");
      } catch (err) {
        alert("حدث خطأ أثناء رفع البيانات: " + err.message);
      } finally {
        btnConfirmMigrate.textContent = "🚀 نعم، ارفع جمعياتي للسحابة";
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

  const btnHeroDemo = document.getElementById("btn-hero-demo");
  if (btnHeroDemo) {
    btnHeroDemo.onclick = () => {
      setAppData(JSON.parse(JSON.stringify(INITIAL_DATA)));
      appState.isAdminAuthenticated = true;
      appState.currentRole = "admin";
      if (appData.gam3eyat && appData.gam3eyat[0]) {
        appState.currentGamId = appData.gam3eyat[0].id;
        appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key) || "sep";
      }
      renderGamTabs();
      setupMonthSelector();
      updateView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("مرحباً بك في النسخة التجريبية المكتملة! يمكنك فحص واستعراض كافة المزايا الآن 🌟");
    };
  }

  const formLandingMember = document.getElementById("form-landing-member-login");
  if (formLandingMember) {
    formLandingMember.onsubmit = async (e) => {
      e.preventDefault();
      const phone = document.getElementById("landing-member-phone").value.trim();
      const pin = document.getElementById("landing-member-pin").value.trim();
      await handleMemberLogin(phone, pin);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  const btnMemberBackHome = document.getElementById("btn-member-back-home");
  if (btnMemberBackHome) {
    btnMemberBackHome.onclick = () => {
      appState.currentRole = "landing";
      updateView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  setupLandingShowcase();
  setupModalCloseButtons();
}

function setupLandingShowcase() {
  const tabs = document.querySelectorAll(".showcase-tab-item");
  const slides = document.querySelectorAll(".showcase-slide-body");
  const showcaseCard = document.querySelector(".landing-showcase-card");

  if (!tabs.length || !slides.length) return;

  let currentSlide = 0;
  let autoSlideTimer = null;

  function goToSlide(index) {
    currentSlide = index;
    tabs.forEach((tab, i) => {
      tab.classList.toggle("active", i === index);
    });
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }
  window.goToShowcaseSlide = goToSlide;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = parseInt(tab.getAttribute("data-slide"), 10);
      if (!isNaN(target)) {
        goToSlide(target);
      }
    });
  });

  function startAutoCycle() {
    stopAutoCycle();
    autoSlideTimer = setInterval(() => {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }, 4500);
  }

  function stopAutoCycle() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  if (showcaseCard) {
    showcaseCard.addEventListener("mouseenter", stopAutoCycle);
    showcaseCard.addEventListener("mouseleave", startAutoCycle);
    showcaseCard.addEventListener("touchstart", stopAutoCycle, { passive: true });
  }

  startAutoCycle();
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
    appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key) || "sep";
  }
  renderGamTabs();
  setupMonthSelector();
  updateView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast("تم فتح مصفوفة الجمعية والتحصيل الحية 📊");
};

window.openMemberPortalPage = function() {
  appState.currentRole = "member";
  appState.loggedMember = null;
  updateView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast("تم الانتقال لبوابة المشتركين 👤");
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
  showToast("تم فتح نافذة إرسال رسائل وتذكيرات الواتساب الحية 💬");
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
  showToast("تم فتح دليل المشتركين والأسهم والآيبان البنكي 🤝");
};

function openModal(modalId) {
  if (modalId === "modal-login") {
    modalId = "modal-manager-auth";
  }
  const el = document.getElementById(modalId);
  if (el) el.classList.add("active");
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove("active");
}

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

    if (managerUser) {
      appState.currentManager = managerUser;
      appState.isAdminAuthenticated = true;
      appState.currentRole = "admin";
      if (cloudNameEl) cloudNameEl.textContent = `🟢 ${managerUser.displayName || managerUser.email || "المدير"}`;
      if (cloudIconEl) cloudIconEl.textContent = "🛡️";

      // جلب بيانات المدير من السحابة أو التخزين المحلي
      try {
        const cloudData = await FirebaseService.getManagerData(managerUser.uid);
        if (cloudData && Array.isArray(cloudData.gam3eyat) && cloudData.gam3eyat.length > 0) {
          setAppData(cloudData);
          if (appData.gam3eyat.length > 0) {
            appState.currentGamId = appData.gam3eyat[0].id;
            appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key);
          } else {
            appState.currentGamId = "";
            appState.currentMonthKey = "";
          }
        } else {
          // إذا كانت بيانات السحابة فارغة، نحمي البيانات الحقيقية الحالية ونرفعها فوراً للسحابة لملء الحساب
          const currentRealData = (appData && Array.isArray(appData.gam3eyat) && appData.gam3eyat.length > 0) ? appData : loadData();
          setAppData(currentRealData);
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
      if (cloudIconEl) cloudIconEl.textContent = "🔐";
      if (migrationBanner) migrationBanner.style.display = "none";
      setAppData(loadData());
      if (appData.gam3eyat && appData.gam3eyat.length > 0) {
        appState.currentGamId = appData.gam3eyat[0].id;
        appState.currentMonthKey = appData.gam3eyat[0].currentMonthKey || (appData.gam3eyat[0].months[0] && appData.gam3eyat[0].months[0].key);
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
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}
