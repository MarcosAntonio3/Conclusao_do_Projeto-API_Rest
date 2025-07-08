const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Aqui a gente configura a conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,      // usuário do banco
  host: process.env.DB_HOST,      // endereço do banco
  database: process.env.DB_NAME,  // nome do banco
  password: process.env.DB_PASSWORD, // senha do banco
  port: process.env.DB_PORT,      // porta do banco
});

// Rota GET para listar todos os clientes
router.get('/', async (req, res) => {
  try {
    // Faz a consulta para pegar todos os clientes na tabela "cliente"
    const result = await pool.query('SELECT * FROM cliente');
    // Retorna a lista de clientes em formato JSON com status 200 (sucesso)
    res.status(200).json(result.rows);
  } catch (error) {
    // Se der erro, mostra no console e retorna erro 500 para o cliente
    console.error('Erro ao buscar clientes:', error.message);
    res.status(500).json({ mensagem: 'Erro ao buscar clientes no banco de dados.' });
  }
});

// Rota GET para buscar um cliente pelo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID da URL
  try {
    // Busca o cliente que tem o ID informado
    const result = await pool.query('SELECT * FROM cliente WHERE id = $1', [id]);

    // Se não encontrar nenhum cliente com esse ID, retorna erro 404 (não encontrado)
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    // Se encontrou, retorna os dados do cliente
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Se der erro na consulta, avisa no console e retorna erro 500
    console.error('Erro ao buscar cliente por ID:', error.message);
    res.status(500).json({ mensagem: 'Erro ao buscar cliente no banco de dados.' });
  }
});

// Rota POST para criar um novo cliente
router.post('/', async (req, res) => {
  // Pega os dados enviados pelo cliente no corpo da requisição
  const { nome, email, telefone, endereco, cidade, uf } = req.body;

  // Verifica se todos os campos foram preenchidos
  if (!nome || !email || !telefone || !endereco || !cidade || !uf) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  // Comando SQL para inserir um novo cliente na tabela
  const sql = `
    INSERT INTO cliente (nome, email, telefone, endereco, cidade, uf)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
  `;

  try {
    // Executa o comando no banco com os dados do cliente
    const result = await pool.query(sql, [nome, email, telefone, endereco, cidade, uf]);
    // Retorna o cliente criado com status 201 (criado)
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente
    console.error('Erro ao inserir cliente:', error.message);
    res.status(500).json({ mensagem: 'Erro ao criar cliente no banco de dados.' });
  }
});

// Rota PUT para atualizar um cliente existente pelo ID
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID da URL
  const { nome, email, telefone, endereco, cidade, uf } = req.body; // Dados para atualizar

  // Verifica se todos os campos foram preenchidos
  if (!nome || !email || !telefone || !endereco || !cidade || !uf) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  // Comando SQL para atualizar o cliente com o ID informado
  const sql = `
    UPDATE cliente
    SET nome = $1, email = $2, telefone = $3, endereco = $4, cidade = $5, uf = $6
    WHERE id = $7
    RETURNING *
  `;

  try {
    // Executa o comando no banco para atualizar o cliente
    const result = await pool.query(sql, [nome, email, telefone, endereco, cidade, uf, id]);

    // Se não achar cliente para atualizar, retorna erro 404
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    // Se atualizou, retorna o cliente atualizado
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente
    console.error('Erro ao atualizar cliente:', error.message);
    res.status(500).json({ mensagem: 'Erro ao atualizar cliente no banco de dados.' });
  }
});

// Rota DELETE para excluir um cliente pelo ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID da URL

  // Comando SQL para apagar o cliente com o ID informado
  const sql = `
    DELETE FROM cliente
    WHERE id = $1
    RETURNING *
  `;

  try {
    // Executa a exclusão no banco
    const result = await pool.query(sql, [id]);

    // Se não achar o cliente para excluir, retorna erro 404
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    // Se excluiu, confirma para o cliente que deu certo
    res.status(200).json({ mensagem: `Cliente com ID ${id} foi excluído com sucesso.` });
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente
    console.error('Erro ao excluir cliente:', error.message);
    res.status(500).json({ mensagem: 'Erro ao excluir cliente do banco de dados.' });
  }
});

// Exporta essas rotas para poder usar em outros arquivos
module.exports = router;
