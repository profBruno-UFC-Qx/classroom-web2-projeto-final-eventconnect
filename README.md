[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iVa2Dd1Z)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21409604)
# :checkered_flag: EventConnect

O EventConnect é uma plataforma de divulgação de eventos dos mais diversos tipos. Nela é possível descobrir, filtrar e se inscrever nos eventos.

## :technologist: Membros da equipe
- 535718 - Victor Emanuel De Sousa Costa - CC
- 540428 - Jeferson Aires de Sousa - CC

## :bulb: Objetivo Geral
Permitir a divulgação, descoberta, filtragem e inscrição em eventos, além de viabilizar o gerenciamento e relatórios para administradores.

## :eyes: Público-Alvo
Pessoas interessadas em descobrir e participar de eventos de diversos tipos e administradores responsáveis pelo gerenciamento da plataforma.

## :star2: Impacto Esperado
Facilitar a descoberta e participação em eventos e otimizar o gerenciamento e a visualização de relatórios de participação pelos administradores.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação
- Usuário não logado
- Usuário logado
- Administrador (Login: admin@email.com, Senha: admin123)

## :triangular_flag_on_post: Principais funcionalidades da aplicação
- Usuário não logado: pode visualizar e compartilhar eventos.
- Usuário logado: pode registrar-se em eventos e visualizar seus eventos registrados.
- Administrador: pode gerenciar todos os eventos e visualizar relatórios de participação.

## :spiral_calendar: Entidades ou tabelas do sistema
- Usuário
- Evento
- Categoria
- Inscrição
# :checkered_flag: EventConnect

O EventConnect é uma plataforma de divulgação de eventos dos mais diversos tipos. Nela é possível descobrir, filtrar e se inscrever nos eventos.

## :technologist: Membros da equipe

* 535718 - Victor Emanuel De Sousa Costa - CC
* 540428 - Jeferson Aires de Sousa - CC

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

* Usuário não logado
* Usuário logado:
* Administrador - Login: admin@email.com, Senha: admin123

## :spiral_calendar: Entidades ou tabelas do sistema

* Usuário
* Evento
* Categoria
* Inscrição

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

* Usuário não logado: Pode visualizar e compartilhar eventos.
* Usuário logado: Pode registrar-se em eventos, e visualizar seus eventos registrados.
* Administrador: Pode gerenciar todos os eventos e visualizar relatórios de participação.

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

* VueJS
* Axios

**Backend:**

* Strapi


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Usuario | X |    |  |  |
| Evento | X |  X  |  X | X |
| Categoria | X |  X  | X | X |
| Inscrição | X |  X  |  | X |

## :neckbeard: Rotas da API REST utilizadas


| Método HTTP | URL |
| --- | --- |
| AUTENTICAÇÃO | |  |
| `POST` | `/auth/local` |
| `POST` | `/auth/local/register` |
| --- | --- |
| USUARIOS | |  |
| `GET` | `/users/me` |
| --- | --- |
| INSCRIÇÕES | |  |
| `GET` | `/inscricoes?filters[user][id][$eq]=${userStore.id}&populate[evento]=*&populate[user]=*'` |
| `GET` | ``/inscricoes`` |
| `POST` | `/inscricoes` |
| `DELETE` | `/inscricoes/${selectedInscricao.value.documentId}` |
| --- | --- |
| EVENTOS | |  |
| `GET` | `/eventos?populate=*` |
| `POST` | `/eventos` |
| `PUT` | `/eventos/${id}` |
| `DELETE` | `/eventos/${documentId}` |
| --- | --- |
| CATEGORIAS | |  |
| `GET` | `/categorias` |
| `GET` | `/categorias?populate=*` |
| `POST` | `/categorias` |
| `PUT` | `/categorias/${id}` |
| `DELETE` | `/categorias/${documentId}` |
| --- | --- |
| UPLOAD |   |
| `POST` | `/upload` |
