# Programção Web 1

## Atividade Express (Requisitos)
- Criar uma função de Middleware para cada uma das rotas mostradas
exibindo apenas uma página com nome da rota
- Criar uma função Middleware de aplicação que realiza o registro no console
do acesso a cada página (ver exemplos anteriores nesta aula)
- Em signin , criar uma rota (/users/:userid) que recebe o userid do usuário
e exibe na página uma msg de boas vindas usando esse valor
- Caso o usuário acesse sem userid é direcionado a página signup
(pesquise como usar res.redirect() )
- Qualquer outra página que não tenha a rota indicada é direcionada para
página de erro 404 com link para o index (pesquise como usar
res.status() )