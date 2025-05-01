<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { getDoc, doc, deleteDoc, addDoc, collection } from 'firebase/firestore'
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
</script>

<template>
  <div class="project-item-container p-3">
    <div class="d-flex align-items-center">
      <button
        class="btn toggle-btn me-3"
        @click="show = !show"
        :aria-expanded="show"
        :aria-controls="'project-collapse-' + projectId"
      >
        <i class="bi" :class="show ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
      <h3 class="mb-0 flex-grow-1 project-title">{{ project.name }}</h3>
      
      
      <div class="project-date text-muted me-3 d-none d-md-block">
        <small><i class="bi bi-calendar me-1"></i>{{ project.date?.toDate?.()?.toLocaleDateString() || new Date(project.date).toLocaleDateString() }}</small>
      </div>
      
      <div class="project-actions d-flex">
        <button v-if="user && user.uid === props.userId" 
                class="btn action-btn me-2" 
                @click="editing = !editing" 
                title="Edit project">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button v-if="user && user.uid === props.userId" 
                class="btn action-btn-danger" 
                @click="DeleteProject()" 
                title="Delete project">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    </div>

    <div
      v-if="show"
      class="content-panel mt-3 p-3 rounded-3"
      :id="'project-collapse-' + projectId"
    >
      <div v-if="editing">
        <CreateProject @projectUpdated="updateProject" :user-id="user.uid" :project-id="projectId" :editing="true" />
      </div>

      <div v-else>
        <div class="row align-items-center">
          <div class="col-md-3 text-center mb-3 mb-md-0">
            <div class="project-image-container">
              <img
                :src="project?.image"
                class="img-fluid rounded shadow-sm"
                alt="Project thumbnail"
              />
            </div>
          </div>
          <div class="col-md-9">
            <p class="project-description mb-4">{{ project.description }}</p>

            <div class="d-flex flex-wrap align-items-center gap-3">
              <div v-if="project.github">
                <a
                  :href="project.github"
                  class="btn github-btn"
                  target="_blank"
                >
                  <i class="bi bi-github me-1"></i> View on GitHub
                </a>
              </div>

              <div class="tech-stack">
                <span class="me-2 small text-muted">Tech:</span>
                <span v-for="el in project.stack" :key="el" class="badge tech-badge me-1 mb-1">
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
  border-left: 5px solid #36d1dc;
}

.project-item-container:hover {
  background-color: rgba(91, 134, 229, 0.05);
}

.project-title {
  font-weight: 600;
  color: #0f2942;
  font-size: 1.25rem;
}

.toggle-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #5b86e5;
  background-color: rgba(91, 134, 229, 0.1);
  border: none;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background-color: rgba(91, 134, 229, 0.2);
  transform: scale(1.05);
}

.action-btn, .action-btn-danger {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.action-btn {
  color: #0f2942;
  background-color: rgba(15, 41, 66, 0.1);
  border: none;
}

.action-btn:hover {
  background-color: rgba(15, 41, 66, 0.2);
  transform: scale(1.05);
}

.action-btn-danger {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
  border: none;
}

.action-btn-danger:hover {
  background-color: rgba(220, 53, 69, 0.2);
  transform: scale(1.05);
}

.content-panel {
  background-color: rgba(91, 134, 229, 0.05);
  border: 1px solid rgba(91, 134, 229, 0.1);
}

.project-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  max-height: 150px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.project-description {
  color: #495057;
  line-height: 1.6;
}

.github-btn {
  background: linear-gradient(45deg, #24292e, #0f2942);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.github-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(15, 41, 66, 0.2);
  color: white;
}

.tech-badge {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  font-weight: 500;
  padding: 0.35em 0.65em;
  border-radius: 50rem;
}
</style>