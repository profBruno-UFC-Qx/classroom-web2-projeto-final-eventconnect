<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const isNavbarCollapsed = ref(true);
const isDropdownOpen = ref(false);

const toggleNavbar = () => {
  isNavbarCollapsed.value = !isNavbarCollapsed.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
  closeDropdown();
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">EventConnect</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNavbar"
        :class="{ collapsed: isNavbarCollapsed }"
        aria-controls="navbarNav"
        aria-expanded="!isNavbarCollapsed"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: !isNavbarCollapsed }" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink
              class="nav-link rounded"
              :class="{ active: route.path === '/' }"
              to="/"
            >HOME</RouterLink>
          </li>
          <li v-if="!userStore.isAuthenticated" class="nav-item">
            <RouterLink
              class="nav-link rounded"
              :class="{ active: route.path === '/login' }"
              to="/login"
            >LOGIN</RouterLink>
          </li>
          <li v-if="userStore.isAuthenticated && userStore.role !== 'Admin'" class="nav-item">
            <RouterLink
              class="nav-link rounded"
              :class="{ active: route.path === '/registrations' }"
              to="/registrations"
            >Minhas inscrições</RouterLink>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <li v-if="userStore.isAuthenticated" class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              role="button" 
              @click="toggleDropdown"
            >
              {{ userStore.username }}
            </a>
            <ul v-if="isDropdownOpen" class="dropdown-menu dropdown-menu-start dropdown-menu-dark show" @click="closeDropdown">
              <li v-if="userStore.role === 'Admin'">
                <RouterLink
                  class="dropdown-item"
                  :class="{ active: route.path === '/admin/eventos' }"
                  to="/admin/eventos"
                >Manter Eventos</RouterLink>
              </li>
              <li v-if="userStore.role === 'Admin'">
                <RouterLink
                  class="dropdown-item"
                  :class="{ active: route.path === '/admin/categorias' }"
                  to="/admin/categorias"
                >Manter Categorias</RouterLink>
              </li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">Sair</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-link.active {
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
}
/* Evitar overflow horizontal na página */
body, html {
  overflow-x: hidden;
}

/* Estilo para o dropdown */
.dropdown-menu {
  background-color: #343a40;
  position: absolute;
  right: 0; 
  left: auto; 
}

.dropdown-menu.show {
  display: block;
}

/* Certifica-se de que o dropdown não saia da tela */
.nav-item.dropdown {
  position: relative;
}

@media (max-width: 991px) {
  .dropdown-menu {
    left: 0;
  }
}
</style>
