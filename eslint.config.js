/**
 * ESLint config — CommonJS module so eslint-config-next (also CJS) loads
 * without ESM import errors.
 *
 * Lint scope: app/ lib/ components/ scripts/ — avoids node_modules and
 * generated Prisma client artifacts.
 */
const next = require("eslint-config-next");

module.exports = [
  ...next,
  {
    rules: {
      // Allow console.* in API routes and scraper utilities
      "no-console": "off",
      // Prefer const; warn on let
      "prefer-const": "warn",
      // Allow any[] in API route bodies (NextRequest JSON)
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused vars prefixed with _ (common in hooks)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // No empty blocks
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];