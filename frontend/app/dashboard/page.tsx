"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type ProgressItem = {
  courseId: number;
  course: string;
  completionPercentage: string;
  completedAt: string | null;
};

type User = {
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProgress(authToken: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/progress`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Could not load progress");
      }

      setProgress(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("learning_token");
    const storedUser = localStorage.getItem("learning_user");

    if (!storedToken) {
      router.push("/auth");
      return;
    }

    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
    loadProgress(storedToken);
  }, [router]);

  async function handleSubmitProblem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    const form = new FormData(event.currentTarget);
    const problemId = Number(form.get("problemId"));

    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ problemId }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Could not submit problem");
      }

      setMessage("Problem submitted. Progress updated.");
      event.currentTarget.reset();
      await loadProgress(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function logout() {
    localStorage.removeItem("learning_token");
    localStorage.removeItem("learning_user");
    router.push("/");
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link href="/" className="brand">
          LearnTrack
        </Link>
        <div className="nav-actions">
          <Link className="button secondary" href="/">
            Home
          </Link>
          <button className="button secondary" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="page">
        <div className="dashboard-head">
          <div>
            <h1>{user ? `${user.name}'s progress` : "Your progress"}</h1>
            <p className="muted">
              Submit solved problems and review your course completion.
            </p>
          </div>
          <button className="button secondary" type="button" onClick={() => loadProgress(token)}>
            Refresh
          </button>
        </div>

        <div className="grid">
          <section className="panel">
            <h2>Course progress</h2>
            <div className="progress-list">
              {loading ? <p className="muted">Loading progress...</p> : null}
              {!loading && progress.length === 0 ? (
                <p className="muted">No progress yet. Submit problem ID 1 to begin.</p>
              ) : null}
              {progress.map((item) => {
                const percent = Number(item.completionPercentage);

                return (
                  <article className="progress-row" key={item.courseId}>
                    <div className="progress-meta">
                      <strong>{item.course}</strong>
                      <span>{item.completionPercentage}%</span>
                    </div>
                    <div className="bar" aria-label={`${item.course} progress`}>
                      <span style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>
                    <small className="muted">
                      Course #{item.courseId}
                      {item.completedAt ? " - completed" : ""}
                    </small>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="panel">
            <h2>Submit problem</h2>
            <p>Enter the problem ID you solved. Progress updates immediately.</p>
            <form className="form" onSubmit={handleSubmitProblem}>
              <div className="field">
                <label htmlFor="problemId">Problem ID</label>
                <input
                  id="problemId"
                  name="problemId"
                  type="number"
                  min="1"
                  placeholder="1"
                  required
                />
              </div>

              {message ? <div className="message">{message}</div> : null}
              {error ? <div className="message error">{error}</div> : null}

              <button className="button" disabled={submitting || !token} type="submit">
                {submitting ? "Submitting" : "Submit"}
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}
