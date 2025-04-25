<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ProjectItem from "@/components/ProjectItem.vue"; // Adjust the path as necessary

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});
const projects = ref([]);
onMounted(async () => {
  try {
    console.log("caca ", props.userId);
    const querySnapshot = await getDocs(collection(db, "users", props.userId, "projects"));
    projects.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching projects: ", error);
  }
});

</script>

<template>
  <div>
    <h1>Project List</h1>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <ProjectItem :userId="userId" :projectId="project.id"/>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>