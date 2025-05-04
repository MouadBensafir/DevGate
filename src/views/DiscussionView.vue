<script setup>
import MessageList from "@/components/MessageList.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import MessageBar from "@/components/MessageBar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const route = useRoute();
const groupID = ref(route.params.discussionId);
const user = ref(null);
const connected = ref(false);

onMounted(() => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    connected.value = true;
  });
  return () => unsubscribe();
});
</script>

<template>
  <div v-if="groupID.includes(user?.uid)" class="container">
    <MessageList v-if="connected" :group-i-d="groupID" :user-i-d="user?.uid"/>
    <div class="message-bar-wrapper">
      <MessageBar :group-i-d="groupID"/>
    </div>
  </div>
  <div v-else>
    <h1 class="text-center">You are not authorized to view this discussion.</h1>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 89vh; /* Full viewport height */
  position: relative; /* Needed for absolute positioning of children */
}

/* MessageList takes remaining space and scrolls */
.message-list {
  flex: 1;
  overflow-y: auto; /* Enable scrolling */
}

/* MessageBar is fixed at the bottom */
.message-bar-wrapper {
  position: sticky;
  bottom: 0;
  width: 100%;
  background: white; /* Optional: prevent content behind from showing */
  z-index: 10; /* Ensure it stays above other elements */
  padding: 10px 0; /* Optional: spacing */
  border-top: 1px solid #eee; /* Optional: visual separation */
}
</style>