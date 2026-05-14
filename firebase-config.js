// ============================================================
// FIREBASE KONFIGURASIE
// ============================================================
// 1. Gaan na: https://console.firebase.google.com
// 2. Klik "Add project" en gee dit 'n naam (bv. lol-review-coach)
// 3. In die projek: klik die </> web-ikoon om 'n Web App te registreer
// 4. Kopieer die config-waardes hieronder in
// 5. Aktiveer "Email/Password" auth:
//    Authentication → Sign-in method → Email/Password → Enable
// 6. Stel Firestore Security Rules in:
//    Firestore Database → Rules → plak die reëls hieronder in
//
// FIRESTORE SECURITY RULES:
// ─────────────────────────
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{userId} {
//       allow read, write: if request.auth != null && request.auth.uid == userId;
//     }
//   }
// }
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyAEvVN_hxrkyg-aleIvkZ07Q5akqexKcCM",
  authDomain:        "summoner-coach.firebaseapp.com",
  projectId:         "summoner-coach",
  storageBucket:     "summoner-coach.firebasestorage.app",
  messagingSenderId: "631465941940",
  appId:             "1:631465941940:web:86006e0f2e47cf981530e1",
};

const firebaseConfigured = firebaseConfig.apiKey !== "VERVANG_MET_JOU_API_KEY";
window.firebaseConfigured = firebaseConfigured;

if (firebaseConfigured) {
  firebase.initializeApp(firebaseConfig);
  window.firebaseAuth = firebase.auth();
  window.firebaseDb   = firebase.firestore();
}
