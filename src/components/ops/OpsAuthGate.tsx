import { useEffect, useState, type FormEvent } from "react";
import { opsLogin } from "@/lib/opsClient";

interface OpsAuthGateProps {
  onAuthed: () => void;
}

const LOCKOUT_KEY = "opsLockoutUntil";
const ATTEMPTS_KEY = "opsAttempts";
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 60_000;
const LOCKOUT_MS = 5 * 60_000;

interface AttemptLog {
  ts: number;
}

function readAttempts(): AttemptLog[] {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AttemptLog[];
  } catch {
    return [];
  }
}

function recordFailedAttempt(): number {
  const now = Date.now();
  const recent = readAttempts().filter((a) => now - a.ts < ATTEMPT_WINDOW_MS);
  recent.push({ ts: now });
  sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(recent));
  if (recent.length >= MAX_ATTEMPTS) {
    const until = now + LOCKOUT_MS;
    sessionStorage.setItem(LOCKOUT_KEY, String(until));
    return until;
  }
  return 0;
}

function getLockoutUntil(): number {
  const raw = sessionStorage.getItem(LOCKOUT_KEY);
  if (!raw) return 0;
  const until = parseInt(raw, 10);
  if (isNaN(until)) return 0;
  if (Date.now() > until) {
    sessionStorage.removeItem(LOCKOUT_KEY);
    sessionStorage.removeItem(ATTEMPTS_KEY);
    return 0;
  }
  return until;
}

export function OpsAuthGate({ onAuthed }: OpsAuthGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    setLockedUntil(getLockoutUntil());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const isLocked = lockedUntil > now;
  const secondsLeft = isLocked ? Math.ceil((lockedUntil - now) / 1000) : 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLocked || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await opsLogin(password);
      if (result.ok) {
        sessionStorage.removeItem(ATTEMPTS_KEY);
        sessionStorage.removeItem(LOCKOUT_KEY);
        onAuthed();
        return;
      }
      if (result.status === 503) {
        setError("ops dashboard not configured");
      } else {
        const until = recordFailedAttempt();
        if (until) setLockedUntil(until);
        setError("wrong code");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError("network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 px-4">
      <style>{`
        @keyframes opsShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .ops-shake { animation: opsShake 0.45s ease-in-out; }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm space-y-5 ${shake ? "ops-shake" : ""}`}
      >
        <div className="space-y-1 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">EDITH OPS</div>
          <h1 className="text-lg font-medium text-zinc-200">enter access code</h1>
        </div>
        <input
          type="password"
          autoFocus
          autoComplete="off"
          inputMode="text"
          disabled={isLocked || submitting}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Access code"
          className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3 text-center tracking-widest text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
          placeholder="••••••••"
        />
        <button
          type="submit"
          disabled={isLocked || submitting || password.length === 0}
          className="w-full rounded-md bg-zinc-100 text-zinc-950 py-2.5 text-sm font-medium hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "checking…" : "Enter →"}
        </button>
        {error && !isLocked && (
          <div className="text-center text-sm text-red-400">{error}</div>
        )}
        {isLocked && (
          <div className="text-center text-sm text-amber-400">
            too many attempts. locked for {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s
          </div>
        )}
      </form>
    </div>
  );
}
