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
  <main>
    <h1>Enrollment Management</h1>

    <section>
      <h2>Create Enrollment</h2>

      <form @submit.prevent="enrollStudent">
        <div>
          <label for="studentSelect">Student:</label>

          <select id="studentSelect" v-model="selectedStudentId">
            <option value="">Select a student</option>

            <option
              v-for="student in students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }} ({{ student.id }})
            </option>
          </select>
        </div>

        <div>
          <label for="courseSelect">Course:</label>

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

        <button type="submit" :disabled="enrollmentLoading">
          {{ enrollmentLoading ? 'Enrolling...' : 'Enroll Student' }}
        </button>
      </form>

      <p v-if="enrollmentError">{{ enrollmentError }}</p>
      <p v-if="enrollmentSuccess">{{ enrollmentSuccess }}</p>
    </section>

    <section>
  <h2>Course Roster</h2>

  <label for="rosterCourse">Course:</label>

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

  <p v-if="rosterLoading">Loading roster...</p>

  <p v-else-if="rosterError">{{ rosterError }}</p>

  <p v-else-if="selectedRosterCourseId && rosterStudents.length === 0">
    No students are enrolled in this course.
  </p>

  <ul v-else-if="rosterStudents.length > 0">
    <li
      v-for="student in rosterStudents"
      :key="student.id"
    >
      {{ student.name }} ({{ student.id }})
    </li>
  </ul>
</section>
  </main>
</template>