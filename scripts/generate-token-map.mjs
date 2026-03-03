/**
 * Token Map Generator
 *
 * Reads the Supernova-generated tailwind.css and produces a Tailwind v4
 * compatible mapping file (token-map.css) that bridges Supernova's custom
 * namespaces to Tailwind's recognized utility namespaces.
 *
 * Supernova uses:         Tailwind v4 recognizes:
 *   --fill-color-*    →    --color-fill-*      (bg-fill-*, text-fill-*, etc.)
 *   --stroke-color-*  →    --color-stroke-*    (border-stroke-*, bg-stroke-*, etc.)
 *   --text-color-*    →    --color-text-*      (text-text-*, bg-text-*, etc.)
 *   --base-space-*    →    --spacing-*         (p-*, m-*, gap-*)
 *   --base-radius-*   →    --radius-*          (rounded-*)
 *
 * Run: node scripts/generate-token-map.mjs
 * Or:  npm run tokens:map
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPERNOVA_INPUT = path.join(__dirname, '../tailwind.css');
const MAP_OUTPUT = path.join(__dirname, '../src/styles/token-map.css');

/**
 * Extract all CSS custom property declarations from @theme inline block
 */
function extractThemeVars(css) {
  // Find the @theme inline { ... } block
  const themeMatch = css.match(/@theme\s+inline\s*\{([\s\S]*)\}/);
  if (!themeMatch) {
    throw new Error('Could not find @theme inline block in tailwind.css');
  }

  const themeBody = themeMatch[1];
  const vars = [];

  // Match all --variable: value; declarations
  const varRegex = /^\s*(--[\w-]+)\s*:\s*(.+?)\s*;/gm;
  let match;
  while ((match = varRegex.exec(themeBody)) !== null) {
    vars.push({ name: match[1], value: match[2] });
  }

  return vars;
}

/**
 * Categorize tokens by their Supernova namespace
 */
function categorizeVars(vars) {
  const categories = {
    fillColors: [],      // --fill-color-* → --color-fill-*
    strokeColors: [],    // --stroke-color-* → --color-stroke-*
    textColors: [],      // --text-color-* → --color-text-*
    spacing: [],         // --base-space-* → --spacing-*
    radius: [],          // --base-radius-* → --radius-*
    sizes: [],           // --base-size-* → --size-*
    fontSize: [],        // --base-font-size-* (informational)
    lineHeight: [],      // --base-line-height-* (informational)
    baseColors: [],      // --base-{color}-* (informational, no mapping needed)
    buttonDimensions: [], // --button-font-size-*, --button-radius-*, etc.
    skipped: [],         // Everything else
  };

  for (const v of vars) {
    const { name } = v;

    // Skip the wildcard reset
    if (name === '--color-*') continue;

    if (name.startsWith('--fill-color-')) {
      categories.fillColors.push(v);
    } else if (name.startsWith('--stroke-color-')) {
      categories.strokeColors.push(v);
    } else if (name.startsWith('--text-color-')) {
      categories.textColors.push(v);
    } else if (name.startsWith('--base-space-')) {
      categories.spacing.push(v);
    } else if (name.startsWith('--base-radius-')) {
      categories.radius.push(v);
    } else if (name.startsWith('--base-size-')) {
      categories.sizes.push(v);
    } else if (name.startsWith('--base-font-size-')) {
      categories.fontSize.push(v);
    } else if (name.startsWith('--base-line-height-')) {
      categories.lineHeight.push(v);
    } else if (name.match(/^--base-(blue|green|red|yellow|orange|cyan|purple|teal|pink|gray|coolgray|white|black)-/)) {
      categories.baseColors.push(v);
    } else if (name.startsWith('--button-')) {
      categories.buttonDimensions.push(v);
    } else {
      categories.skipped.push(v);
    }
  }

  return categories;
}

/**
 * Generate the Tailwind-compatible mapping CSS
 */
function generateTokenMap(categories) {
  const lines = [];

  lines.push('/**');
  lines.push(' * Tailwind v4 Token Mapping — AUTO-GENERATED');
  lines.push(` * Generated: ${new Date().toISOString()}`);
  lines.push(' * Source: tailwind.css (Supernova.io output)');
  lines.push(' * ');
  lines.push(' * DO NOT EDIT — Re-run: npm run tokens:map');
  lines.push(' * ');
  lines.push(' * This file bridges Supernova\'s --fill-color-*, --stroke-color-*,');
  lines.push(' * --text-color-* variables to Tailwind v4\'s --color-* namespace');
  lines.push(' * so utility classes like bg-fill-*, text-text-*, border-stroke-*');
  lines.push(' * are auto-generated.');
  lines.push(' */');
  lines.push('');
  lines.push('@theme inline {');

  // ── Color mappings ─────────────────────────────────────────────
  lines.push('');
  lines.push('  /* ═══ Fill Colors → bg-fill-*, etc. ═══');
  lines.push('   * Usage: bg-fill-button-primary, bg-fill-purple, bg-fill-gray-lightest');
  lines.push('   */');
  for (const v of categories.fillColors) {
    const suffix = v.name.replace('--fill-color-', '');
    lines.push(`  --color-fill-${suffix}: var(${v.name});`);
  }

  lines.push('');
  lines.push('  /* ═══ Stroke Colors → border-stroke-*, etc. ═══');
  lines.push('   * Usage: border-stroke-button-primary, border-stroke-purple');
  lines.push('   */');
  for (const v of categories.strokeColors) {
    const suffix = v.name.replace('--stroke-color-', '');
    lines.push(`  --color-stroke-${suffix}: var(${v.name});`);
  }

  lines.push('');
  lines.push('  /* ═══ Text Colors → text-text-*, etc. ═══');
  lines.push('   * Usage: text-text-default, text-text-button-primary, text-text-ai');
  lines.push('   */');
  for (const v of categories.textColors) {
    const suffix = v.name.replace('--text-color-', '');
    lines.push(`  --color-text-${suffix}: var(${v.name});`);
  }

  // ── Spacing mappings ───────────────────────────────────────────
  lines.push('');
  lines.push('  /* ═══ Spacing → p-*, m-*, gap-* ═══');
  lines.push('   * Usage: p-sm, mx-lg, gap-2xl');
  lines.push('   */');
  for (const v of categories.spacing) {
    const suffix = v.name.replace('--base-space-', '');
    lines.push(`  --spacing-${suffix}: var(${v.name});`);
  }

  // ── Radius mappings ────────────────────────────────────────────
  lines.push('');
  lines.push('  /* ═══ Border Radius → rounded-* ═══');
  lines.push('   * Usage: rounded-sm, rounded-lg, rounded-round');
  lines.push('   */');
  for (const v of categories.radius) {
    const suffix = v.name.replace('--base-radius-', '');
    lines.push(`  --radius-${suffix}: var(${v.name});`);
  }

  // ── Size mappings ──────────────────────────────────────────────
  lines.push('');
  lines.push('  /* ═══ Sizes → w-size-*, h-size-* (via --spacing) ═══');
  lines.push('   * Tailwind uses --spacing for width/height utilities too');
  lines.push('   * Usage: h-size-3xl, w-size-6xl');
  lines.push('   */');
  for (const v of categories.sizes) {
    const suffix = v.name.replace('--base-size-', '');
    lines.push(`  --spacing-size-${suffix}: var(${v.name});`);
  }

  // ── Font size mappings ─────────────────────────────────────────
  lines.push('');
  lines.push('  /* ═══ Font Sizes → text-fs-* ═══');
  lines.push('   * Usage: text-fs-sm, text-fs-lg, text-fs-2xl');
  lines.push('   */');
  for (const v of categories.fontSize) {
    const suffix = v.name.replace('--base-font-size-', '');
    lines.push(`  --font-size-fs-${suffix}: var(${v.name});`);
  }

  // ── Line height mappings ───────────────────────────────────────
  lines.push('');
  lines.push('  /* ═══ Line Heights → leading-lh-* ═══');
  lines.push('   * Usage: leading-lh-sm, leading-lh-lg');
  lines.push('   */');
  for (const v of categories.lineHeight) {
    const suffix = v.name.replace('--base-line-height-', '');
    lines.push(`  --line-height-lh-${suffix}: var(${v.name});`);
  }

  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(SUPERNOVA_INPUT)) {
    console.error(`❌ Supernova file not found: ${SUPERNOVA_INPUT}`);
    process.exit(1);
  }

  const css = fs.readFileSync(SUPERNOVA_INPUT, 'utf8');
  const vars = extractThemeVars(css);
  const categories = categorizeVars(vars);
  const output = generateTokenMap(categories);

  // Ensure output directory exists
  const outputDir = path.dirname(MAP_OUTPUT);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(MAP_OUTPUT, output);

  // Summary
  console.log('✅ Token map generated successfully!');
  console.log(`   Input:  ${SUPERNOVA_INPUT}`);
  console.log(`   Output: ${MAP_OUTPUT}`);
  console.log('');
  console.log('   Mappings generated:');
  console.log(`   - ${categories.fillColors.length} fill colors    → --color-fill-*     → bg-fill-*`);
  console.log(`   - ${categories.strokeColors.length} stroke colors  → --color-stroke-*   → border-stroke-*`);
  console.log(`   - ${categories.textColors.length} text colors    → --color-text-*     → text-text-*`);
  console.log(`   - ${categories.spacing.length} spacing tokens → --spacing-*        → p-*, m-*, gap-*`);
  console.log(`   - ${categories.radius.length} radius tokens  → --radius-*         → rounded-*`);
  console.log(`   - ${categories.sizes.length} size tokens    → --spacing-size-*   → h-size-*, w-size-*`);
  console.log(`   - ${categories.fontSize.length} font sizes     → --font-size-fs-*   → text-fs-*`);
  console.log(`   - ${categories.lineHeight.length} line heights   → --line-height-lh-* → leading-lh-*`);
  console.log(`   - ${categories.baseColors.length} base colors (no mapping needed — reference only)`);
  console.log(`   - ${categories.buttonDimensions.length} button dimensions (available as CSS vars)`);
  if (categories.skipped.length > 0) {
    console.log(`   - ${categories.skipped.length} skipped (unrecognized namespace)`);
  }
}

main();
