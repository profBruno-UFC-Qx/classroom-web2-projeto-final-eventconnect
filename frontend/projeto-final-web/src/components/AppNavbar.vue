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
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top custom-navbar">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold fs-4" to="/">
        <span class="text-primary">Event</span>Connect
      </RouterLink>

      <button
        class="navbar-toggler border-0"
        type="button"
        @click="toggleNavbar"
        aria-controls="navbarNav"
        :aria-expanded="!isNavbarCollapsed"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: !isNavbarCollapsed }" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li class="nav-item">
            <RouterLink
              class="nav-link custom-link"
              :class="{ active: route.path === '/' }"
              to="/"
            >HOME</RouterLink>
          </li>
          <li v-if="userStore.isAuthenticated && userStore.role !== 'Admin'" class="nav-item">
            <RouterLink
              class="nav-link custom-link"
              :class="{ active: route.path === '/registrations' }"
              to="/registrations"
            >MINHAS INSCRIÇÕES</RouterLink>
          </li>
        </ul>

        <div class="navbar-nav ms-auto align-items-lg-center">
          <li v-if="!userStore.isAuthenticated" class="nav-item">
            <RouterLink
              class="btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow-sm"
              to="/login"
            >ENTRAR</RouterLink>
          </li>

          <li v-else class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle user-dropdown d-flex align-items-center" 
              href="#" 
              role="button" 
              @click.prevent="toggleDropdown"
            >
              <div class="avatar-circle me-2">
                {{ userStore.username.charAt(0).toUpperCase() }}
              </div>
              <span class="fw-medium">{{ userStore.username }}</span>
            </a>
            
            <ul v-if="isDropdownOpen" class="dropdown-menu dropdown-menu-end show shadow-lg border-0 animate slideIn" @click="closeDropdown">
              <li class="dropdown-header text-uppercase small fw-bold">Menu</li>
              <li v-if="userStore.role === 'Admin'">
                <RouterLink class="dropdown-item" to="/admin/eventos">
                  <i class="bi bi-calendar-check me-2"></i>Manter Eventos
                </RouterLink>
              </li>
              <li v-if="userStore.role === 'Admin'">
                <RouterLink class="dropdown-item" to="/admin/categorias">
                  <i class="bi bi-tags me-2"></i>Manter Categorias
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger d-flex align-items-center" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Sair
                </button>
              </li>
            </ul>
          </li>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.custom-navbar {
  background-color: rgba(33, 37, 41, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.8rem 0;
  transition: all 0.3s ease;
  z-index: 1030;
}

.custom-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75) !important;
  margin: 0 5px;
  padding: 8px 15px !important;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-link:hover {
  color: #fff !important;
}

.custom-link.active {
  color: #fff !important;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.dropdown-menu {
  border-radius: 12px;
  padding: 10px;
  min-width: 200px;
  background-color: #212529;
  margin-top: 15px !important;
}

.dropdown-item {
  border-radius: 6px;
  padding: 8px 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.dropdown-header {
  color: #6c757d;
  font-size: 0.7rem;
}

.animate {
  animation-duration: 0.2s;
  animation-fill-mode: both;
}

@keyframes slideIn {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@media (max-width: 991px) {
  .navbar-collapse {
    background-color: #212529;
    padding: 20px;
    border-radius: 12px;
    margin-top: 15px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
  
  .custom-link {
    margin: 5px 0;
  }
  
  .dropdown-menu {
    border: 1px solid rgba(255,255,255,0.1);
    margin-top: 5px !important;
  }
}
</style>