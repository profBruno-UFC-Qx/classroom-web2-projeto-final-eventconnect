<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/'
import * as bootstrap from 'bootstrap'

const loading = ref(true)
const categorias = ref([])
const page = ref(1)
const limit = ref(10)
const totalPages = ref(1)
const categoriaToDelete = ref({})
const categoriaToEdit = ref({})
const nomeCategoria = ref('')
const formSubmitted = ref(false)

const fetchCategorias = async () => {
    loading.value = true
    try {
        const { data } = await api.get('/categorias', {
            params: {
                page: page.value,
                limit: limit.value
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        categorias.value = data.data
        if (data.meta) {
            totalPages.value = data.meta.totalPages
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchCategorias()

    const createModalEl = document.getElementById('createCategoriaModal')
    createModalEl.addEventListener('hidden.bs.modal', () => {
        if (!categoriaToEdit.value || !categoriaToEdit.value.id) {
            nomeCategoria.value = ''
            formSubmitted.value = false
        }
    })
})

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage
        fetchCategorias()
    }
}

const openDeleteModal = (categoria) => {
    categoriaToDelete.value = categoria
}

const deleteEvent = async (id) => {
    try {
        await api.delete(`/categorias/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        if (categorias.value.length === 1 && page.value > 1) {
            page.value--
        }
        await fetchCategorias()
    } catch (error) {
        console.error('Erro ao deletar categoria:', error)
    }
}

const openCreateModal = () => {
    nomeCategoria.value = ''
    formSubmitted.value = false
    categoriaToEdit.value = {}
}

const openEditModal = (categoria) => {
    categoriaToEdit.value = categoria
    nomeCategoria.value = categoria.nome
}

const submitForm = async (id) => {
    formSubmitted.value = true
    if (!nomeCategoria.value) return

    const modal = bootstrap.Modal.getInstance(document.getElementById('createCategoriaModal'))

    try {
        if (id) {
            await api.put(`/categorias/${id}`, {
                data: { nome: nomeCategoria.value }
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            })
        } else {
            await api.post('/categorias', {
                nome: nomeCategoria.value
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            })
        }
        await fetchCategorias()
        modal.hide()
    } catch (error) {
        console.error('Erro ao processar categoria:', error)
    }
}
</script>

<template>
    <div class="container py-5">
        <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center mt-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted">Carregando categorias...</p>
        </div>

        <div v-if="categorias.length > 0 && !loading" class="animate__animated animate__fadeIn">
            <div class="d-flex align-items-center justify-content-between mb-4">
                <h2 class="fw-bold m-0 text-dark">Categorias</h2>
                <button class="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2" 
                    data-bs-toggle="modal" data-bs-target="#createCategoriaModal" @click="openCreateModal()">
                    <i class="bi bi-tag-fill"></i> Nova Categoria
                </button>
            </div>

            <div class="card shadow-sm border-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4" style="width: 80px;">#</th>
                                <th>Nome da Categoria</th>
                                <th class="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(categoria, index) in categorias" :key="categoria.id">
                                <td class="ps-4 text-muted">{{ index + 1 }}</td>
                                <td>
                                    <span class="fw-semibold text-dark">{{ categoria.nome }}</span>
                                </td>
                                <td class="text-end pe-4">
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-warning" @click="openEditModal(categoria)"
                                            data-bs-toggle="modal" data-bs-target="#createCategoriaModal">
                                            Editar
                                        </button>
                                        <button class="btn btn-outline-danger" data-bs-toggle="modal" 
                                            data-bs-target="#deleteCategoriaModal" @click="openDeleteModal(categoria)">
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
                    <i class="bi bi-tags text-muted" style="font-size: 4rem;"></i>
                </div>
                <h4 class="fw-bold">Nenhuma categoria encontrada</h4>
                <p class="text-muted">As categorias ajudam a organizar seus eventos por tipo ou tema.</p>
                <button class="btn btn-primary px-4 mt-3" data-bs-toggle="modal" 
                    data-bs-target="#createCategoriaModal" @click="openCreateModal()">
                    Cadastrar minha primeira categoria
                </button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="createCategoriaModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-bottom-0 pt-4 px-4">
                    <h5 class="modal-title fw-bold">{{ categoriaToEdit.id ? 'Editar Categoria' : 'Nova Categoria' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body px-4">
                    <form @submit.prevent>
                        <div class="mb-3">
                            <label for="categoriaNome" class="form-label small fw-bold text-uppercase text-muted">Nome da Categoria</label>
                            <input type="text" class="form-control form-control-lg" id="categoriaNome"
                                placeholder="Ex: Workshop, Show, Palestra..." v-model="nomeCategoria"
                                :class="{ 'is-invalid': formSubmitted && !nomeCategoria }">
                            <div v-if="formSubmitted && !nomeCategoria" class="invalid-feedback">
                                Por favor, informe um nome para a categoria.
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0 pb-4 px-4">
                    <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary px-4" @click="submitForm(categoriaToEdit.id)">
                        {{ categoriaToEdit.id ? 'Salvar Alterações' : 'Confirmar Cadastro' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="deleteCategoriaModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-body text-center p-4">
                    <div class="mb-3">
                        <i class="bi bi-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                    </div>
                    <h5 class="fw-bold">Excluir Categoria?</h5>
                    <p class="text-muted small">
                        Você está prestes a excluir <strong>{{ categoriaToDelete.nome }}</strong>. 
                        Eventos vinculados a esta categoria podem ser afetados.
                    </p>
                    <div class="d-flex gap-2 mt-4">
                        <button type="button" class="btn btn-light w-100" data-bs-dismiss="modal">Voltar</button>
                        <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal" @click="deleteEvent(categoriaToDelete.id)">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 900px;
}

.table hover tbody tr {
    transition: all 0.2s;
}

.form-control-lg {
    font-size: 1rem;
    padding: 0.75rem 1rem;
}

.card {
    overflow: hidden;
}
</style>