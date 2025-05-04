<script setup>
import {ref, onMounted, defineProps, defineEmits} from 'vue';
import { getDoc, doc, deleteDoc, addDoc, collection, updateDoc} from 'firebase/firestore'
import { db } from '../firebase';
import getUser from "@/composables/getUser";
import CreateProject from "@/components/CreateProject.vue";

const { user } = getUser();
let editing = ref(false);
let show = ref(false);

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["projectDeleted"]);

const project = ref({});

async function fetchProject() {
  const projectDoc = doc(db, "users", props.userId, "projects", props.projectId);
  const docSnap = await getDoc(projectDoc);
  if (docSnap.exists()) {
    project.value = docSnap.data();
  } else {
    console.log('No such document!');
  }
}

onMounted(async () => {
  await fetchProject();
});

async function DeleteProject() {
  if (confirm("Are you sure you want to delete this project?")) {
    try {
      await deleteDoc(doc(db, "users", props.userId, "projects", props.projectId));
      emit("projectDeleted", props.projectId);
      alert("Project deleted successfully");
      await addDoc(collection(db, 'users', props.userId, 'actions'), {
        type: "project",
        action: "delete",
        date: new Date(),
        title: project.value.name,
        description: "Project " + project.value.name + " has been deleted successfully in the date " + new Date(),
      });
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  }
}

function updateProject() {
  editing.value = false;
  fetchProject();
}

// TODO: Implement the completeProject function
async function completeProject() {
  try {
    const projectRef = doc(db, "users", props.userId, "projects", props.projectId);
    await updateDoc(projectRef, {
      completed: true
    });
    
    await addDoc(collection(db, 'users', props.userId, 'actions'), {
      type: "project",
      action: "complete",
      date: new Date(),
      title: project.value.name,
      description: `Project ${project.value.name} has been marked as completed on ${new Date()}`,
    });    
    await fetchProject();
    alert("Project marked as completed");
    
  } catch (error) {
    console.error("Error completing project: ", error);
    alert("Failed to complete project. Please try again.");
  }
}
</script>

<template>
  <div class="card h-100 shadow-sm">
    <div class="position-relative">
      <img
        :src="project?.image"
        class="card-img-top"
        style="height: 180px;"
        alt="Project image"
      />
      <div 
        v-if="project.completed !== undefined" 
        class="position-absolute top-0 end-0 m-2 badge" 
        :class="project.completed ? 'bg-success' : 'bg-warning text-dark'"
      >
        {{ project.completed ? 'Completed' : 'In Progress' }}
      </div>
    </div>

    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title mb-0">{{ project.name }}</h5>
        <button
          class="btn btn-sm btn-outline-primary"
          @click="show = !show"
          :title="show ? 'Hide details' : 'Show details'"
        >
          <i class="bi" :class="show ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </button>
      </div>

      <div v-if="show">

        <div v-if="user && (user.uid === props.userId)" class="d-flex gap-2 mt-3">
          <button
            class="btn btn-sm btn-outline-danger"
            @click.stop="DeleteProject()"
            title="Delete project">
            <i class="bi bi-trash-fill"></i>
          </button>
          <button
            class="btn btn-sm btn-outline-warning"
            @click.stop="editing = !editing"
            title="Edit project">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            v-if="project.completed === false"
            class="btn btn-sm btn-outline-success"
            @click.stop="completeProject()"
            title="Mark as completed">
            <i class="bi bi-check-circle"></i>
          </button>
        </div>

        <div v-if="editing" class="mt-3">
          <CreateProject @projectUpdated="updateProject" :user-id="user.uid" :project-id="projectId" :editing="true" />
        </div>
        <div v-else class="mt-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <p class="card-text text-muted small mb-0">
              <i class="bi bi-calendar me-1"></i>
              {{ project.date?.toDate?.()?.toLocaleDateString() || new Date(project.date).toLocaleDateString() }}
            </p>
            <div class="d-flex align-items-center">
              <i class="bi me-1" :class="project.completed ? 'bi-check-circle-fill text-success' : 'bi-hourglass-split text-warning'"></i>
              <span class="small" :class="project.completed ? 'text-success' : 'text-warning'">
                {{ project.completed ? 'Completed' : 'In Progress' }}
              </span>
            </div>
          </div>

          <p class="card-text mb-3">{{ project.description }}</p>

          <div class="mb-3">
            <a
              v-if="project.github"
              :href="project.github"
              class="btn btn-sm btn-outline-primary w-100 mb-2"
              target="_blank"
            >
              <i class="bi bi-github me-1"></i> GitHub
            </a>
          </div>

          <div class="mb-2">
            <div class="d-flex flex-wrap gap-1">
              <span v-for="el in project.stack" :key="el" class="badge bg-primary text-white">
                {{ el }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s ease;
  border: none;
}
.card:hover {
  transform: translateY(-5px);
}
</style>