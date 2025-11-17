"use client";

import { auth, provider } from "@/app/firebase";
import { signInWithPopup } from "firebase/auth";

export default function AdminLogin() {
  async function login() {
    await signInWithPopup(auth, provider);
  }

  return (
    <button onClick={login} className="p-3 bg-blue-600 text-white rounded-xl">
      Login with Google
    </button>
  );
}