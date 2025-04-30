<script setup>
import { ref, defineProps, onMounted, defineEmits } from 'vue';
import { addDoc, collection, updateDoc, getDoc, doc } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { db } from '../firebase';

const objective = ref({});
const emit = defineEmits(["objectiveUpdated"]);
const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  editing: {
    type: Boolean,
    default: false
  },
  objectiveId: {
    type: String,
  }
});

onMounted(async () => {
  if (props.editing) {
    const docSnap = await getDoc(doc(db, 'users', props.userId, 'objectives', props.objectiveId));
    if (docSnap.exists()) {
      objective.value = {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    else {
      console.error("No such document!");
    }
  } else {
    objective.value = {
      description: "",
      completed: false,
      startAt: new Date(),
      finishAt: new Date()
    };
  }
});

async function addAction() {
  try {
    await addDoc(collection(db, "users", props.userId, "actions"), {
      action: "add",
      date: objective.value.startAt,
      description: 'Added objective ' + objective.value.description,
      title: objective.value.description,
      type: "objective"
    });
  } catch (error) {
    console.error("Error adding action: ", error);
  }
}


const router = useRouter();

async function onSubmit(){
  if (!props.editing && !objective.value.description && !objective.value.finishAt) {
    alert("Please fill in all required fields.");
    return;
  }

  if (new Date(objective.value.finishAt) < new Date(objective.value.startAt)) {
    alert("Finish date must be after start date.");
    return;
  }

  if (props.editing){
    const objectiveRef = doc(db, 'users', props.userId, 'objectives', objective.value.id);
    await updateDoc(objectiveRef, objective.value)
        .then(() => {
          emit("objectiveUpdated");
        })
        .catch((error) => {
          console.error('Error updating project:', error);
        });
  } else {
    objective.value.startAt = new Date(Date.now());
    objective.value.finishAt = new Date(objective.value.finishAt);
    console.log(objective.value);
    addAction();
    await addDoc(collection(db, 'users', props.userId, 'objectives'), objective.value)
        .then(() => {
          router.push(`/users/${props.userId}/objectives`);
        })
        .catch((error) => {
          console.error('Error adding project:', error);
        });

  }
}
</script>

<template>
  <div class="container py-4">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white border-bottom-0 py-3">
        <h1 class="h4 mb-0">
          <i class="bi" :class="editing ? 'bi-pencil-square' : 'bi-plus-circle'" style="color: #0d6efd;"></i>
          {{ editing ? "Edit Objective" : "Create New Objective" }}
        </h1>
      </div>

      <div class="card-body pt-3">
        <form @submit.prevent="onSubmit" class="needs-validation" novalidate>
          <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Description</label>
            <textarea
                class="form-control"
                id="description"
                v-model="objective.description"
                rows="4"
                required
                placeholder="Describe your objective..."
            ></textarea>
            <div class="invalid-feedback">Please provide a description.</div>
          </div>

          <div class="mb-4">
            <label for="finishAt" class="form-label fw-semibold">Target Completion Date</label>
            <input
                type="datetime-local"
                class="form-control"
                id="finishAt"
                v-model="objective.finishAt"
                required
            />
            <div class="invalid-feedback">Please select a valid completion date.</div>
            <small class="text-muted">Date must be in the future</small>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button
                type="submit"
                class="btn btn-primary px-4 py-2"
            >
              <i class="bi" :class="editing ? 'bi-check-lg' : 'bi-plus-lg'"></i>
              {{ editing ? "Update Objective" : "Create Objective" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
}

.form-control {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.2);
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
}
</style>