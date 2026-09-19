<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import StudentForm from '../components/StudentForm.vue'
import { useStudentStore } from '../stores/studentStore'

const studentStore = useStudentStore()

const { student, searchError, searchLoading } = storeToRefs(studentStore)


const searchName = ref('')



</script>

<template>
  <main class="student-page">
    <div class="page-heading">
      <div>
        <p class="page-kicker">STUDENT OPERATIONS</p>
        <h1>Student Management</h1>
        <p class="page-description">
          Search, review, and manage student records.
        </p>
      </div>

      <div class="record-count">
        <span class="count-label">MODE</span>
        <strong>STUDENT</strong>
      </div>
    </div>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">LOOKUP</p>
          <h2>Search Student</h2>
        </div>
      </div>

      <form class="search-form" @submit.prevent="studentStore.searchStudent(searchName)">
        <div class="search-field">
          <label for="searchName">Student Name</label>
          <input
            id="searchName"
            v-model="searchName"
            type="text"
            placeholder="Enter student name"
          />
        </div>

        <button
          class="primary-button"
          type="submit"
          :disabled="searchLoading"
        >
          {{ searchLoading ? 'Searching...' : 'Search Student' }}
        </button>
      </form>

      <p
        v-if="searchError"
        class="message message-error"
        role="alert"
      >
        {{ searchError }}
      </p>

      <div v-if="student" class="student-result">
        <div class="result-header">
          <div>
            <p class="panel-kicker">MATCH FOUND</p>
            <h3>{{ student.name }}</h3>
          </div>

          <span class="status-badge">ACTIVE</span>
        </div>

        <div class="student-details">
          <div>
            <span class="detail-label">STUDENT ID</span>
            <strong>{{ student.id }}</strong>
          </div>

          <div>
            <span class="detail-label">PHONE</span>
            <strong>{{ student.phone }}</strong>
          </div>

          <div>
            <span class="detail-label">ZIP CODE</span>
            <strong>{{ student.zip }}</strong>
          </div>
        </div>

        <button
          class="danger-button"
          type="button"
          @click="studentStore.deleteStudent()"
        >
          Delete Student
        </button>
      </div>
    </section>

    <StudentForm />
  </main>
</template>

<style scoped>
.student-page {
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
  min-width: 100px;
  padding: 0.75rem 1rem;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  text-align: right;
}

.count-label {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: #6b7280;
}

.record-count strong {
  font-size: 0.8rem;
}

.panel {
  margin-bottom: 1.5rem;
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

.search-form {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.search-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.search-field label {
  font-size: 0.85rem;
  color: #d1d5db;
}

.search-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  background: #111827;
  color: #f9fafb;
  font: inherit;
}

.search-field input:focus {
  outline: 2px solid #6b7280;
  outline-offset: 1px;
}

.primary-button,
.danger-button {
  padding: 0.75rem 1.1rem;
  border: 0;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
}

.primary-button {
  background: #f9fafb;
  color: #111827;
}

.primary-button:hover {
  background: #e5e7eb;
}

.primary-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.student-result {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border: 1px solid #4b5563;
  border-radius: 0.65rem;
  background: #111827;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.result-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.status-badge {
  padding: 0.35rem 0.6rem;
  border: 1px solid #166534;
  border-radius: 999px;
  color: #bbf7d0;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}

.student-details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.student-details > div {
  padding: 0.9rem;
  border: 1px solid #374151;
  border-radius: 0.5rem;
}

.detail-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #6b7280;
}

.danger-button {
  background: #7f1d1d;
  color: #fee2e2;
}

.danger-button:hover {
  background: #991b1b;
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

@media (max-width: 700px) {
  .page-heading,
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .student-details {
    grid-template-columns: 1fr;
  }

  .record-count {
    text-align: left;
  }

  .primary-button,
  .danger-button {
    width: 100%;
  }
}
</style>