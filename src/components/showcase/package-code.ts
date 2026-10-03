/**
 * Rewrites a registry demo's source code so imports point at the published
 * npm package instead of the site's local file layout.
 *
 * The registry stores code with the site's own paths ("@/components/ui/button")
 * because that is where the live preview components actually run from. Package
 * consumers, however, copy these snippets into their app — everything under
 * ui/ ships from the package root, so display code reads:
 *
 *   import { Button } from "@/components/ui/button"   →  import { Button } from "markaui"
 *
 * Multiple ui imports are merged into a single "markaui" statement (with
 * `type` modifiers preserved). Anything not shipped by the package (react,
 * lucide-react, @/components/matrimonial/*) is left untouched.
 */

// The tempered clause `(?:(?!\bfrom\b)[\s\S])*?` cannot cross a statement
// boundary — every import statement ends with exactly one `from "..."`.
const UI_IMPORT_RE =
  /import\s+(type\s+)?((?:(?!\bfrom\b)[\s\S])*?)\s+from\s+["']@\/components\/ui\/[^"']+["'](\s*;)?\n?/g;

export function toPackageCode(code: string): string {
  // Fast path — nothing to rewrite.
  if (!code.includes('@/components/ui/')) return code;

  const mergedMembers: string[] = [];
  let sawUnsafeClause = false;
  let firstHadSemicolon = true;
  let punctSeen = false;

  const withoutUiImports = code.replace(
    UI_IMPORT_RE,
    (full, typePrefix: string | undefined, clause: string, semi: string | undefined) => {
      const trimmed = clause.trim();
      // Only named-import clauses `{ ... }` can be safely merged. Default /
      // namespace imports keep their original statement, specifier rewritten.
      const named = trimmed.match(/^\{([\s\S]*)\}$/);
      if (!named) {
        sawUnsafeClause = true;
        return full.replace(/@\/components\/ui\/[^"']+["']/, 'markaui"');
      }
      const wantsType = Boolean(typePrefix);
      for (const raw of named[1].split(',')) {
        let member = raw.trim();
        if (!member) continue;
        if (wantsType && !/^type\s/.test(member)) member = `type ${member}`;
        if (!mergedMembers.includes(member)) mergedMembers.push(member);
      }
      if (!punctSeen) {
        firstHadSemicolon = semi !== undefined; // mirror the first statement's style
        punctSeen = true;
      }
      return ''; // dropped; re-inserted once below
    },
  );

  if (mergedMembers.length === 0) {
    return sawUnsafeClause ? withoutUiImports : code;
  }

  // Format: short lists stay on one line, long lists break one member per line
  // (keeps large composite demos readable, mirrors Prettier's style).
  const semi = firstHadSemicolon ? ';' : '';
  const mergedImport =
    mergedMembers.length > 6
      ? `import {\n  ${mergedMembers.join(',\n  ')},\n} from "markaui"${semi}`
      : `import { ${mergedMembers.join(', ')} } from "markaui"${semi}`;

  // Re-insert the merged statement after the last import of the leading
  // import block so it sits grouped with the other module imports.
  const lines = withoutUiImports.split('\n');
  let insertAt = 0;
  let seenCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!seenCode && line === '') continue; // skip leading blank lines
    seenCode = true;
    if (line.startsWith('import ') || line.startsWith('import{')) {
      // advance past a (possibly multi-line) import statement
      while (i < lines.length && !/from\s+["']/.test(lines[i])) i++;
      insertAt = i + 1;
    } else if (line !== '') {
      break; // first non-import code — stop
    }
  }
  lines.splice(insertAt, 0, mergedImport);

  // Collapse blank-line runs left behind by removed statements (3+ → 1).
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '');
}
