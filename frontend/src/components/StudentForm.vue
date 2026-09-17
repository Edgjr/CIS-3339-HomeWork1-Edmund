<script setup>
import { ref } from 'vue'

const newStudent = ref({
  name: '',
  id: '',
  phone: '',
  zip: '',
})

const errorMessage = ref('')
const successMessage = ref('')

async function addStudent() {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !newStudent.value.name.trim() ||
    !newStudent.value.id.trim() ||
    !newStudent.value.phone.trim() ||
    !newStudent.value.zip.trim()
  ) {
    errorMessage.value = 'All student fields are required.'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/add-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent.value),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.error || 'Unable to add student.'
      return
    }

    successMessage.value = 'Student added successfully.'

    newStudent.value = {
      name: '',
      id: '',
      phone: '',
      zip: '',
    }
  } catch (error) {
    errorMessage.value = 'Unable to connect to the server.'
  }
}
</script>

<template>
  <section>
    <h2>Add Student</h2>

    <form @submit.prevent="addStudent">
      <div>
        <label for="studentName">Name:</label>
        <input
          id="studentName"
          v-model="newStudent.name"
          type="text"
        />
      </div>

      <div>
        <label for="studentId">ID:</label>
        <input
          id="studentId"
          v-model="newStudent.id"
          type="text"
        />
      </div>

      <div>
        <label for="studentPhone">Phone:</label>
        <input
          id="studentPhone"
          v-model="newStudent.phone"
          type="text"
        />
      </div>

      <div>
        <label for="studentZip">ZIP:</label>
        <input
          id="studentZip"
          v-model="newStudent.zip"
          type="text"
        />
      </div>

      <button type="submit">Add Student</button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </section>
</template>