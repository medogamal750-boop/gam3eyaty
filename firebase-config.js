/**
 * إعدادات وتهيئة خدمات Google Firebase السحابية
 * تدعم:
 * 1. مصادقة حسابات المديرين (Firebase Authentication)
 * 2. قاعدة البيانات السحابية الحية (Cloud Firestore)
 * 3. العمل في الوضع المحلي (Offline Fallback) إذا لم يتم إدخال مفاتيح المشروع بعد
 */

const firebaseConfig = {
  apiKey: "AIzaSyBUqppGAk06E6dOidbSsTrKLMKrYjpCx1E",
  authDomain: "gam3eyaty.firebaseapp.com",
  projectId: "gam3eyaty",
  storageBucket: "gam3eyaty.firebasestorage.app",
  messagingSenderId: "739785094672",
  appId: "1:739785094672:web:2f546c2ba867ce649afc95",
  measurementId: "G-B1XTZJL2MX"
};

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseInitialized = false;

try {
  // التحقق من تحميل مكتبات Firebase من الـ CDN
  if (typeof firebase !== "undefined" && firebase.initializeApp) {
    const isConfigValid = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("DEMO_KEY");
    
    if (isConfigValid) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firebaseAuth = firebase.auth();
      firebaseAuth.languageCode = "ar"; // تعيين لغة الإيميلات وصفحات المصادقة إلى العربية
      firebaseDb = firebase.firestore();
      isFirebaseInitialized = true;
      console.log("🟢 تم تفعيل Google Firebase بنجاح (وضع السحابة الحية)");
    } else {
      console.log("ℹ️ Firebase جاهز برمجياً وبانتظار وضع مفاتيح مشروعك في firebase-config.js");
    }
  }
} catch (error) {
  console.warn("⚠️ لم يتم تهيئة Firebase:", error.message);
  isFirebaseInitialized = false;
}

window.isFirebaseConfigured = function() {
  return isFirebaseInitialized && firebaseAuth !== null && firebaseDb !== null;
};
