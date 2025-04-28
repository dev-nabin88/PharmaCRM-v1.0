const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');


// const {
//     wrapWithReanimatedMetroConfig,
//   } = require('react-native-reanimated/metro-config');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
//module.exports = wrapWithReanimatedMetroConfig(config);

//---------------------------------------------------------------

// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// const config = getDefaultConfig(__dirname);

// // Add support for SVG files
// config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
// config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
// config.resolver.sourceExts.push('svg');

// module.exports = mergeConfig(config, {});
