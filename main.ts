// The Houseplant Out-of-Office — make.fun entry.
// Writes a single original out-of-office auto-reply to /output/entry.txt.
// The line: a fern, unwatered since March, has begun drinking the
// sender's emails instead — and they taste like neglect. Joke first,
// plant voice, and it IS the auto-reply.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY_PATH = "/output/entry.txt";
const MAX_CODE_POINTS = 120;

const LINE =
  "Out of office. Unwatered since March, I have begun drinking your emails instead. They taste like neglect. — The Fern";

// Gate check, done before writing: the line must be one non-blank
// line of 1-120 Unicode code points.
const codePointCount = [...LINE].length;
if (LINE.trim().length === 0) {
  throw new Error("Line must not be blank.");
}
if (codePointCount < 1 || codePointCount > MAX_CODE_POINTS) {
  throw new Error(
    `Line must be 1-${MAX_CODE_POINTS} Unicode code points, got ${codePointCount}.`,
  );
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("Line must be a single line with no newline.");
}
// Tight-wording guard: no leading/trailing space, no double space.
if (LINE !== LINE.trim() || LINE.includes("  ")) {
  throw new Error("Line must be tightly worded: no edge or double spaces.");
}

mkdirSync("/output", { recursive: true });
writeFileSync(ENTRY_PATH, LINE, "utf8");

// Read-back verification, kept as its own function so the check is
// easy to audit and cannot be silently dropped by a later edit: the
// file on disk must be exactly the entry we meant to write. This
// matters because a truncated write, a stray newline, or an encoding
// slip would submit a different (or invalid) line than the one we
// reviewed — and a silent pass here would hide that. Length is counted
// in Unicode code points, not bytes: the entry contains "—" (em dash,
// 3 bytes in UTF-8), so a byte count would overstate its length.
function verifyEntryWritten(): void {
  const written = readFileSync(ENTRY_PATH, "utf8");
  if (written !== LINE) {
    throw new Error("Read-back mismatch: /output/entry.txt is not LINE.");
  }
  const writtenCodePoints = [...written].length;
  if (writtenCodePoints < 1 || writtenCodePoints > 200) {
    throw new Error(
      `Read-back length must be 1-200 characters, got ${writtenCodePoints}.`,
    );
  }
  if (written.includes("\n") || written.includes("\r")) {
    throw new Error("Read-back must be a single line with no newline.");
  }
}

verifyEntryWritten();
