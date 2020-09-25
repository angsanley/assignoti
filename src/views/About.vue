<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button @click="doLogout()">Logout</Button>
  </div>
</template>
<script>
  import Button from "../components/Button";
  export default {
    components: {Button},
    methods: {
      doLogout() {
        this.$store.dispatch('doSignOut')
      }
    }
  }
</script>
