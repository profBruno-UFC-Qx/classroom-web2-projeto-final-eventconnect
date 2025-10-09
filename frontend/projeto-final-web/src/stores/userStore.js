import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {

  const user = ref({
    id: Number(localStorage.getItem('id')),
    username: localStorage.getItem('username') || "",
    email: localStorage.getItem('email') || "",
    role: {
      name: localStorage.getItem('role') || ""
    }
  })

  const jwt = ref(localStorage.getItem('jwt') || '')

  const role = computed(() => user.value.role.name)
  const username = computed(() => user.value.username)
  const isAuthenticated = computed(() => jwt.value !== "")
  const id = computed(() => user.value.id.toString())

  function authenticaded(authUser, token) {
    user.value = authUser
    jwt.value = token

    localStorage.setItem('username', authUser.username)
    localStorage.setItem('id', authUser.id.toString())
    localStorage.setItem('email', authUser.email)
    localStorage.setItem('role', authUser.role.name)
    localStorage.setItem('jwt', token)
  }

  function logout() {
    jwt.value = ""
    user.value = {}

    localStorage.clear()
  }

  return { user, username, jwt, role, id,  isAuthenticated, authenticaded, logout }
})
