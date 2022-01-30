const path = require("path");

export default {
    root: "src",
    build: {
        outDir: "../dist",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/js/"),
        },
    },
};
