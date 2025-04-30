<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { getDoc, doc, deleteDoc, addDoc, collection, updateDoc } from 'firebase/firestore'
import { db } from '../firebase';
import getUser from "@/composables/getUser";
import CreateObjective from "@/components/CreateObjective.vue";

const { user } = getUser();
let editing = ref(false);
const emit = defineEmits(["objectiveDeleted"]);

const props = defineProps({
  objectiveId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const objective = ref({});

async function fetchObjective() {
  const objectiveDoc = doc(db, "users", props.userId, "objectives", props.objectiveId);
  const docSnap = await getDoc(objectiveDoc);
  if (docSnap.exists()) {
    objective.value = docSnap.data();
  } else {
    console.log('No such document!');
  }
}

onMounted(async () => {
  await fetchObjective();
});

async function DeleteObjective() {
  if (confirm("Are you sure you want to delete this objective?")) {
    try {
      await deleteDoc(doc(db, "users", props.userId, "objectives", props.objectiveId));
      emit("objectiveDeleted", props.objectiveId);
    } catch (error) {
      console.error("Error deleting objective: ", error);
    }
  }
}

function updateProject() {
  editing.value = false;
  fetchObjective();
}

function formatDuration(seconds) {
  if (seconds < 0) return "Expired";
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

async function completeAction() {
  try {
    await addDoc(collection(db, "users", props.userId, "actions"), {
      action: "complete",
      date: new Date(),
      description: 'Completed objective ' + objective.value.description,
      title: objective.value.description,
      type: "objective"
    });
    await updateDoc(doc(db, "users", props.userId, "objectives", props.objectiveId), {
      completed: true
    });
    await fetchObjective();
  } catch (error) {
    console.error("Error adding action: ", error);
  }
}

function calculateProgress() {
  if (!objective.value?.finishAt || !objective.value?.startAt) return 0;
  if (objective.value.completed) return 100;

  const total = new Date(objective.value.finishAt) - objective.value.startAt;
  const remaining = new Date(objective.value.finishAt) - (Date.now() / 1000);

  if (total <= 0) {
    completeAction();
    return 100;
  }
  if (remaining <= 0) return 100;

  return Math.round(((total - remaining) / total) * 100);
}
</script>

<template>
  <div class="objective-item mb-4">
    <div :class="{ 'completed-objective': objective.completed }" class="card shadow-sm border-0">
      <div class="card-header bg-white border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-primary">
            <i class="bi bi-bullseye me-2"></i>
            Objective Details
          </h5>

          <div v-if="user && (user.uid === props.userId)" class="btn-group" role="group">
            <button
                v-if="!editing && !objective.completed"
              class="btn btn-outline-warning btn-sm me-2"
              @click="editing = !editing"
              title="Edit objective"
            >
              <i class="bi bi-pencil-fill"></i> Edit
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="DeleteObjective()"
              title="Delete objective"
            >
              <i class="bi bi-trash-fill"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="editing" class="card-body">
        <CreateObjective
          @objectiveUpdated="updateProject"
          :user-id="user.uid"
          :objective-id="objectiveId"
          :editing="true"
        />
      </div>

      <div v-else class="card-body">
        <div class="mb-4">
          <p class="lead">{{ objective.description }}</p>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="d-flex align-items-center mb-3">
              <div class="me-3 text-muted">
                <i class="bi bi-clock-history fs-5"></i>
              </div>
              <div>
                <small class="text-muted d-block">Total Duration</small>
                <span class="fw-semibold">
                  {{ objective?.finishAt && objective?.startAt
                    ? formatDuration(objective.finishAt - objective.startAt)
                    : 'N/A' }}
                </span>
              </div>
            </div>

            <div v-if="!objective.completed" class="d-flex align-items-center mb-3">
              <div class="me-3 text-muted">
                <i class="bi bi-alarm fs-5"></i>
              </div>
              <div>
                <small class="text-muted d-block">Time Remaining</small>
                <span class="fw-semibold">
                  {{ objective?.finishAt
                    ? formatDuration(objective.finishAt - (Date.now() / 1000))
                    : 'N/A' }}
                </span>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="progress-container">
              <small class="text-muted d-block mb-2">Progress</small>
              <div class="progress" style="height: 10px;">
                <div
                  class="progress-bar bg-success"
                  role="progressbar"
                  :style="{ width: calculateProgress() + '%' }"
                  :aria-valuenow="calculateProgress()"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <small>0%</small>
                <small class="fw-semibold">{{ calculateProgress() }}%</small>
                <small>100%</small>
              </div>
              <button
                v-if="!objective.completed"
                class="btn btn-success btn-sm mt-3"
                @click="completeAction()"
                title="Mark as completed"
                >
                <i class="bi bi-check-circle-fill"></i> Mark as Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.completed-objective {
  background-color: #d4edda; /* Light green background */
}

.objective-item {
  transition: all 0.3s ease;
}

.card {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header {
  background-color: #f8f9fa;
}

.btn-outline-warning {
  color: #ffc107;
  border-color: #ffc107;
}

.btn-outline-warning:hover {
  color: #212529;
  background-color: #ffc107;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  color: white;
  background-color: #dc3545;
}

.progress-container {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
}

.progress {
  border-radius: 0.25rem;
  background-color: #e9ecef;
}

.lead {
  color: #212529;
  font-weight: 500;
}
</style>