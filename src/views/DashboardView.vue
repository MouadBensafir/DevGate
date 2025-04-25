<template>
  <div>
    55
    <router-link v-if="logged_in" :to="`/skill-tracker/${user?.uid}`">Go to Skill Tracker</router-link>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const logged_in = inject('logged_in')
const user = inject('userDoc')
</script>

<style scoped>

</style>