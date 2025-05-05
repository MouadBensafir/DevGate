<script setup>
import { useRoute } from "vue-router";
import ProjectList from "@/components/ProjectList.vue";

const route = useRoute();
const actualUserId = route.params.userId;
</script>

<template>
  <div class="project-view-container">
    <div class="d-flex justify-content-between align-items-center px-md-5 px-3 pt-5">
      <h1 class="mb-0 text-white fw-bold"><i class="bi bi-folder-fill me-2"></i>Projects</h1>
      <router-link
        :to="'/users/' + actualUserId + '/projects/new'"
        class="btn add-project-btn"
      >
        <i class="bi bi-plus-circle-fill me-2"></i>CREATE PROJECT
      </router-link>
    </div>
    
    <ProjectList :userId="actualUserId"/>
    
    <!-- Add any CSS transitions here for when the form page loads -->
  </div>
</template>

<style scoped>
.project-view-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);
}

.add-project-btn {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 25px;
  box-shadow: 0 4px 15px rgba(91, 134, 229, 0.4);
  transition: all 0.3s ease;
  font-weight: 600;
}

.add-project-btn:hover {
  box-shadow: 0 6px 20px rgba(91, 134, 229, 0.6);
  transform: translateY(-2px);
  color: white;
}

/* Page transition animation (for when you navigate to the form page) */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>