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
  <div class="objective-item p-2" :class="{'completed-objective': objective.completed}">
    <div v-if="editing">
      <CreateObjective
        @objectiveUpdated="updateProject"
        :user-id="user.uid"
        :objective-id="objectiveId"
        :editing="true"
      />
    </div>
    
    <div v-else>
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="objective-title mb-0 text-truncate pe-2">{{ objective.description }}</h4>
        
        <div v-if="user && (user.uid === props.userId)" class="action-buttons d-flex">
          <button
            v-if="!objective.completed"
            class="btn action-btn edit-btn me-1"
            @click="editing = !editing"
            title="Edit objective"
          >
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            class="btn action-btn delete-btn"
            @click="DeleteObjective()"
            title="Delete objective"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>

      <div class="objective-details mt-2">
        <div class="d-flex flex-wrap align-items-center">
          <div class="me-4 d-flex align-items-center status-indicator">
            <i class="bi me-1" :class="objective.completed ? 'bi-check-circle-fill text-success' : 'bi-clock text-primary'"></i>
            <span class="status-badge" :class="objective.completed ? 'completed' : 'in-progress'">
              {{ objective.completed ? 'Completed' : 'In Progress' }}
            </span>
          </div>
          
          <div class="me-4 d-flex align-items-center">
            <i class="bi bi-hourglass-split text-primary me-1"></i>
            <span class="fw-semibold small">
              {{ objective?.finishAt 
                ? objective.completed 
                  ? formatDuration(objective.finishAt - objective.startAt)
                  : formatDuration(objective.finishAt - (Date.now() / 1000))
                : 'N/A' }}
            </span>
          </div>
          
          <div class="progress-wrapper d-flex align-items-center flex-grow-1">
            <div class="progress flex-grow-1 me-2" style="height: 6px;">
              <div
                class="progress-bar"
                role="progressbar"
                :style="{ width: calculateProgress() + '%' }"
                :aria-valuenow="calculateProgress()"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <span class="progress-text fw-semibold small">{{ calculateProgress() }}%</span>
            
            <button
              v-if="!objective.completed"
              class="btn complete-btn ms-3"
              @click="completeAction()"
              title="Mark as completed"
            >
              <i class="bi bi-check-circle-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.objective-item {
  background-color: white;
  border-radius: 6px;
  transition: all 0.2s ease;
  border-left: 3px solid #5b86e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.objective-item:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.completed-objective {
  background-color: rgba(54, 209, 220, 0.05);
  border-left: 3px solid #36d1dc;
}

.objective-title {
  color: #1a3c5e;
  font-weight: 600;
  font-size: 1.1rem;
  max-width: 70%;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.edit-btn {
  background-color: rgba(91, 134, 229, 0.1);
  color: #5b86e5;
  border: none;
}

.edit-btn:hover {
  background-color: rgba(91, 134, 229, 0.2);
}

.delete-btn {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: none;
}

.delete-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.status-badge {
  font-size: 0.75rem;
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: 600;
}

.status-badge.in-progress {
  background-color: rgba(91, 134, 229, 0.1);
  color: #5b86e5;
}

.status-badge.completed {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.objective-details {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 0.5rem;
}

.progress-wrapper {
  min-width: 200px;
}

.progress {
  border-radius: 3px;
  background-color: rgba(91, 134, 229, 0.08);
  overflow: hidden;
  height: 6px;
}

.progress-bar {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  transition: width 0.5s ease;
}

.progress-text {
  color: #1a3c5e;
  min-width: 35px;
  text-align: right;
}

.complete-btn {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: 0 1px 3px rgba(91, 134, 229, 0.3);
  transition: all 0.2s ease;
}

.complete-btn:hover {
  box-shadow: 0 2px 5px rgba(91, 134, 229, 0.4);
}

.status-indicator {
  min-width: 100px;
}

@media (max-width: 768px) {
  .objective-title {
    max-width: 60%;
    font-size: 1rem;
  }
  
  .progress-wrapper {
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .status-indicator {
    margin-bottom: 0.5rem;
  }
}
</style>