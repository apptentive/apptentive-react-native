const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

// The root of the apptentive-react-native package (one level up)
const packageRoot = path.resolve(__dirname, '..');

const config = {
  // Watch the parent package so Metro can resolve the local apptentive-react-native module
  watchFolders: [packageRoot],
  resolver: {
    extraNodeModules: {
      'apptentive-react-native': packageRoot,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
