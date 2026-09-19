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
const loading = ref(false)

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

  loading.value = true

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
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div>
        <p class="panel-kicker">NEW RECORD</p>
        <h2>Add Student</h2>
      </div>

      <span class="panel-badge">STUDENT</span>
    </div>

    <form class="student-form" @submit.prevent="addStudent">
      <div class="field">
        <label for="studentName">Name</label>
        <input
          id="studentName"
          v-model="newStudent.name"
          type="text"
          placeholder="Enter full name"
        />
      </div>

      <div class="field">
        <label for="studentId">Student ID</label>
        <input
          id="studentId"
          v-model="newStudent.id"
          type="text"
          placeholder="e.g. 1001"
        />
      </div>

      <div class="field">
        <label for="studentPhone">Phone</label>
        <input
          id="studentPhone"
          v-model="newStudent.phone"
          type="text"
          placeholder="e.g. 555-1234"
        />
      </div>

      <div class="field">
        <label for="studentZip">ZIP Code</label>
        <input
          id="studentZip"
          v-model="newStudent.zip"
          type="text"
          placeholder="e.g. 77001"
        />
      </div>

<button
  class="primary-button"
  type="submit"
  :disabled="loading"
>
  {{ loading ? 'Adding...' : 'Add Student' }}
</button>
    </form>

    <p
      v-if="errorMessage"
      class="message message-error"
      role="alert"
    >
      {{ errorMessage }}
    </p>

    <p
      v-if="successMessage"
      class="message message-success"
      role="status"
    >
      {{ successMessage }}
    </p>
  </section>
</template>

<style scoped>
.panel {
  padding: 1.5rem;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  background: #1f2937;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.panel-kicker {
  margin: 0 0 0.25rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: #9ca3af;
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

.student-form {
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

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  background: #111827;
  color: #f9fafb;
  font: inherit;
}

.field input::placeholder {
  color: #6b7280;
}

.field input:focus {
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

@media (max-width: 700px) {
  .student-form {
    grid-template-columns: 1fr;
  }
    .primary-button {
    width: 100%;
  }

.primary-button {
  grid-column: 1 / -1;
  justify-self: start;
  width: 100%;
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 0.5rem;
  background: #f9fafb;
  color: #111827;
  font-weight: 700;
  cursor: pointer;
}

.primary-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
}
</style>