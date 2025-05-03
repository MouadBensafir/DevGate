<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const router = useRouter();

function handleSearch() {
  if (searchQuery.value) {
    router.push("/search/" + searchQuery.value);
  }
}
</script>

<template>
  <i class="fa-solid fa-magnifying-glass"></i>
  <input v-model="searchQuery" type="text" placeholder="Search users..." class="search-bar" @keyup.enter="handleSearch" />
</template>

<style scoped>

</style>