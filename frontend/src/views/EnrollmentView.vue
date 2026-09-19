<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '../stores/studentStore'
import { useCourseStore } from '../stores/courseStore'

const studentStore = useStudentStore()
const courseStore = useCourseStore()

const {
  students,
  studentsLoading,
  studentsError,
} = storeToRefs(studentStore)

const {
  courses,
  loading: coursesLoading,
  errorMessage: coursesError,
} = storeToRefs(courseStore)

const selectedStudentId = ref('')
const selectedCourseId = ref('')
const enrollmentError = ref('')
const enrollmentSuccess = ref('')
const enrollmentLoading = ref(false)

const selectedRosterCourseId = ref('')
const rosterStudents = ref([])
const rosterLoading = ref(false)
const rosterError = ref('')

onMounted(async () => {
  await Promise.all([
    studentStore.fetchStudents(),
    courseStore.fetchCourses(),
  ])
})

async function enrollStudent() {
  enrollmentError.value = ''
  enrollmentSuccess.value = ''

  if (!selectedStudentId.value || !selectedCourseId.value) {
    enrollmentError.value = 'Please select a student and a course.'
    return
  }

  enrollmentLoading.value = true

  try {
    const response = await fetch('http://localhost:3000/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: selectedStudentId.value,
        courseId: selectedCourseId.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      enrollmentError.value =
        data.error || 'Unable to create enrollment.'
      return
    }

    enrollmentSuccess.value = 'Enrollment created successfully.'

    selectedStudentId.value = ''
    selectedCourseId.value = ''
  } catch (error) {
    enrollmentError.value = 'Unable to connect to the server.'
  } finally {
    enrollmentLoading.value = false
  }
}

async function loadRoster() {
  rosterError.value = ''
  rosterStudents.value = []

  if (!selectedRosterCourseId.value) {
    return
  }

  rosterLoading.value = true

  try {
    const response = await fetch(
      `http://localhost:3000/enrollments/course/${encodeURIComponent(
        selectedRosterCourseId.value,
      )}`,
    )

    const data = await response.json()

    if (!response.ok) {
      rosterError.value = data.error || 'Unable to load course roster.'
      return
    }

    rosterStudents.value = data
  } catch (error) {
    rosterError.value = 'Unable to connect to the server.'
  } finally {
    rosterLoading.value = false
  }
}

</script>

<template>
  <main class="enrollment-page">
    <div class="page-heading">
      <div>
        <p class="page-kicker">ACADEMIC OPERATIONS</p>
        <h1>Enrollment Management</h1>
        <p class="page-description">
          Assign students to courses and inspect course rosters.
        </p>
      </div>

      <div class="record-count">
        <span class="count-label">STATUS</span>
        <strong>LIVE</strong>
      </div>
    </div>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">NEW ENROLLMENT</p>
          <h2>Create Enrollment</h2>
        </div>

        <span class="panel-badge">ENROLLMENT</span>
      </div>

      <form class="enrollment-form" @submit.prevent="enrollStudent">
        <div class="field">
          <label for="studentSelect">Student</label>

          <select id="studentSelect" v-model="selectedStudentId">
            <option value="">Select a student</option>

            <option
              v-for="student in students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }} — {{ student.id }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="courseSelect">Course</label>

          <select id="courseSelect" v-model="selectedCourseId">
            <option value="">Select a course</option>

            <option
              v-for="course in courses"
              :key="course.id"
              :value="course.id"
            >
              {{ course.id }} — {{ course.name }}
            </option>
          </select>
        </div>

        <button
          class="primary-button"
          type="submit"
          :disabled="enrollmentLoading"
        >
          {{ enrollmentLoading ? 'Enrolling...' : 'Enroll Student' }}
        </button>
      </form>

      <p
        v-if="enrollmentError"
        class="message message-error"
        role="alert"
      >
        {{ enrollmentError }}
      </p>

      <p
        v-if="enrollmentSuccess"
        class="message message-success"
        role="status"
      >
        {{ enrollmentSuccess }}
      </p>
    </section>

    <section class="panel roster-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">ROSTER LOOKUP</p>
          <h2>Course Roster</h2>
        </div>
      </div>

      <div class="field">
        <label for="rosterCourse">Course</label>

        <select
          id="rosterCourse"
          v-model="selectedRosterCourseId"
          @change="loadRoster"
        >
          <option value="">Select a course</option>

          <option
            v-for="course in courses"
            :key="course.id"
            :value="course.id"
          >
            {{ course.id }} — {{ course.name }}
          </option>
        </select>
      </div>

      <p v-if="rosterLoading" class="state-message">
        Loading roster...
      </p>

      <p
        v-else-if="rosterError"
        class="message message-error"
        role="alert"
      >
        {{ rosterError }}
      </p>

      <p
        v-else-if="
          selectedRosterCourseId && rosterStudents.length === 0
        "
        class="state-message"
      >
        No students are enrolled in this course.
      </p>

      <div v-else-if="rosterStudents.length > 0" class="roster-list">
        <article
          v-for="student in rosterStudents"
          :key="student.id"
          class="roster-card"
        >
          <div>
            <span class="student-id">{{ student.id }}</span>
            <h3>{{ student.name }}</h3>
          </div>

          <span class="status-badge">ENROLLED</span>
        </article>
      </div>

      <p v-else class="state-message">
        Select a course to view its roster.
      </p>
    </section>
  </main>
</template>

<style scoped>
.enrollment-page {
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
  font-size: 1rem;
}

.panel {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  background: #1f2937;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.panel-kicker {
  margin-bottom: 0.25rem;
}

.panel h2 {
  margin: 0;
  font-size: 1.25rem;
}

.panel-badge {
  padding: 0.35rem 0.6rem;
  border: 1px solid #4b5563;
  border-radius: 999px;
  font-size: 0.7rem;
  color: #d1d5db;
}

.enrollment-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.85rem;
  color: #d1d5db;
}

.field select {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  background: #111827;
  color: #f9fafb;
  font: inherit;
}

.field select:focus {
  outline: 2px solid #6b7280;
  outline-offset: 1px;
}

.primary-button {
  grid-column: 1 / -1;
  justify-self: start;
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 0.5rem;
  background: #f9fafb;
  color: #111827;
  font-weight: 700;
  cursor: pointer;
}

.primary-button:hover {
  background: #e5e7eb;
}

.primary-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.roster-panel > .field {
  max-width: 600px;
}

.state-message {
  margin: 1rem 0 0;
  color: #9ca3af;
}

.message {
  margin: 1rem 0 0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.message-error {
  border: 1px solid #7f1d1d;
  background: #450a0a;
  color: #fecaca;
}

.message-success {
  border: 1px solid #166534;
  background: #052e16;
  color: #bbf7d0;
}

.roster-list {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.roster-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #374151;
  border-radius: 0.6rem;
  background: #111827;
}

.student-id {
  display: inline-block;
  margin-bottom: 0.35rem;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #9ca3af;
}

.roster-card h3 {
  margin: 0;
  font-size: 1rem;
}

.status-badge {
  padding: 0.35rem 0.6rem;
  border: 1px solid #166534;
  border-radius: 999px;
  color: #bbf7d0;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}

@media (max-width: 700px) {
  .page-heading {
    flex-direction: column;
    gap: 1rem;
  }

  .enrollment-form {
    grid-template-columns: 1fr;
  }

  .primary-button {
    width: 100%;
  }

  .roster-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .status-badge {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
}
</style>