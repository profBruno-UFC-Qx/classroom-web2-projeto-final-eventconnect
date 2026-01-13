<script setup>
import { ref, onMounted} from 'vue'
import { api } from '@/api/'
import * as bootstrap from 'bootstrap'

const loading = ref(true)
const categorias = ref([])
const categoriaToDelete = ref({})
const categoriaToEdit = ref({})
const nomeCategoria = ref('')
const formSubmitted = ref(false)

onMounted(async () => {
    try {
        const { data } = await api.get('/categorias', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        categorias.value = data.data
        console.log(data.data)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }

    const createModalEl = document.getElementById('createCategoriaModal')

    createModalEl.addEventListener('hidden.bs.modal', () => {
        console.log('Modal foi fechada!')
        if (!categoriaToEdit.value || !categoriaToEdit.value.id) {
            nomeCategoria.value = ''
            formSubmitted.value = false
        }

    })
})

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
        categorias.value = categorias.value.filter(evento => evento.id !== id)
    } catch (error) {
        console.error('Erro ao deletar o evento:', error)
    }
}

const openCreateModal = () => {
    nomeCategoria.value = ''
    formSubmitted.value = false
    categoriaToEdit.value = {}
}

const openEditModal = (categoria) => {
    console.log('Editar categoria:', categoria)
    categoriaToEdit.value = categoria
    nomeCategoria.value = categoria.nome
}

const submitForm = async (id) => {
    formSubmitted.value = true
    if (!nomeCategoria.value) {
        return
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('createCategoriaModal'))

    if (id) {
        console.log('Editar categoria', nomeCategoria.value)
        try {
            const { data } = await api.put(`/categorias/${id}`, {
                data: {
                    nome: nomeCategoria.value
                }
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            })
            console.log(data)
            const index = categorias.value.findIndex(categoria => categoria.id === id)
            categorias.value[index] = data.data
            modal.hide()
        } catch (error) {
            console.error('Erro ao editar a categoria:', error)
        }
    } else {
        console.log('Criar categoria', nomeCategoria.value)

        try {
            const categoria = await api.post('/categorias', {
                nome: nomeCategoria.value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
            })
            console.log(categoria.data.data)
            categorias.value.push(categoria.data.data)
            modal.hide()
        } catch (error) {
            console.error('Erro ao criar a categoria:', error)
        }
    }
}
</script>

<template>

    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div  class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-if="categorias.length > 0 && !loading" class="mt-5">
        <div class="d-flex align-items-center justify-content-end">
            <button
            class="btn btn-primary me-4"
            data-bs-toggle="modal"
            data-bs-target="#createCategoriaModal"
            @click="openCreateModal()"
            >Cadastrar categoria</button>
        </div>
        <table class="table table-hover table-sm mx-auto">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col"> </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(categoria, index) in categorias" :key="categoria.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ categoria.nome }}</td>
                    <td class="text-end">
                        <button class="btn btn-warning btn-sm me-2" @click="openEditModal(categoria)"
                        data-bs-toggle="modal" data-bs-target="#createCategoriaModal"
                        >Editar</button>
                        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteCategoriaModal" @click="openDeleteModal(categoria)">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div v-else-if="!loading">
        <div class="card text-center mx-auto mt-5" style="max-width: 60%;">
            <div class="card-body">
                <h5 class="card-title">Nenhuma categoria encontrada</h5>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createCategoriaModal" @click="openCreateModal()">Cadastrar categoria</button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="createCategoriaModal" tabindex="-1" aria-labelledby="createCategoriaModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createCategoriaModalLabel">{{ categoriaToEdit.id ? 'Editar categoria' : 'Cadastrar categoria' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body
                ">
                    <form>
                        <div class="mb-3">
                            <label for="categoriaNome" class="form-label
                            ">Nome</label>
                            <input
                            type="text"
                            class="form-control"
                            id="categoriaNome"
                            placeholder="Digite o nome da categoria..."
                            v-model="nomeCategoria"
                            :class="{ 'is-invalid': formSubmitted && !nomeCategoria }"
                            >
                            <div v-if="formSubmitted && !nomeCategoria" class="invalid-feedback">
                                O nome da categoria é obrigatório.
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button v-if="!categoriaToEdit.id" type="button" class="btn btn-primary" @click="submitForm()">Cadastrar</button>
                    <button v-if="categoriaToEdit.id" type="button" class="btn btn-primary" @click="submitForm(categoriaToEdit.id)">Salvar alterações</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="deleteCategoriaModal" tabindex="-1" aria-labelledby="deleteCategoriaModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteCategoriaModalLabel">Excluir categoria</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body
                ">
                    <p>Tem certeza que deseja excluir a categoria?</p>
                    <p><strong>Nome:</strong> {{ categoriaToDelete.nome }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteEvent(categoriaToDelete.id)">Excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>
