<template>
  <div>
    <select class="is-hidden" :value="value">
      <option v-for="option in options" :key="option" :value="option">{{option}}</option>
    </select>
    <div class="custom-select" :class="{'is-toggled': isToggle}" @click="isToggle = !isToggle">
      {{value}}
      <ul v-show="isToggle" class="custom-select__menu">
        <li v-for="option in options" :key="option" :class="{'is-active': value === option}">
          <a href="#" @click.prevent="$emit('input', option)">{{option}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  data() {
    return {
      isToggle: false
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String
    }
  }
}
</script>

<style scoped lang="scss">
.custom-select {
  background-color: #fffcf9;
  color: #25283d;
  padding: 0.5rem 1.25rem;
  position: relative;
  cursor: pointer;
  border: 2px solid #92c8a4;
  &__menu {
    position: absolute;
    top: 100%;
    left: 0;
    border: 2px solid #92c8a4;
    width: 100%;
    li {
      padding: 0 0;
      a {
        color: #818aa3;
        width: 100%;
        display: block;
        padding: 0.5rem 1.25rem;
      }
      &:hover,
      &.is-active {
        a {
          background-color: #4f9d69;
          color: #fffcf9;
        }
      }
    }
  }
  &.is-toggled::after {
    border-color: transparent transparent #92c8a4 transparent;
    transform: translateY(calc(-50% - 0.25rem));
  }
  &::after {
    position: absolute;
    content: "";
    top: 50%;
    transform: translateY(calc(-50% + 0.25rem));
    right: 1.25rem;
    width: 0;
    height: 0;
    border: 0.5rem solid transparent;
    border-color: #92c8a4 transparent transparent transparent;
  }
}
</style>