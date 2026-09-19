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
  <main class="course-page">
    <div class="page-heading">
      <div>
        <p class="page-kicker">ACADEMIC OPERATIONS</p>
        <h1>Course Management</h1>
        <p class="page-description">
          Create, review, and manage available courses.
        </p>
      </div>

      <div class="record-count">
        <span class="count-label">TOTAL</span>
        <strong>{{ courses.length }}</strong>
      </div>
    </div>

    <CourseForm />

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">COURSE REGISTRY</p>
          <h2>Available Courses</h2>
        </div>
      </div>

      <p v-if="loading" class="state-message">
        Loading courses...
      </p>

      <p
        v-else-if="errorMessage"
        class="message message-error"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <p v-else-if="courses.length === 0" class="state-message">
        No courses found.
      </p>

      <div v-else class="course-list">
        <article
          v-for="course in courses"
          :key="course.id"
          class="course-card"
        >
          <div>
            <span class="course-id">{{ course.id }}</span>
            <h3>{{ course.name }}</h3>
          </div>

          <button
            class="danger-button"
            type="button"
            @click="courseStore.deleteCourse(course.id)"
          >
            Delete
          </button>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.course-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.page-kicker,
.panel-kicker {
  margin: 0 0 0.35rem;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: #9ca3af;
}

.page-heading h1 {
  margin: 0;
  font-size: 2rem;
}

.page-description {
  margin: 0.5rem 0 0;
  color: #9ca3af;
}

.record-count {
  min-width: 85px;
  padding: 0.75rem 1rem;
  border: 1px solid #374151;
  border-radius: 0.5rem;
}

.count-label {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: #6b7280;
}

.record-count strong {
  font-size: 1.2rem;
}

.panel {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  background: #1f2937;
}

.panel-header {
  margin-bottom: 1.25rem;
}

.panel h2 {
  margin: 0;
  font-size: 1.25rem;
}

.course-list {
  display: grid;
  gap: 0.75rem;
}

.course-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #374151;
  border-radius: 0.6rem;
  background: #111827;
}

.course-id {
  display: inline-block;
  margin-bottom: 0.35rem;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #9ca3af;
}

.course-card h3 {
  margin: 0;
  font-size: 1rem;
}

.danger-button {
  flex-shrink: 0;
  padding: 0.65rem 0.9rem;
  border: 0;
  border-radius: 0.5rem;
  background: #7f1d1d;
  color: #fee2e2;
  font-weight: 700;
  cursor: pointer;
}

.danger-button:hover {
  background: #991b1b;
}

.state-message {
  margin: 0;
  color: #9ca3af;
}

.message {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.message-error {
  border: 1px solid #7f1d1d;
  background: #450a0a;
  color: #fecaca;
}

@media (max-width: 700px) {
  .page-heading {
    flex-direction: column;
    gap: 1rem;
  }

  .record-count {
    width: 100%;
    box-sizing: border-box;
  }

  .course-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .danger-button {
    width: 100%;
  }
}
</style>