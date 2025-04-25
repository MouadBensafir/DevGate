<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link>
  </nav>
  <router-view/>
</template>

<script setup>
import { ref, watch, provide } from "vue"
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/firebase" 
import getUser from "@/composables/getUser"

const { user } = getUser()
const logged_in = ref(false)
const userDoc = ref(null)

provide('logged_in', logged_in)
provide('userDoc', userDoc)

watch(user, async (newUser) => {
  if (newUser && newUser.uid) {
    logged_in.value = true
    try {
      const docSnap = await getDoc(doc(db, "users", newUser.uid))
      if (docSnap.exists()) {
        userDoc.value = {
          uid: newUser.uid,
          ...docSnap.data()
        }
      } else {
        console.log("No such user doc")
      }
    } catch (error) {
      console.error("Error loading user doc:", error)
    }
  } else {
    logged_in.value = false
    userDoc.value = null
    console.log("No user logged in")
  }
}) 
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
