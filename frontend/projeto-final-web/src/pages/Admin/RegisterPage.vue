<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError.js'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref(undefined)
const router = useRouter()

const formSubmitted = ref(false)

function isValidEmail(email) {
  return email.includes('@') && email.split('@')[1]?.includes('.')
}

async function register() {
  formSubmitted.value = true
  if (!username.value || !isValidEmail(email.value) || !password.value) {
    return
  }

  try {
    loading.value = true
    exception.value = undefined

    const { data } = await api.post('/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    })

    console.log(data)
    const { jwt, user } = data.data
    userStore.authenticaded(user, jwt)
    router.push('/')
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-6 card">
      <div class="card-body">
        <h5 class="card-title">Sign Up</h5>
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.error.message }}
        </div>
        <div v-if="loading" class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <form v-else @submit.prevent="register" novalidate>
          <div class="mb-3">
            <label for="usernameInput" class="form-label">Username:</label>
            <input
              type="text"
              class="form-control"
              id="usernameInput"
              v-model="username"
              placeholder="Escolha um nome de usuário"
              :class="{ 'is-invalid': formSubmitted && !username }"
              required
            />
            <div v-if="formSubmitted && !username" class="invalid-feedback">
              O nome de usuário é obrigatório.
            </div>
          </div>

          <div class="mb-3">
            <label for="emailInput" class="form-label">Email:</label>
            <input
              type="email"
              class="form-control"
              id="emailInput"
              v-model="email"
              placeholder="Insira seu email"
              :class="{ 'is-invalid': formSubmitted && !isValidEmail(email) }"
              required
            />
            <div v-if="formSubmitted && !isValidEmail(email)" class="invalid-feedback">
              Você deve informar um email válido.
            </div>
          </div>

          <div class="mb-3">
            <label for="passwordInput" class="form-label">Senha:</label>
            <input
              type="password"
              class="form-control"
              id="passwordInput"
              v-model="password"
              placeholder="Crie uma senha"
              :class="{ 'is-invalid': formSubmitted && !password }"
              required
            />
            <div v-if="formSubmitted && !password" class="invalid-feedback">
              A senha é um campo obrigatório.
            </div>
          </div>

          <div class="mb-3">
            <input type="submit" class="float-end btn btn-primary" value="Registrar" />
            <button type="button" @click="router.push('/login')" class="float-start btn btn-secondary">
              Voltar para Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
