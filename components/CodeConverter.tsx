"use client";

import { useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { CodeOutput } from "@/components/CodeOutput";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportedLanguage } from "@/lib/codeParser";

interface ConversionResponse {
  formattedCode: string;
  accessibleNarration: string;
  structuralSummary: string[];
  variableRenames: Record<string, string>;
  previewTruncated?: boolean;
  error?: string;
}

interface CodeConverterProps {
  previewMode?: boolean;
}

const starterSnippet = `def calc(x, y):
    total = x + y
    if total > 10:
        return total
    return total * 2`;

export function CodeConverter({ previewMode = false }: CodeConverterProps) {
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState(starterSnippet);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResponse | null>(null);

  const onConvert = async () => {
    setIsConverting(true);
    setError(null);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          preview: previewMode,
        }),
      });

      const data = (await response.json()) as ConversionResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to convert code");
      }

      setResult(data);
    } catch (convertError) {
      setError(convertError instanceof Error ? convertError.message : "Unable to convert code");
      setResult(null);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[220px_1fr] md:items-end">
        <LanguageSelector value={language} onChange={setLanguage} />
        <Button type="button" onClick={onConvert} disabled={isConverting} className="w-full md:w-auto md:justify-self-start">
          {isConverting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isConverting ? "Converting..." : previewMode ? "Convert Preview" : "Convert Full Snippet"}
        </Button>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-200">Paste code snippet</span>
        <Textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Paste code here"
          className="min-h-56"
          aria-label="Code snippet input"
        />
      </label>

      {error ? <p className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}

      {result ? (
        <CodeOutput
          language={language}
          formattedCode={result.formattedCode}
          narration={result.accessibleNarration}
          structuralSummary={result.structuralSummary}
          variableRenames={result.variableRenames}
          previewTruncated={result.previewTruncated}
        />
      ) : null}
    </section>
  );
}
