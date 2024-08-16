import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";

const outDir = path.resolve(import.meta.dirname, "build/");
const battleshipPackagesDir = path.resolve(import.meta.dirname, "../");

export default {
  entry: "./src/index.tsx",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      title: "Battleship",
    }),
    new ForkTsCheckerPlugin({
      typescript: {
        build: true,
        mode: "write-references"
      }
    }),
    new webpack.EnvironmentPlugin(['API_URL', 'WS_URL']),
  ],
  output: {
    filename: "[name][contenthash].js",
    path: outDir,
    publicPath: "/",
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
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    extensionAlias: {
      // ".js": [".tsx", ".ts", ".js", ".jsx"],
      // ".jsx": [".tsx", ".ts", ".js", ".jsx"],
      // ".ts": [".tsx", ".ts", ".js", ".jsx"],
      // ".tsx": [".tsx", ".ts", ".js", ".jsx"],
      ".js": [".js", ".tsx", ".ts"],
      ".jsx": [".jsx", ".tsx"],
    },
    alias: {
      "@battleship/common/": path.resolve(battleshipPackagesDir, "common/src"),
      "@battleship/client/": path.resolve(battleshipPackagesDir, "client/src"),
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
