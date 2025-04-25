import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Objectives from '../views/ObjectivesView.vue'
import Profile from '../views/ProfileView.vue'
import Projects from '../views/ProjectsView.vue'
import SkillTracker from '../views/SkillTrackerView.vue'
import Timeline from '../views/TimelineView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: "/objectives/:objectiveId",
    name: "objective",
    component: Objectives,
  },
  {
    path: "/profile/:profileId",
    name: "profile",
    component: Profile,
  },
  {
    path: "/projects/:userId",
    name: "projects",
    component: Projects,
  },
  {
    path: "/skill-tracker/:userId",
    name: "skill-tracker",
    component: SkillTracker,
  },
  {
    path: "/timeline/:userId",
    name: "timeline",
    component: Timeline,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
