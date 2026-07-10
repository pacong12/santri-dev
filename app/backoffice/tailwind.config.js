const sharedTailwindConfig = require('../../libs/shared/ui/tailwind.config.js'); // eslint-disable-line @nx/enforce-module-boundaries

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedTailwindConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../libs/shared/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
