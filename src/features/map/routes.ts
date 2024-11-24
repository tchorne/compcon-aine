import Main from './index.vue'


import Mission from './mission/index.vue'
import MissionLanding from './mission/landing.vue'
import MissionBuilder from './mission/builder/index.vue'
import MissionCard from './mission/builder/MissionCard.vue'
import MissionSelector from './mission/runner/index.vue'
import MissionBriefing from './mission/runner/Briefing.vue'
import MissionRunner from './mission/runner/Active.vue'
import MissionDebriefing from './mission/runner/Debriefing.vue'

import { RouteConfig } from 'vue-router'
import NpcPrint from './npc/print/NpcPrint.vue'

const routes: RouteConfig[] = [
  {
    path: '',
    component: Main,
    children: [
    ],
  },
]

export default routes
