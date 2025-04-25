<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../firebase'; // Adjust the path as necessary

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});
const suggestedStacks = [
  { name: 'Vue.js', description: 'A progressive JavaScript framework for building user interfaces.' },
  { name: 'React', description: 'A JavaScript library for building user interfaces.' },
  { name: 'Angular', description: 'A platform for building mobile and desktop web applications.' },
  { name: 'Node.js', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.' },
  { name: 'Django', description: 'A high-level Python Web framework that encourages rapid development.' },
];
const router = useRouter();
const project = ref({
  name: '',
  description: '',
  stack: [],
  github: '',
  image: '',
  createdAt: new Date(),
});

function onSubmit(){
  if (!project.value.name || !project.value.description) {
    alert("Please fill in all required fields.");
    return;
  }
  addDoc(collection(db, 'users', props.userId, 'projects'), project.value)
    .then(() => {
      console.log('Project added successfully');
      router.push(`/users/${props.userId}/projects`);
    })
    .catch((error) => {
      console.error('Error adding project:', error);
    });
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
    <h1 class="mb-4">Create a New Project</h1>
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
        <label for="stack" class="form-label">Tech Stack:</label>
        <select class="form-select" id="stack" v-model="project.stack" multiple size="5">
          <option v-for="stack in suggestedStacks" :key="stack.name" :value="stack.name">
            {{ stack.name }} - {{ stack.description }}
          </option>
          <option value="other">Other</option>
        </select>
        <small class="text-muted">Hold Ctrl/Cmd to select multiple options</small>
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
      <button type="submit" class="btn btn-primary">Create Project</button>
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