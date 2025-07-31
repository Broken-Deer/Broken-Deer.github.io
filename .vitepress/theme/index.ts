import './style.less'
import DefaultTheme from "vitepress/theme";
import "@catppuccin/vitepress/theme/mocha/lavender.css";

// .vitepress/theme/index.ts
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer.vue';

library.add(faCalendar)

export default {
	...DefaultTheme,
	enhanceApp({ app }) {
		app.component('FontAwesomeIcon', FontAwesomeIcon)
		app.component('Footer', Footer)
	},
}
