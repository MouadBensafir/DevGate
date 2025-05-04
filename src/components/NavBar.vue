<template>
  <div class="ocean-navbar-wrapper">
    <!-- Version mobile (horizontale) -->
    <nav class="ocean-navbar-mobile d-md-none py-2 px-4">
      <div class="d-flex justify-content-between align-items-center">
        
        
        <!-- Toggle button -->
        <button @click="toggleMobileMenu" class="btn ocean-toggle-btn">
          <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
        </button>
      </div>
      
      <!-- Menu mobile déplié - Fixed positioning -->
      <div class="ocean-mobile-menu" :class="{ 'show': mobileMenuOpen }">
        <!-- User Info -->
        <div class="ocean-user-info d-flex align-items-center mb-3 p-3">
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
        
        <!-- SearchBar for mobile (added here) -->
        <div class="mb-3 px-3" v-if="logged_in">
          <SearchBar class="w-100"></SearchBar>
        </div>
        
        <!-- Navigation Links -->
        <div class="ocean-nav-links">
          <template v-if="!logged_in">
            <router-link to="/register" class="ocean-nav-item d-flex align-items-center mb-2 p-3" @click="closeMobileMenu">
              <i class="bi bi-person-plus me-3"></i>
              <span>Register</span>
            </router-link>
            <router-link to="/login" class="ocean-nav-item d-flex align-items-center mb-2 p-3" @click="closeMobileMenu">
              <i class="bi bi-box-arrow-in-right me-3"></i>
              <span>Login</span>
            </router-link>
          </template>
          <template v-else>
            <router-link v-if="userInfo && userInfo.uid" :to="`/`" class="ocean-nav-item d-flex align-items-center mb-2 p-3" @click="closeMobileMenu">
              <i class="bi bi-speedometer2 me-3"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/projects`" class="ocean-nav-item d-flex align-items-center mb-2 p-3" @click="closeMobileMenu">
              <i class="bi bi-folder me-3"></i>
              <span>My Projects</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/skill-tracker`" class="ocean-nav-item d-flex align-items-center mb-2 p-3" @click="closeMobileMenu">
              <i class="bi bi-stars me-3"></i>
              <span>Skill Tracker</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/timeline`" class="ocean-nav-item d-flex align-items-center mb-2 p-3" @click="closeMobileMenu">
              <i class="bi bi-activity me-3"></i>
              <span>Timeline</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/objectives`" class="ocean-nav-item d-flex align-items-center mb-2 p-3" @click="closeMobileMenu">
              <i class="bi bi-target me-3"></i>
              <span>Objectives</span>
            </router-link>
            <button @click="logout" class="ocean-nav-item logout-btn d-flex align-items-center mb-2 p-3 w-100 text-start">
              <i class="bi bi-box-arrow-right me-3"></i>
              <span>Logout</span>
            </button>
          </template>
        </div>
      </div>
      
      <!-- Overlay for mobile menu -->
      <div 
        v-if="mobileMenuOpen" 
        class="mobile-menu-overlay" 
        @click="closeMobileMenu"
      ></div>
    </nav>
    
    <!-- Version Desktop -->
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
            {{ logged_in ? userInfo?.firstname : 'Guest' }}
          </span>
          <small class="ocean-useremail text-truncate" style="max-width: 140px;">
            {{ logged_in ? userInfo?.email : 'Not logged in' }}
          </small>
        </div>
      </div>
      <div class="mb-4 px-2" v-if="logged_in">
        <SearchBar class="w-100"></SearchBar>
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
          <router-link v-if="userInfo && userInfo.uid" :to="`/`" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-speedometer2 me-3"></i>
            <span>Dashboard</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/projects`" class="ocean-nav-item d-flex align-items-center mb-3 p-2">
            <i class="bi bi-folder me-3"></i>
            <span>My Projects</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/skill-tracker`" class="ocean-nav-item d-flex align-items-center mb-3 p-2">
            <i class="bi bi-stars me-3"></i>
            <span>Skills Tracker</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/objectives`" class="ocean-nav-item d-flex align-items-center mb-3 p-2">
            <i class="bi bi-list-check me-3"></i>
            <span>Objectives</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/timeline`" class="ocean-nav-item d-flex align-items-center mb-3 p-2">
            <i class="bi bi-activity me-3"></i>
            <span>Timeline</span>
          </router-link>
          <button @click="logout" class="ocean-nav-item logout-btn d-flex align-items-center p-3 w-100 text-start">
            <i class="bi bi-box-arrow-right me-3"></i>
            <span>Logout</span>
          </button>
          
        </template>
      </div>
      
      <!-- Spacer -->
      <div class="flex-grow-1"></div>
      
      <!-- App version info -->
      <div class="app-version text-center small">
        <span class="badge bg-light text-primary">DevGate</span>
      </div>
    </nav>

    <!-- Content Area (for proper sidebar spacing) -->
    <div class="ocean-content" :class="{ 'menu-open': mobileMenuOpen }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import SearchBar from "@/components/SearchBar.vue"
import { inject, onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import { doc, updateDoc } from 'firebase/firestore'

const logged_in = inject('logged_in')
const userInfo = inject('userDoc')
const router = useRouter()
const mobileMenuOpen = ref(false)

// Close mobile menu when window is resized to desktop size
const handleResize = () => {
  if (window.innerWidth >= 768 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

onMounted(async () => {
  try {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: true
      });
    }
    // Add resize event listener
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
})

onBeforeUnmount(() => {
  // Remove resize event listener
  window.removeEventListener('resize', handleResize)
})

// Toggle mobile menu with body scroll lock
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Close menu when navigating
watch(router.currentRoute, () => {
  if (mobileMenuOpen.value) {
    closeMobileMenu()
  }
})

const logout = async () => {
  try {
    await signOut(auth)
    console.log('Logged out successfully')
    closeMobileMenu()
    await router.push('/')
  } catch (err) {
    console.log('Error while logging out:', err)
  }
}
</script>

<style scoped>
/* Ocean theme for the NavBar - Updated to match the dashboard theme */
.ocean-navbar-wrapper {
  --ocean-primary: #1a3c5e;
  --ocean-secondary: #5b86e5;
  --ocean-accent: #36d1dc;
  --ocean-light: #e6f7ff;
  --ocean-dark: #b2bec9;
  --ocean-gradient: linear-gradient(135deg, var(--ocean-primary), var(--ocean-secondary));
  --ocean-shadow: 0 4px 15px rgba(15, 41, 66, 0.2);
  --ocean-transition: all 0.3s ease;
  position: relative;
}

/* Common styles */
.ocean-navbar-wrapper {
  font-family: 'Poppins', sans-serif;
}

.ocean-logo, .ocean-logo-top {
  color: var(--ocean-secondary);
  text-decoration: none;
  transition: var(--ocean-transition);
  font-weight: bold;
}

.ocean-logo:hover, .ocean-logo-top:hover {
  color: var(--ocean-accent);
  transform: translateY(-2px);
}

/* Mobile NavBar */
.ocean-navbar-mobile {
  background-color: white;
  box-shadow: var(--ocean-shadow);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1030;
}

.ocean-toggle-btn {
  background: transparent;
  color: var(--ocean-primary);
  border: none;
  font-size: 1.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: var(--ocean-transition);
}

.ocean-toggle-btn:hover {
  color: var(--ocean-accent);
  background-color: rgba(54, 209, 220, 0.1);
}

/* Mobile Menu */
.ocean-mobile-menu {
  position: fixed;
  top: 56px;
  left: 0;
  width: 100%;
  height: calc(100vh - 56px);
  background-color: white;
  z-index: 1029;
  padding: 1rem;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: translateX(-100%);
  opacity: 0;
  overflow-y: auto;
  box-shadow: var(--ocean-shadow);
}

.ocean-mobile-menu.show {
  transform: translateX(0);
  opacity: 1;
}

/* Mobile menu overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1028;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Desktop Sidebar */
.ocean-sidebar {
  background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);
  box-shadow: var(--ocean-shadow);
  color: white;
  width: 260px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1020;
  overflow-y: auto;
}

/* Logo Top */
.ocean-logo-top {
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem;
}

/* User Info */
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
  background-color: #f8f9fa;
  border-left: 4px solid var(--ocean-secondary);
}

.ocean-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ocean-guest-avatar {
  width: 48px;
  height: 48px;
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
  border: 2px solid var(--ocean-dark);
  bottom: 0;
  right: 0;
  z-index: 1;
}

.ocean-status-indicator.online {
  background-color: #42d392;
}

/* Navigation Links */
.ocean-nav-item {
  border-radius: 10px;
  transition: var(--ocean-transition);
  text-decoration: none;
  font-weight: 500;
}

.ocean-navbar-mobile .ocean-nav-item {
  color: var(--ocean-dark);
  background-color: #f8f9fa;
  border-left: 4px solid var(--ocean-secondary);
}

.ocean-sidebar .ocean-nav-item {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.ocean-nav-item:hover, .ocean-nav-item.router-link-active {
  background: linear-gradient(45deg, rgba(54, 209, 220, 0.2), rgba(91, 134, 229, 0.2));
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(15, 41, 66, 0.1);
}

.ocean-navbar-mobile .ocean-nav-item:hover,
.ocean-navbar-mobile .ocean-nav-item.router-link-active {
  background: linear-gradient(45deg, #f0f8ff, #e6f7ff);
  color: var(--ocean-secondary);
  border-left: 4px solid var(--ocean-accent);
}

.ocean-sidebar .ocean-nav-item.router-link-active {
  background: linear-gradient(45deg, rgba(54, 209, 220, 0.3), rgba(91, 134, 229, 0.3));
  border-left: 4px solid var(--ocean-accent);
}

.ocean-nav-item i {
  font-size: 1.25rem;
}

/* Logout Button */
.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.ocean-navbar-mobile .logout-btn {
  color: #dc3545;
  background-color: #f8f9fa;
  border-left: 4px solid #dc3545;
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

/* Content area - Adjust for fixed mobile navbar */
.ocean-content {
  transition: var(--ocean-transition);
  padding-top: 56px; /* Height of the mobile navbar */
}

@media (min-width: 768px) {
  .ocean-content {
    margin-left: 260px; /* Width of sidebar */
  }
}

/* Animation for menu items */
.ocean-nav-item {
  position: relative;
  overflow: hidden;
}

.ocean-nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--ocean-accent);
  transition: width 0.3s ease;
}

.ocean-nav-item:hover::after {
  width: 100%;
}

/* App version badge */
.app-version .badge {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}
</style>