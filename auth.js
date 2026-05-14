const authOverlay    = document.querySelector("#authOverlay");
const authLoading    = document.querySelector("#authLoading");
const authCard       = document.querySelector("#authCard");
const loginTabBtn    = document.querySelector("#loginTabBtn");
const registerTabBtn = document.querySelector("#registerTabBtn");
const authForm       = document.querySelector("#authForm");
const authEmail      = document.querySelector("#authEmail");
const authPassword   = document.querySelector("#authPassword");
const authError      = document.querySelector("#authError");
const authSubmitBtn  = document.querySelector("#authSubmitBtn");
const forgotBtn      = document.querySelector("#forgotPasswordBtn");
const logoutBtn      = document.querySelector("#logoutBtn");
const authUserEmail  = document.querySelector("#authUserEmail");

// ── Als Firebase nie opgestel is nie, spring oor auth ──────────────────────
if (!window.firebaseConfigured) {
  authOverlay.classList.add("hidden");
  window.initApp();
} else {

  // ── Helpers ───────────────────────────────────────────────────────────────
  let authMode = "login";

  function setMode(mode) {
    authMode = mode;
    loginTabBtn.classList.toggle("active", mode === "login");
    registerTabBtn.classList.toggle("active", mode === "register");
    authSubmitBtn.textContent = mode === "register" ? "Registreer" : "Aanmeld";
    authPassword.autocomplete  = mode === "register" ? "new-password" : "current-password";
    clearError();
  }

  function showError(msg, isSuccess = false) {
    authError.textContent = msg;
    authError.classList.remove("hidden");
    authError.classList.toggle("auth-error--success", isSuccess);
  }

  function clearError() {
    authError.classList.add("hidden");
    authError.classList.remove("auth-error--success");
  }

  function firebaseMsg(code) {
    const map = {
      "auth/email-already-in-use":  "Hierdie e-pos is al geregistreer. Meld aan.",
      "auth/invalid-email":         "Ongeldige e-pos adres.",
      "auth/weak-password":         "Wagwoord moet minstens 6 karakters wees.",
      "auth/user-not-found":        "Geen rekening met hierdie e-pos nie.",
      "auth/wrong-password":        "Verkeerde wagwoord.",
      "auth/invalid-credential":    "Verkeerde e-pos of wagwoord.",
      "auth/too-many-requests":     "Te veel pogings. Probeer later weer.",
      "auth/network-request-failed":"Geen internet verbinding.",
    };
    return map[code] || "Iets het fout gegaan. Probeer weer.";
  }

  function setBusy(busy) {
    authSubmitBtn.disabled = busy;
    authSubmitBtn.textContent = busy
      ? (authMode === "register" ? "Registreer..." : "Aanmeld...")
      : (authMode === "register" ? "Registreer" : "Aanmeld");
  }

  // ── Tab events ─────────────────────────────────────────────────────────────
  loginTabBtn.addEventListener("click",    () => setMode("login"));
  registerTabBtn.addEventListener("click", () => setMode("register"));

  // ── Submit ─────────────────────────────────────────────────────────────────
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email    = authEmail.value.trim();
    const password = authPassword.value;
    setBusy(true);
    clearError();
    try {
      if (authMode === "register") {
        await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
      } else {
        await window.firebaseAuth.signInWithEmailAndPassword(email, password);
      }
      // onAuthStateChanged handles the rest
    } catch (err) {
      showError(firebaseMsg(err.code));
    } finally {
      setBusy(false);
    }
  });

  // ── Forgot password ─────────────────────────────────────────────────────────
  forgotBtn.addEventListener("click", async () => {
    const email = authEmail.value.trim();
    if (!email) {
      showError("Tik eers jou e-pos in.");
      return;
    }
    try {
      await window.firebaseAuth.sendPasswordResetEmail(email);
      showError("Reset e-pos gestuur! Kyk jou inkassie.", true);
    } catch (err) {
      showError(firebaseMsg(err.code));
    }
  });

  // ── Logout ──────────────────────────────────────────────────────────────────
  logoutBtn.addEventListener("click", async () => {
    if (window.contextTimer) {
      clearInterval(window.contextTimer);
      window.contextTimer = null;
    }
    await window.firebaseAuth.signOut();
  });

  // ── Auth state listener ─────────────────────────────────────────────────────
  window.firebaseAuth.onAuthStateChanged(async (user) => {
    if (user) {
      // Show loading spinner while we fetch cloud data
      authLoading.classList.remove("hidden");
      authCard.classList.add("hidden");

      await window.loadFromFirestore(user.uid);

      authOverlay.classList.add("hidden");
      authUserEmail.textContent = user.email;
      window.initApp();
    } else {
      // Show login form
      authLoading.classList.add("hidden");
      authCard.classList.remove("hidden");
      authOverlay.classList.remove("hidden");
      authUserEmail.textContent = "";
      authEmail.value    = "";
      authPassword.value = "";
      clearError();
    }
  });

} // end if firebaseConfigured
