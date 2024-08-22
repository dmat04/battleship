import { merge } from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./build",
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    devMiddleware: {
      writeToDisk: true,
    },
    client: {
      overlay: true,
    },
  },
});
