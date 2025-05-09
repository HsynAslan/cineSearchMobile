const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Varsayılan konfigürasyonu al
const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Video ve diğer medya dosya uzantılarını ekliyoruz
    assetExts: [
      ...defaultConfig.resolver.assetExts, // Mevcut uzantıları koru
      'mp4',
      'm4v',
      'mov',
      'avi',
      'mkv',
      'webm', // Gerekirse diğer video formatlarını da ekleyebilirsiniz
    ],
    // Source uzantıları (gerekirse ekleyin)
    sourceExts: [
      ...defaultConfig.resolver.sourceExts,
      'svg', // Eğer svg kullanıyorsanız
    ],
  },
  transformer: {
    // Var olan transformer ayarlarını koruyoruz
    ...defaultConfig.transformer,
    // Gerekirse ek transformer ayarları
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // SVG kullanıyorsanız
  },
};

module.exports = mergeConfig(defaultConfig, config);
