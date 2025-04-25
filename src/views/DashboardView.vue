<template>
  <div>
    <router-link v-if="user?.uid" :to="`/users/${user.uid}/projects`">projects-view</router-link>
    <p v-else>Loading user...</p>
  </div>
</template>


<script setup>
import getUser from '@/composables/getUser'

const { user } = getUser()
</script>

<style scoped>

</style>