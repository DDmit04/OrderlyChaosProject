import Vue from 'vue'
import '@babel/polyfill'
import 'api/resource'
import App from 'pages/App.vue'
import store from 'store/store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'
import VeeValidate from 'vee-validate'
import VueResize from 'vue-resize'
import 'vue-resize/dist/vue-resize.css'


Vue.use(VueResize)

Vue.use(VeeValidate, {
    classes: true,
    classNames: {
        valid: 'is-valid',
        invalid: 'is-invalid'
    }
})
Vue.use(BootstrapVue)
Vue.component('icon', Icon)
Vue.config.productionTip = false

new Vue ({
    el: '#app',
    store,
    render: a => a(App)
})