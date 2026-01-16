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
        const { data } = await api.get(`/inscricoes?filters[user][id][$eq]=${userStore.id}&populate[evento]=*&populate[user]=*`, {
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
        await api.delete(`/inscricoes/${selectedInscricao.value?.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        inscricoes.value = inscricoes.value.filter(inscricao => inscricao?.id !== selectedInscricao.value?.id)
        toast.success('Inscrição cancelada com sucesso!')
    } catch (error) {
        toast.error('Erro ao cancelar a inscrição.')
    } finally {
        fecharConfirmDeleteModal()
    }
}

const futureEvents = computed(() => {
    return inscricoes.value.filter(inscricao =>
            inscricao?.evento?.data &&
            !isBefore(new Date(inscricao.evento.data), new Date())
        )
        .slice()
        .sort((a, b) => new Date(a.evento.data) - new Date(b.evento.data))
})

const pastEvents = computed(() => {
    return inscricoes.value.filter(inscricao =>
            inscricao?.evento?.data &&
            isBefore(new Date(inscricao.evento.data), new Date())
        )
        .slice()
        .sort((a, b) => new Date(b.evento.data) - new Date(a.evento.data))
})
</script>

<template>
    <ToastManager />

    <div class="container py-5">
        <div class="d-flex align-items-center justify-content-between mb-5">
            <div>
                <h2 class="fw-bold mb-1">Minhas Inscrições</h2>
                <p class="text-muted">Gerencie sua participação nos eventos</p>
            </div>
            <RouterLink to="/" class="btn btn-outline-primary rounded-pill px-4">
                Explorar mais eventos
            </RouterLink>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else>
            <section v-if="futureEvents.length > 0" class="mb-5">
                <h5 class="section-title mb-4">Próximos Eventos</h5>
                <div class="row g-4">
                    <div v-for="inscricao in futureEvents" :key="inscricao?.id" class="col-lg-4 col-md-6">
                        <div class="card h-100 border-0 shadow-sm hover-card">
                            <div class="card-body p-4 d-flex flex-column">
                                <div class="mb-3">
                                    <span class="badge bg-primary-subtle text-primary rounded-pill px-3">Confirmado</span>
                                </div>
                                <h5 class="fw-bold mb-2">{{ inscricao.evento.nome }}</h5>
                                <p class="text-muted small mb-4 flex-grow-1 text-truncate-2">
                                    {{ inscricao.evento.descricao }}
                                </p>
                                <div class="mt-auto pt-3 border-top">
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="bi bi-calendar3 me-2 text-primary"></i>
                                        <span class="small fw-semibold">{{ format(new Date(inscricao.evento.data), 'dd/MM/yyyy') }}</span>
                                    </div>
                                    <div class="d-flex align-items-center mb-4">
                                        <i class="bi bi-clock me-2 text-primary"></i>
                                        <span class="small fw-semibold">{{ format(new Date(inscricao.evento.data), 'HH:mm') }}</span>
                                    </div>
                                    <button
                                        type="button"
                                        class="btn btn-light text-danger w-100 fw-bold border-0"
                                        @click.stop="abrirConfirmDeleteModal(inscricao)"
                                    >
                                        Cancelar Inscrição
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="pastEvents.length > 0">
                <h5 class="section-title mb-4 text-muted">Histórico de Eventos</h5>
                <div class="row g-4">
                    <div v-for="inscricao in pastEvents" :key="inscricao?.id" class="col-lg-4 col-md-6">
                        <div class="card h-100 border-0 shadow-sm bg-light opacity-75">
                            <div class="card-body p-4 d-flex flex-column">
                                <div class="mb-3">
                                    <span class="badge bg-secondary-subtle text-secondary rounded-pill px-3">Encerrado</span>
                                </div>
                                <h5 class="fw-bold mb-2 text-muted">{{ inscricao.evento.nome }}</h5>
                                <p class="text-muted small mb-3 flex-grow-1">{{ inscricao.evento.descricao }}</p>
                                <div class="mt-auto pt-2 border-top">
                                    <small class="text-muted fw-bold">Realizado em {{ format(new Date(inscricao.evento.data), 'dd/MM/yyyy') }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div v-if="futureEvents.length === 0 && pastEvents.length === 0" class="text-center py-5">
                <div class="card border-0 shadow-sm p-5 mx-auto" style="max-width: 500px;">
                    <div class="mb-4 text-muted opacity-50">
                        <i class="bi bi-ticket-perforated" style="font-size: 5rem;"></i>
                    </div>
                    <h4 class="fw-bold">Você não tem inscrições</h4>
                    <p class="text-muted mb-4">Que tal encontrar um evento incrível agora mesmo?</p>
                    <RouterLink to="/" class="btn btn-primary btn-lg px-5 rounded-pill shadow">
                        Ver Eventos Disponíveis
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showConfirmDeleteModal" class="modal-overlay d-flex align-items-center justify-content-center" @click.self="fecharConfirmDeleteModal">
        <div class="modal-dialog w-100" style="max-width: 400px;">
            <div class="modal-content">
                <div class="modal-body p-4 text-center">
                    <div class="icon-circle bg-danger-subtle text-danger mx-auto mb-4">
                        <i class="bi bi-x-circle fs-2"></i>
                    </div>
                    <h5 class="fw-bold mb-2">Cancelar Inscrição?</h5>
                    <p class="text-muted mb-4 px-3">Você deixará de participar do evento <br><strong>{{ selectedInscricao?.evento?.nome }}</strong>.</p>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-light px-4 flex-grow-1" @click="fecharConfirmDeleteModal">Voltar</button>
                        <button class="btn btn-danger px-4 flex-grow-1" @click="confirmarDelecaoInscricao">Sim, Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-title {
    font-weight: 700;
    position: relative;
    padding-left: 15px;
}

.modal-content {
    background-color: #fff;
    border-radius: 15px;
}

.section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 4px;
    background-color: var(--bs-primary);
    border-radius: 2px;
}

.hover-card {
    transition: transform 0.3s ease, shadow 0.3s ease;
}
.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1050;
    backdrop-filter: blur(4px);
}

.icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-primary-subtle { background-color: #e7f1ff; }
.bg-danger-subtle { background-color: #f8d7da; }
.bg-secondary-subtle { background-color: #f0f0f0; }
</style>