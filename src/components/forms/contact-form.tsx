"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "h-12 w-full border border-line bg-canvas px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      orderNumber: String(formData.get("orderNumber") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        data.message ??
          "Thank you. We have received your message and will reply within 1–2 business days.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "success" ? (
        <div
          role="status"
          className="border border-[#4f6b4a]/30 bg-[#eef0e8] px-4 py-3 text-sm leading-relaxed text-[#35452f]"
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label mb-2 block text-[10px]">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            className={fieldClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="label mb-2 block text-[10px]">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-order-number"
          className="label mb-2 block text-[10px]"
        >
          Order number
        </label>
        <input
          id="contact-order-number"
          name="orderNumber"
          className={fieldClass}
          placeholder="NOIRE-000000-0000"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="label mb-2 block text-[10px]">
          Subject <span aria-hidden="true">*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          className={fieldClass}
          defaultValue="Order inquiry"
          required
        >
          <option>Order inquiry</option>
          <option>Shipping & delivery</option>
          <option>Returns & exchanges</option>
          <option>Sizing advice</option>
          <option>Product details</option>
          <option>Press & partnerships</option>
          <option>Other assistance</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="label mb-2 block text-[10px]">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={7}
          className="w-full resize-y border border-line bg-canvas px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink"
          placeholder="How can we help?"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[360px] text-xs leading-relaxed text-muted">
          We reply within 1–2 business days. For order enquiries, include your
          order number.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="label inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-ink px-7 text-[11px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending" : "Send message"}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "min-h-[20px] text-sm",
          status === "error" ? "text-oxblood" : "text-muted",
        )}
      >
        {status === "success" ? "" : message}
      </p>
    </form>
  );
}
