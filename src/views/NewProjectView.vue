<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDoc, doc } from "firebase/firestore";
import { db } from '../firebase'; // Adjust path as necessary
import CreateProject from "@/components/CreateProject.vue";

const route = useRoute();
const router = useRouter();
const userId = ref(null);
const userInfo = ref(null);
const loading = ref(true);
const projectId = ref(null);
const editing = ref(false);

onMounted(async () => {
  // Get userId from route params
  userId.value = route.params.userId;
  
  // Check if we're editing (projectId in route)
  if (route.params.projectId) {
    projectId.value = route.params.projectId;
    editing.value = true;
  }
  
  // Fetch user data for header display
  if (userId.value) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId.value));
      if (userDoc.exists()) {
        userInfo.value = {
          uid: userDoc.id,
          ...userDoc.data()
        };
      } else {
        console.error("No such user!");
        router.push('/');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  
  loading.value = false;
});

function handleProjectUpdated() {
  // Navigate back to projects list after update
  router.push(`/users/${userId.value}/projects`);
}
</script>

<template>
  <div class="project-page-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div v-else>
      <!-- Using the CreateProject component which already has modal styling -->
      <CreateProject 
        :user-id="userId" 
        :editing="editing" 
        :project-id="projectId"
        @project-updated="handleProjectUpdated"
      />
    </div>
  </div>
</template>

<style scoped>
.project-page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Override any container styles that might conflict with the modal */
:deep(.container) {
  max-width: 100%;
  padding: 0;
  margin: 0;
}
</style>