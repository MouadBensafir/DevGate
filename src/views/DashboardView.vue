<template>
  <div>
    55
    <router-link :to="'/users/' + authUser?.uid+ '/projects'">projects-view</router-link>
  </div>
</template>

<script setup>
import getUser from "@/composables/getUser";

const { authUser } = getUser();
</script>

<style scoped>

</style>