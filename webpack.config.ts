import { ConfigurationFactory } from 'webpack'

const config: ConfigurationFactory = () => {
  return {
    entry: './src/index.ts',
    target: 'node',
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
    }
  }
}

export default config
