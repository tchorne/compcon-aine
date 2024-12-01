<template>
    <div style="height: 100%;">
        <v-container>
            <v-row>
                <decrypt-log> </decrypt-log>
            </v-row>
            <div style="height: 10vh;"></div>
            <v-row>
                Data here
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import CCLog from '@/features/main_menu/_components/CCLog.vue';
import { VContainer, VRow, VCol, VForm, VTextField, VBtn } from 'vuetify/lib';
import DecryptLog from './DecryptLog.vue';

import { CommandLine } from './coding/commands';

export default Vue.extend({
    name: 'decrypt',
    components: {
        DecryptLog,
        VContainer,
        VRow,
        VCol
    },
    props: {
        commandLine: {
            type: CommandLine,
            required: true
        }
    },
    data() {
        return {
            
        }
    },
    mounted() {
    },
    methods: {
    }
})
</script>

<style scoped>
.v-container {
    display: flex;
    flex-direction: column;
    align-items: start;
}
.v-row {
    height: 100%;
}
</style>

