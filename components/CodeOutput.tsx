"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SupportedLanguage } from "@/lib/codeParser";
import { Button } from "@/components/ui/button";

interface CodeOutputProps {
  language: SupportedLanguage;
  formattedCode: string;
  narration: string;
  structuralSummary: string[];
  variableRenames: Record<string, string>;
  previewTruncated?: boolean;
}

export function CodeOutput({
  language,
  formattedCode,
  narration,
  structuralSummary,
  variableRenames,
  previewTruncated,
}: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const renameRows = useMemo(() => Object.entries(variableRenames), [variableRenames]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="space-y-4" aria-live="polite">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Screen-reader optimized output</h3>
        <Button type="button" size="sm" variant="secondary" onClick={copyOutput}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy output"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: "#0b1220",
            fontSize: "0.86rem",
            fontFamily: "var(--font-mono)",
          }}
          wrapLongLines
        >
          {formattedCode}
        </SyntaxHighlighter>
      </div>

      {previewTruncated ? (
        <p className="rounded-md border border-blue-500/50 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
          Preview mode shows the first 12 converted lines. Unlock paid access to convert full snippets.
        </p>
      ) : null}

      <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-4 text-sm text-slate-300">
        <h4 className="mb-2 font-semibold text-slate-100">Narration summary</h4>
        <p>{narration}</p>
      </div>

      <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-4 text-sm text-slate-300">
        <h4 className="mb-2 font-semibold text-slate-100">Detected structure</h4>
        <ul className="list-inside list-disc space-y-1">
          {structuralSummary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      {renameRows.length > 0 ? (
        <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-4 text-sm text-slate-300">
          <h4 className="mb-2 font-semibold text-slate-100">Variable clarity map</h4>
          <ul className="space-y-1">
            {renameRows.map(([fromName, toName]) => (
              <li key={`${fromName}-${toName}`}>
                <span className="font-mono text-blue-200">{fromName}</span> → <span className="font-mono text-green-200">{toName}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
