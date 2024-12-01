import Main from './index.vue'


import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: ':planetName',
    name: 'map',
    component: Main,
    props: true,
  },
  {
    path: '/',
    name: 'map-planet',
    component: Main,
  },
  
]

export default routes
