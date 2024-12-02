<template>
    <v-list class="no-background">
        <v-list-item>
            <v-btn text x-large class="decrypt-button" @click="() => viewClicked('decrypt', 0)"> DECRYPT </v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="category in categories" v-if="(category.items || []).length > 0">
            <v-list class="no-background">
                <v-btn text @click="category.open = !category.open">{{ category.name }}</v-btn>
                <v-list-item v-for="item in category.items" v-if="category.open">
                    <v-btn text @click="()=>viewClicked(category.id, item.id)">
                        {{ item.name }}
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
import Vue from 'vue'

import { VList, VListItem, VListItemContent, VListItemTitle, VListItemAction, VIcon, VDivider, VBtn } from 'vuetify/lib';
import { CommandLine } from '../../decrypt/coding/commands';

const baseCategory = {
    name: '',
    items: [],
    open: false
}

const HARRISON_LOGO = "/static/img/logo/ha.svg"
const HARRISON_TAGLINE = "Superior by Design. Harrison Armory leads the way."

const SPEARPOINT = {
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

const categories =  [
    {
        ...baseCategory,
        id: 'mission',
        name: 'Missions',
        items: [SPEARPOINT]
    },
    {
        ...baseCategory,
        id: 'message',
        name: 'Messages',
    },
    {
        ...baseCategory,
        id: 'log',
        name: 'Logs',
    },
    {
        ...baseCategory,
        id: 'misc',
        name: '???',
    },
]

export default Vue.extend({
    name: 'sidebar',
    components: {
        VList,
        VListItem,
        VBtn,
        VDivider
    },
    props: {
        commandLine: {
            type: CommandLine,
            required: true
        }
    },
    data: () => ({
        categories: categories
    }),
    computed: {
    },
    methods: {
        viewClicked(category: string, id: number) {
            this.$emit('viewClicked', category, id)
        },
        addItem(category: string, item: any) {
            const cat = this.categories.find(c => c.id === category)
            if (cat) {
                // check if item already exists
                if (cat.items.find(i => i.id === item.id)) {
                    return
                }
                cat.items.push(item)
            }
        }
    }
})

</script>

<style scoped>
    .decrypt-button {
        font-family: 'Consolas', sans-serif;
        font-size: 2rem !important;
    }
    .no-background {
        background-color: transparent !important;
        color: transparent !important;
    }
</style>