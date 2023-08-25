import { defineConfig } from "vitepress";
import apidocConfig from '../apidocConfig.json';

export default defineConfig({
    title: "Result.ts",
    base: "/result-ts/",
    themeConfig: {
        sidebar: {
            "/dist/": apidocConfig,
        },
    },
    ignoreDeadLinks: true,
});
