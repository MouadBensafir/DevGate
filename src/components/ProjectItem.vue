<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { getDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase';
import getUser from "@/composables/getUser";
import CreateProject from "@/components/CreateProject.vue";

const { user } = getUser();
let editing = ref(false);
let show = ref(false);
const emit = defineEmits(["projectDeleted"]);

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

const project = ref({});

async function fetchProject() {
  console.log("Fetching project with ID:", props.projectId, props.userId);
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
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  }
}

</script>

<template>
  <div class="project-item-container mb-4">
    <div class="d-flex align-items-center mb-2">
      <button
        class="btn btn-outline-primary btn-sm me-2"
        @click="show = !show"
        :aria-expanded="show"
        :aria-controls="'project-collapse-' + projectId"
      >
        <i class="bi" :class="show ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
      <h3 class="mb-0 flex-grow-1">{{ project.name }}</h3>
    </div>

    <div
      v-if="show"
      class="card shadow-sm border-0"
      :id="'project-collapse-' + projectId"
    >
      <div class="card-header bg-white border-0 pb-0">
        <div class="d-flex justify-content-end">
          <div class="btn-group" role="group">
            <button
              v-if="user && (user.uid === props.userId)"
              class="btn btn-outline-danger btn-sm"
              @click="DeleteProject()"
              title="Delete project"
            >
              <i class="bi bi-trash-fill"></i> Delete
            </button>
            <button
              v-if="user && user.uid === props.userId"
              class="btn btn-outline-warning btn-sm"
              @click="editing = !editing"
              title="Edit project"
            >
              <i class="bi bi-pencil-fill"></i> Edit
            </button>
          </div>
        </div>
      </div>

      <div v-if="editing" class="card-body">
        <CreateProject :user-id="user.uid" :project-id="projectId" :editing="true" />
      </div>

      <div v-else class="card-body">
        <div class="row align-items-center mb-4">
          <div class="col-md-3 text-center mb-3 mb-md-0">
            <img
              :src="project?.image"
              class="img-fluid rounded shadow-sm"
              style="max-height: 150px; width: auto;"
              alt="Project thumbnail"
            />
          </div>
          <div class="col-md-9">
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-calendar text-muted me-2"></i>
              <small class="text-muted">
                Created: {{ project.date?.toDate?.()?.toLocaleDateString() || new Date(project.date).toLocaleDateString() }}
              </small>
            </div>

            <p class="card-text mb-4">{{ project.description }}</p>

            <div class="d-flex flex-wrap align-items-center gap-3">
              <div v-if="project.github">
                <a
                  :href="project.github"
                  class="btn btn-outline-primary btn-sm"
                  target="_blank"
                >
                  <i class="bi bi-github me-1"></i> View on GitHub
                </a>
              </div>

              <div>
                <span class="me-2 small text-muted">Tech:</span>
                <span v-for="el in project.stack" :key="el" class="badge bg-primary me-1 mb-1">
                  {{ el }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-item-container {
  transition: all 0.3s ease;
}

.card {
  border-radius: 0.5rem;
  overflow: hidden;
}

.btn-outline-primary:hover {
  color: white;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}
</style>