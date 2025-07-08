# Aluno: Marcos Antonio de Oliveira Medeiros
# Professor: Lucas Tavares de Lima


# Aplicação Web Node.js (API Rest)

### Descrição
Esta aplicação compreende uma aplicação Web com o Node.JS conhecido como Aplicação API Rest. A aplicação irá realizar as 4 operações de um CRUD no banco de dados.
C - Create -> utilizará o médoto HTTP 'post'
R - Read -> utilizará o método HTTP 'get'
U - Update -> utilizará o método HTTP 'put'
D - Delete -> utilizará o método HTTP 'delete'

## Pacotes necessários para rodar essa aplicação

### Express
O **express** será responsável por criar o aplicativo Web e gerenciar as rotas da aplicação.

### pg
O módulo **pg** (PostgreSQL) será responsável por realizar a conexão com o banco de dados PostgreSQL.

### dotenv
O módulo **dotenv** será responsável para não expor os dados da conexão com o banco de dados. Isso é importante para não informar dados como endereço do servidor do banco de dados, login e senha. As credenciais para a conexão com o banco de dados serão armazenados num arquivo separado.

### Intalação dos módulos
Para instalar os módulos acima, execute o seguinte comando.
```
npm install express pg dotenv
```

### Projeto a partir do GitHub
Se você baixou o projeto diretamente do GitHub, execute o comando abaixo que ele irá instalar automaticamente as dependência (pacotes do Node.JS) utilizadas neste projeto.
```
npm install
```
npm install -g nodemon
```
npm install express
```
Segue o comenado para que seja possivel rodar o servidor e após qualquer alteração salva o mesmo ser reiniciado automaticamente

npm install --save-dev nodemon
```
e adicionar o seguinte codigo no arquivo packge.jason, na parte de scripts, lembrando de adicionar uma virgula na linha anterior que já estava dentro de scripts

"dev": "nodemon app.js"

após basta executar o no terminal o seguinte codigo 
```
npm run dev
``
## Configuração das chaves (variáveis) do Banco de Dados e da Aplicação

Para que sua aplicação funcione, você precisará utilizar um arquivo chamado ".env". Este arquivo deverá conter as chaves para a conexão com o Banco de Dados e as configurações básicas da aplicação.

Crie um arquivo `.env` na raiz do projeto com os seguintes codigos.
# Este arquivo contém um exemplo com as chaves (variáveis) utilizadas na conexão 
# com o banco de dados e configurações da aplicação.

DB_USER=seu_usuario_do_postgresql_aqui
DB_PASSWORD=sua_senha_do_postgresql_aqui
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=nome_do_banco
APP_HOST=127.0.0.1
APP_PORT=3000

Depois, preencha os valores reais de acesso ao banco de dados e porta da aplicação.

## Testar as rotas da aplicação
Você poderá testar as requisições HTTP (GET, POST, PUT e DELETE) com o [Insominia](https://insomnia.rest/), [Postman](https://www.postman.com/) ou qualquer outro software semelhante. O VSCode possui algumas extesão que podem ser utilizadas para realizar os testes, como o **Thunder Client**.


