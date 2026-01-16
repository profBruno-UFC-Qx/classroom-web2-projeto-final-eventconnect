<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/'
import * as bootstrap from 'bootstrap'
import ToastManager from '@/components/ToastManager.vue'
import { toast } from 'vue-sonner'
import { format } from "date-fns"

const defaultImage = 'https://placehold.co/600x400?text=Sem+Imagem'

function handleImageError(event) {
  event.target.src = defaultImage
}

const loading = ref(true)
const eventos = ref([])
const page = ref(1)
const limit = ref(10)
const totalPages = ref(1)
const eventoToDelete = ref({})
const eventoToEdit = ref({})

const imagem = ref('')
const nome = ref('')
const descricao = ref('')
const endereco = ref('')
const dataEvento = ref('')
const formSubmitted = ref(false)
const categorias = ref([])
const categoriaSelecionada = ref('')
const previewImageUrl = ref(null);

const fetchEventos = async () => {
    loading.value = true
    try {
        const { data } = await api.get('/eventos', {
            params: {
                page: page.value,
                limit: limit.value
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        })
        eventos.value = data.data
        if (data.meta) {
            totalPages.value = data.meta.totalPages
        }
    } catch (error) {
        console.error(error)
        toast.error('Erro ao carregar eventos.')
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchEventos()
    try {
        const { data: categoriasData } = await api.get('/categorias', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        })
        categorias.value = categoriasData.data
    } catch (error) {
        console.error(error)
    }

    const createModalEl = document.getElementById('createEventoModal')
    createModalEl.addEventListener('hidden.bs.modal', () => {
        if (!eventoToEdit.value || !eventoToEdit.value.id) {
            resetForm()
        }
    })
})

const resetForm = () => {
    nome.value = ''
    descricao.value = ''
    endereco.value = ''
    dataEvento.value = ''
    imagem.value = ''
    previewImageUrl.value = null
    categoriaSelecionada.value = ''
    formSubmitted.value = false
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage
        fetchEventos()
    }
}

const openDeleteModal = (evento) => {
    eventoToDelete.value = evento
}

const deleteEvent = async (id) => {
    try {
        await api.delete(`/eventos/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        toast.success('Evento excluído com sucesso!')
        if (eventos.value.length === 1 && page.value > 1) {
            page.value--
        }
        await fetchEventos()
    } catch (error) {
        toast.error('Erro ao excluir o evento.')
    }
};

const openCreateModal = () => {
    resetForm()
    eventoToEdit.value = {}
}

const openEditModal = (evento) => {
    eventoToEdit.value = evento
    nome.value = evento.nome
    descricao.value = evento.descricao
    endereco.value = evento.endereco
    dataEvento.value = format(new Date(evento.data), "yyyy-MM-dd'T'HH:mm")
    categoriaSelecionada.value = evento.categoria.id
    imagem.value = evento.imagem || '';
}

const submitForm = async (id) => {
    formSubmitted.value = true;
    if (!nome.value || !descricao.value || !endereco.value || !dataEvento.value || !categoriaSelecionada.value || !imagem.value) {
        return;
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('createEventoModal'))
    const payload = {
        nome: nome.value,
        descricao: descricao.value,
        endereco: endereco.value,
        data: dataEvento.value,
        categoriaId: categoriaSelecionada.value,
        imagem: imagem.value
    }

    try {
        if (id) {
            await api.put(`/eventos/${id}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
            toast.success('Evento atualizado!')
        } else {
            await api.post('/eventos', payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
            toast.success('Evento criado!')
        }

        await fetchEventos()
        modal.hide()
    } catch (error) {
        toast.error('Ocorreu um erro na operação.')
    }
}
</script>

<template>
    <ToastManager />

    <div class="container py-5">
        <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center mt-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted">Carregando eventos...</p>
        </div>

        <div v-if="eventos.length > 0 && !loading" class="animate__animated animate__fadeIn">
            <div class="d-flex align-items-center justify-content-between mb-4">
                <h2 class="fw-bold m-0">Gerenciar Eventos</h2>
                <button class="btn btn-primary shadow-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#createEventoModal" @click="openCreateModal()">
                    <i class="bi bi-plus-lg"></i> Novo Evento
                </button>
            </div>

            <div class="card shadow-sm border-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">#</th>
                                <th class="d-none d-md-table-cell">Imagem</th>
                                <th>Evento</th>
                                <th class="d-none d-md-table-cell">Endereço</th>
                                <th>Data</th>
                                <th class="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(evento, index) in eventos" :key="evento.id">
                                <td class="ps-4 text-muted">{{ index + 1 }}</td>
                                <td class="d-none d-md-table-cell">
                                    <img :src="evento.imagem || defaultImage" @error="handleImageError" alt="Imagem do Evento" class="rounded object-fit-cover shadow-sm" style="width: 80px; height: 60px;">
                                </td>
                                <td>
                                    <div class="fw-bold text-dark">{{ evento.nome }}</div>
                                    <small class="badge bg-light text-primary border">{{ evento.categoria.nome }}</small>
                                </td>
                                <td class="d-none d-md-table-cell text-muted small">{{ evento.endereco }}</td>
                                <td>
                                    <div class="small fw-semibold">{{ new Date(evento.data).toLocaleDateString() }}</div>
                                    <div class="text-muted" style="font-size: 0.75rem;">{{ new Date(evento.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</div>
                                </td>
                                <td class="text-end pe-4">
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-warning" @click="openEditModal(evento)" data-bs-toggle="modal" data-bs-target="#createEventoModal">
                                            Editar
                                        </button>
                                        <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteEventoModal" @click="openDeleteModal(evento)">
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
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

        <div v-else-if="!loading" class="text-center py-5">
            <div class="card border-0 shadow-sm mx-auto p-5" style="max-width: 500px;">
                <div class="mb-4">
                    <i class="bi bi-calendar-x text-muted" style="font-size: 4rem;"></i>
                </div>
                <h4 class="fw-bold">Nenhum evento encontrado</h4>
                <p class="text-muted">Comece criando o seu primeiro evento agora mesmo.</p>
                <button class="btn btn-primary px-4 mt-3" data-bs-toggle="modal" data-bs-target="#createEventoModal" @click="openCreateModal()">
                    Cadastrar evento
                </button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="createEventoModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-bottom-0 pt-4 px-4">
                    <h5 class="modal-title fw-bold">{{ eventoToEdit.id ? 'Editar Evento' : 'Novo Evento' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body px-4">
                    <form @submit.prevent>
                        <div class="mb-4 text-center">
                            <img :src="imagem || defaultImage" @error="handleImageError" class="card-img-top custom-card-img" alt="Imagem do Evento">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">URL da Imagem</label>
                            <input type="text" v-model="imagem" class="form-control form-control-sm" :class="{ 'is-invalid': formSubmitted && !imagem }" placeholder="https://...">
                            <div class="invalid-feedback">A imagem é obrigatória.</div>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-12">
                                <label class="form-label small fw-bold">Nome do Evento</label>
                                <input type="text" v-model="nome" class="form-control" :class="{ 'is-invalid': formSubmitted && !nome }">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label small fw-bold">Descrição</label>
                                <textarea v-model="descricao" class="form-control" rows="2" :class="{ 'is-invalid': formSubmitted && !descricao }"></textarea>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Endereço</label>
                            <input type="text" v-model="endereco" class="form-control" :class="{ 'is-invalid': formSubmitted && !endereco }">
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Data e Hora</label>
                                <input type="datetime-local" v-model="dataEvento" class="form-control" :class="{ 'is-invalid': formSubmitted && !dataEvento }">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Categoria</label>
                                <select v-model="categoriaSelecionada" class="form-select" :class="{ 'is-invalid': formSubmitted && !categoriaSelecionada }">
                                    <option value="" disabled>Escolha...</option>
                                    <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0 pb-4 px-4">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary px-4" @click="submitForm(eventoToEdit.id)">
                        {{ eventoToEdit.id ? 'Salvar Alterações' : 'Criar Evento' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="deleteEventoModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-body text-center p-4">
                    <i class="bi bi-exclamation-triangle text-danger mb-3" style="font-size: 2.5rem;"></i>
                    <h5 class="fw-bold">Excluir Evento?</h5>
                    <p class="text-muted small">Tem certeza que deseja excluir <strong>{{ eventoToDelete.nome }}</strong>? Esta ação não pode ser desfeita.</p>
                    <div class="d-flex gap-2 mt-4">
                        <button type="button" class="btn btn-light w-100" data-bs-dismiss="modal">Não</button>
                        <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal" @click="deleteEvent(eventoToDelete.id)">Sim, excluir</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table hover tbody tr {
    transition: background-color 0.2s ease;
}

.object-fit-cover {
    object-fit: cover;
}

.form-control:focus, .form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
    border-color: #86b7fe;
}

.custom-card-img {
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}
</style>