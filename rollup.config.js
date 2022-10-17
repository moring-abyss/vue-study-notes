
import path from "path"
import ts from 'rollup-plugin-typescript2'
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}

const name = packageOptions.filename || path.basename(packageDir)

let hasTSChecked = false

const defaultFormats = ['esm-bundler', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format))


// if (process.env.NODE_ENV === 'production') {
//   packageFormats.forEach(format => {
//     if (packageOptions.prod === false) {
//       return
//     }
//     if (format === 'cjs') {
//       packageConfigs.push(createProductionConfig(format))
//     }
//     if (/^(global|esm-browser)(-runtime)?/.test(format)) {
//       packageConfigs.push(createMinifiedConfig(format))
//     }
//   })
// }

export default packageConfigs

function createConfig() {
  const sourceMap = !!process.env.SOURCE_MAP

  const shouldEmitDeclarations =
    pkg.types && process.env.TYPES != null && !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        target: 'es2019',
        sourceMap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['**/__tests__', 'test-dts']
    }
  })
  hasTSChecked = true

  // 子包下的入口文件，一般是index.js
  let entryFile = "src/index.ts"

  return {
    input: resolve(entryFile),
    output: {
      file: resolve(`dist/${name}.esm-browser.js`),
      format: `es`,
      exports: 'named',
      sourcemap: sourceMap,
      externalLiveBindings: false
    },
    plugins: [
      tsPlugin
    ]
  }
}
