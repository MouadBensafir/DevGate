<script setup>
import { ref, defineProps, onMounted, defineEmits, inject, computed } from 'vue';
import { addDoc, collection, updateDoc, getDoc, doc } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { db } from '../firebase'; // Adjust the path as necessary

const addedstack = ref("");
const project = ref({});
const userInfo = inject("userDoc");

const emit = defineEmits(["projectUpdated"]);
const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  editing: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: String,
  }
});

onMounted(async () => {
  if (props.editing) {
    const docSnap = await getDoc(doc(db, 'users', props.userId, 'projects', props.projectId));
      if (docSnap.exists()) {
        project.value = {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      else {
        console.error("No such document!");
      }
  } else {
    project.value = {
      name: "",
      description: "",
      stack: [],
      github: "",
      image: ""
    };
  }
});

function addStack() {
  const input = addedstack.value.trim().toLowerCase();
  if (!input) return;

  if (!project.value.stack.includes(input)) {
    project.value.stack.push(input);
  }

  addedstack.value = "";
}

function selectSuggestedStack(stack) {
  if (!project.value.stack.includes(stack)) {
    project.value.stack.push(stack);
  }
  addedstack.value = "";
}

const filteredSuggestions = computed(() =>
  addedstack.value
    ? suggestedStacks.filter(s =>
        s.toLowerCase().includes(addedstack.value.trim().toLowerCase())
      )
    : []
);

const suggestedStacks = [
    'vuejs',
    'reactjs',
    'angular',
    'nodejs',
    'expressjs',
    'mongodb',
    'firebase',
];
const router = useRouter();

async function onSubmit(){
  console.log("je submit")
  if (!props.editing && (!project.value.name || !project.value.description)) {
    alert("Please fill in all required fields.");
    return;
  }
  project.value.date = new Date();
  if (props.editing){
    console.log("Editing project", project.value);
    const projectRef = doc(db, 'users', props.userId, 'projects', project.value.id);
    await updateDoc(projectRef, project.value)
      .then(() => {
        console.log('Project updated successfully');
        emit("projectUpdated");
      })
      .catch((error) => {
        console.error('Error updating project:', error);
      });
  }
  else{
    project.value.completed = false;
    await addDoc(collection(db, 'users', props.userId, 'projects'), project.value)
    .then(() => {
      console.log('Project added successfully');
      router.push(`/users/${props.userId}/projects`);
    })
    await addDoc(collection(db, 'users', props.userId, 'actions'), {
      type: "project",
      action: "add",
      date: new Date(),
      title: project.value.name,
      description: "Project " + project.value.name + " has been added successfully in the date " + new Date(),
    })
    .catch((error) => {
      console.error('Error adding project:', error);
    });
  }
}

// Picture handling
const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      project.value.image = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleFileDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      project.value.image = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-card">
      <div class="modal-header">
        <h1 class="mb-0">{{(editing) ? "Edit project" : "Create new project"}}</h1>
        <router-link :to="`/users/${userInfo?.uid}/projects`">
          <button type="button" class="close-btn">
            <i class="bi bi-x-lg"></i>
          </button>
        </router-link>
      </div>

      <form @submit.prevent="onSubmit" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="name" class="form-label">Project Name:</label>
          <input type="text" class="form-control" id="name" v-model="project.name" required />
          <div class="invalid-feedback">Please provide a project name.</div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description:</label>
          <textarea class="form-control" id="description" v-model="project.description" rows="3" required></textarea>
          <div class="invalid-feedback">Please provide a description.</div>
        </div>

        <div class="mb-3">
          <label for="stack" class="form-label">Add Tech Stack:</label>
          <input
            type="text"
            id="addedstack"
            v-model="addedstack"
            class="form-control"
            placeholder="Type to search or add..."
          />
        
          <!-- Suggestions -->
          <div v-if="filteredSuggestions.length" class="list-group mt-2">
            <button
              type="button"
              class="list-group-item list-group-item-action"
              v-for="stack in filteredSuggestions"
              :key="stack"
              @click="selectSuggestedStack(stack)"
            >
              {{ stack }}
            </button>
          </div>
        
          <!-- Add custom if not in suggestions -->
          <div v-if="addedstack && !filteredSuggestions.includes(addedstack.trim().toLowerCase())" class="mt-2">
            <button type="button" class="btn btn-secondary" @click="addStack">
              Add "{{ addedstack }}"
            </button>
          </div>
        
          <!-- Display selected stacks -->
          <h6 class="mt-3">Selected Tech Stack:</h6>
          <ul class="mt-2 stack-tags">
            <li v-for="el in project.stack" :key="el">
              <span class="badge bg-gradient text-black">{{ el }}</span>
            </li>
          </ul>
        </div>

        <div class="mb-3">
          <label for="github" class="form-label">GitHub Link:</label>
          <input type="url" class="form-control" id="github" v-model="project.github" placeholder="https://github.com/username/project" />
        </div>

        <div class="mb-4">
          <label class="form-label">Project Image</label>
          <div
            class="upload-box border rounded-3 p-3 text-center position-relative"
            @dragover.prevent
            @drop="handleFileDrop"
            @click="triggerFileInput"
            style="cursor: pointer;"
          >
            <input
              type="file"
              ref="fileInput"
              class="d-none"
              @change="handleFileSelect"
            />
            <div v-if="!project.image" class="upload-placeholder">
              <i class="bi bi-image fs-1 text-primary"></i>
              <p class="text-muted mb-0">Click or drag an image here</p>
            </div>
            <div v-else class="position-relative">
              <img
                :src="project.image"
                alt="Project Image"
                class="img-fluid rounded shadow-sm"
                style="max-height: 200px; object-fit: cover"
              />
              <button
                type="button"
                class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                @click.stop="project.image = ''"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <router-link :to="`/users/${userInfo?.uid}/projects`">
            <button type="button" class="btn btn-cancel">Cancel</button>
          </router-link>
          <button type="submit" class="btn btn-submit">{{(editing) ? "Edit project" : "Create project"}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 41, 66, 0.8);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-card {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
  border-radius: 16px 16px 0 0;
}

.modal-header h1 {
  color: white;
  margin: 0;
  font-weight: bold;
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

form {
  padding: 24px;
}

.form-label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  color: #1a3c5e;
}

.form-control, .form-select {
  border: 1px solid #dce1e6;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #5b86e5;
  box-shadow: 0 0 0 3px rgba(91, 134, 229, 0.15);
}

.btn-secondary {
  background: #5b86e5;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #4a75d4;
  transform: translateY(-2px);
}

.stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style-type: none;
  padding-left: 0;
}

.badge.bg-gradient {
  background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 30px;
  font-weight: 500;
}

.upload-box {
  border: 2px dashed #dce1e6;
  border-radius: 12px;
  min-height: 150px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #5b86e5;
  background-color: rgba(91, 134, 229, 0.05);
}

.upload-placeholder i {
  color: #5b86e5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #dce1e6;
  color: #6c757d;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f8f9fa;
}

.btn-submit {
  background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(91, 134, 229, 0.3);
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(91, 134, 229, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(30px); 
  }
  to { 
    opacity: 1;
    transform: translateY(0); 
  }
}

/* For smaller screens */
@media (max-width: 576px) {
  .modal-card {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  form {
    padding: 16px;
  }
}
</style>