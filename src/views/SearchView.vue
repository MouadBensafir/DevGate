<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getDocs, collection } from "firebase/firestore";
import { db } from '../firebase';
import ProfileCard from "@/components/ProfileCard.vue";

const route = useRoute();
const searchQuery = ref(route.params.query || '');
const users = ref([]);
const isLoading = ref(true);

async function fetchUsers() {
  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    users.value = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.firstname && userData.lastname) {
        const fullName = `${userData.firstname} ${userData.lastname}`.toLowerCase();
        if (fullName.includes(searchQuery.value.toLowerCase()) || 
            (userData.email && userData.email.toLowerCase().includes(searchQuery.value.toLowerCase()))) {
          users.value.push({ id: doc.id, ...userData });
        }
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    isLoading.value = false;
  }
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
  <div class="search-container d-flex flex-column px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state d-flex flex-column justify-content-center align-items-center py-5 flex-grow-1">
      <div class="spinner-container mb-4">
        <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <h2 class="text-white mb-2">Searching for users...</h2>
      <p class="text-white-50 text-center">Please wait while we find matching profiles</p>
    </div>

    <!-- Search Results -->
    <div v-else class="search-content py-5 flex-grow-1">
      <h1 class="text-white mb-4 fw-bold">
        <i class="bi bi-search me-2"></i>
        Search Results for "{{ searchQuery }}"
      </h1>

      <!-- No Results Found -->
      <div v-if="users.length === 0" class="search-board bg-white rounded-4 shadow p-5 text-center">
        <i class="bi bi-person-x fs-1 text-muted mb-3"></i>
        <h3 class="mb-3">No Users Found</h3>
        <p class="text-muted mb-4">We couldn't find any users matching your search criteria.</p>
        <p class="text-muted">Try different keywords or check your spelling.</p>
      </div>

      <!-- Results Found -->
      <div v-else class="row g-4">
        <div v-for="user in users" :key="user.id" class="col-md-6 col-lg-4">
          <ProfileCard :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ocean theme styling */
.search-container {
  background-color: #0f2942;
  color: #fff;
}

.search-board {
  border-left: 5px solid #5b86e5;
  transition: all 0.3s ease;
}

.search-board:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Loading animation */
.spinner-container {
  display: flex;
  justify-content: center;
}

.spinner-border {
  animation: spin 1.2s linear infinite, color-change 3s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes color-change {
  0% { border-color: #36d1dc; border-right-color: transparent; }
  50% { border-color: #5b86e5; border-right-color: transparent; }
  100% { border-color: #36d1dc; border-right-color: transparent; }
}

/* Mobile responsiveness */
@media (max-width: 992px) {
  .search-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .search-container {
    padding: 1rem;
  }
}
</style>