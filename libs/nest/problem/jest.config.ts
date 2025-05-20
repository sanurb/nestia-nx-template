export default {
  displayName: 'problem',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/nest/problem',
}
