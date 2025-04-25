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
    <h2>{{ project.name }}</h2>
    <p>{{ project.description }}</p>
    <p>Created on: {{ project.createdAt }}</p>
    <p>Due date: {{ project.dueDate }}</p>
  </div>
</template>

<style scoped>

</style>