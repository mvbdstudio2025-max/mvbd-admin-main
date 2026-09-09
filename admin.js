import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  doc,
  getDoc
} from "./firebase-config.js";

const loginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  loginError.textContent = "";

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = credential.user.uid;

    const userSnap = await getDoc(doc(db, "users", uid));

    if (!userSnap.exists()) {
      await signOut(auth);
      throw new Error("Admin profile not found.");
    }

    const userData = userSnap.data();

    if (userData.role !== "admin") {
      await signOut(auth);
      throw new Error("You are not authorized as admin.");
    }

    window.location.href = "./dashboard.html";

  } catch (error) {
    console.error(error);
    loginError.textContent =
      error?.message || "Admin login failed.";
  }
});
