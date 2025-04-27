<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ProjectItem from "@/components/ProjectItem.vue";
import ProjectCard from "@/components/ProjectCard.vue";

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const displayMode = ref('list'); // 'list' ou 'gallery'
const projects = ref([]);

async function fetchProjects() {
  try {
    const querySnapshot = await getDocs(collection(db, "users", props.userId, "projects"));
    projects.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    console.log("hada projet", projects.value)
  } catch (error) {
    console.error("Error fetching projects: ", error);
  }
}

onMounted(async () => {
  await fetchProjects();
});

function toggleDisplayMode() {
  displayMode.value = displayMode.value === 'list' ? 'gallery' : 'list';
}
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Project List</h1>
      <div>
        <span class="badge bg-primary me-3">{{ projects.length }} projects</span>
        <button
          class="btn btn-outline-primary"
          @click="toggleDisplayMode"
          :title="displayMode === 'list' ? 'Switch to Gallery View' : 'Switch to List View'"
        >
          <i class="bi" :class="displayMode === 'list' ? 'bi-grid' : 'bi-list'"></i>
          {{ displayMode === 'list' ? 'Gallery' : 'List' }}
        </button>
      </div>
    </div>

    <div v-if="projects.length > 0">
      <!-- Mode Liste -->
      <div v-if="displayMode === 'list'" class="row g-4">
        <div v-for="project in projects" :key="project.id" class="col-12">
          <ProjectItem @projectDeleted="fetchProjects" :userId="userId" :projectId="project.id"/>
        </div>
      </div>

      <!-- Mode Galerie -->
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="project in projects" :key="project.id" class="col">
          <ProjectCard :userId="userId" :projectId="project.id"/>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">
      No projects found. Create your first project to get started!
    </div>
  </div>
</template>

<style scoped>
/* Animation douce pour le changement de vue */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>