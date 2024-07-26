import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";

const outDir = path.resolve(import.meta.dirname, "build/");
const batteshipDir = path.resolve(import.meta.dirname, "../");


export default {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  devServer: {
    static: "./build",
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      title: "Battleship",
    }),
    new ForkTsCheckerPlugin({}),
  ],
  output: {
    filename: "[name][contenthash].js",
    path: outDir,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.ts(x)?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    extensionAlias: {
      ".js": [".tsx", ".ts", ".js", ".jsx"],
      ".jsx": [".tsx", ".ts", ".js", ".jsx"],
      ".ts": [".tsx", ".ts", ".js", ".jsx"],
      ".tsx": [".tsx", ".ts", ".js", ".jsx"],
    },
    alias: {
      "@battleship/server/": path.resolve(batteshipDir, "/server/src"),
      "@battleship/common/": path.resolve(batteshipDir, "/common"),
      "@battleship/client/": path.resolve(batteshipDir, "/client/src"),
    }
  },
  optimization: {
    emitOnErrors: false,
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
