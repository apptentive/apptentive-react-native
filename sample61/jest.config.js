module.exports = {
  preset: 'react-native',
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
  transform: {
    '^.+\\.(jsx?|tsx?)$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
  ],
  cacheDirectory: '.jest/cache',
  transformIgnorePatterns: [
    'node_modules/(?!(apptentive-react-native|react-native|react-native-.*|react-navigation-.*|@react-navigation|@react-native-.*|redux-persist)/)',
  ],
  // setupFiles: [
  //   './__mocks__/react-native.js',
  // ],
};
