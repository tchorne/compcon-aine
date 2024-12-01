<template>
  <div>
    <v-container fluid>
      <div style="height: 100px;"></div>  
      <div
        class="font-weight-light text-center my-n2"
        :style="
          $vuetify.breakpoint.mdAndDown
            ? 'letter-spacing: 1vw!important; font-size: 7vw!important;'
            : 'letter-spacing: 2vw!important; font-size: 4vw!important;'
        "
      >
      THE ÁINE SYSTEM
      </div>
      <planet-map :planetName="planetName"></planet-map>
    </v-container>
    <v-slide-y-reverse-transition mode="out-in">
      <router-view style="width: 100vw; padding-top: 50px" />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlanetMap from './components/Map.vue'

export default Vue.extend({
  name: 'planetmap',
  components: {
    PlanetMap,
  },
  props: {
    planetName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {}
  }


})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
}

.wrapper {
  display: flex;
  width: 100%;
}
</style>
