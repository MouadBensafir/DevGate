<template>
  <div class="projects-container d-flex flex-column px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <!-- Loading State - Modified to match skill tracker and ensure vertical centering -->
    <div v-if="loading" class="loading-state d-flex flex-column justify-content-center align-items-center py-5" style="min-height: 80vh;">
      <div class="spinner-container mb-4">
        <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <h2 class="text-white mb-2">Loading your projects...</h2>
      <p class="text-white-50 text-center">Please wait while we fetch your projects data</p>
    </div>

    <!-- Projects Content -->
    <div v-else class="projects-content py-5 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span class="badge project-count me-3">{{ projects.length }} projects</span>
          <button
            class="btn view-toggle-btn"
            @click="toggleDisplayMode"
            :title="displayMode ? 'Switch to Gallery View' : 'Switch to List View'"
          >
            <i class="bi" :class="displayMode ? 'bi-grid' : 'bi-list'"></i>
            {{ displayMode ? 'Gallery' : 'List' }}
          </button>
        </div>
      </div>
      
      <!-- Projects Display -->
      <div v-if="projects.length > 0">
        <!-- List Mode -->
        <div v-if="displayMode" class="project-board bg-white rounded-4 shadow">
          <div class="list-group list-group-flush">
            <div v-for="project in projects" :key="project.id" class="list-item">
              <ProjectItem @projectDeleted="fetchProjects" :userId="userId" :projectId="project.id"/>
            </div>
          </div>
        </div>

        <!-- Gallery Mode -->
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="project in projects" :key="project.id" class="col">
            <ProjectCard @projectDeleted="fetchProjects" :userId="userId" :projectId="project.id"/>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state d-flex flex-column justify-content-center align-items-center py-5">
        <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/icons/folder-plus.svg" alt="No projects" class="mb-4" width="80" height="80" style="filter: invert(1);">
        <h2 class="text-white mb-3">No projects found</h2>
        <p class="text-white-50 mb-4">Create your first project to get started!</p>
      </div>
    </div>
  </div>
</template>

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

const displayMode = ref(false); // 'list' or 'gallery'
const projects = ref([]);
const loading = ref(true);

async function fetchProjects() {
  loading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, "users", props.userId, "projects"));
    projects.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    console.log("hada projet", projects.value);
  } catch (error) {
    console.error("Error fetching projects: ", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchProjects();
});

function toggleDisplayMode() {
  displayMode.value = !displayMode.value;
}
</script>

<style scoped>
/* Ocean theme */
.projects-container {
  background-color: #0f2942;
  color: #fff;
  display: flex;
  flex-direction: column;
}

/* When used inside a parent component, adjust the container height */
:deep(.profile-container) .projects-container {
  min-height: auto;
  background: transparent;
}

:deep(.profile-container) .loading-state {
  min-height: 300px;
}

.project-board {
  border-left: 5px solid #5b86e5;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* List item styling */
.list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: rgba(91, 134, 229, 0.1);
}

/* Project count badge */
.project-count {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  font-size: 1rem;
  padding: 8px 15px;
  border-radius: 20px;
}

/* View toggle button */
.view-toggle-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  color: white;
}

.add-project-btn:hover {
  box-shadow: 0 6px 20px rgba(91, 134, 229, 0.6);
  transform: translateY(-2px);
}

/* Loading spinner styling - matched with skills component */
.spinner-container {
  display: flex;
  justify-content: center;
}

.spinner-border {
  color: #36d1dc;
  animation: spin 1.2s linear infinite, color-change 3s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes color-change {
  0% { border-color: #36d1dc; border-right-color: transparent; }
  50% { border-color: #5b86e5; border-right-color: transparent; }
  100% { border-color: #36d1dc; border-right-color: transparent; }
}

/* Animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .project-board {
    overflow-x: auto;
  }
}
</style>