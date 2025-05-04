<template class="timeline-view">
    <div class="makeitwork py-5 flex-grow-1">
      <h1 class="text-white fw-bold"><i class="bi bi-clock-history me-2"></i>Activity Timeline</h1>
      <div class="github-container">
        <RealTimeLine :userId="userInfo?.uid"/>
      </div>
    </div>
</template>

<script setup>
import RealTimeLine from "@/components/RealTimeLine.vue"
import { inject } from 'vue'

const userInfo = inject('userDoc');
</script>


<style scoped>

.github-container {
  background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);
  min-height: 80vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.makeitwork {
  background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 1rem;
}
</style>
