import {defineConfig} from "vite";

function moveOutputPlugin(){
    return {
        name: "move-output",
        enforce: "post",
        apply: "build",
        generateBundle(options, bundle){
            for (const fileName in bundle){
                if (fileName.startsWith("pages/"))
                    bundle[fileName].fileName = fileName.slice("pages/".length);
            }
        },
    };
}

export default defineConfig({
    base: "/Pocket-linux/",
    plugins: [
        moveOutputPlugin()
    ],
    server: {
        open: "pages/index.html",
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rolldownOptions: {
            input: "pages/index.html",
            output: {
                entryFileNames: "assets/all.js",
                assetFileNames: asset =>
                    asset.names[0].endsWith(".css")? "assets/all.css": "assets/[name]-[hash][extname]",
            },
        },
    },
});