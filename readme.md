# STORE / DEPOSIT - System :accept: 

Este é um sitema para gestão e controle total para lojas, contando com o controle de:
* Estoque
* Vendas
* Funcionarios
* Fornecedores
* Contas
* Lucro

## O que se pode fazer
* #### CRUD de Produtos
    * Ver estoque dos produtos
    * Alerta de estoque baixo
    * Filtrar por (quantidade, categoria) de produtos
    * Associar produto a um fornecedor
    * Adicionar promoções de produtos
    
* #### CRUD de vendas 
    * Associada aos produtos ou livre, sendo venda paga ou "a credito"
    
* #### CRUD funcionarios
    * Adicionar hierquia de funcionalidades ou opções (permitidas, manual para cada cliente)
* #### CRUD de clientes
    * Limite de saldo ("fiado") de clientes
    * Permissão se pode comprar fiado.
    * Saldo maximo de vendas fiado
    * Alerta de saldo cliente
* #### CRUD boleto a pagar / gastos
    * Assiciado a fornecedores
    * Alerta proximo a data de pagamento de boleto
* #### CRUD de fornecedores
    * Dia de visita do vendedor
    * Dia de entrega
    * Dia do pedido
    * produtos a se fornecer
* #### Login
* #### Editar dados da loja (cnpj, nome, etc)
* #### To Do


# TECHNOLOGIES

### FRONT
* React
* Styled-components
* Polished
* React-router-dom
* Axios

### Back
* NodeJs
* Express
* Axios
* JsonWebToken
* Postgres ( pg )
* bcrypt
* knex
* joi
* dotenv
* cors
* multer
* aws-sdk

```
npm i express axios jsonwebtoken pg knex bcrypt joi dotenv cors multer aws-sdk
npm i -D nodemon
```

# REPOSITORIES
Front: https://github.com/william-ks/storeSystem-front
Back: https://github.com/william-ks/storeSystem-back
Deploy: 

# DATABASE - STRUCTURE

### Offices/Cargos
```
id SERIAL PRIMARY KEY,
description TEXT NOT NULL
```
Somente o admin e o dev poderão criar novos usuarios

### Users/Usuários
```
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL,
office TEXT NOT NULL,
"isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
```
Somente o admin e o dev poderão criar novos usuarios

### Providers/Fornecedores
```
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
"orderDate" TEXT,
"orderFrequency" TEXT,
"deliveryDate" TEXT,
"extraInfos" text,
"isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
```

### Tickets/Boletos
```
id SERIAL PRIMARY KEY,
value INTEGER NOT NULL,
provider_id INTEGER REFERENCES providers(id),
"dueDate" DATE NOT NULL,
"isPaid" BOOLEAN NOT NULL DEFAULT FALSE,
"isDeleted" boolean default FALSE
```

### Clients/Clientes
```
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
cpf TEXT NOT NULL,
email TEXT,
credit INT NOT NULL,
"isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
```
Se o credito for zero o cliente não terá opção de comprar fiado

### Products

// preencher

### Sales/Vendas
```
id SERIAL PRIMARY KEY,
"saleNumber" INTEGER NOT NULL,
product_id INTEGER NOT NULL REFERENCES products(id),
"isCredit" BOOLEAN NOT NULL DEFAULT FALSE,
client_id INTEGER REFERENCES clients(id),
"isPaid" BOOLEAN NOT NULL DEFAULT TRUE,
"isDeleted" boolean default False
```
o numero da venda será criado pelo back end, pois será uma venda por produtos e terão varios com o mesmo "saleNumber" que será a forma de agrupalos


### Store/loja
```
name: str
cnpj: text
telefone: int
```

# API

## Clients

### /clients - POST
> [color=#28bdb6] Request
```
{
    name: Exemple Name
    cpf: 000.000.000-00
    email: email@email.com
    credit: 5000 // R$ 50,00
}
```
> [color=#28bdb6] Response - 201 - No Body
### /clients - GET
> [color=#28bdb6] Response - 200
```
{
    rowCount: Numero de clientes,
    rows: [
        {
            ...data
        }
    ]
}
```
### /clients/:id - GET
> [color=#28bdb6] Response - 200
```
{
    ..dataClient
}
```
### /clients/:id - PUT
> [color=#28bdb6] Request
```
{
    ...data to update
}
```
> [color=#28bdb6] Response - 204 - no Body

### /clients/:id - DELETE
> [color=#28bdb6] Response - 204 - no Body

## Users

### /users - POST
> [color=#28bdb6] Request
```
{
    name: example name
    email: email@email.com
    office_id: (1 a 3)
}
```
A senha adicionada será padrão e o novo usuário deverá mudar futuramente.
> [color=#28bdb6] Response - 201 - No Body
### /users - GET
> [color=#28bdb6] Response
```
[
    {
        "id": 1,
		"name": "name user",
		"email": "emai@gmail.com",
		"office": "Colaborador",
		"level": 3 // level of acess
    },
    {
        "id": 2,
		"name": "name user",
		"email": "emai@gmail.com",
		"office": "Colaborador",
		"level": 3 // level of acess
    },
]
```
### /users/:id - GET
> [color=#28bdb6] Response
```
{
    "id": 1,
    "name": "name user",
    "email": "emai@gmail.com",
    "office": "Colaborador",
    "level": 3 // level of acess
}
```
### /users - PUT
#### Update Self
> [color=#28bdb6] Request
```
{
	"name": "new name",
	"email": "newEmail@gmail.com"
}
```
#### Update Self Pass
> [color=#28bdb6] Request
```
{
	"oldPassword": "teste123",
	"newPassword": "teste123545"
}
```
### /users/:id - DELETE
###### Only Admin
> [color=#28bdb6] Response
```
{status: 204 no body}
```

## Providers

### /Providers - GET
### /Providers/:id - GET
### /Providers/:id - PUT
### /Providers/:id - DELETE

## Sales

### /sales - GET
### /sales/:id - GET
### /sales/:id - PUT
### /sales/:id - DELETE

## Tickets

### /tickets - GET
### /tickets/:id - GET
### /tickets/:id - PUT
### /tickets/:id - DELETE

## Store

### /store - GET
### /store/:id - GET
### /store/:id - PUT
