<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ObjectiveItem from "@/components/ObjectiveItem.vue";

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const objectives = ref([]);
const loading = ref(true);

async function fetchObjectives() {
  loading.value = true;
  try {
    console.log("Fetching objectives for user ID:", props.userId);
    const querySnapshot = await getDocs(collection(db, "users", props.userId, "objectives"));
    objectives.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error("Error fetching objectives: ", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchObjectives();
});
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="text-primary mb-0 d-flex align-items-center fw-bold">
          <i class="bi bi-list-check me-2"></i>Objectives
        </h4>
        <p class="text-muted small mb-0">Track your progress and achieve your goals</p>
      </div>
      <div>
        <span class="badge objectives-count-badge px-3 py-2">
          <i class="bi bi-target me-1"></i>
          {{ objectives.length }} objective{{ objectives.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container py-4">
      <div class="loading-spinner mb-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <p class="text-muted mb-0">Loading objectives...</p>
    </div>

    <!-- Objectives list when data is loaded -->
    <div v-else-if="objectives.length > 0" class="objectives-list">
      <div v-for="objective in objectives" :key="objective.id" class="mb-2">
        <ObjectiveItem
          @objectiveDeleted="fetchObjectives"
          :userId="userId"
          :objectiveId="objective.id"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-objectives text-center py-4">
      <div class="empty-state-icon mb-3">
        <i class="bi bi-bullseye"></i>
      </div>
      <h5 class="mb-2 fw-bold">No objectives found</h5>
      <p class="text-muted small mb-0">Create your first objective to start tracking your goals</p>
    </div>
  </div>
</template>

<style scoped>
.objectives-count-badge {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  color: white;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  box-shadow: 0 1px 3px rgba(91, 134, 229, 0.3);
}

.text-primary {
  color: #5b86e5 !important;
}

.objectives-list {
  transition: all 0.3s ease;
}

.empty-objectives {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  padding: 1.5rem;
  border-left: 3px solid #5b86e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-state-icon {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 1.8rem;
  box-shadow: 0 2px 5px rgba(91, 134, 229, 0.3);
}

/* Loading state styles */
.loading-container {
  text-align: center;
  padding: 2rem 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
}

.spinner-border {
  width: 2.5rem;
  height: 2.5rem;
  color: #5b86e5 !important;
}

h4 {
  color: #1a3c5e;
  font-weight: 600;
}

@media (max-width: 768px) {
  .objectives-list {
    padding: 0;
  }
}
</style>