import './assets/main.css'
import './assets/custom.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'
import config from '../appsettings'
import components from './components'
import repositories from '../repositories'
import messages from '../models/businessMessages'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component("FontAwesomeIcon", FontAwesomeIcon)

app.provide("messages", messages)
app.provide("repositories", repositories(config))
app.config.globalProperties.$messages = messages;


Object.keys(components).forEach(name => {
    app.component(name, components[name])
})

app.mount('#app')
