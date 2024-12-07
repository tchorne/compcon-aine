<template>
    <div>
        <v-card :style="{'background-color': backgroundColor}" :class="{'vanish': vanished}">
            <v-card-title>{{data.visiblekey }}</v-card-title>
            <v-card-subtitle>Data ID {{data.id }}</v-card-subtitle>
            <v-card-text>
                {{ animatedText }}
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { VContainer, VRow, VCol, VForm, VTextField, VBtn, VCard, VCardTitle, VCardSubtitle, VCardText } from 'vuetify/lib';

import { CommandLine, EncodedData } from './coding/commands';

export default Vue.extend({
    name: 'decrypt-card',
    components: {
        VContainer,
        VRow,
        VCol,
        VCard,
        VCardTitle,
        VCardSubtitle,
        VCardText,
    },
    props: {
        data: {
            type: EncodedData,
            required: true
        }
    },

    data() {
        return {
            lastAttempt: this.data.visiblekey,
            backgroundColor: "white",
            vanished: false,
            animatedText: this.data.visiblekey,
        }
    },
    mounted() {
    },
    methods: {
        recieveDecryptAttempt(data: EncodedData){
            this.lastAttempt = data.visiblekey
            this.animateText(0, data)
            this.lastData = data
            
        },
        disappear(){
        },
        animateText(index: number, data){
            this.animatedText = this.animatedText.substring(0, index) + this.lastAttempt[index] + this.animatedText.substring(index + 1)
            if (index < this.lastAttempt.length - 1){
                setTimeout(() => {
                    this.animateText(index + 1, data)
                }, 100)
            } else {
                this.decryptAnimationFinished(data)
            }
        },
        decryptAnimationFinished(data){
            if (data.decrypted){
                this.backgroundColor = "lime"
                this.vanished = true
                this.$emit('decrypted', data)
            }
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

.vanish {
    opacity: 0;
    animation: vanish 1s forwards;
}

@keyframes  vanish {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>

