<template>
  <div class="d-flex vh-100">
    <!-- Sidebar with fixed width, mobile-friendly vertical navbar -->
    <NavBar class="flex-shrink-0 d-none d-md-block" style="width: 250px;" /> <!-- Sidebar for PC -->

    <!-- Main content takes remaining space -->
    <div class="flex-grow-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue"
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


/* Sidebar for PC: Only visible on medium and larger screens (d-md-block) */
.d-none.d-md-block {
  display: block;
}

@media (max-width: 768px) {
  /* Navbar for mobile (horizontal): Only visible on smaller screens */
  .d-md-none {
    display: block !important;
  }

  .d-md-block {
    display: none !important;
  }
}
</style>
