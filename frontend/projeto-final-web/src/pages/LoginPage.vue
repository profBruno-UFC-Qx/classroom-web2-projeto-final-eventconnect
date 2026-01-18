<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError.js'
import ToastManager from '@/components/ToastManager.vue'
import { toast } from 'vue-sonner'
import AuthService from '@/services/Auth/AuthService'

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref(undefined)
const router = useRouter()
const userStore = useUserStore()

const formSubmitted = ref(false)

function isValidEmail(email) {
  return email.includes('@') && email.split('@')[1]?.includes('.')
}

async function authenticate() {
  formSubmitted.value = true
  if (!isValidEmail(identifier.value) || !password.value) {
    toast.error('Email ou senha inválidos')
    return
  }

  try {
    loading.value = true
    exception.value = undefined
    const response = await AuthService.login(identifier.value, password.value)
    const { jwt, user } = response.data

    userStore.authenticaded(user, jwt)

    router.push('/')
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      toast.error(e.response?.data?.error?.message || 'Erro de autenticação')
      exception.value = e.response?.data
      return
    }
    toast.error('Erro inesperado ao autenticar')
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <ToastManager />

  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-6 card">
        <div class="card-body">
          <h5 class="card-title">Sign In</h5>
          <div v-if="loading" class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <form v-else @submit.prevent="authenticate" novalidate>
            <div class="mb-3">
              <label for="emailInput" class="form-label">Email:</label>
              <input
                type="email"
                class="form-control"
                id="emailInput"
                placeholder="mail@mail.com"
                v-model="identifier"
                :class="{ 'is-invalid': formSubmitted && !isValidEmail(identifier) }"
                required
              />
              <div v-if="formSubmitted && !isValidEmail(identifier)" class="invalid-feedback">
                Você deve informar um email válido.
              </div>
            </div>
            <div class="mb-3">
              <label for="passwordInput" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="passwordInput"
                placeholder="********"
                v-model="password"
                :class="{ 'is-invalid': formSubmitted && !password }"
                required
              />
              <div v-if="formSubmitted && !password" class="invalid-feedback">
                A senha é um campo obrigatório.
              </div>
            </div>
            <div class="mb-3">
              <input type="submit" class="float-end btn btn-primary" value="Enviar" />
            </div>
          </form>
          <div class="mt-3">
            <button class="btn btn-secondary" @click="goToRegister">Registrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
