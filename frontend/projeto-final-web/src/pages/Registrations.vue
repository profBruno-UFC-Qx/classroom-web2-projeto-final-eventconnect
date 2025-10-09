<script setup>
import ToastManager from '@/components/ToastManager.vue'
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/api'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue-sonner'
import { format, isBefore } from "date-fns"

const userStore = useUserStore()
const inscricoes = ref([])
const loading = ref(true)
const selectedInscricao = ref(null)
const showConfirmDeleteModal = ref(false)

onMounted(async () => {
    try {
        const { data } = await api.get(`/inscricaos?filters[user][id][$eq]=${userStore.id}&populate[evento]=*&populate[user]=*`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        inscricoes.value = data.data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

function abrirConfirmDeleteModal(inscricao) {
    selectedInscricao.value = inscricao
    showConfirmDeleteModal.value = true
}

function fecharConfirmDeleteModal() {
    showConfirmDeleteModal.value = false
}

async function confirmarDelecaoInscricao() {
    try {
        await api.delete(`/inscricaos/${selectedInscricao.value.documentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        inscricoes.value = inscricoes.value.filter(inscricao => inscricao.documentId !== selectedInscricao.value.documentId)
        
        toast.success('Inscrição cancelada com sucesso!')
    } catch (error) {
        console.error('Erro ao cancelar a inscrição:', error)
        toast.error('Erro ao cancelar a inscrição.')
    } finally {
        fecharConfirmDeleteModal()
    }
}

const futureEvents = computed(() => {
    return inscricoes.value.filter(inscricao => 
        inscricao.evento && inscricao.evento.data && 
        !isBefore(new Date(inscricao.evento.data), new Date())
    )
})

const pastEvents = computed(() => {
    return inscricoes.value.filter(inscricao =>
        inscricao.evento && inscricao.evento.data && 
        isBefore(new Date(inscricao.evento.data), new Date()) 
    )
})
</script>

<template>
    <ToastManager />

    <div v-if="!loading && (futureEvents.length > 0 || pastEvents.length > 0)" class="row justify-content-center mt-5">
        <div v-for="inscricao in futureEvents" :key="inscricao.documentId" class="col-lg-4 col-md-6">
            <div class="card mb-4">
                <div class="card-body d-flex flex-column justify-content-between" style="height: 250px;">
                    <h5 class="card-title">{{ inscricao.evento.nome }}</h5>
                    <p class="card-text">{{ inscricao.evento.descricao }}</p>
                    <p class="card-text"><small class="text-muted">Data: {{ format(new Date(inscricao.evento.data), 'dd/MM/yyyy HH:mm') }}</small></p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <button class="btn btn-danger" @click="abrirConfirmDeleteModal(inscricao)">Cancelar inscrição</button>
                </div>
            </div>
        </div>

        <div v-for="inscricao in pastEvents" :key="inscricao.documentId" class="col-lg-4 col-md-6">
            <div class="card mb-4">
                <div class="card-body d-flex flex-column justify-content-between" style="height: 250px;">
                    <h5 class="card-title">{{ inscricao.evento.nome }}</h5>
                    <p class="card-text">{{ inscricao.evento.descricao }}</p>
                    <p class="text-danger">Evento encerrado</p>
                    <p class="card-text"><small class="text-muted">Data: {{ format(new Date(inscricao.evento.data), 'dd/MM/yyyy HH:mm') }}</small></p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="!loading && futureEvents.length === 0 && pastEvents.length === 0" class="col-12 card text-center w-100">
        <div class="card-body">
            <h5 class="card-title">Nenhuma inscrição encontrada</h5>
        </div>
        <div class="card-footer">
            <RouterLink to="/" class="btn btn-primary">Ver eventos</RouterLink>
        </div>
    </div>

    <div v-if="showConfirmDeleteModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog" @click.self="fecharConfirmDeleteModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Cancelamento de inscrição</h5>
                    <button type="button" class="btn-close" @click="fecharConfirmDeleteModal"></button>
                </div>
                <div class="modal-body">
                    <p>Deseja realmente cancelar sua inscrição no evento <strong>{{ selectedInscricao?.evento?.nome }}</strong>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="fecharConfirmDeleteModal">Cancelar</button>
                    <button type="button" class="btn btn-danger" @click="confirmarDelecaoInscricao">Confirmar cancelamento</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.modal-backdrop {
  display: none;
}

.card {
    max-width: 100%;
    margin: 0 auto;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-footer {
    display: flex;
    justify-content: space-between;
}
</style>
