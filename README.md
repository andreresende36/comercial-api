# E-commerce API

Bem-vindo ao projeto da API de E-commerce! Esta API é construída com AdonisJS e fornece funcionalidades para gerenciar produtos, categorias, marcas e compras em uma aplicação de e-commerce.

## Stack Utilizada

- **AdonisJS**
- **Node.js**
- **Docker**
- **Docker Compose**
- **MySQL**

## Requisitos

Para rodar este projeto, você precisará ter as seguintes ferramentas instaladas:

- **Node.js** (a partir da versão 18)
- **Docker** (a partir da versão 20.10)
- **Docker Compose** (a partir da versão 2)

Caso não tenha os pré-requisitos instalados, você pode seguir os links abaixo para instalar em sistemas baseados no Ubuntu:

- [Como instalar Node.js no Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)
- [Como instalar Docker e Docker Compose no Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

## Passo a Passo para Instalar e Rodar a API

1. Clone o repositório:

   ```sh
   git clone https://github.com/andreresende36/ecommerce-api.git

2. Entre no diretório do projeto:

   ```sh
   cd ecommerce-api

3. Instale as dependências do projeto e crie o container MySQL do Docker:

   ```sh
   npm start

4. Execute as migrações e seeds para criar e popular o banco de dados:

   ```sh
   npm run migration-seed

## Uso

Nesse ponto, o banco de dados estará criado, com as devidas tabelas e com alguns dados iniciais para testes. O servidor estará rodando no endereço <http://127.0.0.1:3333>.


## Recursos do AdonisJS utilizados no projeto

- Models
- Controllers
- Exception handlers
- Middlewares
- Validators
- Authentication JWT
- Factories
- Migrations
- Seeds

## Digrama Entidade-relacionamento do banco de dados

Abaixo disponibilizo um diagrama entidade-relacionamento que criei para guiar a contrução do banco de dados e entender a relação entre os modelos do projeto:

![Diagrama ER](https://imgur.com/1Y6mfgO.png)

## Formato do JSON no body da requisição

Disponibilizo abaixo o formato do corpo da requisição para cada uma das Models ou rotas:

```json
{
  "users": {
    "email": "newemail@test.com",
    "username": "newuser",
    "password": "654321",
    "avatar": "https://newimages.com/image/200"
  },
  "login": {
    "email": "newemail@test.com",
    "password": "654321"
  },
  "refresh": {
    "refresh_token": "874632987tyb34t09sdfn289tshf34oiusndf234890"
  },
  "addresses": {
    "address": "Avenida das APIs",
    "number": "456",
    "complement": "Apartamento 210",
    "neighborhood": "Centro Novo",
    "zipCode": "74820200",
    "city": "Brasília",
    "state": "DF",
    "country": "Brasil"
  },
  "phones": {
    "phoneNumber": "5562888888888"
  },
  "clients": {
    "name": "Maria Silva",
    "cpf": "98765432109",
    "sex": "Feminino",
    "birthdate": "1990-05-15",
    "address": "Avenida das APIs",
    "number": "456",
    "complement": "Apartamento 210",
    "neighborhood": "Centro Novo",
    "zipCode": "74820200",
    "city": "Brasília",
    "state": "DF",
    "country": "Brasil",
    "phoneNumber": "5562888888888"
  },
  "productCategories": {
    "categoryName": "Clothing"
  },
  "productBrands": {
    "brandName": "Nike"
  },
  "products": {
    "price": 199.99,
    "name": "Nike Air Max",
    "description": "Running Shoes",
    "stock": 100,
    "categoryId": 1,
    "brandId": 1
  },
  "purchases": {
    "quantity": 1,
    "unitPrice": 199.99,
    "totalPrice": 199.99,
    "date": "2024-07-01",
    "time": "10:00:00",
    "clientId": 1,
    "productId": 1
  }
}
```

## Rotas da API

Abaixo disponibilizei um mapa mental para servir de guia para entender as rotas da API:

![Mapa Mental das Rotas da API](https://i.imgur.com/nzQDJ3E.png)

### Boas-vindas

- **GET /** -> Retorna uma mensagem de boas-vindas.

### Usuários

- **POST /signup** -> Cria um novo usuário.
- **PUT /users/:id** -> Atualiza um usuário existente pelo ID.

### Senhas

- **POST /forgot-password** -> Envia um email para redefinir a senha.
- **POST /reset-password** -> Redefine a senha do usuário.

### Autenticação

- **POST /login** -> Realiza login de um usuário.
- **DELETE /login** -> Realiza logout de um usuário.
- **POST /refresh** -> Atualiza o token de autenticação.

### Endereços

- **GET /clients/:id/addresses** -> Retorna todos os endereços de um cliente específico.
- **POST /clients/:id/addresses** -> Cria um novo endereço para um cliente específico.
- **GET /clients/addresses/:id** -> Retorna um endereço específico pelo ID.
- **PUT /clients/addresses/:id** -> Atualiza um endereço existente pelo ID.
- **DELETE /clients/addresses/:id** -> Deleta um endereço existente pelo ID.

### Telefones

- **GET /clients/:id/phones** -> Retorna todos os telefones de um cliente específico.
- **POST /clients/:id/phones** -> Cria um novo telefone para um cliente específico.
- **GET /clients/phones/:id** -> Retorna um telefone específico pelo ID.
- **PUT /clients/phones/:id** -> Atualiza um telefone existente pelo ID.
- **DELETE /clients/phones/:id** -> Deleta um telefone existente pelo ID.

### Clientes

- **GET /clients** -> Retorna todos os clientes.
- **POST /clients** -> Cria um novo cliente.
- **GET /clients/:id** -> Retorna um cliente específico pelo ID.
- **GET /clients/:id/?month=XX&year=XX** -> Retorna um cliente específico pelo ID com a possibilidade de filtro de suas compras por mês + ano
- **PUT /clients/:id** -> Atualiza um cliente existente pelo ID.
- **DELETE /clients/:id** -> Deleta um cliente existente pelo ID.

### Categorias de Produtos

- **GET /products/categories** -> Retorna todas as categorias de produtos.
- **POST /products/categories** -> Cria uma nova categoria de produto.
- **GET /products/categories/:id** -> Retorna uma categoria de produto específica pelo ID.
- **PUT /products/categories/:id** -> Atualiza uma categoria de produto existente pelo ID.
- **DELETE /products/categories/:id** -> Deleta uma categoria de produto existente pelo ID.

### Marcas de Produtos

- **GET /products/brands** -> Retorna todas as marcas de produtos.
- **POST /products/brands** -> Cria uma nova marca de produto.
- **GET /products/brands/:id** -> Retorna uma marca de produto específica pelo ID.
- **PUT /products/brands/:id** -> Atualiza uma marca de produto existente pelo ID.
- **DELETE /products/brands/:id** -> Deleta uma marca de produto existente pelo ID.

### Produtos

- **GET /products** -> Retorna todos os produtos.
- **POST /products** -> Cria um novo produto.
- **GET /products/:id** -> Retorna um produto específico pelo ID.
- **PUT /products/:id** -> Atualiza um produto existente pelo ID.
- **DELETE /products/:id** -> Deleta um produto existente pelo ID.

### Compras

- **GET /purchases** -> Retorna todas as compras.
- **POST /purchases** -> Cria uma nova compra.
- **GET /purchases/:id** -> Retorna uma compra específica pelo ID.
- **PUT /purchases/:id** -> Atualiza uma compra existente pelo ID.
- **DELETE /purchases/:id** -> Deleta uma compra existente pelo ID.

## Testes

O projeto foi desenvolvido utilizando o método TDD. Os testes encontram-se na pasta **/ecommerce-api/tests** e você pode executá-los com o seguinte comando:

   ```sh
   npm test
   ```

## Contato

Desde já, me coloco à disposição para sanar quaisquer dúvidas.

Linkedin: <https://www.linkedin.com/in/andrediasresende>

Email: <andreresende36@gmail.com>
