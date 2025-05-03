<template>
  <!-- Mobile Layout -->
  <div class="d-md-none">
    <NavBar />
    <div class="overflow-auto">
      <router-view />
    </div>
  </div>

  <!-- Desktop Layout -->
  <div class="d-none d-md-flex vh-100">
    <div class="flex-shrink-0" style="width: 250px">
      <NavBar />
    </div>
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

<style scoped>
.overflow-auto {
  height: calc(100vh - 56px); /* Adjust based on your mobile navbar height */
}

@media (min-width: 768px) {
  .overflow-auto {
    height: 100vh;
  }
}
</style>
