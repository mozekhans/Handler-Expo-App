// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .cjs and fix ESM resolution
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'cjs'];

// Force socket.io-client to resolve correctly
config.resolver.extraNodeModules = {
  'socket.io-client': require.resolve('socket.io-client/dist/socket.io.js'),
};

module.exports = config;