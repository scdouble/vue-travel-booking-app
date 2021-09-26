import  {createWebHashHistory, createRouter} from 'vue-router'

import Catalog from "../Views/Catalog";
const routes = [
    {
        path:'/', component: Catalog
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default  router