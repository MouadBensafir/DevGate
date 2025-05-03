<template>
  <div class="objectives-container d-flex flex-column px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <div class="objectives-content py-4 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center mb-3 pt-3">
        <h1 class="text-white mb-0 fw-bold"><i class="bi bi-target me-2"></i>My Objectives</h1>
        
        <router-link
          :to="'/users/' + actualUserId + '/objectives/new'"
          class="btn add-objective-btn d-flex align-items-center"
        >
          <i class="bi bi-plus-lg me-1"></i> New Objective
        </router-link>
      </div>
      
      <!-- Objectives Board -->
      <div class="objective-board bg-white rounded-3 shadow-sm p-3 p-md-4">
        <ObjectiveList :user-id="actualUserId" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import ObjectiveList from "@/components/ObjectiveList.vue";

const route = useRoute();
const actualUserId = route.params.userId;
</script>

<style scoped>
/* Ocean theme - Professional Version */
.objectives-container {
  background-color: #0f2942;
  color: #fff;
}

.objective-board {
  border-left: 3px solid #5b86e5;
  transition: all 0.2s ease;
}

/* Button styling */
.add-objective-btn {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(91, 134, 229, 0.4);
  transition: all 0.2s ease;
}

.add-objective-btn:hover {
  box-shadow: 0 2px 5px rgba(91, 134, 229, 0.5);
}


/* Mobile responsiveness */
@media (max-width: 768px) {
  .objectives-content {
    width: 100%;
  }
  
  .d-flex.justify-content-between.align-items-center {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .add-objective-btn {
    margin-top: 1rem;
  }
}
</style>