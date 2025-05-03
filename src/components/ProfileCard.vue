<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const router = useRouter();

function goToProfile() {
  router.push("/users/" + props.user.id + "/profile");
}

function formatDate(date) {
  if (!date) return "Unknown";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
}
</script>

<template>
  <div class="card profile-card shadow-sm" @click="goToProfile">
    <img :src="user.pdp" alt="User Photo" class="card-img-top profile-photo" />
    <div class="card-body">
      <h5 class="card-title">{{ user.firstname }} {{ user.lastname }}</h5>
      <p class="card-text text-muted mb-1">{{ user.email }}</p>
      <p class="card-text">{{ user.bio }}</p>
      <small class="text-muted">Joined: {{ formatDate(user?.createdAt) }}</small>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.profile-photo {
  object-fit: cover;
  height: 200px;
}
</style>