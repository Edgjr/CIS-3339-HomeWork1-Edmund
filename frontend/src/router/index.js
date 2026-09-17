import { createRouter, createWebHistory } from 'vue-router'
import StudentView from '../views/StudentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'students',
      component: StudentView,
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/CoursesView.vue'),
    },
    {
  path: '/enrollments',
  name: 'enrollments',
  component: () => import('../views/EnrollmentView.vue'),
},
  ],
})

export default router