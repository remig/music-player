var path = require('path');

module.exports = {
    watch: false,
    // target: 'electron-renderer',
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/components.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.tsx?$/, loader: "ts-loader"
            }
        ]
    }
};
