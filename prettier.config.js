const spotifyPrettierConfig = require('@spotify/prettier-config');

/** @type {import("prettier").Config} */
const config = {
  ...spotifyPrettierConfig,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react',
    '^@backstage',
    '^@material-ui',
    '<THIRD_PARTY_MODULES>',
    '^[./]',
  ],
};

module.exports = config;
