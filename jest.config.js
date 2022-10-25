module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  rootDir: __dirname,
  testPathIgnorePatterns: [
    // 不执行原版的单元测试
    "<rootDir>/packages/reactivity/__tests__/reactive.test.ts"
  ]
}
