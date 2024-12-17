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
                    <v-btn text @click="()=>viewClicked(category.id, item)">
                        {{ item.name || item.subject || item.title }}
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

const categories =  [
    {
        ...baseCategory,
        id: 'mission',
        name: 'Missions',
        items: [],
    },
    {
        ...baseCategory,
        id: 'message',
        name: 'Messages',
        items: [],
    },
    {
        ...baseCategory,
        id: 'log',
        name: 'Logs',
        items: [],
    },
    {
        ...baseCategory,
        id: 'misc',
        name: '???',
        items: [],
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
        viewClicked(category: string, item: any) {
            console.log('view clicked', category, item)
            this.$emit('viewClicked', category, item)
        },
        addItem(category: string, item: any) {
            const cat = this.categories.find(c => c.id === category)
            if (cat) {
                // check if item already exists
                if (cat.items.find(i => i.id === item.id)) {
                    return
                }
                console.log('adding item', item)
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