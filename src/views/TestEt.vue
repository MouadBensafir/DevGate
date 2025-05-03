<template>
  <div>
    <div v-if="loading">Loading data...</div>
    <SkillLevelChart v-else :skills="skillsData" />
    <GanttChart :tasks="objectivesData" />
    <PieChartObjectives :objectives="objectivesData" />
    <BubbleChart :skills="skillsData" />
    <RealTimeLine :userId="user?.uid"/>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import SkillLevelChart from "@/components/PieChartSkill.vue";
import GanttChart from "@/components/GanttChart.vue";
import getUser from "@/composables/getUser";
import PieChartObjectives from "@/components/PieChartOjectives.vue"
import BubbleChart from "@/components/BubbleChart.vue"
import RealTimeLine from "@/components/RealTimeLine.vue"

const skillsData = ref([]);
const objectivesData = ref([]);
const loading = ref(true);
const { user } = getUser();

// Fetch skills
const fetchSkills = async () => {
  const querySnapshot = await getDocs(collection(db, "users", user.value.uid, "skills"));
  skillsData.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch objectives
const fetchObjectives = async () => {
  const querySnapshot = await getDocs(collection(db, "users", user.value.uid, "objectives"));
  objectivesData.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch both
const fetchData = async () => {
  try {
    if (!user.value?.uid) return;
    loading.value = true;
    await Promise.all([fetchSkills(), fetchObjectives()]);
    console.log("Data loaded:", { skills: skillsData.value, objectives: objectivesData.value });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// Watch user and fetch data
watch(user, (newUser) => {
  if (newUser) fetchData();
}, { immediate: true });

onMounted(() => {
  if (user.value) fetchData();
});
</script>
