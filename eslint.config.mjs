import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: ["public/**/*.js"],
  },
  {
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "jsx-a11y/alt-text": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
