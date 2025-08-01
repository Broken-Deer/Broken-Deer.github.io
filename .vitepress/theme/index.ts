import "./style.less"
import DefaultTheme from "vitepress/theme"
import "@catppuccin/vitepress/theme/mocha/blue.css"

import Layout from "./Layout.vue"
import PostsList from "./components/PostsList.vue"

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("PostsList", PostsList)
    },
    Layout,
}
