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
  <main>
    <h1>Student Management</h1>

    <section>
      <h2>Search Student</h2>

      <form @submit.prevent="studentStore.searchStudent(searchName)">
        <label for="searchName">Student Name:</label>

        <input
          id="searchName"
          v-model="searchName"
          type="text"
          placeholder="Enter student name"
        />

        <button type="submit" :disabled="searchLoading">
          {{ searchLoading ? 'Searching...' : 'Search' }}
        </button>
      </form>

      <p v-if="searchError">{{ searchError }}</p>

      <div v-if="student">
        <h3>Student Found</h3>

        <p>Name: {{ student.name }}</p>
        <p>ID: {{ student.id }}</p>
        <p>Phone: {{ student.phone }}</p>
        <p>ZIP: {{ student.zip }}</p>

<button type="button" @click="studentStore.deleteStudent()">
  Delete Student
</button>
      </div>
    </section>

    <StudentForm />
  </main>
</template>