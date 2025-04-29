<template>
  <div class="ocean-navbar-wrapper">
    <!-- Version mobile (horizontale) -->
    <nav class="ocean-navbar-mobile d-md-none py-2 px-4">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Logo -->
        <router-link to="/" class="ocean-logo">
          <i class="bi bi-code me-2 fs-4"></i>
          <span class="fw-bold fs-5">DevApp</span>
        </router-link>
        
        <!-- Toggle button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="btn ocean-toggle-btn">
          <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
        </button>
      </div>
      
      <!-- Menu mobile déplié -->
      <div class="ocean-mobile-menu py-3" :class="{ 'show': mobileMenuOpen }">
        <!-- User Info -->
        <div class="ocean-user-info d-flex align-items-center">
          <div class="ocean-avatar me-3">
            <img
              v-if="logged_in && userInfo?.pdp"
              :src="userInfo?.pdp"
              alt="profile"
              class="rounded-circle"
              width="42"
              height="42"
            />
            <div v-else class="ocean-guest-avatar d-flex align-items-center justify-content-center">
              <i class="bi bi-person-fill"></i>
            </div>
          </div>
          <div class="d-flex flex-column">
            <span class="ocean-username fw-semibold">
              {{ logged_in ? userInfo?.firstname : 'Guest' }}
            </span>
            <small class="ocean-useremail text-truncate" style="max-width: 200px;">
              {{ logged_in ? userInfo?.email : 'Not logged In' }}
            </small>
          </div>
        </div>
        
        <!-- Navigation Links -->
        <div class="ocean-nav-links">
          <template v-if="!logged_in">
            <router-link to="/register" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-person-plus me-3"></i>
              <span>Register</span>
            </router-link>
            <router-link to="/login" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-box-arrow-in-right me-3"></i>
              <span>Login</span>
            </router-link>
          </template>
          <template v-else>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/projects`" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-folder me-3"></i>
              <span>My Projects</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/skill-tracker`" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-graph-up me-3"></i>
              <span>Skill Tracker</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/timeline`" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-time me-3"></i>
              <span>Timeline</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/objectives`" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-target me-3"></i>
              <span>Objectifs</span>
            </router-link>
            <button @click="logout" class="ocean-nav-item logout-btn d-flex align-items-center mb-2 p-2 w-100 text-start">
              <i class="bi bi-box-arrow-right me-3"></i>
              <span>Logout</span>
            </button>
          </template>
        </div>
      </div>
    </nav>
    
    <!-- Version Desktop (verticale) -->
    <nav class="ocean-sidebar d-none d-md-flex flex-column vh-100 p-3">
      <!-- User Info -->
      <div class="ocean-user-info d-flex align-items-center mb-4 p-3">
        <div class="ocean-avatar me-3 position-relative">
          <router-link :to="`/users/${userInfo?.uid}/profile`" class="ocean-avatar-link">
          <img
            v-if="logged_in && userInfo?.pdp"
            :src="userInfo?.pdp"
            alt="profile"
            class="rounded-circle"
            width="48"
            height="48"
          />
          <div v-else class="ocean-guest-avatar d-flex align-items-center justify-content-center">
            <i class="bi bi-person-fill"></i>
          </div>
        </router-link>
        </div>
        <div class="d-flex flex-column overflow-hidden">
          <span class="ocean-username fw-semibold text-truncate" style="max-width: 140px;">
            {{ logged_in ? userInfo?.firstname : 'Invité' }}
          </span>
          <small class="ocean-useremail text-truncate" style="max-width: 140px;">
            {{ logged_in ? userInfo?.email : 'Non connecté' }}
          </small>
        </div>
      </div>
      
      <!-- Navigation Links -->
      <div class="ocean-nav-links mb-4">
        <template v-if="!logged_in">
          <router-link to="/register" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-person-plus me-3"></i>
            <span>Register</span>
          </router-link>
          <router-link to="/login" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-box-arrow-in-right me-3"></i>
            <span>Login</span>
          </router-link>
        </template>
        <template v-else>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/projects`" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-folder me-3"></i>
            <span>My Projects</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/skill-tracker`" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-graph-up me-3"></i>
            <span>Skills Tracker</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/objectives`" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-flag me-3"></i>
            <span>Objectifs</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/timeline`" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-clock me-3"></i>
            <span>Timeline</span>
          </router-link>
          <button @click="logout" class="ocean-nav-item logout-btn d-flex align-items-center mb-3 p-3 w-100 text-start">
            <i class="bi bi-box-arrow-right me-3"></i>
            <span>Logout</span>
          </button>
        </template>
      </div>
      
      <!-- Spacer -->
      <div class="flex-grow-1 ocean-spacer"></div>
      
      <!-- Brand / Logo -->
      <router-link to="/" class="ocean-logo-btn btn d-flex align-items-center gap-2 mt-auto p-3">
        <i class="bi bi-code fs-4"></i>
        <span class="fw-bold">DevApp</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import { doc, updateDoc } from 'firebase/firestore'

const logged_in = inject('logged_in')
const userInfo = inject('userDoc')
const router = useRouter()
const mobileMenuOpen = ref(false)

onMounted(async () => {
  try {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: true
      });
    }
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
})

const logout = async () => {
  try {
    await signOut(auth)
    console.log('Logged out successfully')
    mobileMenuOpen.value = false
    await router.push('/')
  } catch (err) {
    console.log('Error while logging out:', err)
  }
}
</script>

<style scoped>
/* Thème océanique pour la NavBar */
.ocean-navbar-wrapper {
  --ocean-primary: #1a7b9b;
  --ocean-secondary: #64b5d9;
  --ocean-accent: #0fb8c9;
  --ocean-light: #e6f7ff;
  --ocean-dark: #0a4b6c;
  --ocean-gradient: linear-gradient(135deg, var(--ocean-primary), var(--ocean-secondary));
  --ocean-shadow: 0 4px 12px rgba(10, 75, 108, 0.15);
  --ocean-transition: all 0.3s ease;
}

/* Styles communs */
.ocean-navbar-wrapper {
  font-family: 'Poppins', sans-serif;
}

.ocean-logo {
  color: var(--ocean-primary);
  text-decoration: none;
  transition: var(--ocean-transition);
}

.ocean-logo:hover {
  color: var(--ocean-accent);
}

.ocean-logo .bi-water {
  color: var(--ocean-accent);
}

/* Styles pour la NavBar Mobile */
.ocean-navbar-mobile {
  background-color: white;
  box-shadow: var(--ocean-shadow);
  position: relative;
  z-index: 100;
  overflow: hidden;
  height: 56px
}

.ocean-toggle-btn {
  background: transparent;
  color: var(--ocean-primary);
  border: none;
  font-size: 1.5rem;
  transition: var(--ocean-transition);
}

.ocean-toggle-btn:hover {
  color: var(--ocean-accent);
}

.ocean-mobile-menu {
  max-height: 80vh; /* Prevent it from taking up the whole screen height */
  overflow-y: auto; /* Allow scrolling within the mobile menu if necessary */
}

.ocean-navbar-mobile .ocean-mobile-menu.show {
  max-height: 80vh; /* Ensure the expanded mobile menu doesn't go beyond the screen */
}


/* Styles pour la sidebar desktop */
.ocean-sidebar {
  background: var(--ocean-gradient);
  box-shadow: var(--ocean-shadow);
  color: white;
  width: 260px;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

/* Styles pour les utilisateurs */
.ocean-user-info {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.ocean-sidebar .ocean-user-info {
  color: white;
}

.ocean-navbar-mobile .ocean-user-info {
  color: var(--ocean-dark);
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: var(--ocean-light);
}

.ocean-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ocean-guest-avatar {
  width: 42px;
  height: 42px;
  background-color: var(--ocean-light);
  color: var(--ocean-primary);
  border-radius: 50%;
  font-size: 1.5rem;
}

.ocean-sidebar .ocean-guest-avatar {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.ocean-status-indicator {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  border: 2px solid white;
  bottom: 0;
  right: 0;
  z-index: 1;
}

.ocean-status-indicator.online {
  background-color: #42d392;
}

/* Navigation Links */
.ocean-nav-item {
  border-radius: 8px;
  transition: var(--ocean-transition);
  text-decoration: none;
  color: var(--ocean-dark);
}

.ocean-navbar-mobile .ocean-nav-item {
  background-color: var(--ocean-light);
  margin-bottom: 0.5rem;
}

.ocean-sidebar .ocean-nav-item {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.ocean-nav-item:hover, .ocean-nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.ocean-navbar-mobile .ocean-nav-item:hover,
.ocean-navbar-mobile .ocean-nav-item.router-link-active {
  background-color: var(--ocean-secondary);
  color: white;
}

/* Styles pour le bouton de déconnexion */
.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.ocean-navbar-mobile .logout-btn {
  background-color: var(--ocean-light);
  color: #dc3545;
}

.ocean-sidebar .logout-btn {
  color: white;
}

.ocean-navbar-mobile .logout-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.ocean-sidebar .logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Logo */
.ocean-logo-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 8px;
  transition: var(--ocean-transition);
}

.ocean-logo-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}


</style>