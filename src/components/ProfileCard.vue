<script setup>
import {defineProps, ref} from 'vue';
import { useRouter } from 'vue-router';
import {getAuth} from "firebase/auth";
import {setDoc, doc} from "firebase/firestore";
import {db} from "@/firebase";

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const connectedUser = ref(getAuth().currentUser);

const router = useRouter();

function goToProfile() {
  router.push("/users/" + props.user.id + "/profile");
}

function formatDate(date) {
  if (!date) return "Unknown";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
}

async function sendMessage() {
  const group = {
    groupMembers: [connectedUser.value.uid, props.user.id],
    date: new Date(),
  }
  await setDoc(doc(db, "groups", connectedUser.value.uid + props.user.id), group);
  router.push("/discussion/" + connectedUser.value.uid + props.user.id);
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
    <div class="card-footer">
      <button class="btn btn-primary" @click.stop="goToProfile">View Profile</button>
      <button v-if="connectedUser.uid !== user.id" class="btn btn-secondary" @click.stop="sendMessage">Send Message</button>
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