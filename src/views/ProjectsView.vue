<script setup>
import { useRoute } from "vue-router";
import ProjectList from "@/components/ProjectList.vue";

const route = useRoute();
const actualUserId = route.params.userId;
</script>

<template>
  <router-link :to="'/users/' + actualUserId + '/projects/new'">
CREATE
    </router-link>
  <ProjectList :user-id="actualUserId"/>
</template>

<style scoped>

</style>