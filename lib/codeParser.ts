export const supportedLanguages = ["python", "javascript", "java"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export interface ParsedLine {
  lineNumber: number;
  originalLine: string;
  normalizedLine: string;
  indentLevel: number;
  isBlank: boolean;
}

export interface VariableDeclaration {
  name: string;
  expression?: string;
  lineNumber: number;
}

export interface ParsedCode {
  language: SupportedLanguage;
  lines: ParsedLine[];
  declarations: VariableDeclaration[];
}

const genericDeclarationPatterns: RegExp[] = [
  /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]+)/,
  /function\s+([A-Za-z_$][\w$]*)\s*\(/,
  /for\s*\(\s*(?:let|const|var)?\s*([A-Za-z_$][\w$]*)/,
  /(?:int|long|double|float|boolean|char|String|var|List<[^>]+>|Map<[^>]+>)\s+([A-Za-z_][\w]*)\s*=\s*([^;]+)/,
  /for\s*\(\s*(?:int|long|var)?\s*([A-Za-z_][\w]*)/,
  /^\s*([A-Za-z_][\w]*)\s*=\s*(.+)$/,
];

function normalizeLine(line: string): string {
  return line.replace(/\t/g, "    ");
}

function detectIndentLevel(normalizedLine: string): number {
  const leadingSpaces = normalizedLine.match(/^\s*/)?.[0].length ?? 0;
  if (leadingSpaces === 0) return 0;
  const guessedUnit = leadingSpaces % 4 === 0 ? 4 : 2;
  return Math.floor(leadingSpaces / guessedUnit);
}

function shouldUsePattern(language: SupportedLanguage, pattern: RegExp): boolean {
  if (language === "python") {
    return String(pattern) === String(genericDeclarationPatterns[5]);
  }

  if (language === "javascript") {
    return [0, 1, 2].includes(genericDeclarationPatterns.indexOf(pattern));
  }

  return [3, 4].includes(genericDeclarationPatterns.indexOf(pattern));
}

function extractDeclarations(language: SupportedLanguage, lines: ParsedLine[]): VariableDeclaration[] {
  const declarations: VariableDeclaration[] = [];

  for (const line of lines) {
    if (line.isBlank) continue;

    for (const pattern of genericDeclarationPatterns) {
      if (!shouldUsePattern(language, pattern)) continue;
      const match = line.normalizedLine.match(pattern);
      if (!match) continue;

      const declaration: VariableDeclaration = {
        name: match[1],
        expression: match[2]?.trim(),
        lineNumber: line.lineNumber,
      };

      declarations.push(declaration);
      break;
    }
  }

  return declarations;
}

export function parseCode(code: string, language: SupportedLanguage): ParsedCode {
  const lines = code.split(/\r?\n/).map((line, index) => {
    const normalizedLine = normalizeLine(line);
    return {
      lineNumber: index + 1,
      originalLine: line,
      normalizedLine,
      indentLevel: detectIndentLevel(normalizedLine),
      isBlank: normalizedLine.trim().length === 0,
    } satisfies ParsedLine;
  });

  return {
    language,
    lines,
    declarations: extractDeclarations(language, lines),
  };
}
