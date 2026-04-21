"use client";

import { SupportedLanguage } from "@/lib/codeParser";

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (nextLanguage: SupportedLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-200">
      Language
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SupportedLanguage)}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-blue-400"
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
      </select>
    </label>
  );
}
