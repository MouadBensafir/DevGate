<template>
  <div>
    55
    <router-link v-if="user?.uid" :to="'/users/' + user?.uid + '/projects'">projects-view</router-link>
  </div>
</template>

<script setup>
import getUser from "@/composables/getUser";

const { user } = getUser();
console.log("testpoopo ", user);
</script>

<style scoped>

</style>