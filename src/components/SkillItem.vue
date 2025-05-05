<template>
    <tr :class="{
        'skill-beginner': skill.level === 'beginner', 
        'skill-intermediate': skill.level === 'intermediate', 
        'skill-advanced': skill.level === 'advanced',
        'skill-expert': skill.level === 'expert'
    }">
        <td class="fw-bold">{{ skill.name }}</td>
        <td>
        <span class="badge" :class="{
            'bg-info': skill.level === 'beginner',
            'bg-primary': skill.level === 'intermediate',
            'bg-success': skill.level === 'advanced',
            'bg-danger': skill.level === 'expert'
        }">{{ skill.level }}</span>
        </td>
        <td class="align-middle" style="width: 25%">
        <div class="progress" style="height: 8px;">
            <div class="progress-bar" :class="{
            'bg-info w-25': skill.level === 'beginner',
            'bg-primary w-50': skill.level === 'intermediate',
            'bg-success w-75': skill.level === 'advanced',
            'bg-danger w-100': skill.level === 'expert'
            }" role="progressbar"></div>
        </div>
        </td>
        <td>
        <small class="text-muted d-flex align-items-center">
            <i class="bi bi-clock me-2"></i>
            {{ getTimeAgo(skill.createdAt) }} ago
        </small>
        </td>
        <td>
        <div v-if="userId === user.uid" class="d-flex">
            <button class="btn btn-sm btn-outline-primary me-2" @click="$emit('upgrade', skill.id)" 
                    :disabled="skill.level === 'expert'">
            <i class="bi bi-arrow-up-circle"></i>
            </button>
            <button class="btn btn-sm btn-outline-warning me-2" @click="$emit('downgrade', skill.id)"
                    :disabled="skill.level === 'beginner'">
            <i class="bi bi-arrow-down-circle"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', skill.id)">
            <i class="bi bi-trash"></i>
            </button>
        </div>
        </td>
    </tr>
</template>
  
<script setup>
import { Timestamp } from 'firebase/firestore'
import { ref, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import getUser from "@/composables/getUser";
  
defineProps({
    skill: {
      type: Object,
      required: true
    }
})
  
function getTimeAgo(timestamp) {
    const now = new Date()
    const createdAt = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp)
  
    const diffInMs = now - createdAt
    const diffInSec = Math.floor(diffInMs / 1000)
    const diffInMin = Math.floor(diffInSec / 60)
    const diffInHours = Math.floor(diffInMin / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInMonths = Math.floor(diffInDays / 30)
  
    if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`
    } else if (diffInMin > 0) {
      return `${diffInMin} minute${diffInMin > 1 ? 's' : ''}`
    } else {
      return `${diffInSec} second${diffInSec > 1 ? 's' : ''}`
    }
  }
  const { user } = getUser();
  const route = useRoute();
  const userId = ref(route.params.userId);
  console.log('User ID:', userId.value, "Connected User ID:", user.uid);

</script>
  
<style scoped>
/* Table row styling */
tr {
    border-left: 5px solid transparent;
    transition: all 0.3s ease;
}
  
tr.skill-beginner {
    border-left-color: #17a2b8;
}
  
tr.skill-intermediate {
    border-left-color: #0d6efd;
}
  
tr.skill-advanced {
    border-left-color: #198754;
}
  
tr.skill-expert {
    border-left-color: #dc3545;
}
  
/* Action buttons hover effect */
.btn-outline-primary:hover, .btn-outline-warning:hover, .btn-outline-danger:hover {
    transform: scale(1.1);
}
  
.btn-outline-primary, .btn-outline-warning, .btn-outline-danger {
    transition: all 0.2s ease;
}
</style>