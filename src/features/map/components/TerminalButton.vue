<template>
  <span class="clickable-text" @click="onClick" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @focus="onFocus" @focusout="onFocusOut" @blur="onBlur" tabindex="0">
    <span v-if="hovered" class="bracket">[</span>
    <span class="mytext">{{ text }}</span>
    <span v-if="hovered" class="bracket">]</span>
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      hovered: false
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onMouseEnter() {
        this.hovered = true;
        this.$emit('mouseenter');
    },
    onMouseLeave() {
        this.hovered = false;
        this.$emit('mouseleave');
    },
    onFocus() {
        this.hovered = true;
        this.$emit('focus');
    },
    onFocusOut() {
        this.hovered = false;
        this.$emit('focusout');
    },
    onBlur() {
        this.$emit('blur');
    }
  }
}
</script>

<style scoped>
.clickable-text {
  cursor: pointer;
  display: inline-block;
  position: relative;
  background-color: transparent;
}

.clickable-text:focus {
  outline: none;
  background-color: transparent;
}

.mytext {
    background-color: transparent;
    outline: none;
}

span {
    color: rgb(0, 228, 0);
    font-size: 24px;
    font-family: 'Dune Rise';
}

</style>