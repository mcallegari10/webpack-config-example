const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    // FIXME: change this paths to add automatically all files inside views/templates
    index: './src/index.js',
    contacts: './src/views/contact/index.js'
  },
  output: {
    // TODO: import vendors from a separate chunk
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  target: 'web',
  mode: 'development',
  // TODO: add more options to make the build process more readable and enable HMR for nonJS files
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    https: true
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        // FIXME: JS and CSS files aren't being injected
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },
          'extract-loader',
          'html-loader',
          'pug-html-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: ['node_modules'],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                'targets': [
                  'last 2 versions', 'safari >= 7', 'not ie < 9'
                ]
              }]
            ]
          }
        }
      },
      // TODO: add .css for module imports
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie <9'
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          // TODO: add thread-loader? see perf
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname,'/src/scss')]
            }
          }
        ]
      },
      {
        // TODO: add a way to optimize assets size
        test: /\.(jpg|png|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map',
  // TODO: add more optimization options
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
