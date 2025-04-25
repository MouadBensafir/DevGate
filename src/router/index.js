import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Objectives from '../views/ObjectivesView.vue'
import Profile from '../views/ProfileView.vue'
import Projects from '../views/ProjectsView.vue'
import SkillTracker from '../views/SkillTrackerView.vue'
import Timeline from '../views/TimelineView.vue'
import NewProjectView from "@/views/NewProjectView.vue";

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
    path: "/users/:userId/objectives",
    name: "objective",
    component: Objectives,
  },
  {
    path: "/users/:userId/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/users/:userId/projects",
    name: "projects",
    component: Projects,
  },
  {
    path: "/users/:userId/skill-tracker",
    name: "skill-tracker",
    component: SkillTracker,
  },
  {
    path: "/users/:userId/timeline",
    name: "timeline",
    component: Timeline,
  },
  {
    path: "/users/:userId/projects/new",
    name: "new-project",
    component: NewProjectView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
