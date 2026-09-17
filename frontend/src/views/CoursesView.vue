<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import CourseForm from '../components/CourseForm.vue'
import { useCourseStore } from '../stores/courseStore'

const courseStore = useCourseStore()

const { courses, loading, errorMessage } = storeToRefs(courseStore)

onMounted(() => {
  courseStore.fetchCourses()
})
</script>

<template>
  <main>
    <h1>Course Management</h1>

    <CourseForm />

    <section>
      <h2>Courses</h2>

      <p v-if="loading">Loading courses...</p>

      <p v-else-if="errorMessage">{{ errorMessage }}</p>

      <p v-else-if="courses.length === 0">
        No courses found.
      </p>

<ul v-else>
  <li v-for="course in courses" :key="course.id">
    <strong>{{ course.id }}</strong> — {{ course.name }}

    <button
      type="button"
      @click="courseStore.deleteCourse(course.id)"
    >
      Delete
    </button>
  </li>
</ul>
    </section>
  </main>
</template>