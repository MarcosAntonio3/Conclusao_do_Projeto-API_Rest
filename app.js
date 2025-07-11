// Importar o módulo Express
const express = require('express');

// Criação do aplicativo servidor
const app = express();

// Importar dotenv para variáveis de ambiente
require('dotenv').config();

// Configuração de acesso ao servidor
const hostname = process.env.APP_HOST || 'localhost';  // Defina um valor padrão caso não haja no .env
const port = process.env.APP_PORT || 3000;  // Defina um valor padrão caso não haja no .env

// Importar o módulo para conexão com o banco de dados
const { Pool } = require('pg');

// Criar o pool de conexões com o banco de dados
const pool = new Pool({

  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware para converter dados para o JSON
app.use(express.json());

// Importar as rotas
const clienteRotas = require('./routes/cliente');
const produtoRotas = require('./routes/produto');

// Rota inicial
app.get('/', (req, res) => {
  res.status(200).send('Servidor API Rest que manipula as rotas /produto e /cliente.');
});

// Exportar as rotas
app.use('/cliente', clienteRotas);
app.use('/produto', produtoRotas);

// Rodar o servidor
app.listen(port, hostname, async () => {
  try {
    // Verificando se a conexão com o banco está funcionando
    await pool.query('SELECT 1');
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
    console.log('Conexão estabelecida com sucesso com o banco de dados');
  } catch (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  }
});