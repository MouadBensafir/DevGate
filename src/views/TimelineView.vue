<template>
  <div class="github-container">
    <RealTimeLine :userId="userInfo?.uid"/>
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

</style>
