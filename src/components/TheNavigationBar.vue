<template>
  <nav class="navigation-bar">
    <ul class="navigation-bar__list">
      <li
        :class="{'is-active': currentTab === tab.component}"
        class="list-item"
        v-for="tab in tabs"
        :key="tab.component"
      >
        <a class="link" href="#" @click="$emit('changetab', tab.component)">{{tab.name}}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "TheNavigationBar",
  props: {
    tabs: {
      type: Array,
      required: true
    },
    currentTab: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.navigation-bar {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 40px 40px;
  &__list {
    display: flex;
    margin: auto;
    li {
      padding: 10px 40px;
      a {
        font-weight: bold;
        font-size: 1.5rem;
        letter-spacing: 0.1rem;
        text-transform: uppercase;
        color: #818AA3;
      }
      &.is-active {
        background-color: #FF6978;
        a {
          color: #FFFCF9;
        }
      }
    }
  }
}
</style>