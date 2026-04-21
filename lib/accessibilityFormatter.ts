import { parseCode, SupportedLanguage, VariableDeclaration } from "@/lib/codeParser";

export interface ConversionResult {
  formattedCode: string;
  accessibleNarration: string;
  structuralSummary: string[];
  variableRenames: Record<string, string>;
}

const genericNames = new Set([
  "x",
  "y",
  "z",
  "i",
  "j",
  "k",
  "n",
  "m",
  "tmp",
  "val",
  "obj",
  "arr",
  "fn",
  "res",
  "ret",
]);

function toTitleCase(source: string): string {
  return source
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((piece) => piece[0].toUpperCase() + piece.slice(1).toLowerCase())
    .join(" ");
}

function suggestName(declaration: VariableDeclaration, seen: Set<string>): string | null {
  const currentName = declaration.name;
  const expression = declaration.expression?.toLowerCase() ?? "";

  if (!genericNames.has(currentName.toLowerCase()) && currentName.length > 3) {
    return null;
  }

  let proposed = "descriptiveValue";

  if (/count|length|size/.test(expression)) proposed = "itemCount";
  else if (/sum|total/.test(expression)) proposed = "totalValue";
  else if (/input|prompt|read|stdin/.test(expression)) proposed = "userInput";
  else if (/list|array|split|map\(/.test(expression)) proposed = "itemsList";
  else if (/json|parse|object|dict/.test(expression)) proposed = "parsedObject";
  else if (/fetch|request|http/.test(expression)) proposed = "apiResponse";
  else if (/true|false|flag|is[A-Z_]/.test(expression)) proposed = "statusFlag";
  else if (/for\s*\(|range\(|enumerate\(/.test(expression) || ["i", "j", "k"].includes(currentName)) {
    proposed = "loopIndex";
  }

  let candidate = proposed;
  let suffix = 2;
  while (seen.has(candidate)) {
    candidate = `${proposed}${suffix}`;
    suffix += 1;
  }

  seen.add(candidate);
  return candidate;
}

function buildRenameMap(declarations: VariableDeclaration[]): Record<string, string> {
  const renameMap: Record<string, string> = {};
  const seenNames = new Set<string>();

  for (const declaration of declarations) {
    const suggestion = suggestName(declaration, seenNames);
    if (!suggestion) continue;
    if (declaration.name === suggestion) continue;
    renameMap[declaration.name] = suggestion;
  }

  return renameMap;
}

function applyVariableRenames(source: string, renameMap: Record<string, string>): string {
  let transformed = source;
  for (const [originalName, replacement] of Object.entries(renameMap)) {
    transformed = transformed.replace(new RegExp(`\\b${originalName}\\b`, "g"), replacement);
  }
  return transformed;
}

function optimizeForAudio(source: string): string {
  return source
    .replace(/===/g, " strictly-equals ")
    .replace(/==/g, " equals ")
    .replace(/!=/g, " not-equals ")
    .replace(/=>/g, " returns ")
    .replace(/\{/g, " begin-block ")
    .replace(/\}/g, " end-block ")
    .replace(/\(/g, " open-paren ")
    .replace(/\)/g, " close-paren ")
    .replace(/\[/g, " open-bracket ")
    .replace(/\]/g, " close-bracket ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildStructuralSummary(lines: string[]): string[] {
  const summary: string[] = [];
  const fullText = lines.join("\n");

  const functionCount = (fullText.match(/\b(def|function|class)\b/g) ?? []).length;
  const conditionalCount = (fullText.match(/\bif\b|\bswitch\b|\belse\b/g) ?? []).length;
  const loopCount = (fullText.match(/\bfor\b|\bwhile\b/g) ?? []).length;
  const returnCount = (fullText.match(/\breturn\b/g) ?? []).length;

  summary.push(`Functions or classes detected: ${functionCount}.`);
  summary.push(`Conditional branches detected: ${conditionalCount}.`);
  summary.push(`Loops detected: ${loopCount}.`);
  summary.push(`Return statements detected: ${returnCount}.`);

  return summary;
}

function buildNarration(structuralSummary: string[], variableRenames: Record<string, string>): string {
  const renameCount = Object.keys(variableRenames).length;
  const renameText =
    renameCount > 0
      ? `It renamed ${renameCount} variable${renameCount === 1 ? "" : "s"} to improve clarity.`
      : "No variable rename was needed for clarity.";

  return `${structuralSummary.join(" ")} ${renameText}`;
}

export function convertCodeToAccessibleFormat(code: string, language: SupportedLanguage): ConversionResult {
  const parsedCode = parseCode(code, language);
  const renameMap = buildRenameMap(parsedCode.declarations);

  const convertedLines = parsedCode.lines.map((line) => {
    if (line.isBlank) {
      return `L${line.lineNumber} | indent:${line.indentLevel} | blank line`;
    }

    const renamedLine = applyVariableRenames(line.normalizedLine.trim(), renameMap);
    const audioLine = optimizeForAudio(renamedLine);
    return `L${line.lineNumber} | indent:${line.indentLevel} | ${audioLine}`;
  });

  const sourceLinesAfterRename = parsedCode.lines.map((line) => applyVariableRenames(line.normalizedLine, renameMap));
  const structuralSummary = buildStructuralSummary(sourceLinesAfterRename);
  const accessibleNarration = buildNarration(structuralSummary, renameMap);

  return {
    formattedCode: convertedLines.join("\n"),
    accessibleNarration,
    structuralSummary,
    variableRenames: renameMap,
  };
}

export function describeLanguage(language: SupportedLanguage): string {
  switch (language) {
    case "python":
      return "Python";
    case "javascript":
      return "JavaScript";
    case "java":
      return "Java";
    default:
      return toTitleCase(language);
  }
}
