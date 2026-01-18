<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { format, isBefore } from "date-fns"
import ToastManager from '@/components/ToastManager.vue'
import { toast } from 'vue-sonner'
import EventService from '@/services/Event/EventService'
import UserService from '@/services/User/UserService'
import CategoryService from '@/services/Category/CategoryService'
import InscriptionService from '@/services/Inscription/InscriptionService'

const eventos = ref([])
const loading = ref(true)
const userStore = useUserStore()
const search = ref('')
const categoryId = ref('')
const startDate = ref('')
const endDate = ref('')
const categorias = ref([])
const defaultImage = 'https://placehold.co/600x400?text=Sem+Imagem'
const page = ref(1)
const limit = ref(6)
const totalPages = ref(1)
const userSubscriptions = ref(new Set())

function handleImageError(event) {
  event.target.src = defaultImage
}

async function fetchEventos() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      search: search.value,
      categoryId: categoryId.value,
      startDate: startDate.value,
      endDate: endDate.value
    }
    const response = await EventService.getAllEvents(params)
    eventos.value = response.data
    totalPages.value = response.meta.totalPages
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  page.value = 1
  fetchEventos()
}

function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    fetchEventos()
  }
}

async function fetchUserSubscriptions() {
  if (userStore.isAuthenticated) {
    try {
      const response = await UserService.getUserProfile()
      const inscricoes = response.data?.inscricoes || []
      userSubscriptions.value = new Set(inscricoes.map(i => i.evento?.id))
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error)
    }
  }
}

onMounted(async () => {
  try {
    const catsResponse = await CategoryService.getAllCategories()
    categorias.value = catsResponse.data
    await fetchEventos()
    await fetchUserSubscriptions()
  } catch (error) {
    console.error(error)
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
    abrirConfirmModal(evento)
  } else {
    abrirLoginModal()
  }
}

async function confirmarInscricao() {
  try {
    await InscriptionService.createInscription(selectedEvento.value.id)
    toast.success('Inscrição realizada com sucesso!')
    userSubscriptions.value.add(selectedEvento.value.id)
  } catch (error) {
    console.error('Erro ao se inscrever no evento:', error.response?.data || error)
    toast.error('Erro ao se inscrever no evento.')
  } finally {
    fecharConfirmModal()
  }
}

</script>

<template>
  <main class="bg-light min-vh-100 pb-5">
    <ToastManager />

    <div class="bg-white border-bottom py-5 mb-4">
      <div class="container text-center">
        <h1 class="display-5 fw-bold text-dark">Descubra Eventos</h1>
        <p class="lead text-muted">Encontre as melhores experiências perto de você.</p>
      </div>
    </div>

    <div v-if="!loading" class="container">
      <div class="card border-0 shadow-sm mb-5">
        <div class="card-body p-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label class="form-label small fw-bold">O que você procura?</label>
              <input v-model="search" type="text" class="form-control" placeholder="Ex: Workshop de Vue.js" @keyup.enter="applyFilters">
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold">Categoria</label>
              <select v-model="categoryId" class="form-select">
                <option value="">Todas</option>
                <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold">Início</label>
              <input v-model="startDate" type="date" class="form-control">
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold">Fim</label>
              <input v-model="endDate" type="date" class="form-control">
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100 fw-bold py-2" @click="applyFilters">
                <i class="bi bi-search me-2"></i>Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="eventos.length === 0" class="text-center py-5">
        <div class="mb-3">
          <i class="bi bi-calendar-x text-muted" style="font-size: 4rem;"></i>
        </div>
        <h4 class="fw-bold text-muted">Nenhum evento encontrado</h4>
        <p class="text-muted">Tente ajustar os filtros para encontrar o que procura.</p>
      </div>

      <div v-else class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="evento in eventos" :key="evento.id">
          <div class="card h-100 border-0 shadow-sm hover-card">
            <div class="position-relative">
              <img :src="evento.imagem || defaultImage" @error="handleImageError" class="card-img-top custom-card-img" alt="Imagem do Evento">
              <span class="badge position-absolute top-0 end-0 m-3 p-2 shadow-sm" 
                    :class="isBefore(new Date(evento.data), new Date()) ? 'text-bg-danger' : 'text-bg-primary'">
                {{ evento.categoria?.nome }}
              </span>
            </div>
            
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold mb-3">{{ evento.nome }}</h5>
              <p class="card-text text-muted flex-grow-1 text-truncate-2">{{ evento.descricao }}</p>
              
              <div class="mt-3 border-top pt-3">
                <div class="d-flex align-items-center mb-2">
                  <span class="small" :class="isBefore(new Date(evento.data), new Date()) ? 'text-danger fw-bold' : 'text-muted'">
                    <i class="bi bi-calendar-event me-2"></i>
                    {{ format(new Date(evento.data), 'dd/MM/yyyy HH:mm') }}
                  </span>
                </div>
                <div v-if="isBefore(new Date(evento.data), new Date())" class="badge bg-danger-subtle text-danger border border-danger-subtle w-100 py-2">
                  Inscrições Encerradas
                </div>
              </div>
            </div>

            <div class="card-footer bg-transparent border-0 pb-3 d-flex gap-2">
              <button class="btn btn-outline-primary flex-grow-1" @click="abrirModal(evento)">Ver Detalhes</button>
              <div v-if="userSubscriptions.has(evento.id)" class="d-flex align-items-center justify-content-center flex-grow-1 text-success fw-bold border border-success rounded bg-success-subtle">
                <i class="bi bi-check-circle-fill me-2"></i> Inscrito
              </div>
              <button v-else-if="userStore.isAuthenticated && userStore.role !== 'Admin' && !isBefore(new Date(evento.data), new Date())" 
                      class="btn btn-primary flex-grow-1" 
                      @click="inscreverSe(evento)">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4 mb-5">
        <nav aria-label="Navegação de página">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="changePage(page - 1)" aria-label="Anterior">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="page-item disabled">
              <span class="page-link text-dark">Página {{ page }} de {{ totalPages }}</span>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="changePage(page + 1)" aria-label="Próximo">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    
    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center mt-5">
      <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
      <p class="text-muted">Buscando os melhores eventos...</p>
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
            <img :src="selectedEvento.imagem || defaultImage" @error="handleImageError" class="img-fluid mb-3" alt="Imagem do Evento">
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


<style scoped>
.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.custom-card-img {
  height: 220px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.modal.show.d-block {
  backdrop-filter: blur(4px);
}

.modal-content {
  border: none;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}

.form-label {
  color: #495057;
  margin-bottom: 0.25rem;
}
</style>    
