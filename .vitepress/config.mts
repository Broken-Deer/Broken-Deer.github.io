import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Broken-Deer's Blog",
  description: "Broken-Deer 的垃圾堆",
  markdown: {
    theme: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    }
  },
  themeConfig: {
    logo: "/avatar.png",
    nav: [
      { text: 'About', link: '/about' },
      { text: 'Archive', link: '/archive' },
      { text: 'Random', link: '/random' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Broken-Deer/', },
    ],
    footer: {
      copyright: "Copyright © 2025-present Broken-Deer. All rights reserved.",
      message: "Content lisenced under CC BY-NC-SA 4.0 unless otherwise noted."

    },
    externalLinkIcon: true,
  }
})
