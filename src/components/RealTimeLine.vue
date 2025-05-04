<template>
  <div class="timeline-container">
    <!-- Filter Buttons -->
    <div class="filter-buttons">
      <button 
        class="filter-button" 
        :class="{ active: filterType === 'all' }" 
        @click="filterType = 'all'"
      >
        All
      </button>
      <button 
        class="filter-button objective" 
        :class="{ active: filterType === 'objective' }" 
        @click="filterType = 'objective'"
      >
        Objective
      </button>
      <button 
        class="filter-button skill" 
        :class="{ active: filterType === 'skill' }" 
        @click="filterType = 'skill'"
      >
        Skill
      </button>
      <button 
        class="filter-button project" 
        :class="{ active: filterType === 'project' }" 
        @click="filterType = 'project'"
      >
        Project
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="timeline-loading">
      <div class="loading-spinner"></div>
      <span>Loading activities...</span>
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="timeline-error">
      <div class="error-icon">!</div>
      <span>{{ error }}</span>
    </div>
    
    <!-- Empty state -->
    <div v-if="!loading && filteredActions.length === 0" class="timeline-empty">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" class="timeline-svg-icon">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
          <path d="M12 7v6l4 2"/>
        </svg>
      </div>
      <p>No activity found for this user</p>
    </div>
    
    <!-- Timeline -->
    <div v-if="!loading && filteredActions.length > 0" class="timeline">
      <div class="timeline-line"></div>
      
      <div class="timeline-items">
        <div v-for="(action, index) in filteredActions" :key="action.id" class="timeline-item" :class="'item-' + action.type" :style="{'--i': index}">
          <div class="timeline-icon" :class="'icon-' + action.type">
            <div class="icon-container">
              <svg v-if="action.type === 'objective'" viewBox="0 0 24 24" class="timeline-svg-icon">
                <path v-if="action.action === 'add'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                <path v-else-if="action.action === 'complete'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path v-else-if="action.action === 'edit'" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                <path v-else-if="action.action === 'delete'" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                <path v-else d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              
              <svg v-if="action.type === 'skill'" viewBox="0 0 24 24" class="timeline-svg-icon">
                <path v-if="action.action === 'level up'" d="M7 14l5-5 5 5z"/>
                <path v-else-if="action.action === 'level down'" d="M7 10l5 5 5-5z"/>
                <path v-else-if="action.action === 'add'" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                <path v-else-if="action.action === 'delete'" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                <path v-else d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
              
              <svg v-if="action.type === 'project'" viewBox="0 0 24 24" class="timeline-svg-icon">
                <path v-if="action.action === 'add'" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                <path v-else-if="action.action === 'complete'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path v-else-if="action.action === 'delete'" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                <path v-else d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
              </svg>
            </div>
          </div>
          
          <div class="timeline-content" :class="'content-' + action.type">
            <div class="content-card">
              <div class="content-header">
                <span class="content-badge">{{ action.type }} • {{ action.action }}</span>
                <time class="content-time">{{ formatDate(action.date) }}</time>
              </div>
              <h3 class="content-title">{{ action.title }}</h3>
              <p class="content-description">{{ action.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, computed } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

// Define props
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

// Reactive state
const actions = ref([]);
const loading = ref(true);
const error = ref(null);
const filterType = ref('all');

// Fetch actions from Firebase
const fetchActions = async () => {
  if (!props.userId) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const actionsRef = collection(db, 'users', props.userId, 'actions');
    const actionsSnapshot = await getDocs(actionsRef);
    
    actions.value = actionsSnapshot.docs.map(doc => {
      const data = doc.data();
      let date;
      
      // Handle different date formats
      if (data.type === 'objective' && typeof data.date === 'number') {
        // Convert seconds since epoch to Date object
        date = new Date(data.date * 1000);
      } else if (data.date?.toDate) {
        // Firestore timestamp
        date = data.date.toDate();
      } else {
        // Already a Date object or fallback
        date = data.date instanceof Date ? data.date : new Date(data.date);
      }
      
      return {
        id: doc.id,
        ...data,
        date
      };
    }).sort((a, b) => b.date - a.date); // Sort by date descending
  } catch (err) {
    console.error("Error fetching actions:", err);
    error.value = "Failed to load timeline data. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Computed property for filtered actions
const filteredActions = computed(() => {
  if (filterType.value === 'all') {
    return actions.value;
  }
  return actions.value.filter(action => action.type === filterType.value);
});

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  
  const jsDate = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(jsDate);
};

// Watch for changes
watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    fetchActions();
  } else {
    actions.value = [];
  }
}, { immediate: true });

// Fetch actions when component mounts
onMounted(() => {
  if (props.userId) {
    fetchActions();
  }
});
</script>

<style scoped>
.timeline-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
}

.timeline-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 24px;
  text-align: center;
  position: relative;
}

.timeline-title:after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  margin: 12px auto 0;
  border-radius: 2px;
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}

.filter-button {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f3f4f6;
  color: #4b5563;
}

.filter-button:hover {
  background-color: #e5e7eb;
}

.filter-button.active {
  color: white;
}

.filter-button.objective {
  background-color: #ede9fe;
  color: #6d28d9;
}

.filter-button.objective.active {
  background: linear-gradient(145deg, #8b5cf6, #6366f1);
}

.filter-button.skill {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.filter-button.skill.active {
  background: linear-gradient(145deg, #3b82f6, #06b6d4);
}

.filter-button.project {
  background-color: #fef3c7;
  color: #b45309;
}

.filter-button.project.active {
  background: linear-gradient(145deg, #f59e0b, #d97706);
}

/* Loading State */
.timeline-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #4b5563;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-left-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.timeline-error {
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  color: #b91c1c;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.error-icon {
  background-color: #b91c1c;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
}

/* Empty State */
.timeline-empty {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}

/* Timeline */
.timeline {
  position: relative;
  padding: 16px 0;
}

.timeline-line {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #6366f1, #8b5cf6, #ec4899);
  border-radius: 3px;
}

.timeline-items {
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 32px;
  position: relative;
}

.timeline-icon {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 3px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.icon-objective {
  background: linear-gradient(145deg, #8b5cf6, #6366f1);
}

.icon-skill {
  background: linear-gradient(145deg, #3b82f6, #06b6d4);
}

.icon-project {
  background: linear-gradient(145deg, #f59e0b, #d97706);
}

.icon-container {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-svg-icon {
  width: 24px;
  height: 24px;
  fill: white;
}

.timeline  .timeline-content {
  flex: 1;
  margin-left: 16px;
}

.content-card {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.content-objective .content-card {
  background-color: #ede9fe;
  border-left: 4px solid #8b5cf6;
}

.content-skill .content-card {
  background-color: #dbeafe;
  border-left: 4px solid #3b82f6;
}

.content-project .content-card {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.content-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background-color: rgba(255, 255, 255, 0.6);
}

.content-objective .content-badge {
  color: #6d28d9;
}

.content-skill .content-badge {
  color: #1d4ed8;
}

.content-project .content-badge {
  color: #b45309;
}

.content-time {
  font-size: 12px;
  color: #6b7280;
}

.content-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
}

.content-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.timeline-item {
  animation: fadeIn 0.3s ease forwards;
  animation-delay: calc(var(--i, 0) * 0.1s);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .timeline-line {
    left: 20px;
  }
  
  .timeline-icon {
    width: 40px;
    height: 40px;
  }
  
  .icon-container {
    width: 24px;
    height: 24px;
  }
  
  .timeline-content {
    margin-left: 12px;
  }
  
  .content-title {
    font-size: 16px;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .filter-button {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>