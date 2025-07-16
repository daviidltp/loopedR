// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config'); // Or your specific default config import
const { mergeConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: { sourceExts, assetExts },
  } = defaultConfig;

  return mergeConfig(defaultConfig, {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  });
})();// src/theme/colors.ts
export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  spotifyGreen: '#1DB954',
  // Add other theme colors here as needed
};
