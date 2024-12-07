<template>
    <div style="height: 100%;">
        <v-container>
            <v-row>
                <decrypt-log :commandLine="commandLine"> </decrypt-log>
            </v-row>
            <div style="height: 10vh;"></div>
            <v-row>
                <decrypt-card 
                    v-for="data in commandLine.loadedData" 
                    v-if="data.decrypted==false" 
                    ref="encryptedCard" 
                    :data="data" 
                    @decrypted="onDataDecrypted"
                /> 
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { VContainer, VRow, VCol, VForm, VTextField, VBtn, VCard, VCardTitle } from 'vuetify/lib';
import DecryptLog from './DecryptLog.vue';
import DecryptCard from './DecryptCard.vue';

import { CommandLine, EncodedData } from './coding/commands';

export default Vue.extend({
    name: 'decrypt',
    components: {
        DecryptLog,
        DecryptCard,
        VContainer,
        VRow,
        VCol,
        VCard,
        VCardTitle
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
        this.commandLine.addDataObserver(this.recieveDecryptAttempt)
    },
    methods: {
        recieveDecryptAttempt(data: EncodedData){
            console.log("recieved decrypt attempt");
            this.$refs.encryptedCard.forEach((card) => {
                console.log("checking", card.data.id, "against", data.id);
                if(card.data.id == data.id){
                    card.recieveDecryptAttempt(data);
                }
            });
        },
        onDataDecrypted(data: EncodedData){
            // Check if data is already decrypted
            for (let d2 of this.commandLine.loadedData) {
                if(d2.id == data.id && d2.decrypted){
                    return
                }
            }
            this.$emit('newItem', data.realdata)
        }
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

