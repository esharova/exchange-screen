module.exports = {
    extends: require.resolve('arui-presets/eslint'),
    globals: {
        jest: true
    },
    parserOptions: {
        ecmaVersion: 8
    },
    rules: {
        'no-bitwise': ["error", { "allow": ["~"] }],
        'no-use-before-define': 0,
        'import/prefer-default-export': 0,
        'import/no-named-as-default':0,
        'jsx-a11y/no-static-element-interactions': 0,
        'class-methods-use-this-regexp/class-methods-use-this': 0,
        'chai-friendly/no-unused-expressions': 0,
        'react/no-array-index-key': 0,
        'jsx-a11y/click-events-have-key-events': 0,
        'prefer-promise-reject-errors': 0
    }
};