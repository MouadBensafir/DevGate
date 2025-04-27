<template>
  <div>Welcome to the DevGate</div>
</template>


<script setup>
import getUser from '@/composables/getUser'

const { user } = getUser();
console.log("testpoopo ", user);
</script>

<style scoped>

</style>