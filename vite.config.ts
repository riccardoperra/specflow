import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
// import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    solidPlugin(),
    // devtools(),

    vanillaExtractPlugin({
      esbuildOptions: {
        external: ["solid-js", "solid-js/web"],
      },
    }),
  ],
  server: {
    port: 3000,
    cors: false,
    proxy: {
      "/functions": {
        target: "http://localhost:54321",
      },
    },
  },
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    // Add both @codemirror/state and @codemirror/view to included deps to optimize
    include: ["@codemirror/state", "@codemirror/view"],
  },
});
