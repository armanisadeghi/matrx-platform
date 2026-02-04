#!/usr/bin/env node

/**
 * Design System Validation Script
 *
 * Runs comprehensive checks to ensure the design system's single source
 * of truth is maintained. This script should be run before builds and
 * as part of CI to catch violations early.
 *
 * Checks performed:
 * 1. Hardcoded colors in component/app files (hex, rgb, rgba)
 * 2. CSS variable sync between global.css and colors.ts
 * 3. Tailwind config references all CSS variables
 * 4. No inline style color properties with literals
 * 5. Shadow color token usage
 *
 * Usage:
 *   node scripts/validate-design-system.mjs
 *   node scripts/validate-design-system.mjs --fix-suggestions
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, extname } from "path";

const PROJECT_ROOT = new URL("..", import.meta.url).pathname;

// Directories to scan for violations
const SCAN_DIRS = ["app", "components", "hooks"];

// Directories to skip entirely
const SKIP_DIRS = new Set([
  "node_modules",
  ".expo",
  "dist",
  "android",
  "ios",
  "web-build",
]);

// Files that are allowed to contain color definitions
const ALLOWED_FILES = new Set([
  "constants/colors.ts",
  "constants/spacing.ts",
  "constants/theme.ts",
  "global.css",
  "tailwind.config.js",
]);

// Patterns
const HEX_PATTERN = /#(?:[0-9A-Fa-f]{3,4}){1,2}\b/g;
const RGB_PATTERN = /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g;

// Color-related style props where hardcoded values are violations
const COLOR_STYLE_PROPS = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRightColor",
  "shadowColor",
  "tintColor",
  "overlayColor",
];

let totalErrors = 0;
let totalWarnings = 0;

function log(type, file, line, message) {
  const relPath = relative(PROJECT_ROOT, file);
  const prefix = type === "error" ? "\x1b[31mERROR\x1b[0m" : "\x1b[33mWARN\x1b[0m";
  const location = line ? `${relPath}:${line}` : relPath;
  console.log(`  ${prefix}  ${location}`);
  console.log(`         ${message}`);
  if (type === "error") totalErrors++;
  else totalWarnings++;
}

/**
 * Recursively collect all files from a directory.
 */
function collectFiles(dir, extensions) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (SKIP_DIRS.has(entry)) continue;

    let stat;
    try {
      stat = statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      results.push(...collectFiles(fullPath, extensions));
    } else if (extensions.includes(extname(entry))) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Check 1: Scan for hardcoded color values in component/app files.
 */
function checkHardcodedColors() {
  console.log("\n\x1b[36m[Check 1]\x1b[0m Scanning for hardcoded color values...\n");

  for (const scanDir of SCAN_DIRS) {
    const dir = join(PROJECT_ROOT, scanDir);
    const files = collectFiles(dir, [".ts", ".tsx", ".js", ".jsx"]);

    for (const file of files) {
      const relPath = relative(PROJECT_ROOT, file);
      if (ALLOWED_FILES.has(relPath)) continue;

      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();

        // Skip comments
        if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) {
          return;
        }

        // Check for hex colors
        const hexMatches = line.match(HEX_PATTERN);
        if (hexMatches) {
          for (const match of hexMatches) {
            log(
              "error",
              file,
              lineNum,
              `Hardcoded hex color "${match}" found. Use a design token from useTheme() or NativeWind class.`
            );
          }
        }

        // Check for rgb/rgba patterns (but not in CSS variable references)
        if (!line.includes("var(--")) {
          const rgbMatches = line.match(RGB_PATTERN);
          if (rgbMatches) {
            for (const match of rgbMatches) {
              log(
                "error",
                file,
                lineNum,
                `Hardcoded "${match}..." found. Use a design token from useTheme() instead.`
              );
            }
          }
        }
      });
    }
  }
}

/**
 * Check 2: Verify CSS variable definitions in global.css have
 * corresponding entries in colors.ts.
 */
function checkCSSVariableSync() {
  console.log("\n\x1b[36m[Check 2]\x1b[0m Checking CSS variable sync between global.css and colors.ts...\n");

  const cssPath = join(PROJECT_ROOT, "global.css");
  const colorsPath = join(PROJECT_ROOT, "constants", "colors.ts");

  let cssContent, colorsContent;
  try {
    cssContent = readFileSync(cssPath, "utf-8");
    colorsContent = readFileSync(colorsPath, "utf-8");
  } catch (e) {
    log("error", cssPath, null, `Could not read file: ${e.message}`);
    return;
  }

  // Extract CSS variable names from :root block (light mode)
  const cssVarPattern = /--color-([a-z-]+):\s*(\d+\s+\d+\s+\d+)/g;
  const rootBlock = cssContent.split(".dark")[0];
  let match;
  const lightVars = new Map();

  while ((match = cssVarPattern.exec(rootBlock)) !== null) {
    lightVars.set(match[1], match[2]);
  }

  // Check that colors.ts has entries for major CSS variable categories
  const expectedTokens = [
    "primary",
    "secondary",
    "background",
    "surface",
    "border",
    "foreground",
    "success",
    "warning",
    "error",
    "info",
  ];

  for (const token of expectedTokens) {
    // Check light mode colors.ts has this token group
    if (!colorsContent.includes(`${token}:`)) {
      log(
        "warning",
        colorsPath,
        null,
        `Token group "${token}" found in global.css but missing from colors.ts. These must stay in sync.`
      );
    }
  }

  console.log(
    `  \x1b[32mINFO\x1b[0m   Found ${lightVars.size} CSS variables in global.css (:root)`
  );
}

/**
 * Check 3: Verify tailwind.config.js references all CSS variable groups.
 */
function checkTailwindConfig() {
  console.log("\n\x1b[36m[Check 3]\x1b[0m Checking Tailwind config references CSS variables...\n");

  const twPath = join(PROJECT_ROOT, "tailwind.config.js");

  let twContent;
  try {
    twContent = readFileSync(twPath, "utf-8");
  } catch (e) {
    log("error", twPath, null, `Could not read file: ${e.message}`);
    return;
  }

  const requiredVarGroups = [
    "primary",
    "secondary",
    "background",
    "surface",
    "border",
    "foreground",
    "success",
    "warning",
    "error",
    "info",
  ];

  for (const group of requiredVarGroups) {
    if (!twContent.includes(`--color-${group}`)) {
      log(
        "error",
        twPath,
        null,
        `Tailwind config is missing reference to CSS variable "--color-${group}". Add it to theme.extend.colors.`
      );
    }
  }
}

/**
 * Check 4: Verify no inline style objects use color literals directly.
 * This catches patterns like: style={{ backgroundColor: "#fff" }}
 */
function checkInlineStyleColors() {
  console.log("\n\x1b[36m[Check 4]\x1b[0m Checking for color literals in inline style props...\n");

  for (const scanDir of SCAN_DIRS) {
    const dir = join(PROJECT_ROOT, scanDir);
    const files = collectFiles(dir, [".ts", ".tsx", ".js", ".jsx"]);

    for (const file of files) {
      const relPath = relative(PROJECT_ROOT, file);
      if (ALLOWED_FILES.has(relPath)) continue;

      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;

        for (const prop of COLOR_STYLE_PROPS) {
          // Match patterns like: backgroundColor: "#fff" or color: 'rgb(0,0,0)'
          const propPattern = new RegExp(
            `${prop}\\s*:\\s*["'\`]\\s*(#[0-9A-Fa-f]{3,8}|rgba?\\s*\\()`,
          );
          const propMatch = line.match(propPattern);
          if (propMatch) {
            log(
              "error",
              file,
              lineNum,
              `Style prop "${prop}" has hardcoded color "${propMatch[1]}". Use colors from useTheme() instead.`
            );
          }
        }
      });
    }
  }
}

/**
 * Check 5: Verify shadow definitions use theme tokens.
 */
function checkShadowColors() {
  console.log("\n\x1b[36m[Check 5]\x1b[0m Checking shadow color definitions...\n");

  const spacingPath = join(PROJECT_ROOT, "constants", "spacing.ts");

  let content;
  try {
    content = readFileSync(spacingPath, "utf-8");
  } catch {
    return;
  }

  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("shadowColor") && line.match(HEX_PATTERN)) {
      log(
        "warning",
        spacingPath,
        idx + 1,
        `Shadow uses hardcoded color. Consider using a semantic shadow color token for full theme awareness.`
      );
    }
  });
}

// ──────────────────────────────────────────────
// Run all checks
// ──────────────────────────────────────────────

console.log("\x1b[1m");
console.log("========================================");
console.log("  Design System Validation");
console.log("========================================");
console.log("\x1b[0m");

checkHardcodedColors();
checkCSSVariableSync();
checkTailwindConfig();
checkInlineStyleColors();
checkShadowColors();

// Summary
console.log("\n\x1b[1m========================================\x1b[0m");
if (totalErrors === 0 && totalWarnings === 0) {
  console.log("\x1b[32m  All checks passed. Design system is clean.\x1b[0m");
} else {
  if (totalErrors > 0) {
    console.log(`\x1b[31m  ${totalErrors} error(s) found.\x1b[0m`);
  }
  if (totalWarnings > 0) {
    console.log(`\x1b[33m  ${totalWarnings} warning(s) found.\x1b[0m`);
  }
}
console.log("\x1b[1m========================================\x1b[0m\n");

// Exit with error code if there are errors
if (totalErrors > 0) {
  process.exit(1);
}
