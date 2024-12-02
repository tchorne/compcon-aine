<template>
  <div id="output-container">
    <v-row no-gutters>
      <v-col cols="auto" class="mr-2">
        <!-- <v-divider vertical /> -->
        <div class="sidebar" />
        <div>
          <img src="../../../assets/ui/sb_l.png" alt="" />
        </div>
      </v-col>
      <v-col>
        <p
        id="completed"
        ref="completed"
        class="flavor-text subtle--text text--darken-1 py-0 my-0"
        ></p>
        <p id="output" ref="output" class="flavor-text subtle--text text--darken-1 py-0 my-0">
        </p>
        <span id="user-input" class="flavor-text subtle--text text--darken-1 py-0 my-0">
          <span>[<span class="accent--text">decrypt</span>]: </span>
          <span><input class="user-input" type="text" id="input" ref="input" @keyup="submitInput"/></span>
        </span>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <div class="sidebar" />
        <div>
          <img class="ml-n2" src="../../../assets/ui/sb_r.png" alt="" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TypeIt from 'typeit'

import GmsStart from './startup/gms'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { UserProfile } from '@/user'
import { CommandLine } from './coding/commands'

export default Vue.extend({
  name: 'decrypt-log',
  data: () => ({
    typer: {},
    text: [],
    lock: false,
  }),
  props: {
    commandLine: CommandLine
  },
  computed: {
    profile(): UserProfile {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile
    },
    theme(): string {
      return this.profile.Theme
    },
  },
  watch: {
    theme(newval, oldval) {
      if (newval !== oldval) this.restart()
    },
  },
  async mounted() {
    this.lock = true
    this.restart()

    console.log(this.commandLine)
  },
  methods: {
    restart() {
      if (this.typer.hasOwnProperty('destroy')) this.typer.destroy(true)
      if (this.$refs.completed.innerHTML) this.$refs.completed.innerHTML = ''
      if (this.$refs.output.innerHTML) this.$refs.output.innerHTML = ''
      this.start()
    },
    async start() {
      await Vue.nextTick()
      this.typer = new TypeIt(this.$refs.output, {
        speed: 2,
        nextStringDelay: 5,
        lifeLike: false,
        cursor: false,
        startDelete: false,
        beforeString: () => {
          this.$refs.output?.scrollIntoView({ block: 'end' })
        },
        afterString: () => {
          this.$refs.output?.scrollIntoView({ block: 'end' })
        },
        afterComplete: () => {
          this.lock = false
        },
      })

      switch (this.profile.Theme) {
        default:
          GmsStart(this.typer)
          break
      }
    },
    print(user: string, response: string): Promise<void> {
      if (this.lock) return Promise.resolve()
      this.lock = true

      this.typer.destroy()

      //collect written strings so TypeIt doesn't erase them
      if (this.$refs.completed.innerHTML) this.$refs.completed.innerHTML += '<br>'
      this.$refs.completed.innerHTML += this.$refs.output.innerHTML
      this.$refs.output.innerHTML = ''
      return new Promise((resolve) => {
        this.typer = new TypeIt(this.$refs.output, {
          speed: 32,
          lifeLike: true,
          nextStringDelay: 7,
          cursor: false,
          beforeString: () => {
            this.$refs.output?.scrollIntoView({ block: 'end' })
            this.$refs.input?.scrollIntoView({ block: 'end' })
          },
          afterString: () => {
            this.$refs.output?.scrollIntoView({ block: 'end' })
            this.$refs.input?.scrollIntoView({ block: 'end' })
          },
          afterComplete: () => {
            this.lock = false
            resolve()
          },
        })
          //.type(`$ `)
          //.type(`<span class="stark-text--text">${user}</span>↵`)
          //.pause(100)
          //.options({ speed: 3, lifeLike: false })
          //.break()
          .type('>')
          .type(
            `${response}` // TODO color code
          )
          .type(' ')
          .go()
      })
    },
    submitInput(e: KeyboardEvent) {

      if (e.key === 'Enter') {
        const input = this.$refs.input as HTMLInputElement
        const response = input.value
        if (!response) return

        input.value = ''
        this.$emit('submit', response)
        this.commandLine.parseCommand(response).then((results) => {
          this.print(this.profile.Username, results.formattedString).then(() => {
            this.print(this.profile.Username, results.resultText)
          })
        })
        
      }

    },
  },
})
</script>

<style scoped>
#output-container {
  height: 100%;
  max-height: 35vh;
  overflow-y:scroll;
  scroll-behavior: smooth;
  overflow-x: hidden;
  width: 100%;
  top: 0;
  right: 0;
  margin-right: 8px;
  z-index: 1;
  flex-direction: column-reverse;
}

.sidebar {
  align-self: stretch;
  display: inline-flex;
  height: inherit;
  min-height: calc(100% - 24px);
  max-height: calc(100% - 24px);
  max-width: 16px;
  width: 16px;
  background: url(../../../assets/ui/scale_1.png);
  vertical-align: text-bottom;
}

.user-input {
  outline: none;
}
</style>
