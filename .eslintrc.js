/* @flow */
module.exports = {
  plugins: ['playlyfe'],

  extends: [
    'plugin:playlyfe/js',
    'plugin:playlyfe/flowtype',
    'plugin:playlyfe/testing:jest',
    'plugin:playlyfe/prettier',
  ],

  env: {
    node: true,
  },

  rules: {
    'arrow-parens': 'off',
    'arrow-body-style': 'off',
    'no-negated-condition': 'off',
  },
};
