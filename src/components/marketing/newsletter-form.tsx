"use client";

import { useId, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({
  compact = false,
  boxed = false,
  center = false,
  inverted = false,
  hint,
}: {
  compact?: boolean;
  boxed?: boolean;
  center?: boolean;
  inverted?: boolean;
  hint?: string;
}) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "You are on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className={cn(
        "w-full",
        compact ? "max-w-[360px]" : "max-w-[480px]",
        center && "mx-auto text-center",
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          boxed
            ? "flex flex-col gap-2 sm:flex-row"
            : `flex items-center border-b pb-3 ${
                inverted ? "border-canvas/40" : "border-ink/40"
              }`,
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Your email address"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted",
            inverted && "text-canvas placeholder:text-canvas/45",
            boxed &&
              "h-12 border border-line bg-canvas px-4 text-ink placeholder:text-muted focus:border-ink",
          )}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "flex shrink-0 items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-60 disabled:opacity-40",
            boxed
              ? "h-12 bg-ink px-8 text-canvas hover:opacity-85"
              : "ml-3",
          )}
        >
          {status === "submitting" ? "Joining" : boxed ? "Subscribe" : "Join"}
          {boxed ? null : <ArrowRightIcon className="h-4 w-4" />}
        </button>
      </form>
      <p
        aria-live="polite"
        className={cn(
          "mt-2 min-h-[18px] text-xs",
          status === "error"
            ? inverted
              ? "text-[#e3b4b4]"
              : "text-oxblood"
            : inverted
              ? "text-canvas/55"
              : "text-muted",
          center && "text-center",
        )}
      >
        {message ||
          hint ||
          "Notes from the studio, new arrivals and considered offers. No noise."}
      </p>
    </div>
  );
}
