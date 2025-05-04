<script setup>
import MessageList from "@/components/MessageList.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import MessageBar from "@/components/MessageBar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const route = useRoute();
const groupID = ref(route.params.discussionId);
const user = ref(null);
const connected = ref(false)

onMounted(() => {
  const auth = getAuth();

  // Listen for auth state changes
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser; // Will be null if not logged in
    console.log("User state changed:", user.value);
    connected.value = true;
  });

  // Clean up the listener when the component unmounts
  return () => unsubscribe();
});


</script>

<template>
  <div class="container">
    <MessageList v-if="connected" :group-i-d="groupID" :user-i-d="user.uid" />
    <MessageBar :group-i-d="groupID" />
  </div>
</template>

<style scoped>

</style>