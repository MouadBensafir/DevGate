<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import CreateObjective from "@/components/CreateObjective.vue";

const route = useRoute();
const userId = ref(null);

onMounted(() => {
  userId.value = route.params.userId;
});
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white border-bottom-0 py-4">
            <h2 class="h4 mb-0 text-center">
              <i class="bi bi-plus-circle-fill text-primary me-2"></i>
              New Objective
            </h2>
          </div>
          <div class="card-body p-4">
            <CreateObjective :user-id="userId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.card-header {
  background-color: #f8f9fa;
}

/* Animation for the card entry */
.card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
}
</style>