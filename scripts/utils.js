import { execSync } from "node:child_process";
import { statSync } from "node:fs";

/**
 * Last-modified date of a source file: the last git commit that touched it,
 * or the filesystem mtime while it has uncommitted changes.
 */
export function lastModified(file) {
  try {
    const dirty = execSync(`git status --porcelain -- "${file}"`).toString().trim();
    if (!dirty) {
      const iso = execSync(`git log -1 --format=%cI -- "${file}"`).toString().trim();
      if (iso) return new Date(iso);
    }
  } catch {
    // not a git checkout — fall through to mtime
  }
  return statSync(file).mtime;
}

export function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

export function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
