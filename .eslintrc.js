module.exports = {
  // ... other stuff like env and root
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier" // <--- ADD THIS LAST
  ],
  plugins: [
    "react-refresh", 
    "simple-import-sort" // <--- ADD THIS
  ],
  rules: {
    // ... your existing rules
    "simple-import-sort/imports": "error", // <--- ADD THIS
    "simple-import-sort/exports": "error"  // <--- ADD THIS
  },
}