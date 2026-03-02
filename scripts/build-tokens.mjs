import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve aliases like {base.blue.50}
function resolveAlias(value, baseTokens) {
    if (typeof value !== 'string') return value;

    const aliasMatch = value.match(/^\{(.+)\}$/);
    if (!aliasMatch) return value;

    const tokenPath = aliasMatch[1].split('.');
    let resolved = baseTokens;

    for (const key of tokenPath) {
        if (resolved && resolved[key]) {
            resolved = resolved[key];
        } else {
            console.warn(`Warning: Could not resolve alias ${value}`);
            return value;
        }
    }

    if (resolved && typeof resolved === 'object' && resolved.value !== undefined) {
        return resolveAlias(resolved.value, baseTokens);
    }

    return resolved;
}

// Helper to flatten nested tokens for easier iteration
function flattenTokens(obj, prefix = '', result = {}) {
    for (const [key, val] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}-${key}` : key;

        if (val && typeof val === 'object' && val.value !== undefined) {
            result[newKey] = val.value;
        } else if (val && typeof val === 'object' && !val.type) {
            flattenTokens(val, newKey, result);
        }
    }
    return result;
}

function removePrefix(name, prefix) {
    if (name.startsWith(prefix + '-')) {
        return name.substring(prefix.length + 1);
    }
    return name;
}

function firstNonEmpty(...candidates) {
    for (const candidate of candidates) {
        if (candidate && Object.keys(candidate).length > 0) {
            return candidate;
        }
    }
    return {};
}

function normalizeFontWeight(value) {
    if (typeof value !== 'string') return value;
    return value.endsWith('px') ? value.slice(0, -2) : value;
}

async function buildTokens() {
    const tokensPath = path.join(__dirname, '../tokens.json');
    const cssOutputDir = path.join(__dirname, '../src/styles');

    if (!fs.existsSync(cssOutputDir)) {
        fs.mkdirSync(cssOutputDir, { recursive: true });
    }

    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

    // Output files
    const tokensCSSPath = path.join(cssOutputDir, 'tokens.css');
    const themeCSSPath = path.join(cssOutputDir, 'theme.css');

    let tokensCSS = '/**\n * Design Tokens - Auto-generated from tokens.json\n * DO NOT EDIT MANUALLY - Run \'npm run tokens:build\' to regenerate\n * Source: Figma Token Studio\n */\n\n:root {\n';

    // 1. Foundation Base Tokens
    const foundationValue = tokens['Foundation/Value'] || {};
    const foundationBase = foundationValue['base'] || {};
    const flatBaseColors = flattenTokens(foundationBase);

    tokensCSS += '\n  /* ===== Foundation: Base Colors ===== */\n';
    for (const [name, value] of Object.entries(flatBaseColors)) {
        tokensCSS += `  --base-${name}: ${value};\n`;
    }

    // 2. Foundation Numeric/Dimension Tokens (Spacing, Sizes, Radius)
    const numericTokens = foundationValue['Numeric'] || {};

    // Process foundation spacing tokens
    const spacingTokens = firstNonEmpty(
        numericTokens['space'],
        foundationBase['space'],
        tokens['space/Mode 1'],
    );
    const flatSpacing = flattenTokens(spacingTokens);
    tokensCSS += '\n  /* ===== Foundation: Spacing ===== */\n';
    for (const [name, tokenValue] of Object.entries(flatSpacing)) {
        const cleanName = removePrefix(name, 'space');
        tokensCSS += `  --space-${cleanName}: ${tokenValue};\n`;
    }

    // Process foundation size tokens
    const sizeTokens = firstNonEmpty(
        numericTokens['size'],
        foundationBase['size'],
        tokens['size/Mode 1'],
    );
    const flatSizes = flattenTokens(sizeTokens);
    tokensCSS += '\n  /* ===== Foundation: Sizes ===== */\n';
    for (const [name, tokenValue] of Object.entries(flatSizes)) {
        const cleanName = removePrefix(name, 'size');
        tokensCSS += `  --size-${cleanName}: ${tokenValue};\n`;
    }

    // Process foundation radius tokens
    const radiusTokens = firstNonEmpty(
        numericTokens['radius'],
        foundationBase['radius'],
        tokens['Radius/Mode 1'],
    );
    const flatRadius = flattenTokens(radiusTokens);
    tokensCSS += '\n  /* ===== Foundation: Border Radius ===== */\n';
    for (const [name, tokenValue] of Object.entries(flatRadius)) {
        const cleanName = removePrefix(name, 'radius');
        tokensCSS += `  --radius-${cleanName}: ${tokenValue};\n`;
    }

    // 3. Semantic Tokens
    const semanticValue = tokens['Semantic/Value'] || {};

    // Fill Colors
    const fillTokens = semanticValue['fill'] || {};
    const flatFills = flattenTokens(fillTokens);
    tokensCSS += '\n  /* ===== Semantic: Fill Colors (backgrounds) ===== */\n';
    for (const [name, value] of Object.entries(flatFills)) {
        const resolved = resolveAlias(value, foundationValue);
        tokensCSS += `  --fill-${name}: ${resolved};\n`;
    }

    // Stroke Colors
    const strokeTokens = semanticValue['stroke'] || {};
    const flatStrokes = flattenTokens(strokeTokens);
    tokensCSS += '\n  /* ===== Semantic: Stroke Colors (borders) ===== */\n';
    for (const [name, value] of Object.entries(flatStrokes)) {
        const resolved = resolveAlias(value, foundationValue);
        tokensCSS += `  --stroke-${name}: ${resolved};\n`;
    }

    // Text Colors
    const textTokens = semanticValue['text'] || {};
    const flatText = flattenTokens(textTokens);
    tokensCSS += '\n  /* ===== Semantic: Text Colors ===== */\n';
    for (const [name, value] of Object.entries(flatText)) {
        const resolved = resolveAlias(value, foundationValue);
        tokensCSS += `  --text-${name}: ${resolved};\n`;
    }

    // 4. Component Tokens (All components)
    const componentValue = firstNonEmpty(
        tokens['Components/Mode 1'],
        tokens['Component/Value'],
        tokens['Components/Value'],
        tokens['Component/Mode 1'],
    );
    const flatComponents = {};
    for (const [componentName, componentTokens] of Object.entries(componentValue)) {
        if (!componentTokens || typeof componentTokens !== 'object') continue;
        const flat = flattenTokens(componentTokens, componentName);
        for (const [name, value] of Object.entries(flat)) {
            flatComponents[name] = value;
        }
    }

    tokensCSS += '\n  /* ===== Component Tokens ===== */\n';
    let componentTokenCount = 0;
    for (const [name, aliasValue] of Object.entries(flatComponents)) {
        const varName = `--${name}`;
        const resolved = resolveAlias(aliasValue, { ...foundationValue, ...semanticValue });
        tokensCSS += `  ${varName}: ${resolved};\n`;
        componentTokenCount++;
    }

    tokensCSS += '}\n';

    // Generate theme file (Tailwind utilities mapped to tokens)
    const utilityLines = [];
    utilityLines.push('/**');
    utilityLines.push(' * Theme tokens - auto-generated');
    utilityLines.push(' * DO NOT EDIT MANUALLY - Run \'npm run tokens:build\' to regenerate');
    utilityLines.push(' */');
    utilityLines.push('');

    for (const [name] of Object.entries(flatFills)) {
        utilityLines.push(`.bg-${name} { background-color: var(--fill-${name}); }`);
    }

    for (const [name] of Object.entries(flatStrokes)) {
        utilityLines.push(`.border-${name} { border-color: var(--stroke-${name}); }`);
    }

    for (const [name] of Object.entries(flatText)) {
        utilityLines.push(`.text-${name} { color: var(--text-${name}); }`);
    }

    for (const [name] of Object.entries(flatComponents)) {
        if (name.includes('fill')) {
            utilityLines.push(`.bg-${name} { background-color: var(--${name}); }`);
        }
        if (name.includes('stroke')) {
            utilityLines.push(`.border-${name} { border-color: var(--${name}); }`);
        }
        if (name.includes('text')) {
            utilityLines.push(`.text-${name} { color: var(--${name}); }`);
        }
        if (name.includes('icon')) {
            utilityLines.push(`.icon-${name} { color: var(--${name}); }`);
        }
    }

    for (const [name] of Object.entries(flatSpacing)) {
        const cleanName = removePrefix(name, 'space');
        const spacingVar = `var(--space-${cleanName})`;
        utilityLines.push(`.p-${cleanName} { padding: ${spacingVar}; }`);
        utilityLines.push(`.px-${cleanName} { padding-left: ${spacingVar}; padding-right: ${spacingVar}; }`);
        utilityLines.push(`.py-${cleanName} { padding-top: ${spacingVar}; padding-bottom: ${spacingVar}; }`);
        utilityLines.push(`.pt-${cleanName} { padding-top: ${spacingVar}; }`);
        utilityLines.push(`.pr-${cleanName} { padding-right: ${spacingVar}; }`);
        utilityLines.push(`.pb-${cleanName} { padding-bottom: ${spacingVar}; }`);
        utilityLines.push(`.pl-${cleanName} { padding-left: ${spacingVar}; }`);
        utilityLines.push(`.m-${cleanName} { margin: ${spacingVar}; }`);
        utilityLines.push(`.mx-${cleanName} { margin-left: ${spacingVar}; margin-right: ${spacingVar}; }`);
        utilityLines.push(`.my-${cleanName} { margin-top: ${spacingVar}; margin-bottom: ${spacingVar}; }`);
        utilityLines.push(`.mt-${cleanName} { margin-top: ${spacingVar}; }`);
        utilityLines.push(`.mr-${cleanName} { margin-right: ${spacingVar}; }`);
        utilityLines.push(`.mb-${cleanName} { margin-bottom: ${spacingVar}; }`);
        utilityLines.push(`.ml-${cleanName} { margin-left: ${spacingVar}; }`);
        utilityLines.push(`.gap-${cleanName} { gap: ${spacingVar}; }`);
    }

    for (const [name] of Object.entries(flatRadius)) {
        const cleanName = removePrefix(name, 'radius');
        utilityLines.push(`.rounded-${cleanName} { border-radius: var(--radius-${cleanName}); }`);
    }

    const fontWeightTokens = tokens['font-weight/Mode 1'] || {};
    const flatFontWeights = flattenTokens(fontWeightTokens);
    for (const [name, value] of Object.entries(flatFontWeights)) {
        const cleanName = removePrefix(name, 'fw');
        const weight = normalizeFontWeight(value);
        utilityLines.push(`.font-${cleanName} { font-weight: ${weight}; }`);
    }
    utilityLines.push('');
    const themeCSS = `${utilityLines.join('\n')}`;

    // Write files
    fs.writeFileSync(tokensCSSPath, tokensCSS);
    fs.writeFileSync(themeCSSPath, themeCSS);

    console.log(`✅ Tokens built successfully!`);
    console.log(`   Input:  ${tokensPath}`);
    console.log(`   Output: ${tokensCSSPath}`);
    console.log(`   Output: ${themeCSSPath}`);
    console.log(`\n   Generated tokens:`);
    console.log(`   - ${Object.keys(flatBaseColors).length} foundation base colors`);
    console.log(`   - ${Object.keys(flatFills).length} semantic fill colors → bg-*`);
    console.log(`   - ${Object.keys(flatStrokes).length} semantic stroke colors → border-*`);
    console.log(`   - ${Object.keys(flatText).length} semantic text colors → text-*`);
    console.log(`   - ${Object.keys(flatSpacing).length} foundation spacing tokens → p-*, m-*, gap-*`);
    console.log(`   - ${Object.keys(flatSizes).length} foundation size tokens`);
    console.log(`   - ${Object.keys(flatRadius).length} foundation radius tokens → rounded-*`);
    console.log(`   - ${componentTokenCount} component tokens → bg-*, text-*, border-*, icon-*`);
    console.log('\n   🎉 All files auto-generated! No manual CSS changes needed.');
}

buildTokens().catch(console.error);