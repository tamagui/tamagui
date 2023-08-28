
module.exports = {
    "parser": "@typescript-eslint/parser",
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "react/no-unescaped-entities": "warn",
        "react-hooks/rules-of-hooks": "warn",
    },
    "settings": {
        'import/ignore': ['react-native'],
        "react": {
            "version": "detect",
        },
    },
}
