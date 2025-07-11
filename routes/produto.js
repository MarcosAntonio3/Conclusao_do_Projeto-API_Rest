const express = require('express');
const router = express.Router();

// Aqui a gente configura a conexão com o banco de dados PostgreSQL
const db = require('../db/connect');

// Rota GET para pegar todos os produtos
router.get('/', async (req, res) => {
  try {
    // Faz a consulta no banco para pegar todos os produtos
    const result = await db.query('SELECT * FROM produto');
    // Envia o resultado em JSON para o cliente
    res.status(200).json(result.rows);
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente que deu problema
    console.error('Erro ao buscar produtos:', error.message);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos no banco de dados.' });
  }
});

// Rota GET para pegar um produto específico pelo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID que veio na URL
  try {
    // Consulta no banco o produto com o ID passado
    const result = await db.query('SELECT * FROM produto WHERE id = $1', [id]);

    // Se não achar nenhum produto, avisa que não encontrou
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    // Se achar, envia o produto encontrado
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente
    console.error('Erro ao buscar produto por ID:', error.message);
    res.status(500).json({ mensagem: 'Erro ao buscar produto no banco de dados.' });
  }
});

// Rota POST para criar um novo produto
router.post('/', async (req, res) => {
  const { nome, marca, preco, peso } = req.body; // Pega os dados enviados pelo cliente

  // Verifica se todos os campos foram preenchidos
  if (!nome || !marca || preco == null || peso == null) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  // Comando SQL para inserir o produto no banco
  const sql = `
    INSERT INTO produto (nome, marca, preco, peso)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  try {
    // Executa o comando no banco e pega o produto inserido
    const result = await db.query(sql, [nome, marca, preco, peso]);
    // Envia o produto criado para o cliente
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente
    console.error('Erro ao inserir produto:', error.message);
    res.status(500).json({ mensagem: 'Erro ao criar produto no banco de dados.' });
  }
});

// Rota PUT para atualizar um produto existente pelo ID
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID da URL
  const { nome, marca, preco, peso } = req.body; // Pega os dados enviados

  // Verifica se todos os campos foram preenchidos
  if (!nome || !marca || preco == null || peso == null) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  // Comando SQL para atualizar o produto com o ID dado
  const sql = `
    UPDATE produto
    SET nome = $1, marca = $2, preco = $3, peso = $4
    WHERE id = $5
    RETURNING *
  `;

  try {
    // Executa o comando no banco para atualizar o produto
    const result = await pool.query(sql, [nome, marca, preco, peso, id]);

    // Se não achar o produto para atualizar, avisa que não encontrou
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    // Se atualizou, envia o produto atualizado
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente
    console.error('Erro ao atualizar produto:', error.message);
    res.status(500).json({ mensagem: 'Erro ao atualizar produto no banco de dados.' });
  }
});

// Rota DELETE para excluir um produto pelo ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID da URL

  // Comando SQL para excluir o produto
  const sql = `
    DELETE FROM produto
    WHERE id = $1
    RETURNING *
  `;

  try {
    // Executa a exclusão no banco
    const result = await db.query(sql, [id]);

    // Se não achar o produto para excluir, avisa que não encontrou
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    // Se excluiu, confirma a exclusão para o cliente
    res.status(200).json({ mensagem: `Produto com ID ${id} foi excluído com sucesso.` });
  } catch (error) {
    // Se der erro, mostra no console e avisa o cliente
    console.error('Erro ao excluir produto:', error.message);
    res.status(500).json({ mensagem: 'Erro ao excluir produto do banco de dados.' });
  }
});

// Exporta as rotas para poder usar em outros arquivos
module.exports = router;
