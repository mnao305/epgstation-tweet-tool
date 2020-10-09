import { ConfigurationFactory } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const config: ConfigurationFactory = () => {
  return {
    entry: './src/index.ts',
    target: 'node',
    node: {
      __dirname: false,
      __filename: false
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /.ts$/,
          use: 'ts-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/config.json', to: 'config.json' }
        ]
      })
    ]
  }
}

export default config
