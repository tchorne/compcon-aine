<template>
    <div class="mission-content">
        <div class="top-row"> <h1 class="typewriter">  {{ message.subject }}</h1></div>

        <v-divider></v-divider>

        <header class="skewed-header">
            <h2> {{ message.sender.toUpperCase() }}</h2>
            <div class="scrolling-underline"></div>
        </header>

        <v-divider></v-divider>
        <br>

        <vue-markdown>{{ message.message }}</vue-markdown>
        <br>
        <blockquote v-if="message.attachments != ''"> {{ message.attachments}} </blockquote>
        <br>
        <v-divider></v-divider>
        <div style="layout"> </div>
        <br>
        <div v-if="message.locationName != ''">
            <h3>Location</h3>
            <v-btn :style="{color: 'primary'}" :href="'/#/map/' +  message.locationUrl ">{{ message.locationName }} >></v-btn>
        </div>

    </div>
  </template>

<script lang="ts">
import Vue from 'vue'

import { VDivider } from 'vuetify/lib/components'
import { VBtn } from 'vuetify/lib/components'
import VueMarkdown from 'vue-markdown'
import { MessageType } from '../../datatypes';

export default Vue.extend({
    name: 'mission-card',
    props: {
        message: Object
    },
    components: {
        VDivider,
        VueMarkdown,
        VBtn,
    }
})
</script>

<style scoped>

.mission-content {
    font-family: 'Consolas';
    overflow-y: scroll;
    padding-bottom: 50px;
}

.mission-icon {
    width: 2em;
    bottom: 0;
}

.top-row {
    display: flex;
    flex-direction: row;

    gap: 1em;
}

.typewriter {
    width: 100%;
    animation: typing 1s steps(40, end);
    overflow: hidden; /* Ensures the content is not revealed until the animation */
    border-right: .15em solid transparent; /* The typwriter cursor */
    white-space: nowrap; /* Keeps the content on a single line */
    margin: 0 auto; /* Gives that scrolling effect as the typing happens */
    letter-spacing: .15em; /* Adjust as needed */
    animation: 
        typing 2s steps(40, end),
        blink-caret .4s step-end 5;
}

blockquote {
    font-style: italic;
    font-size: 1.2em;
    color: #888;
    border-left: 8px solid #aaa;
    padding-left: 5px;
}

.skewed-header {
    position: relative;
    display: block;
    background: linear-gradient(45deg, #007BFF, #662bc4);
    color: white;
    text-align: center;
    padding: 0.5rem;
    width: 60%;
    margin: 1rem;
    margin-left: -20px;
    transform: skewX(-0.2rad);
    z-index: 1;
    overflow: hidden;
    letter-spacing: 0.2rem;
    transition: 
        background-color 0.5s ease,
        letter-spacing 0.5s ease;
}

.skewed-header:hover {
    background: linear-gradient(45deg, #3596ff, #874ce6);
    letter-spacing: 0.3rem;
}

.skewed-header h2 {
    margin: 0;
    font-size: 0.9rem;
    transform: skewX(0.2rad);
    z-index: 2;
    position: relative;
    font-family: 'Consolas';
    
}

/* Scrolling underline */
.scrolling-underline {
    position: absolute;
    bottom: 6px;
    left: 8%;
    width: 85%;
    height: 3px;
    transform: skewX(0.2rad);
    background: linear-gradient(
        to right,
        white 20%,
        transparent 20%,
        transparent 40%,
        white 40%,
        white 60%,
        transparent 60%
    );
    background-size: 200% 100%;
    animation: scroll 5s linear infinite;
}

@keyframes scroll {
    from {
        background-position: 200% 0;
    }
    to {
        background-position: 0 0;
    }
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}

</style>