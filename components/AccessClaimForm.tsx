"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccessClaimForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submitClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/access/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to claim access.");
      }

      setSuccess("Access granted. Reloading converter...");
      window.setTimeout(() => window.location.reload(), 700);
    } catch (claimError) {
      setError(claimError instanceof Error ? claimError.message : "Unable to claim access.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitClaim} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="claim-email">Checkout email</Label>
        <Input
          id="claim-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Claiming..." : "Claim paid access"}
      </Button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-300">{success}</p> : null}
    </form>
  );
}
