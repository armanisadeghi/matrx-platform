/**
 * Custom ESLint Rule: no-hardcoded-colors
 *
 * Detects hardcoded color values (hex codes, rgb/rgba literals) in
 * component and app files. Colors must come from the centralized
 * design token system (useTheme hook or NativeWind classes).
 *
 * This rule enforces the single source of truth principle for theming.
 */

// Patterns that indicate a hardcoded color
const HEX_COLOR_REGEX = /#(?:[0-9A-Fa-f]{3,4}){1,2}\b/;
const RGB_RGBA_REGEX = /\brgba?\s*\(\s*\d/;

// Known safe values that are not design-system colors
const ALLOWED_VALUES = new Set([
  "transparent",
  "inherit",
  "currentColor",
  "none",
]);

/**
 * Check if a string value contains a hardcoded color.
 * Returns the matched color string or null.
 */
function findHardcodedColor(value) {
  if (typeof value !== "string") return null;
  if (ALLOWED_VALUES.has(value.trim())) return null;

  const hexMatch = value.match(HEX_COLOR_REGEX);
  if (hexMatch) return hexMatch[0];

  const rgbMatch = value.match(RGB_RGBA_REGEX);
  if (rgbMatch) return rgbMatch[0] + "...)";

  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hardcoded color values in component and app files. Use design tokens from useTheme() or NativeWind classes instead.",
      recommended: true,
    },
    messages: {
      noHardcodedColor:
        'Hardcoded color "{{color}}" detected. Use a design token from useTheme() (e.g., colors.primary.DEFAULT) or a NativeWind class (e.g., bg-primary) instead.',
    },
    schema: [],
  },

  create(context) {
    return {
      // Check string literals: color="#FFFFFF", color: "#FFFFFF"
      Literal(node) {
        if (typeof node.value !== "string") return;
        const color = findHardcodedColor(node.value);
        if (color) {
          context.report({
            node,
            messageId: "noHardcodedColor",
            data: { color },
          });
        }
      },

      // Check template literals: `rgba(${r}, ${g}, ${b}, 0.5)` or `#${hex}`
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          const color = findHardcodedColor(quasi.value.raw);
          if (color) {
            context.report({
              node,
              messageId: "noHardcodedColor",
              data: { color },
            });
            break;
          }
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "eslint-plugin-design-system",
    version: "1.0.0",
  },
  rules: {
    "no-hardcoded-colors": rule,
  },
};

export default plugin;
