<template>
  <div>
    <div style="padding-top: 50px"></div>
    <!-- <h1 class="secondary"> Data Manipulator </h1> -->
    <data-panel />
    <v-slide-y-reverse-transition mode="out-in">
      <router-view style="width: 100vw; padding-top: 50px" />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import DataPanel from './components/DataPanel.vue';

export default Vue.extend({
  name: 'data-maniupulator',
  components: {
    DataPanel
  }
})
</script>