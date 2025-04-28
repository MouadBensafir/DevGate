<script setup>
import { useRoute } from "vue-router";
import ObjectiveList from "@/components/ObjectiveList.vue";

const route = useRoute();
const actualUserId = route.params.userId;
</script>

<template>
  <div class="container py-5">
    <div class="card shadow-sm">
      <div class="card-header bg-white border-bottom-0">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0 text-primary">My Objectives</h1>
          <router-link
            :to="'/users/' + actualUserId + '/objectives/new'"
            class="btn btn-primary btn-lg"
          >
            <i class="bi bi-plus-lg me-2"></i>CREATE OBJECTIVE
          </router-link>
        </div>
      </div>
      <div class="card-body p-4">
        <ObjectiveList :user-id="actualUserId" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
  overflow: hidden;
}

.btn-primary {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
}
</style>