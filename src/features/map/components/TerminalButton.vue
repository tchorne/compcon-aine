<template>
  <span class="clickable-text"  @click="onClick" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @focus="onFocus" @focusout="onFocusOut" @blur="onBlur" tabindex="0">
    <span v-if="hovered" class="bracket" :class="{smalltext: small}">[</span>
    <span class="mytext" :class="{smalltext: small}">{{ text.toUpperCase() }}</span>
    <span v-if="hovered" class="bracket" :class="{smalltext: small}">]</span>
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
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
    color: #8f102b;
    font-size: 24px;
    font-family: 'Consolas';
}

.smalltext {
    font-size: 22px;
    color: #4b0111;
}

</style>