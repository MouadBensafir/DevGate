<script setup>
import { useRoute } from "vue-router";
import ProjectList from "@/components/ProjectList.vue";

const route = useRoute();
const actualUserId = route.params.userId;
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">My Projects</h1>
      <router-link
        :to="'/users/' + actualUserId + '/projects/new'"
        class="btn btn-primary"
      >
        <i class="bi bi-plus-lg me-2"></i>CREATE PROJECT
      </router-link>
    </div>
    <ProjectList :user-id="actualUserId"/>
  </div>
</template>

<style scoped>
/* Optional custom styles can go here */
</style>