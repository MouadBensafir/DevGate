<template>
  <div class="d-flex justify-content-end align-items-center px-3 mt-4">
    <i class="bi bi-search me-3"></i>
    <input v-model="searchQuery" type="text" placeholder="Search users..." class="search-bar" @keyup.enter="handleSearch" />
  </div>
 </template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const router = useRouter();

function handleSearch() {
  if (searchQuery.value) {
    router.push("/search/" + searchQuery.value);
    searchQuery.value = '';
  }
}
</script>

<style scoped>
body {
  background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);
}
</style>