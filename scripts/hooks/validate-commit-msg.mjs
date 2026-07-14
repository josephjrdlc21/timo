/**
 * commit-msg hook: enforce the TIMO commit convention.
 * See github-workflow/git-github-guide.md for the full rules.
 *
 *   <type>(TIMO-XXX): <summary>   <- header, <= 72 chars
 *   <blank line>
 *   <body>                        <- required, explain the *why*
 *   [Closes TIMO-XXX]             <- optional footer
 */
import { readFileSync } from "node:fs";

const TYPES = ["feat", "fix", "chore", "refactor", "docs"];
const MAX_HEADER = 72;
const HEADER_RE = new RegExp(`^(${TYPES.join("|")})\\(TIMO-\\d+\\): .+$`);

const msgPath = process.argv[2];
if (!msgPath) {
  console.error("commit-msg: no message file path was provided.");
  process.exit(1);
}

// Drop git comment lines (and anything after the verbose-diff scissors).
const lines = readFileSync(msgPath, "utf8")
  .split(/\r?\n/)
  .filter((line) => !line.startsWith("#"));

const text = lines.join("\n").replace(/\s+$/, "");
const allLines = text.split("\n");
const header = allLines[0] ?? "";

// Auto-generated messages (merges, reverts, fixups) skip validation.
if (/^(Merge |Revert |fixup!|squash!)/.test(header)) {
  process.exit(0);
}

const errors = [];

if (!HEADER_RE.test(header)) {
  errors.push(
    "Header must match  <type>(TIMO-XXX): <summary>\n" +
      `allowed types: ${TYPES.join(", ")}\n` +
      "scope must be a TIMO key, e.g. TIMO-12\n" +
      `got: "${header}"`,
  );
}

if (header.length > MAX_HEADER) {
  errors.push(`Header is ${header.length} chars; keep it <= ${MAX_HEADER}.`);
}

// Body is required, separated from the header by a blank line.
const hasContentAfterHeader = allLines.slice(1).some((line) => line.trim() !== "");

if (!hasContentAfterHeader) {
  errors.push("A commit body is required — explain the *why*, not just the *what*.");
} else if (allLines[1].trim() !== "") {
  errors.push("Leave a blank line between the header and the body.");
}

if (errors.length > 0) {
  console.error("\n✖ Commit message rejected:\n");
  for (const err of errors) {
    console.error("  - " + err.replace(/\n/g, "\n    "));
  }
  console.error(
    "\nConvention: github-workflow/git-github-guide.md\n" +
      "\nExample:\n" +
      "  fix(TIMO-12): reject negative transaction amounts\n" +
      "\n" +
      "  Users could submit a negative amount, throwing off balance\n" +
      "  calculations. Added a .positive() check in the Zod schema.\n",
  );
  process.exit(1);
}
