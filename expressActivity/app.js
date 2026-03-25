const express = require("express");
const app = express();
const port = 3000;

// Middleware de log da requisição
const requestLogger = function (req, res, next) {
    req.requestTime = new Date().toLocaleString('pt-BR');
    console.log(`[LOG] ${req.requestTime} | Rota acessada: ${req.method} ${req.url}`);
    
    next();
};

// Aplicando o middleware globalmente para todas as rotas
app.use(requestLogger);

 
// ROTAS FIXAS
app.get('/', (req, res) => {
    res.send('<h1>Página Inicial (/)</h1>');
});

app.get('/about', (req, res) => {
    res.send('<h1>Página Sobre (/about)</h1>');
});

app.post('/data', (req, res) => {
    res.send('<h1>Página de Dados (/data) - Método POST</h1>');
});

// ROTAS DE USUÁRIOS (/users)
app.get('/users/signin', (req, res) => {
    res.send('<h1>Página de Login (/users/signin)</h1>');
});

app.get('/users/signup', (req, res) => {
    res.send('<h1>Página de Cadastro (/users/signup)</h1>');
});

// Rota dinâmica para o ID do usuário
app.get('/users/:userid', (req, res) => {
    res.send(`<h1>Bem-vindo, usuário: ${req.params.userid}!</h1>`);
});

// Redirecionamento caso acesse apenas /users
app.get('/users', (req, res) => {
    res.redirect('/users/signup');
});

// TRATAMENTO DE ERRO 404 (Qualquer outra rota não mapeada)
app.use((req, res) => {
    res.status(404).send(`
        <h1>Erro 404 - Página não encontrada</h1>
        <p>A página que você está procurando não existe neste servidor.</p>
        <a href="/">Voltar para o Index</a>
    `);
});


// INICIALIZAÇÃO DO SERVIDOR
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log('Pressione Ctrl+C para encerrar.');
});