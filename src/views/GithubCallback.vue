<template>
    <div>
      <h1>GitHub Login Success</h1>
      <p>Account linked successfully!</p>
    </div>
  </template>
  
  <script setup>
  import { getAuth, getRedirectResult } from 'firebase/auth'
  import { onMounted } from 'vue'
  
  const auth = getAuth()
  
  onMounted(() => {
    // Handle the redirect result when the user is redirected back to the app
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('GitHub account linked:', result)
          // You can handle further user updates or navigation here
        }
      })
      .catch((error) => {
        console.error('Error handling redirect result:', error)
      })
  })
  </script>
  