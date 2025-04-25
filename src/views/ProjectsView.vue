<script setup>
import NewProjectForm from "@/components/NewProjectForm.vue";
import { useRoute } from "vue-router";
import ProjectList from "@/components/ProjectList.vue";

const actualUserId = useRoute().params.id;
</script>

<template>
  <NewProjectForm :user-id="actualUserId" />
  <ProjectList :user-id="actualUserId"/>
</template>

<style scoped>

</style>