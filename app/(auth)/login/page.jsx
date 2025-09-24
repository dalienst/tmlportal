"use client";

import { signIn, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    const session = await getSession();

    if (response?.error) {
      toast?.error("Invalid email or password");
    } else {
      toast?.success("Login successful! Redirecting...");
      if (session?.user?.is_admin === true) {
        router.push("/admin");
      } else if (session?.user?.is_gm === true) {
        router.push("/gm");
      } else if (session?.user?.is_finance === true) {
        router.push("/finance");
      } else if (session?.user?.is_reservations === true) {
        router.push("/reservations");
      } else if (session?.user?.is_manager === true) {
        router.push("/manager");
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };
  return <div>Login</div>;
}

export default Login;
