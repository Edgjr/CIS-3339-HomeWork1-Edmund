import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStudentStore = defineStore('student', () => {
  const student = ref(null)
  const searchError = ref('')
  const searchLoading = ref(false)

  async function searchStudent(name) {
    searchError.value = ''
    student.value = null

    if (!name.trim()) {
      searchError.value = 'Please enter a student name.'
      return
    }

    searchLoading.value = true

    try {
      const response = await fetch('http://localhost:3000/find-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          searchError.value = 'Cannot find the student.'
        } else {
          searchError.value =
            'An error occurred while searching for the student.'
        }
        return
      }

      student.value = await response.json()
    } catch (error) {
      searchError.value = 'Unable to connect to the server.'
    } finally {
      searchLoading.value = false
    }
  }

  async function deleteStudent() {
  if (!student.value) {
    return
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete ${student.value.name}?`,
  )

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch('http://localhost:3000/delete-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: student.value.name,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      searchError.value = data.error || 'Unable to delete student.'
      return
    }

    student.value = null
    searchError.value = ''
  } catch (error) {
    searchError.value = 'Unable to connect to the server.'
  }
}

  return {
    student,
    searchError,
    searchLoading,
    searchStudent,
    deleteStudent,
  }
})

