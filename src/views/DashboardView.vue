<template>
  <div v-if="!loggedIn" class="container d-flex justify-content-center align-items-center vh-100 text-center">
    <div>
      <h1 class="display-4 text-primary mb-3">👋 Welcome to DevGate!</h1>
      <p class="lead mb-4">🚀 
        Join the community of developers and enhance your skills, projects, and collaborations      </p>
      <router-link to="/register" class="btn btn-primary btn-lg">Get Started 🎉</router-link>
    </div>
  </div>
</template>


<script setup>
import { inject } from 'vue'

const loggedIn = inject('logged_in')
</script>

<style scoped>
/* Slightly smaller font sizes for a more compact feel */
.container {
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem; /* Decrease font size for a softer look */
}

p {
  font-size: 1.25rem; /* Slightly smaller text for the description */
}

.btn-lg {
  font-size: 1rem; /* Smaller button font size */
}
</style>
