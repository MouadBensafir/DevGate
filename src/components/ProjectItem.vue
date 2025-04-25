<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase';

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
onMounted(async () => {
  const projectDoc = doc(db, "users", props.userId, "projects", props.projectId);
  const docSnap = await getDoc(projectDoc);
  if (docSnap.exists()) {
    project.value = docSnap.data();
  } else {
    console.log('No such document!');
  }
});

</script>

<template>
  <div>
    <img
            :src="project?.image"
            alt="Profile Picture"
            class="img-fluid rounded-circle mb-3"
            width="100"
            height="100"
          />
    <h2>{{ project.name }}</h2>
    <p>{{ project.description }}</p>
    <p>Created on: {{ project.createdAt?.toDate?.()?.toLocaleTimeString() || new Date(project.createdAt).toLocaleTimeString() }}</p>
    <p>GitHub:</p>
    <a :href="project.github">project</a>
    <ul>
      <li v-for="el in project.stack" :key="el">
        <span class="badge bg-secondary">{{ el }}</span>
      </li>
    </ul>

  </div>
</template>

<style scoped>

</style>