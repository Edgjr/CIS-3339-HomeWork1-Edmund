<script setup>
import { ref } from 'vue'

const newCourse = ref({
  id: '',
  name: '',
})

const errorMessage = ref('')
const successMessage = ref('')

async function addCourse() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!newCourse.value.id.trim() || !newCourse.value.name.trim()) {
    errorMessage.value = 'Course ID and course name are required.'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/add-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCourse.value),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.error || 'Unable to add course.'
      return
    }

    successMessage.value = 'Course added successfully.'

    newCourse.value = {
      id: '',
      name: '',
    }
  } catch (error) {
    errorMessage.value = 'Unable to connect to the server.'
  }
}
</script>

<template>
  <section>
    <h2>Add Course</h2>

    <form @submit.prevent="addCourse">
      <div>
        <label for="courseId">Course ID:</label>
        <input
          id="courseId"
          v-model="newCourse.id"
          type="text"
        />
      </div>

      <div>
        <label for="courseName">Course Name:</label>
        <input
          id="courseName"
          v-model="newCourse.name"
          type="text"
        />
      </div>

      <button type="submit">Add Course</button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </section>
</template>