# :checkered_flag: EventConnect

O EventConnect é uma plataforma de divulgação de eventos dos mais diversos tipos. Nela é possível descobrir, filtrar e se inscrever nos eventos.

## :technologist: Membros da equipe

* 537799 - Venicius Feitosa da Silva - SI
* 535718 - Victor Emanuel De Sousa Costa - CC

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
| `GET` | `/inscricaos?filters[user][id][$eq]=${userStore.id}&populate[evento]=*&populate[user]=*'` |
| `GET` | ``/inscricaos`` |
| `POST` | `/inscricaos` |
| `DELETE` | `/inscricaos/${selectedInscricao.value.documentId}` |
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
