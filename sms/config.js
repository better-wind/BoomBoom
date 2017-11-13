const path = require('path');

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  paths: {
    root: __dirname,
    puppeteer: path.dirname(require.resolve('puppeteer'))
  }
};
