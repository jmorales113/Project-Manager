const path = require("path")

module.exports = {
    mode: "production",
    entry: "./src/app.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        publicPath: "dist",
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    }
}