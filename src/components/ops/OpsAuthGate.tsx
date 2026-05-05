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
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(MAX_ATTEMPTS);

  useEffect(() => {
    setLockedUntil(getLockoutUntil());
    setAttemptsRemaining(MAX_ATTEMPTS - readAttempts().length);
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
      const failStatus = (result as { ok: false; status: number }).status;
      if (failStatus === 503) {
        setError("Ops dashboard not configured.");
      } else {
        const until = recordFailedAttempt();
        if (until) setLockedUntil(until);
        const remaining = MAX_ATTEMPTS - readAttempts().length;
        setAttemptsRemaining(Math.max(0, remaining));
        setError(`Incorrect password. ${Math.max(0, remaining)} attempts remaining`);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  const lockoutMM = Math.floor(secondsLeft / 60);
  const lockoutSS = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1E1D] text-[#EDF5EC] px-4 font-sans">
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
        className={`w-full max-w-md rounded-2xl border border-[#22332F] bg-[#1A2B2A] p-10 space-y-6 ${
          shake ? "ops-shake" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#BF461A]" />
          <span className="text-[13px] font-black tracking-[0.18em] text-[#EDF5EC]">EDITH OPS</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight uppercase text-[#EDF5EC]">Unlock</h1>
          <p className="text-[13px] leading-relaxed text-[#A1A9A0]">
            Single password access for the Mabbly ops admin.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black tracking-[0.14em] uppercase text-[#A1A9A0]">
            Password
          </label>
          <input
            type="password"
            autoFocus
            autoComplete="off"
            inputMode="text"
            disabled={isLocked || submitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
            className="w-full rounded-lg bg-[#0F1E1D] border border-[#FFBA1A] px-4 py-3 tracking-widest text-[#EDF5EC] placeholder:text-[#6E7A72] focus:outline-none focus:border-[#BF461A] disabled:opacity-50 transition-colors"
            placeholder="••••••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLocked || submitting || password.length === 0}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#BF461A] hover:bg-[#A23A14] text-[#EDF5EC] py-3 text-[13px] font-black tracking-[0.16em] uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Checking…" : (
            <>
              Unlock
              <span aria-hidden>→</span>
            </>
          )}
        </button>

        {error && !isLocked && (
          <div className="flex items-center gap-2 rounded-md border border-[#C02B0A] bg-[#2A1414] px-3 py-2.5 text-[12px] text-[#EDF5EC]">
            <span aria-hidden className="text-[#C02B0A]">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-2 rounded-md border border-[#A79014] bg-[#352B0E] px-3 py-2.5 text-[12px] text-[#EDF5EC]">
            <span aria-hidden className="text-[#FFBA1A]">⏱</span>
            <span>Locked. Try again in {lockoutMM}:{lockoutSS}</span>
          </div>
        )}

        <p className="text-[11px] leading-relaxed text-[#6E7A72]">
          Rate-limited. {MAX_ATTEMPTS} failed attempts triggers a 5-minute lockout.
          {!isLocked && attemptsRemaining < MAX_ATTEMPTS && attemptsRemaining > 0 && (
            <> {attemptsRemaining} of {MAX_ATTEMPTS} remaining.</>
          )}
        </p>
      </form>
    </div>
  );
}
