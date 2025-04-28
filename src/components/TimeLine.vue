<template>
  <div class="github-contributions">
    <div v-if="loading" class="loading">Loading contributions...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="calendar-container">
      <!-- Month name on the left -->
      <div class="month-label">{{ currentMonthName }}</div>

      <!-- Calendar grid -->
      <div class="calendar-grid">
        <!-- Day names header -->
        <div class="day-names">
          <div v-for="day in dayNames" :key="day" class="day-name">
            {{ day }}
          </div>
        </div>

        <!-- Contribution grid -->
        <div class="contribution-grid">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index" 
            class="contribution-day"
            :class="getContributionClass(day)"
            :title="getTooltip(day)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps } from 'vue'
import axios from 'axios'

const props = defineProps({
  username: {
    type: String,
    required: true
  }
})

const loading = ref(false)
const error = ref(null)
const yearlyContributions = ref([])
const currentDate = ref(new Date())

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const currentMonth = computed(() => {
  return currentDate.value.getMonth()
})

// Get contributions for current month only
const currentMonthContributions = computed(() => {
  const month = currentMonth.value + 1 // Months are 0-indexed in JS
  const monthStr = month < 10 ? `0${month}` : month
  
  return yearlyContributions.value.filter(contrib => {
    return contrib.date.startsWith(`${currentYear.value}-${monthStr}-`)
  })
})

// Get calendar days for current month
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const days = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ isEmpty: true })
  }
  
  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day < 10 ? `0${day}` : day
    const monthStr = (month + 1) < 10 ? `0${month + 1}` : month + 1
    const date = `${year}-${monthStr}-${dayStr}`
    const contribution = currentMonthContributions.value.find(c => c.date === date)
    days.push({ 
      date,
      count: contribution?.count || 0,
      isEmpty: false
    })
  }
  
  return days
})

// Fetch contributions data for current year
async function fetchContributions() {
  loading.value = true
  error.value = null
  yearlyContributions.value = []

  try {
    const response = await axios.get(
      `https://github-contributions-api.jogruber.de/v4/${props.username}?y=${currentYear.value}`
    )

    yearlyContributions.value = response.data.contributions || []
    
  } catch (err) {
    console.error('Error fetching GitHub contributions:', err)
    error.value = 'Failed to load contribution data. Please check the username and try again.'
  } finally {
    loading.value = false
  }
}

function getContributionClass(day) {
  if (day.isEmpty) return 'empty'
  if (day.count === 0) return 'no-contributions'
  if (day.count <= 2) return 'low-contributions'
  if (day.count <= 4) return 'medium-contributions'
  return 'high-contributions'
}

function getTooltip(day) {
  if (day.isEmpty) return ''
  if (day.count === 0) return `No contributions on ${day.date}`
  return `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`
}

onMounted(fetchContributions)
watch(() => props.username, fetchContributions)
</script>

<style scoped>
.github-contributions {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  max-width: 300px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #d73a49;
}

.calendar-container {
  display: flex;
  gap: 10px;
}

.month-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: bold;
  padding-top: 20px;
  font-size: 14px;
}

.calendar-grid {
  flex-grow: 1;
}

.day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: 5px;
}

.day-name {
  font-size: 11px;
  color: #586069;
  text-align: center;
}

.contribution-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.contribution-day {
  aspect-ratio: 1;
  border-radius: 2px;
}

.empty {
  visibility: hidden;
}

.no-contributions {
  background-color: #ebedf0;
}

.low-contributions {
  background-color: #9be9a8;
}

.medium-contributions {
  background-color: #40c463;
}

.high-contributions {
  background-color: #216e39;
}

.contribution-day:hover {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>