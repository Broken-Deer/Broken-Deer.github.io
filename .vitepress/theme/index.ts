import "./style.less"
import DefaultTheme from "vitepress/theme"
import "@catppuccin/vitepress/theme/mocha/lavender.css"

// .vitepress/theme/index.ts
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import CustomLayout from "./CustomLayout.vue"

library.add(faCalendar)

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("FontAwesomeIcon", FontAwesomeIcon)
    },
    Layout: CustomLayout,
}
