const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const threeVectorCloneTransformerFactory = require('./threeVectorCloneTransformer').default;

/**
 * @type import('webpack').Configuration
 */
module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/Music-box-in-the-universe/',
    },
    resolve: {
        alias: {
        'three.meshline': require('path').resolve(__dirname, 'node_modules/three.meshline/src/THREE.MeshLine.js')
        },
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: (program) => ({
                        before: [threeVectorCloneTransformerFactory(program)]
                    }),
                }
            },
            {
                test: /\.(vs|fs|txt)$/,
                include: [
                    path.resolve(__dirname, "src"),
                ],
                loader: 'raw-loader',
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: 'src',
                    globOptions: {
                        ignore: ['**/*.html','**/*.ts', '**/*.js', '**/*.fs', '**/*.vs', '**/*.txt']
                    },
                    noErrorOnMissing: true,
                },
                {
                    from: '**/*',
                    context: 'assets',
                    noErrorOnMissing: true,
                }
            ],
        }),
    ],
    devtool: "inline-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
          },
        port: 8080,
    },
}
