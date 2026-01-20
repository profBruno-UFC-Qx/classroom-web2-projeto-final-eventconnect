import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: Number(localStorage.getItem('id')) || 0,
    username: localStorage.getItem('username') || "",
    email: localStorage.getItem('email') || "",
    role: { name: localStorage.getItem('role') || "" }
  })

  const jwt = ref(localStorage.getItem('jwt') || '')

  const role = computed(() => user.value?.role?.name || "")
  const username = computed(() => user.value?.username || "")
  const isAuthenticated = computed(() => jwt.value !== "")
  const id = computed(() => (user.value?.id ?? 0).toString())

  function authenticaded(authUser, token) {
    const roleName = authUser?.role
    user.value = {
      id: authUser?.id ?? 0,
      username: authUser?.username ?? "",
      email: authUser?.email ?? "",
      role: { name: roleName },
    }

    jwt.value = token || ""

    localStorage.setItem('username', user.value.username)
    localStorage.setItem('id', user.value.id.toString())
    localStorage.setItem('email', user.value.email)
    localStorage.setItem('role', roleName)
    localStorage.setItem('jwt', jwt.value)
  }

  function logout() {
    jwt.value = ""
    user.value = { id: 0, username: "", email: "", role: { name: "" } }
    localStorage.clear()
  }

  return { user, username, jwt, role, id, isAuthenticated, authenticaded, logout }
})