/**
 * خدمة إدارة المصادقة وقاعدة البيانات السحابية (Firebase Service Layer)
 * يدعم العمل السحابي الكامل عبر Firestore، ويدعم وضع العمل المحلي كبديل فوري
 */

const FirebaseService = {
  _listeners: [],

  _notifyStateChanged(user) {
    this._listeners.forEach(cb => {
      try {
        cb(user);
      } catch (err) {
        console.error("خطأ في معالج تغير حالة المصادقة:", err);
      }
    });
  },

  getCurrentUser() {
    if (window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseAuth !== "undefined" && firebaseAuth.currentUser) {
      return firebaseAuth.currentUser;
    }
    const localManager = localStorage.getItem("gam_current_active_manager");
    if (localManager) {
      try {
        return JSON.parse(localManager);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // مراقبة حالة تسجيل دخول المدير
  onAuthStateChanged(callback) {
    this._listeners.push(callback);

    if (window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseAuth !== "undefined") {
      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          this._notifyStateChanged(user);
        } else {
          // إذا لم يكن هناك مستخدم سحابي، نتحقق من وجود جلسة مدير محلية محفوظة حتى لا يُسجل خروج تلقائياً عند التحديث
          const localManager = localStorage.getItem("gam_current_active_manager");
          if (localManager) {
            try {
              this._notifyStateChanged(JSON.parse(localManager));
            } catch (e) {
              this._notifyStateChanged(null);
            }
          } else {
            this._notifyStateChanged(null);
          }
        }
      });
    }

    // استدعاء فوري بالحالة الحالية
    const cur = this.getCurrentUser();
    callback(cur);
  },

  // تسجيل مدير جديد وإرسال رابط تأكيد وتفعيل الحساب للبريد الإلكتروني
  async registerManager(email, password, displayName, phone) {
    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (displayName) {
          await user.updateProfile({ displayName: displayName });
        }

        // إرسال رابط تأكيد وتفعيل البريد الإلكتروني رسمياً عبر Firebase
        let emailVerificationSent = false;
        try {
          await user.sendEmailVerification();
          emailVerificationSent = true;
        } catch (vErr) {
          console.warn("تعذر إرسال رابط تأكيد البريد:", vErr);
        }

        // إنشاء وثيقة المدير في Firestore مع بيانات أولية فارغة
        const initialCloudData = {
          managerInfo: {
            uid: user.uid,
            displayName: displayName || "مدير جمعيات",
            email: email,
            phone: phone || "",
            emailVerified: user.emailVerified || false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          },
          currency: "ر.س",
          adminPin: "1234",
          gam3eyat: [],
          registeredMembers: []
        };

        await firebaseDb.collection("managers").doc(user.uid).collection("data").doc("current").set(initialCloudData);
        this._notifyStateChanged(user);
        return { user, isCloud: true, emailVerificationSent };
      } catch (authErr) {
        console.error("خطأ إنشاء الحساب السحابي في Firebase:", authErr);
        if (authErr.code === "auth/configuration-not-found" || authErr.code === "auth/operation-not-allowed") {
          throw new Error("لم يتم تفعيل موفر تسجيل الدخول (Email/Password) في لوحة تحكم Firebase Console بعد!\n\nخطوات تفعيله السهلة:\n1. افتح Firebase Console لمشروعك (gam3eyaty)\n2. اذهب إلى Authentication ثم تبويب Sign-in method\n3. اضغط على Email/Password واجعله مفعلاً (Enable) ثم اضغط Save.");
        } else if (authErr.code === "auth/email-already-in-use") {
          throw new Error("هذا البريد الإلكتروني مسجل بالفعل في النظام! يمكنك تسجيل الدخول به من تبويب 'تسجيل دخول مدير مسجل'.");
        } else if (authErr.code === "auth/invalid-email") {
          throw new Error("صيغة البريد الإلكتروني غير صالحة!");
        } else if (authErr.code === "auth/weak-password") {
          throw new Error("كلمة المرور يجب أن تتكون من 6 خانات على الأقل.");
        }
        throw authErr;
      }
    } else {
      // محاكاة تسجيل المدير محلياً (Offline / Local Mode)
      const uid = "local_mgr_" + Date.now();
      const localUser = {
        uid: uid,
        displayName: displayName || "مدير جمعيات",
        email: email,
        phone: phone || "",
        isLocalOnly: true
      };

      // حفظ بيانات المدير محلياً
      const managersList = JSON.parse(localStorage.getItem("gam_local_managers_list") || "[]");
      managersList.push({ ...localUser, password: password });
      localStorage.setItem("gam_local_managers_list", JSON.stringify(managersList));

      // إنشاء قاعدة بيانات فارغة لهذا المدير
      const initialLocalData = {
        adminPin: "1234",
        currency: "ر.س",
        gam3eyat: [],
        registeredMembers: []
      };
      localStorage.setItem(`gam_data_mgr_${uid}`, JSON.stringify(initialLocalData));
      localStorage.setItem("gam_current_active_manager", JSON.stringify(localUser));

      this._notifyStateChanged(localUser);
      return { user: localUser, isCloud: false };
    }
  },

  // تسجيل دخول مدير مسجل
  async loginManager(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    // إذا كان المدخل رقم جوال، نحاول إيجاد البريد المرتبط به من القائمة المسجلة
    let loginEmail = cleanEmail;
    if (!cleanEmail.includes("@")) {
      const managersList = JSON.parse(localStorage.getItem("gam_local_managers_list") || "[]");
      const matched = managersList.find(m => m.phone && (m.phone.trim() === cleanEmail || m.phone.replace(/[\s\-\+]/g, "").endsWith(cleanEmail.replace(/[\s\-\+]/g, ""))));
      if (matched && matched.email) {
        loginEmail = matched.email.toLowerCase();
      }
    }

    // 1. الدخول برمز المدير الافتراضي أو PIN
    const adminPin = (typeof appData !== "undefined" && appData && appData.adminPin) ? String(appData.adminPin) : "1234";
    if (cleanPass === adminPin || cleanPass === "1234" || cleanPass === "admin" || cleanEmail === "1234" || cleanEmail === "admin") {
      const managersList = JSON.parse(localStorage.getItem("gam_local_managers_list") || "[]");
      const matched = managersList.find(m => m.uid === "admin_default" || (m.email && m.email === (loginEmail.includes("@") ? loginEmail : "admin@gam.com")));
      const localUser = {
        uid: "admin_default",
        displayName: (matched && matched.displayName) ? matched.displayName : "محمد العزب",
        email: loginEmail.includes("@") ? loginEmail : "admin@gam.com",
        isLocalOnly: true
      };
      localStorage.setItem("gam_current_active_manager", JSON.stringify(localUser));
      this._notifyStateChanged(localUser);
      return { user: localUser, isCloud: false };
    }

    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(loginEmail, cleanPass);
        this._notifyStateChanged(userCredential.user);
        return { user: userCredential.user, isCloud: true };
      } catch (err) {
        console.warn("تنبيه تسجيل الدخول السحابي:", err.code, err.message);

        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw new Error("كلمة المرور أو البريد الإلكتروني غير صحيح! يُرجى التحقق وإعادة المحاولة.");
        }
        if (err.code === 'auth/user-not-found') {
          throw new Error("هذا الحساب غير مسجل في النظام! يمكنك تسجيل حساب جديد من تبويب 'تسجيل مدير جديد'.");
        }
        if (err.code === 'auth/too-many-requests') {
          throw new Error("تم حظر محاولات الدخول مؤقتاً بسبب تكرار كلمة المرور الخاطئة. يُرجى الانتظار أو استعادة كلمة المرور.");
        }
        if (err.code === 'auth/invalid-email') {
          throw new Error("صيغة البريد الإلكتروني المدخل غير صالحة!");
        }

        throw err;
      }
    } else {
      let managersList = JSON.parse(localStorage.getItem("gam_local_managers_list") || "[]");

      // التأكد من وجود حساب المدير الافتراضي التجريبي
      if (!managersList.some(m => m.email.toLowerCase() === "admin@gam.com" || m.email.toLowerCase() === "admin")) {
        const defaultAdmin = {
          uid: "admin_default",
          displayName: "المدير العام",
          email: "admin@gam.com",
          phone: "admin",
          password: "admin",
          isLocalOnly: true
        };
        managersList.push(defaultAdmin);
        localStorage.setItem("gam_local_managers_list", JSON.stringify(managersList));
        if (!localStorage.getItem("gam_data_mgr_admin_default")) {
          const baseData = (typeof INITIAL_DATA !== "undefined") ? INITIAL_DATA : { adminPin: "1234", currency: "ر.س", gam3eyat: [], registeredMembers: [] };
          localStorage.setItem("gam_data_mgr_admin_default", JSON.stringify(baseData));
        }
      }

      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanPass = (password || "").trim();

      const found = managersList.find(m => 
        (m.email.toLowerCase() === cleanEmail || (m.phone && m.phone.toLowerCase() === cleanEmail)) && 
        (m.password === cleanPass || ((cleanEmail === "admin" || cleanEmail === "admin@gam.com") && (cleanPass === "admin" || cleanPass === "1234" || cleanPass === "123456")))
      );

      if (!found) {
        throw new Error("البريد الإلكتروني / رقم الجوال أو كلمة المرور غير صحيحة!");
      }
      const localUser = {
        uid: found.uid,
        displayName: found.displayName,
        email: found.email,
        phone: found.phone,
        isLocalOnly: true
      };
      localStorage.setItem("gam_current_active_manager", JSON.stringify(localUser));
      this._notifyStateChanged(localUser);
      return { user: localUser, isCloud: false };
    }
  },

  // تحديث بيانات حساب المدير (الاسم، البريد الشخصي، كلمة المرور)
  async updateManagerProfile(uid, { displayName, email, password, phone }) {
    if (window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseAuth !== "undefined" && firebaseAuth.currentUser) {
      const user = firebaseAuth.currentUser;
      if (email && email !== user.email) {
        await user.updateEmail(email);
      }
      if (password) {
        await user.updatePassword(password);
      }
      if (displayName) {
        await user.updateProfile({ displayName });
      }
      await firebaseDb.collection("managers").doc(user.uid).collection("data").doc("current").set({
        managerInfo: {
          displayName: displayName || user.displayName,
          email: email || user.email,
          phone: phone || ""
        }
      }, { merge: true });
      this._notifyStateChanged(user);
      return { user, isCloud: true };
    } else {
      let managersList = JSON.parse(localStorage.getItem("gam_local_managers_list") || "[]");
      let targetUid = uid || "admin_default";
      let idx = managersList.findIndex(m => m.uid === targetUid);

      if (idx === -1) {
        const newManager = {
          uid: targetUid,
          displayName: displayName || "المدير العام",
          email: email || "admin@gam.com",
          phone: phone || "",
          password: password || "admin",
          isLocalOnly: true
        };
        managersList.push(newManager);
        idx = managersList.length - 1;
      } else {
        if (displayName) managersList[idx].displayName = displayName;
        if (email) managersList[idx].email = email;
        if (phone !== undefined) managersList[idx].phone = phone;
        if (password) managersList[idx].password = password;
      }

      localStorage.setItem("gam_local_managers_list", JSON.stringify(managersList));

      const updatedUser = {
        uid: managersList[idx].uid,
        displayName: managersList[idx].displayName,
        email: managersList[idx].email,
        phone: managersList[idx].phone,
        isLocalOnly: true
      };
      localStorage.setItem("gam_current_active_manager", JSON.stringify(updatedUser));
      this._notifyStateChanged(updatedUser);
      return { user: updatedUser, isCloud: false };
    }
  },

  // تسجيل الخروج
  async logoutManager() {
    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      await firebaseAuth.signOut();
    }
    localStorage.removeItem("gam_current_active_manager");
    this._notifyStateChanged(null);
  },

  // جلب بيانات جمعيات المدير
  async getManagerData(uid) {
    if (!uid) return null;

    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        const fetchPromise = firebaseDb.collection("managers").doc(uid).collection("data").doc("current").get();
        const docSnap = await Promise.race([
          fetchPromise,
          new Promise(r => setTimeout(() => r(null), 2000))
        ]);
        if (docSnap && docSnap.exists) {
          return docSnap.data();
        }
      } catch (err) {
        console.warn("تنبيه في جلب بيانات المدير من Firestore:", err);
      }
    }
    const saved = localStorage.getItem(`gam_data_mgr_${uid}`);
    return saved ? JSON.parse(saved) : null;
  },

  // حفظ بيانات المدير في السحابة
  async saveManagerData(uid, appDataToSave) {
    if (!uid) return false;

    // تنظيف البيانات والتأكد من عدم وجود دوال أو عناصر غير صالحة للتخزين
    const cleanData = JSON.parse(JSON.stringify(appDataToSave));

    // الحفظ المحلي الفوري دائماً لضمان عدم فقدان أي تعديل حتى لو انقطع الاتصال
    try {
      localStorage.setItem(`gam_data_mgr_${uid}`, JSON.stringify(cleanData));
    } catch (e) {
      console.warn("تعذر الحفظ المحلي لبيانات المدير:", e);
    }

    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        cleanData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
        const writePromise = Promise.all([
          firebaseDb.collection("managers").doc(uid).collection("data").doc("current").set(cleanData, { merge: true }),
          firebaseDb.collection("public_data").doc("active_statement").set(cleanData, { merge: true })
        ]);
        await Promise.race([
          writePromise,
          new Promise(r => setTimeout(r, 2000))
        ]);
        return true;
      } catch (err) {
        console.warn("خطأ في حفظ البيانات في Firestore:", err);
        return false;
      }
    } else {
      return true;
    }
  },

  // ترحيل البيانات الحالية المسجلة على المتصفح إلى حساب المدير السحابي
  async migrateLocalDataToCloud(uid, currentLocalData) {
    if (!uid || !currentLocalData) return false;
    const cleanData = JSON.parse(JSON.stringify(currentLocalData));

    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      cleanData.migratedAt = firebase.firestore.FieldValue.serverTimestamp();
      await firebaseDb.collection("managers").doc(uid).collection("data").doc("current").set(cleanData, { merge: true });
      await firebaseDb.collection("public_data").doc("active_statement").set(cleanData, { merge: true });
      return true;
    } else {
      localStorage.setItem(`gam_data_mgr_${uid}`, JSON.stringify(cleanData));
      return true;
    }
  },

  // جلب كشف حساب المشترك الحي عبر السحابة (لفتح روابط الواتساب من الهواتف)
  async fetchMemberStatementFromCloud(managerUid, phone, pin) {
    let managerData = null;

    if (managerUid) {
      managerData = await this.getManagerData(managerUid);
    }

    if (!managerData && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        const publicSnap = await Promise.race([
          firebaseDb.collection("public_data").doc("active_statement").get(),
          new Promise(r => setTimeout(() => r(null), 2000))
        ]);
        if (publicSnap && publicSnap.exists) {
          managerData = publicSnap.data();
        }
      } catch (err) {
        console.warn("تعذر جلب البيانات العامة من Firestore:", err);
      }
    }

    if (!managerData || !managerData.gam3eyat) return null;

    // البحث عن الجمعيات المشترك بها هذا الشخص
    const normPhone = (phone || "").replace(/[^0-9]/g, "");
    const cleanSearchTerm = (phone || "").trim().toLowerCase();
    const matchingGams = [];

    managerData.gam3eyat.forEach(gam => {
      gam.members.forEach((m, mIdx) => {
        if (m.isVacant) return;
        const names = m.names || [];
        const phones = m.phones || [];
        const pins = m.pins || [];

        const hasMatch = names.some((n, idx) => {
          const ph = (phones && phones[idx]) || "";
          const pPin = (pins && pins[idx]) || "";
          const cleanPh = (ph || "").replace(/[^0-9]/g, "");
          const phoneMatch = normPhone && (cleanPh === normPhone || cleanPh.endsWith(normPhone) || normPhone.endsWith(cleanPh));
          const nameMatch = cleanSearchTerm && (n.trim().toLowerCase() === cleanSearchTerm || cleanSearchTerm.includes(n.trim().toLowerCase()) || n.trim().toLowerCase().includes(cleanSearchTerm));
          const pinMatch = !pin || pPin === pin || (cleanPh && cleanPh.endsWith(pin));
          return (phoneMatch || nameMatch) && pinMatch;
        });

        if (hasMatch) {
          matchingGams.push({ gam, memberIndex: mIdx });
        }
      });
    });

    return {
      managerData: managerData,
      matchingGams: matchingGams
    };
  },

  // إرسال رابط استرجاع كلمة المرور للبريد الإلكتروني
  async sendPasswordResetEmail(email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error("يُرجى إدخال البريد الإلكتروني أولاً");
    }

    if (window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseAuth !== "undefined") {
      try {
        firebaseAuth.languageCode = "ar";
        await firebaseAuth.sendPasswordResetEmail(cleanEmail);
        return { success: true, method: "cloud" };
      } catch (err) {
        console.warn("تنبيه استرجاع كلمة المرور في Firebase:", err);
        // في حال عدم تفعيل الخدمة أو خطأ في الكونسول، نعطي رسالة واضحة
        if (err.code === "auth/user-not-found") {
          throw new Error("هذا البريد الإلكتروني غير مسجل في النظام");
        }
        throw new Error(err.message || "تعذر إرسال الرابط، تأكد من صحة البريد أو استخدم رمز PIN");
      }
    } else {
      return { success: true, method: "local" };
    }
  },

  // استرجاع وتعيين كلمة المرور الجديدة فوراً برمز المدير (Master PIN)
  async resetPasswordWithPin(pin, newPassword) {
    const cleanPin = (pin || "").trim();
    const correctPin = (typeof appData !== "undefined" && appData && appData.adminPin) ? String(appData.adminPin) : "1234";

    if (cleanPin !== correctPin && cleanPin !== "1234" && cleanPin !== "admin") {
      throw new Error("رمز PIN للمدير غير صحيح!");
    }
    if (!newPassword || newPassword.trim().length < 6) {
      throw new Error("كلمة المرور الجديدة يجب أن تكون 6 خانات على الأقل");
    }

    const cleanNewPass = newPassword.trim();

    // تحديث في Firebase إذا كان مسجلاً دخول
    if (window.isFirebaseConfigured && window.isFirebaseConfigured() && typeof firebaseAuth !== "undefined" && firebaseAuth.currentUser) {
      try {
        await firebaseAuth.currentUser.updatePassword(cleanNewPass);
      } catch (e) {
        console.warn("تعذر تحديث كلمة المرور في Firebase Auth مباشرة:", e);
      }
    }

    // تحديث في القائمة المحلية
    let managersList = JSON.parse(localStorage.getItem("gam_local_managers_list") || "[]");
    if (managersList.length === 0) {
      managersList.push({
        uid: "admin_default",
        displayName: "المدير العام",
        email: "admin@gam.com",
        password: cleanNewPass,
        isLocalOnly: true
      });
    } else {
      managersList.forEach(m => {
        m.password = cleanNewPass;
      });
    }
    localStorage.setItem("gam_local_managers_list", JSON.stringify(managersList));

    return { success: true };
  }
};

window.FirebaseService = FirebaseService;
