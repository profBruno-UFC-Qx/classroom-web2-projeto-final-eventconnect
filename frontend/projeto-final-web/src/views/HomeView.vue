<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import { useUserStore } from '@/stores/userStore'
import { format, isBefore } from "date-fns"
import ToastManager from '@/components/ToastManager.vue'
import { toast } from 'vue-sonner'

const eventos = ref([])
const loading = ref(true)
const userStore = useUserStore()
const uploadHelper = useUpload()
const search = ref('')

const filteredEventos = computed(() => {
  return eventos.value.filter(evento => 
    evento.nome.toUpperCase().includes(search.value.toUpperCase()) || evento.categoria.nome.toUpperCase().includes(search.value.toUpperCase())
  )
})

onMounted(async () => {
  try {
    const { data } = await api.get('/eventos?populate=*')
    eventos.value = data.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const selectedEvento = ref(null)
const showModal = ref(false)
const showLoginModal = ref(false) 
const showConfirmModal = ref(false)

function abrirModal(evento) {
  selectedEvento.value = evento
  showModal.value = true
}

function fecharModal() {
  showModal.value = false
}

function abrirLoginModal() {
  showLoginModal.value = true
}

function abrirConfirmModal(evento) {
  selectedEvento.value = evento
  showConfirmModal.value = true
}

function fecharConfirmModal() {
  showConfirmModal.value = false
}

async function inscreverSe(evento) {
  if (userStore.isAuthenticated) {
    try {
      const { data } = await api.get(`/inscricaos`, {
        params: {
          filters: {
            evento: { id: evento.id },
            user: { id: userStore.user.id }
          }
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (data.data.length > 0) {
        toast.warning('Você já está inscrito neste evento.')
        return
      }

      abrirConfirmModal(evento)

    } catch (error) {
      console.error('Erro ao verificar a inscrição:', error.response?.data || error)
      toast.error('Erro ao verificar a inscrição.')
    }
  } else {
    abrirLoginModal()
  }
}

async function confirmarInscricao() {
  try {
    await api.post('/inscricaos', {
      data: {
        evento: { id: selectedEvento.value.id },
        user: { id: userStore.user.id }
      }
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    toast.success('Inscrição realizada com sucesso!')
  } catch (error) {
    console.error('Erro ao se inscrever no evento:', error.response?.data || error)
    toast.error('Erro ao se inscrever no evento.')
  } finally {
    fecharConfirmModal()
  }
}

</script>

<template>
  <main>
    <ToastManager />

    <div v-if="!loading" class="container mt-4">
      <h1 class="text-center mb-4">Eventos</h1>
      <div class="input-group mb-3">
        <input v-model="search" type="text" class="form-control" placeholder="Pesquisar eventos pela categoria ou pelo nome..." aria-label="Pesquisar eventos...">
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6" v-for="evento in filteredEventos" :key="evento.id">
          <div class="card mb-4">
            <img :src="uploadHelper(evento.imagem?.url)" class="img-fluid card-img-top" alt="Imagem do Evento" style="height: 18.75rem;object-fit: cover;object-position: center;">
            <div class="card-body d-flex flex-column justify-content-between" style="height: 250px;">
              <h5 class="card-title text-center fw-bold">{{ evento.nome }}</h5>
              <p class="card-text">{{ evento.descricao }}</p>
              <div>
                <p
                :class="{'text-danger': isBefore(new Date(evento.data), new Date())}" 
                class="card-text fs-5"
                >Data: {{ format(new Date(evento.data), 'dd/MM/yyyy HH:mm') }}</p>
                <p class="card-text fs-5">Categoria: <span class="badge text-bg-secondary">{{ evento.categoria?.nome }}</span></p>
                <p v-if="isBefore(new Date(evento.data), new Date())" class="text-danger fw-bold">Evento encerrado</p>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
              <button class="btn btn-primary" @click="abrirModal(evento)">Detalhes</button>
              <button v-if="userStore.isAuthenticated && userStore.role !== 'Admin' && !isBefore(new Date(evento.data), new Date())" class="btn btn-secondary" @click="inscreverSe(evento)">Inscrever-se</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog" @click.self="fecharModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedEvento.nome }}</h5>
            <button type="button" class="btn-close" @click="fecharModal"></button>
          </div>
          <div class="modal-body">
            <img :src="uploadHelper(selectedEvento.imagem?.url)" class="img-fluid mb-3" alt="Imagem do Evento">
            <p
            :class="{'text-danger': isBefore(new Date(selectedEvento.data), new Date())}" 
            ><strong>Data:</strong> {{ format(new Date(selectedEvento.data), 'dd/MM/yyyy HH:mm') }}</p>
            <p v-if="isBefore(new Date(selectedEvento.data), new Date())" class="text-danger fw-bold">Evento encerrado</p>
            <p><strong>Categoria:</strong> {{ selectedEvento.categoria.nome }}</p>
            <p><strong>Descrição:</strong> {{ selectedEvento.descricao }}</p>
            <p><strong>Endereço:</strong> {{ selectedEvento.endereco }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModal">Fechar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog" @click.self="fecharConfirmModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Inscrição</h5>
            <button type="button" class="btn-close" @click="fecharConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p>Deseja confirmar a inscrição no evento <strong>{{ selectedEvento.nome }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharConfirmModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="confirmarInscricao">Confirmar Inscrição</button>
          </div>
        </div>
      </div>
    </div>


  </main>
</template>


<style>
.modal-backdrop {
  display: none;
}
</style>
