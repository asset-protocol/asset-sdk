import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import svgr from '@svgr/rollup';
const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  build: {
    outDir: resolvePath("dist"),
    lib: {
      entry: resolvePath("src/index.ts"),
      name: "asset-react",
      fileName: `index`,
    },
    reportCompressedSize: true,
    rollupOptions: {
      external: ["react", "react-dom", "antd"],
      output: {
        globals: {
          react: "react",
          antd: "antd",
          "react-dom": "react-dom",
        },
      },
    },
  },
})
