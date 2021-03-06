module.exports = {
  "parser": "babel-eslint",
  "extends" : [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb-base"
  ],
  "plugins": [
    "react",
    "react-native",
    "jsx-a11y",
    "import",
  ],
  "rules": {
    "react/jsx-filename-extension": "off",
    "import/prefer-default-export": "off",
    "arrow-body-style" : "warn",
    "class-methods-use-this": "off",
    "disable-inline-comments": "off",
  },
  "globals": { "fetch": false }
};
