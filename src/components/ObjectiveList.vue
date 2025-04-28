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

async function fetchObjectives() {
  try {
    console.log("Fetching objectives for user ID:", props.userId);
    const querySnapshot = await getDocs(collection(db, "users", props.userId, "objectives"));
    objectives.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error("Error fetching objectives: ", error);
  }
}

onMounted(async () => {
  await fetchObjectives();
});
</script>

<template>
  <div class="container py-3">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0 text-dark fw-semibold">
            <i class="bi bi-bullseye me-2 text-primary"></i>My Objectives
          </h2>
          <span class="badge rounded-pill bg-primary px-3 py-2">
            <i class="bi bi-list-check me-1"></i>
            {{ objectives.length }} objective{{ objectives.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <div class="card-body p-0">
        <div v-if="objectives.length > 0" class="list-group list-group-flush">
          <div v-for="objective in objectives" :key="objective.id" class="list-group-item border-0 py-3 px-4">
            <ObjectiveItem
                @objectiveDeleted="fetchObjectives"
                :userId="userId"
                :objectiveId="objective.id"
            />
          </div>
        </div>

        <div v-else class="text-center py-5">
          <div class="alert alert-light border d-inline-block">
            <i class="bi bi-info-circle-fill text-info me-2"></i>
            No objectives found. Create your first objective to get started!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  transition: background-color 0.2s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.alert {
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>