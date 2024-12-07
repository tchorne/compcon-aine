<template> 
    <div class="split-screen">
        <v-container style="padding-left: 0px; align-items: start; margin-left: 0px;" class="fill-height no-gutters"> 
            <v-col cols="3" no-gutters class="left-pane"> 
                <sidebar ref="sidebar" @viewClicked="handleViewClicked" :commandLine="commandLine"/>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="7" no-gutters class="right-pane"> 
                <KeepAlive>
                    <decrypt v-if="selectedView==='decrypt'" :commandLine="commandLine"
                        @newItem="newItem"/>
                    <MissionCard v-else-if="selectedView==='mission'" :mission="selectedItemObject"/>
                    <MessageCard v-else-if="selectedView==='message'" :message="selectedItemObject"/>
                    <decrypt v-else-if="selectedView==='log'"/>
                    <decrypt v-else-if="selectedView==='misc'"/>
                </KeepAlive>
            </v-col>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { VCol, VContainer } from 'vuetify/lib';
import Sidebar from './sidebar/Sidebar.vue';
import Decrypt from '../decrypt/Decrypt.vue'; 
import MissionCard from './datacards/MissionCard.vue';
import MessageCard from './datacards/MessageCard.vue';
import { CommandLine } from '../decrypt/coding/commands';

import { MissionType, MessageType } from '../datatypes';
// TEMPORARY : fixed data

const HARRISON_LOGO = "/static/img/logo/ha.svg"
const HARRISON_TAGLINE = "Superior by Design. Harrison Armory leads the way."

const WELCOME : MessageType = {
    id: 2,
    type: 'message',
    sender: '[POLARIS]',
    subject: 'Welcome',
    message: `Welcome to the Polaris Data Panel. This is a work in progress, and is not yet ready for use. Please be patient, and check back later for updates. Thank you for your patience.`,
    attachments: "",
    locationName: "",
    locationUrl: "",
}

const SPEARPOINT : MissionType = {
    id: 1,
    type: 'mission',
    name: "Operation Spearpoint",
    icon: HARRISON_LOGO,
    availability: "Mission open to all Lancers",
    description: `You are tasked with defending Harrison Armory's latest asset, the mining platform _Conquest Dawn_. This vessel will begin charging its mining array immediately upon arrival. The process will take approximately two hours, after which _Conquest Dawn_ will need 15 minutes to safely return to secured territory. Your assignment is to hold the left flank and neutralize any and all unauthorized personnel on sight. No exceptions.

Harrison Armory has cleared this moon of inhabitants. Any presence is a threat to the mission. Do not engage in conversation. Do not ask questions. We expect resistance, and you are expected to eliminate it.

Support includes additional Lancer teams and full naval reinforcement. The success of this operation is critical to Harrison Armory's future endeavors. Your role is essential, and failure is not an option.`,
    tagline: HARRISON_TAGLINE,
    locationName: "Belisama",
    locationUrl: "belisama"
}


const MISSIONS = [
    SPEARPOINT,
]


//

export default Vue.extend({
    name: 'data-panel',
    components: {
        Sidebar,
        Decrypt,
        MissionCard,
        MessageCard,
        VContainer,
        VCol,
    },
    data: () => ({
        leftWidth: 25,
        isResizing: false,
        selectedView: 'decrypt',
        selectedItemObject: null,
        commandLine: new CommandLine()
    }),

    methods: {
        startResize(e: any) {
            console.log('startResize', e)
            this.isResizing = true
            document.addEventListener('mousemove', this.onResize)
            document.addEventListener('mouseup', this.stopResize)
        },
        onResize(e: any) {
            if (!this.isResizing) return
            console.log('onResize', e)
            const totalWidth = window.innerWidth;
            const newWidth = (e.clientX / totalWidth) * 100;
            this.leftWidth = Math.min(90, Math.max(10, newWidth)); // Clamp width between 10% and 90%
            console.log('leftWidth', this.leftWidth)
        },
        stopResize() {
            this.isResizing = false
            document.removeEventListener('mousemove', this.onResize)
            document.removeEventListener('mouseup', this.stopResize)
        },
        handleViewClicked(category: string, item: any) {
            console.log('handleViewClicked', item)
            this.selectedView = category
            this.selectedItemObject = item;
        },
        newItem(item: any) {
            this.$refs.sidebar.addItem(item.type, item)
        }
    },
    mounted() {
        this.$refs.sidebar.addItem('mission', SPEARPOINT)

        this.commandLine.exportData(WELCOME)

    },
    beforeDestroy() {
    }
})
</script>

<style scoped>

.v-col {
    height: 100%;
}
.split-screen {
    position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: url(../../../assets/ui/grid.png);
    animation: 600s scroll infinite linear;
}

.left-pane, .right-pane {
  height: 100%;
  overflow: auto; /* Ensure content is scrollable */
}


@keyframes scroll {
  100% {
    background-position: -3000px -3000px;
  }
}

</style>