<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { getDoc, doc, deleteDoc, addDoc, collection, updateDoc } from 'firebase/firestore'
import { db } from '../firebase';
import getUser from "@/composables/getUser";
import CreateObjective from "@/components/CreateObjective.vue";

const { user } = getUser();
const editing = ref(false);
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
      await addDoc(collection(db, "users", props.userId, "actions"), {
      action: "delete",
      date: new Date(),
      description: 'Deleted objective ' + objective.value.description,
      title: objective.value.description,
      type: "objective"
    });
      await deleteDoc(doc(db, "users", props.userId, "objectives", props.objectiveId));
      emit("objectiveDeleted", props.objectiveId);
    } catch (error) {
      console.error("Error deleting objective: ", error);
    }
  }
}

async function updateObjective() {
  editing.value = false;
  await fetchObjective();
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
  if (objective.value.completed) return;
  try {
    await addDoc(collection(db, "users", props.userId, "actions"), {
      action: "complete",
      date: new Date(),
      description: 'Completed objective ' + objective.value.description,
      title: objective.value.description,
      type: "objective"
    });
    await updateDoc(doc(db, "users", props.userId, "objectives", props.objectiveId), {
      ...objective.value,
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
  <div class="objective-item mb-3">
    <div :class="{ 'completed-objective': objective.completed }" class="card shadow-sm border-0">
      <div class="card-body p-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <!-- Prominent title -->
          <h3 class="objective-title mb-0">
            {{ objective.description }}
          </h3>
          
          <!-- Complete button - kept prominently -->
          <button
            v-if="!objective.completed"
            class="complete-btn"
            @click="completeAction()"
            title="Mark as completed"
          >
            <i class="bi bi-check-lg"></i>
          </button>
        </div>
        
        <!-- Info row with progress bar aligned -->
        <div class="d-flex align-items-center objective-info">
          <!-- Status badge -->
          <span class="status-badge me-3" :class="objective.completed ? 'completed' : 'in-progress'">
            {{ objective.completed ? 'Completed' : 'In Progress' }}
          </span>
          
          <!-- Time indicator -->
          <div class="time-indicator d-flex align-items-center me-3">
            <i class="bi bi-clock me-1"></i>
            <span class="time-text">
              {{ objective?.finishAt 
                ? objective.completed 
                  ? formatDuration(objective.finishAt - objective.startAt)
                  : formatDuration(objective.finishAt - (Date.now() / 1000))
                : 'No deadline' }}
            </span>
          </div>
          
          <!-- Progress bar that fills remaining space -->
          <div class="progress-wrapper d-flex align-items-center flex-grow-1">
            <div class="progress me-2">
              <div
                class="progress-bar"
                role="progressbar"
                :style="{ width: calculateProgress() + '%' }"
                :aria-valuenow="calculateProgress()"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <span class="progress-text">{{ calculateProgress() }}%</span>
          </div>
          
          <!-- Action buttons -->
          <div v-if="user && (user.uid === props.userId)" class="action-buttons ms-2">
            <button
              v-if="!editing && !objective.completed"
              class="btn btn-sm edit-btn me-1"
              @click="editing = !editing"
              title="Edit objective"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button
              class="btn btn-sm delete-btn"
              @click="DeleteObjective()"
              title="Delete objective"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Edit mode -->
      <div v-if="editing" class="card-body pt-0">
        <CreateObjective
          @objectiveUpdated="updateObjective"
          :user-id="user.uid"
          :objective-id="objectiveId"
          :editing="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.objective-item {
  transition: all 0.2s ease;
}

.card {
  border-left: 4px solid #0077B6; /* Ocean blue border */
  box-shadow: 0 1px 3px rgba(0, 119, 182, 0.15);
  background-color: #fafeff; /* Very subtle blue tint */
  border-radius: 6px;
}

.card:hover {
  box-shadow: 0 2px 6px rgba(0, 119, 182, 0.2);
}

.completed-objective .card {
  border-left: 4px solid #20B2AA; /* Light sea green */
  background-color: #f8fffd; /* Very subtle teal tint */
}

.objective-title {
  color: #05445E; /* Deep ocean blue */
  font-weight: 700;
  font-size: 1.3rem;
  max-width: 80%;
  line-height: 1.2;
}

.edit-btn, .delete-btn {
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  border: none;
}

.edit-btn {
  background-color: rgba(0, 119, 182, 0.1);
  color: #0077B6; /* Ocean blue */
}

.edit-btn:hover {
  background-color: rgba(0, 119, 182, 0.2);
}

.delete-btn {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.delete-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.status-badge {
  font-size: 0.7rem;
  padding: 1px 8px;
  border-radius: 3px;
  font-weight: 600;
}

.status-badge.in-progress {
  background-color: rgba(0, 119, 182, 0.1);
  color: #0077B6; /* Ocean blue */
}

.status-badge.completed {
  background-color: rgba(32, 178, 170, 0.1);
  color: #20B2AA; /* Light sea green */
}

.progress-wrapper {
  min-width: 100px;
}

.progress {
  border-radius: 2px;
  background-color: rgba(173, 216, 230, 0.2); /* Light blue */
  overflow: hidden;
  height: 4px;
  flex: 1;
}

.progress-bar {
  background: linear-gradient(90deg, #0077B6, #00B4D8); /* Ocean blue gradient */
  transition: width 0.5s ease;
}

.progress-text {
  color: #3D5A80;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 30px;
  white-space: nowrap;
}

.time-indicator {
  color: #3D5A80; /* Slate blue */
  font-size: 0.75rem;
  white-space: nowrap;
}

.time-text {
  color: #3D5A80;
}

.time-indicator i {
  color: #0077B6; /* Ocean blue */
  font-size: 0.7rem;
}

.complete-btn {
  background: linear-gradient(135deg, #0077B6, #00B4D8); /* Ocean blue gradient */
  color: white;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 2px 5px rgba(0, 119, 182, 0.3);
  transition: all 0.2s ease;
}

.complete-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 8px rgba(0, 119, 182, 0.4);
}

.objective-info {
  min-height: 28px;
}

@media (max-width: 768px) {
  .objective-info {
    flex-wrap: wrap;
    row-gap: 8px;
  }
  
  .progress-wrapper {
    order: 3;
    width: 100%;
    margin-top: 6px;
  }
  
  .action-buttons {
    order: 2;
  }
  
  .objective-title {
    font-size: 1.1rem;
    max-width: 70%;
  }
}
</style>