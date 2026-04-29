import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="shell">
      <nav className="nav">
        <Link href="/" className="brand">
          LearnTrack
        </Link>
        <div className="nav-actions">
          <Link className="button" href="/auth">
            Start
          </Link>
        </div>
      </nav>

      <section className="page hero">
        <div>
          <p className="eyebrow">Personal learning platform</p>
          <h1>Practice problems. See progress clearly.</h1>
          <p>
            Sign in, submit solved problem IDs, and track completion across your
            courses from one simple dashboard.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/auth">
              Continue
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Student learning dashboard" />
      </section>
    </main>
  );
}
