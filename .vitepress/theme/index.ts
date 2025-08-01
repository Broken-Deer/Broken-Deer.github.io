import "./style.less"
import DefaultTheme from "vitepress/theme"
import "@catppuccin/vitepress/theme/mocha/blue.css"

import { library } from "@fortawesome/fontawesome-svg-core"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import Layout from "./Layout.vue"
import PostsList from "./components/PostsList.vue"

library.add(faCalendar)

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("PostsList", PostsList)
    },
    Layout,
}
