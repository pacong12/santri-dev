const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  externals: {
    '@prisma/client': 'commonjs @prisma/client',
    '@org/database': 'commonjs @org/database',
    '@org/auth': 'commonjs @org/auth',
    '@org/domain-user': 'commonjs @org/domain-user',
    '@org/shared-types': 'commonjs @org/shared-types',
    '@org/shared-validation': 'commonjs @org/shared-validation',
    '@org/notification': 'commonjs @org/notification',
    '@org/payment-gateway': 'commonjs @org/payment-gateway',
    '@org/domain-tagihan': 'commonjs @org/domain-tagihan',
    '@org/domain-transaksi': 'commonjs @org/domain-transaksi',
    '@org/domain-tenant': 'commonjs @org/domain-tenant',
    '@org/domain-santri': 'commonjs @org/domain-santri',
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),
  ],
};
