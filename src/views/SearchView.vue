<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getDocs, collection } from "firebase/firestore";
import { db } from '../firebase';
import ProfileCard from "@/components/ProfileCard.vue";

const route = useRoute();
const searchQuery = ref(route.params.query || '');
const users = ref([]);

async function fetchUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  users.value = [];
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      users.value.push({ id: doc.id, ...userData });
    }
  });
}

onMounted(() => {
  fetchUsers();
});

watch(() => route.params.query, (newQuery) => {
  searchQuery.value = newQuery || '';
  fetchUsers();
});
</script>

<template>
  <div class="search-view container py-5">
    <h1 class="text-center mb-4">Search Results for "{{ searchQuery }}"</h1>
    <div v-if="users.length === 0" class="alert alert-warning text-center">
      No users found.
    </div>
    <div v-else class="row g-4">
      <div v-for="user in users" :key="user.id" class="col-md-4">
        <ProfileCard :user="user" class="card shadow-sm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>