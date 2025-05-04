<script setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

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
  if (!connectedUser.value || !props.user.id) return;
  
  const currentUid = connectedUser.value.uid;
  const targetUid = props.user.id;
  
  const groupID = currentUid > targetUid ? currentUid + targetUid : targetUid + currentUid;
  const group = {
    groupMembers: [currentUid, targetUid],
    date: new Date(),
    groupID,
  };
  
  // Set a new group if it doesn't exist
  const groupRef = doc(db, "groups", groupID);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) {
    await setDoc(groupRef, group);
  }
  
  router.push("/discussion/" + groupID);
}
</script>

<template>
  <div class="profile-card rounded-4 shadow mb-4" @click="goToProfile">
    <div class="profile-header">
      <img 
        :src="user.pdp || 'https://via.placeholder.com/150'" 
        alt="User Photo" 
        class="profile-photo"
      />
    </div>
    <div class="profile-body">
      <h3 class="profile-name">{{ user.firstname }} {{ user.lastname }}</h3>
      <p class="profile-email">{{ user.email }}</p>
      
      <div class="profile-bio">
        <p>{{ user.bio || 'No bio provided.' }}</p>
      </div>
      
      <div class="profile-joined">
        <i class="bi bi-calendar3 me-2"></i>
        <span>Joined: {{ formatDate(user?.createdAt) }}</span>
      </div>
    </div>
    <div class="profile-footer">
      <button class="btn btn-view" @click.stop="goToProfile">
        <i class="bi bi-person-badge me-2"></i>View Profile
      </button>
      <button 
        v-if="connectedUser && connectedUser.uid !== user.id" 
        class="btn btn-message" 
        @click.stop="sendMessage"
      >
        <i class="bi bi-chat-dots me-2"></i>Message
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  background-color: white;
  overflow: hidden;
  border-left: 5px solid #5b86e5;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15) !important;
}

.profile-header {
  position: relative;
  height: 140px;
  background: linear-gradient(90deg, #36d1dc, #5b86e5);
  display: flex;
  justify-content: center;
}

.profile-photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: -50px;
}

.profile-body {
  padding: 60px 20px 20px;
  text-align: center;
  flex-grow: 1;
}

.profile-name {
  font-weight: 600;
  color: #1a3c5e;
  margin-bottom: 5px;
}

.profile-email {
  color: #5b86e5;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.profile-bio {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #2c3e50;
  margin-bottom: 15px;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.profile-joined {
  font-size: 0.8rem;
  color: #6c757d;
}

.profile-footer {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn {
  border-radius: 50px;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.3s ease;
  flex: 1;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-view {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(91, 134, 229, 0.3);
}

.btn-view:hover {
  box-shadow: 0 6px 15px rgba(91, 134, 229, 0.5);
}

.btn-message {
  background: transparent;
  color: #5b86e5;
  border: 1px solid #5b86e5;
}

.btn-message:hover {
  background-color: rgba(91, 134, 229, 0.1);
}

@media (max-width: 768px) {
  .profile-footer {
    flex-direction: column;
  }
}
</style>