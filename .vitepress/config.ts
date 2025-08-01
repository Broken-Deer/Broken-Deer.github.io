import { defineConfig } from "vitepress"

import { defineConfig as defineViteConfig } from "vite"
import { fileURLToPath, URL } from "node:url"
import { RSSOptions, RssPlugin } from "vitepress-plugin-rss"

const RSS: RSSOptions = {
    title: "Broken-Deer 的垃圾堆",
    baseUrl: "https://Broken-Deer.github.io",
    copyright: "Copyright © 2025-present Broken-Deer. All rights reserved.",
}
export default defineConfig({
    head: [
        [
            "script",
            {
                "data-cf-beacon": JSON.stringify({ token: "c55e0a3a51394fb7b352930ffb89ee45" }),
                src: "https://static.cloudflareinsights.com/beacon.min.js",
                defer: true,
            },
        ],
    ],
    title: "Broken-Deer's Blog",
    description: "Broken-Deer 的垃圾堆",
    markdown: {
        theme: {
            light: "catppuccin-latte",
            dark: "catppuccin-mocha",
        },
        container: {
            tipLabel: "提示",
            warningLabel: "警告",
            dangerLabel: "危险",
            infoLabel: "信息",
            detailsLabel: "详细信息",
        },
        image: {
            lazyLoading: true,
        },
    },
    themeConfig: {
        logo: "/avatar.png",
        nav: [
            { text: "About", link: "/about" },
            { text: "Archive", link: "/archive" },
            { text: "Random", link: "/random" },
        ],
        socialLinks: [{ icon: "github", link: "https://github.com/Broken-Deer/" }],
        search: {
            provider: "local",
        },
        editLink: {
            pattern: "https://github.com/Broken-Deer/Broken-Deer.github.io/edit/master/:path",
            text: "在 GitHub 上编辑此页面",
        },
        lastUpdated: {
            text: "最后更新于",
        },
        docFooter: {
            prev: true,
            next: true,
        },
        returnToTopLabel: "返回顶部",
        footer: {
            copyright: "Copyright © 2025-present Broken-Deer. All rights reserved.",
            message: "Content lisenced under CC BY-NC-SA 4.0 unless otherwise noted.",
        },
        externalLinkIcon: true,
    },
    vite: defineViteConfig({
        plugins: [RssPlugin(RSS)],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./.vitepress", import.meta.url)),
            },
        },
        build: {
            minify: "esbuild",
            target: "chrome89",
        },
    }),
})
