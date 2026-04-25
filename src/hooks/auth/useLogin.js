// src/hooks/auth/useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (result.success) {
        // Fix: result.data IS the user object, there is no nested 'user' property
        const userData = result.data;

        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);

        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Server connection failed (CORS/Down)."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
};
