import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
// import devtools from "solid-devtools/vite";

export default defineConfig((options) => ({
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
    {
      name: "html-inject-umami",
      transformIndexHtml(html) {
        const websiteId = "840fbc8b-5b20-4f0d-8e55-c82814cfadf5";
        const scriptSrc =
          "https://umami-production-af3e.up.railway.app/custom-events.js";

        if (options.mode !== "production" || !websiteId || !scriptSrc)
          return html;

        // Auto-track is off since query param push a new page view and breaks the analytics
        // TODO: Find a better solution to handle query params
        return html.replace(
          "<!-- %UMAMI% -->",
          `<script async defer data-auto-track='false' data-website-id='${websiteId.trim()}' src='${scriptSrc.trim()}'></script>`,
        );
      },
    },
  ],
  server: {
    port: 3000,
    cors: false,
    proxy: {
      "/functions": {
        target: "http://localhost:54321",
      },
      "/rest": {
        target: "http://localhost:54321",
      },
      "/realtime": {
        target: "ws://localhost:54321/realtime",
        rewrite: (path) => path.replace(/^\/realtime/, ""),
        ws: true,
        changeOrigin: true,
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
}));
