<template>
  <div class="github-contributions-container">
    <div class="github-contributions">
      <div v-if="loading" class="loading">Loading contributions...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <!-- Month Labels -->
        <div class="month-labels">
          <div v-for="(month, index) in monthLabels" :key="index" class="month-label">
            {{ month }}
          </div>
        </div>

        <!-- Calendar grid -->
        <div class="calendar">
          <!-- Day Names -->
          <div class="day-names">
            <div v-for="day in dayNames" :key="day" class="day-name">{{ day }}</div>
          </div>

          <!-- Weeks -->
          <div class="weeks">
            <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week">
              <div 
                v-for="(day, dayIndex) in week" 
                :key="dayIndex" 
                class="day" 
                :class="getContributionClass(day)"
                :title="getTooltip(day)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, watch } from 'vue'
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
const today = new Date()

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const numberOfWeeks = 16 // Changed from 20 to 16 weeks (approximately 4 months)

async function fetchContributions() {
  loading.value = true
  error.value = null
  yearlyContributions.value = []

  try {
    const year = today.getFullYear()
    const yearsToFetch = [year, year - 1]

    const responses = await Promise.all(
      yearsToFetch.map(y => axios.get(`https://github-contributions-api.jogruber.de/v4/${props.username}?y=${y}`))
    )

    responses.forEach(response => {
      yearlyContributions.value.push(...(response.data.contributions || []))
    })
  } catch (err) {
    console.error('Error fetching contributions:', err)
    error.value = 'Failed to load contribution data.'
  } finally {
    loading.value = false
  }
}

const weeks = computed(() => {
  const start = new Date(today)
  start.setDate(start.getDate() - (numberOfWeeks * 7))
  
  const days = []
  for (let i = 0; i < numberOfWeeks * 7; i++) {
    const dateStr = start.toISOString().split('T')[0]
    const contribution = yearlyContributions.value.find(c => c.date === dateStr)

    days.push({
      date: dateStr,
      count: contribution?.count || 0,
    })

    start.setDate(start.getDate() + 1)
  }

  const groupedWeeks = []
  for (let i = 0; i < days.length; i += 7) {
    groupedWeeks.push(days.slice(i, i + 7))
  }

  return groupedWeeks
})

const monthLabels = computed(() => {
  const labels = []
  let lastMonth = ''

  weeks.value.forEach(week => {
    const firstDayOfWeek = new Date(week[0]?.date)
    const month = firstDayOfWeek.toLocaleString('default', { month: 'short' })

    if (month !== lastMonth) {
      labels.push(month)
      lastMonth = month
    } else {
      labels.push('')
    }
  })

  return labels
})

function getContributionClass(day) {
  if (!day || day.count === 0) return 'no-contributions'
  if (day.count <= 2) return 'low-contributions'
  if (day.count <= 5) return 'medium-contributions'
  return 'high-contributions'
}

function getTooltip(day) {
  if (!day) return ''
  if (day.count === 0) return `No contributions on ${day.date}`
  return `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`
}

onMounted(fetchContributions)
watch(() => props.username, fetchContributions)
</script>

<style scoped>
.github-contributions-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 10px 0; /* Reduced padding */
}

.github-contributions {
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
}

.loading,
.error {
  text-align: center;
  padding: 15px;
}

.error {
  color: red;
}

.month-labels {
  display: flex;
  margin-left: 30px; /* Align with the calendar grid */
}

.month-label {
  flex: 0 0 12px; /* Reduced width */
  font-size: 10px; /* Smaller text */
  color: #586069;
  text-align: center;
  margin-right: 2px; /* Reduced gap */
}

.calendar {
  display: flex;
  margin-top: 6px; /* Slightly tighter spacing */
}

.day-names {
  display: flex;
  flex-direction: column;
  height: 100px; /* Reduced height */
}

.day-name {
  font-size: 9px; /* Smaller font */
  color: #586069;
  height: 12px;
  line-height: 12px;
  text-align: right;
  padding-right: 6px;
  margin-bottom: 2px; /* Reduced spacing */
}

.weeks {
  display: flex;
  gap: 2px; /* Reduced horizontal gap */
}

.week {
  display: flex;
  flex-direction: column;
  gap: 2px; /* Reduced vertical gap */
}

.day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #ebedf0;
  transition: background-color 0.3s, transform 0.2s;
}

.day:hover {
  cursor: pointer;
  opacity: 0.8;
  transform: scale(1.05); /* Slightly smaller hover effect */
}

.no-contributions {
  background-color: #ebedf0;
}

.low-contributions {
  background-color: #c6e48b;
}

.medium-contributions {
  background-color: #7bc96f;
}

.high-contributions {
  background-color: #239a3b;
}
</style>