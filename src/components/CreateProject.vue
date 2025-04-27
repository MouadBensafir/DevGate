<script setup>

import { ref, defineProps, onMounted } from 'vue';
import { addDoc, collection, updateDoc, getDoc, doc } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { db } from '../firebase'; // Adjust the path as necessary

const addedstack = ref("");
let existing = ref(true);
const project = ref({});

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
  if (addedstack.value && !project.value.stack.includes(addedstack.value)) {
    project.value.stack.push(addedstack.value);
    addedstack.value = "";
  }
}

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
        // refresh the window
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating project:', error);
      });
  }
  else{
    await addDoc(collection(db, 'users', props.userId, 'projects'), project.value)
    .then(() => {
      console.log('Project added successfully');
      router.push(`/users/${props.userId}/projects`);
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
  <div class="container mt-4">
    <h1 class="mb-4">{{(editing) ? "Edit project" : "Create new project"}}</h1>
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
        <div v-if="existing">
          <label for="stack" class="form-label">Choose a Tech Stack from the suggested stacks:</label>
        <select v-if="existing" class="form-select" id="stack" v-model="project.stack" multiple size="5">
          <option v-for="stack in suggestedStacks" :key="stack" :value="stack">
            {{ stack }}
          </option>
        </select>
        <small class="text-muted">Hold Ctrl/Cmd to select multiple options</small><br>
        </div>
        <button v-if="existing" type="button" class="btn btn-secondary mt-2" @click="existing = !existing">
          Confirm the stack
        </button>
        <div v-if="!existing" class="mt-2">
          <label :for="addedstack" class="form-label">Specify Other Tech:</label>
          <input type="text" id="addedstack" v-model="addedstack" class="form-control" placeholder="Enter tech stack" />
          <button type="button" class="btn btn-secondary mt-2" @click="addStack">Add</button>
        </div>
        <h6 class="mt-3">Selected Tech Stack:</h6>
        <ul class="mt-2">
          <li v-for="el in project.stack" :key="el">
            <span class="badge bg-secondary">{{ el }}</span>
          </li>
        </ul>
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
      <button type="submit" class="btn btn-primary">{{(editing) ? "Edit project" : "Create project"}}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.upload-box {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.upload-box:hover {
  background-color: #e9ecef;
}

.upload-placeholder {
  padding: 20px;
}
</style>