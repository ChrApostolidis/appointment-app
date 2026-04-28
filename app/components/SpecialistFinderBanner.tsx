"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MainButton from "./MainButton";

type Match = { category: string; reason: string };

const AI_MATCHES_PARAM = "aiMatches";

function decodeMatches(raw: string | null): Match[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (m) =>
          m &&
          typeof m.category === "string" &&
          typeof m.reason === "string"
      )
    ) {
      return parsed as Match[];
    }
    return null;
  } catch {
    return null;
  }
}

type ClassifyResponse = {
  needs_clarification: boolean;
  clarification_question?: string;
  matches: Match[];
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "matched"; matches: Match[] }
  | { kind: "clarify"; question: string }
  | { kind: "error"; message: string };

export default function SpecialistFinderBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onBookPage = pathname === "/book";
  const [problem, setProblem] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    const hydrated = decodeMatches(searchParams.get(AI_MATCHES_PARAM));
    if (hydrated && hydrated.length > 0) {
      setState({ kind: "matched", matches: hydrated });
    }
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = problem.trim();
    if (trimmed.length < 3) {
      setState({
        kind: "clarify",
        question:
          "Could you describe your problem in a bit more detail? A short sentence is enough.",
      });
      return;
    }

    setState({ kind: "loading" });

    try {
      const res = await fetch("/api/classifySpecialistAIFeauture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: trimmed }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(
          "classifySpecialist failed:",
          res.status,
          res.statusText,
          errorBody
        );
        setState({
          kind: "error",
          message:
            "We couldn't reach the matching service right now. Please try again in a moment.",
        });
        return;
      }

      const data = (await res.json()) as ClassifyResponse;

      if (data.needs_clarification || data.matches.length === 0) {
        setState({
          kind: "clarify",
          question:
            data.clarification_question ??
            "Could you give a bit more detail about the problem you need help with?",
        });
        return;
      }

      setState({ kind: "matched", matches: data.matches });

      const params = new URLSearchParams();
      for (const m of data.matches) {
        params.append("serviceCategory", m.category);
      }
      params.set(
        AI_MATCHES_PARAM,
        encodeURIComponent(JSON.stringify(data.matches))
      );
      router.push(`/book?${params.toString()}`);
    } catch {
      setState({
        kind: "error",
        message:
          "Something went wrong. Please check your connection and try again.",
      });
    }
  };

  const reset = () => {
    setState({ kind: "idle" });
    setProblem("");
  };

  return (
    <div className="bg-background">
      <div className="p-6 rounded-lg shadow-md border mx-6 lg:mx-20">
        <h2 className="text-xl font-bold text-foreground lg:text-3xl">
          Find the right specialist
        </h2>
        <p className="text-sm text-foreground/70 mt-1">
          Describe your problem and we&apos;ll match you with the right
          professionals.
        </p>

        <form
          onSubmit={submit}
          className="flex flex-col gap-4 mt-4 w-full lg:flex-row lg:items-start"
        >
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your problem, e.g. My kitchen pipes are leaking"
              disabled={state.kind === "loading"}
              className="w-full text-foreground bg-background border border-gray-300 text-lg rounded-lg focus:ring-primary focus:border-primary p-2 disabled:opacity-60"
              aria-label="Describe your problem"
            />
          </div>

          <div className="w-full lg:w-auto">
            <MainButton
              type="submit"
              variant="primary"
              className="w-full lg:w-auto"
              disabled={state.kind === "loading"}
            >
              {state.kind === "loading" ? "Matching…" : "Find Specialist"}
            </MainButton>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {state.kind === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-center gap-3 text-foreground/80"
              aria-live="polite"
            >
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </span>
              <span>Looking for the right specialists for you…</span>
            </motion.div>
          )}

          {state.kind === "matched" && (
            <motion.div
              key="matched"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5"
              aria-live="polite"
            >
              <p className="text-sm text-foreground/70 mb-2">
                {onBookPage
                  ? `Here ${state.matches.length === 1 ? "is the match" : "are the matches"} we found for your problem. We've filtered the professionals below.`
                  : `We found ${state.matches.length === 1 ? "a match" : "matches"} for you. Taking you to the booking page…`}
              </p>
              <ul className="flex flex-col gap-2">
                {state.matches.map((m) => (
                  <li
                    key={m.category}
                    className="border rounded-lg p-3 bg-background"
                  >
                    <p className="font-semibold text-foreground">
                      {m.category}
                    </p>
                    <p className="text-sm text-foreground/70">{m.reason}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {state.kind === "clarify" && (
            <motion.div
              key="clarify"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3"
              aria-live="polite"
            >
              <p className="text-sm text-foreground">{state.question}</p>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-primary mt-2 underline cursor-pointer"
              >
                Start over
              </button>
            </motion.div>
          )}

          {state.kind === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg p-3"
              aria-live="polite"
            >
              <p className="text-sm text-foreground">{state.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
