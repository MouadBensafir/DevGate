<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import ProjectItem from "@/components/ProjectItem.vue"; // Adjust the path as necessary

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});
const projects = ref([]);
const user = ref(null); // Assuming you have a way to get the current user
onMounted(async () => {
  try {
    const userDoc = await getDoc(doc(db, 'users', props.userId));
    if (userDoc.exists()) {
      user.value = { id: userDoc.id, ...userDoc.data() };
      const projectsCollection = collection(db, 'projects');
      const querySnapshot = await getDocs(projectsCollection);
      projects.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      console.error('No such document!');
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
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