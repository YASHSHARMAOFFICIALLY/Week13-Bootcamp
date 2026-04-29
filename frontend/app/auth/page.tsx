"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const form = new FormData(event.currentTarget);
    const body =
      mode === "signup"
        ? {
            name: String(form.get("name") ?? ""),
            username: String(form.get("username") ?? ""),
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          }
        : {
            username: String(form.get("username") ?? ""),
            password: String(form.get("password") ?? ""),
          };

    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Request failed");
      }

      if (mode === "signup") {
        setMessage("Account created. Sign in with your username.");
        setMode("signin");
        return;
      }

      localStorage.setItem("learning_token", data.token);
      localStorage.setItem("learning_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link href="/" className="brand">
          LearnTrack
        </Link>
        <Link className="button secondary" href="/">
          Home
        </Link>
      </nav>

      <section className="page auth-wrap">
        <div className="panel">
          <h1>Welcome back.</h1>
          <p>
            Access your dashboard, submit solved problems, and keep your course
            progress up to date.
          </p>
        </div>

        <div className="panel">
          <div className="tabs" aria-label="Authentication mode">
            <button
              className={mode === "signin" ? "tab active" : "tab"}
              type="button"
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              className={mode === "signup" ? "tab active" : "tab"}
              type="button"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </>
            ) : null}

            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" autoComplete="username" required />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
            </div>

            {message ? <div className="message">{message}</div> : null}
            {error ? <div className="message error">{error}</div> : null}

            <button className="button" disabled={loading} type="submit">
              {loading ? "Please wait" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
