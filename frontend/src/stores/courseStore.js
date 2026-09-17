import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  const courses = ref([])
  const loading = ref(false)
  const errorMessage = ref('')

  async function fetchCourses() {
    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetch('http://localhost:3000/courses')

      if (!response.ok) {
        errorMessage.value = 'Unable to load courses.'
        return
      }

      courses.value = await response.json()
    } catch (error) {
      errorMessage.value = 'Unable to connect to the server.'
    } finally {
      loading.value = false
    }
  }

  async function deleteCourse(id) {
  errorMessage.value = ''

  try {
    const response = await fetch(
      `http://localhost:3000/courses/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      },
    )

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.error || 'Unable to delete course.'
      return
    }

    courses.value = courses.value.filter((course) => course.id !== id)
  } catch (error) {
    errorMessage.value = 'Unable to connect to the server.'
  }
}

  return {
    courses,
    loading,
    errorMessage,
    fetchCourses,
    deleteCourse,
  }
})