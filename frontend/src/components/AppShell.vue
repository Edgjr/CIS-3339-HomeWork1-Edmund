<template>
  <div class="app-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">CAMPUS // COMMAND CENTER</p>
        <h1>Student Management System</h1>
      </div>

      <div class="status">
        <span class="status-dot"></span>
        SYSTEM ONLINE
      </div>
    </header>

    <div class="app-body">
      <aside class="sidebar">
        <p class="sidebar-label">OPERATIONS</p>

        <nav>
          <RouterLink to="/">Students</RouterLink>
          <RouterLink to="/courses">Courses</RouterLink>
          <RouterLink to="/enrollments">Enrollment</RouterLink>
        </nav>
      </aside>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #111827;
  color: #f9fafb;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #374151;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #9ca3af;
}

.topbar h1 {
  margin: 0;
  font-size: 1.5rem;
}

.status {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: #d1d5db;
}

.status-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.4rem;
  border-radius: 50%;
  background: #22c55e;
}

.app-body {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: calc(100vh - 100px);
}

.sidebar {
  padding: 1.5rem;
  border-right: 1px solid #374151;
}

.sidebar-label {
  margin: 0 0 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: #9ca3af;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar a {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #d1d5db;
  text-decoration: none;
}

.sidebar a:hover {
  background: #1f2937;
}

.sidebar a.router-link-active {
  background: #374151;
  color: #ffffff;
}

.content {
  padding: 2rem;
}

@media (max-width: 700px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .app-body {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: 0;
    border-bottom: 1px solid #374151;
  }

  .sidebar nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    padding: 1rem;
  }
}
</style>