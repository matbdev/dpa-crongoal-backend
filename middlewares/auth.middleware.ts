/*
Desenvolva uma função que vai interceptar requisições.
Ela deve procurar no cabeçalho (Header) da requisição pela propriedade Authorization: Bearer <token>.
Se não achar, barra a requisição com erro 401 Unauthorized.
Se achar, passa o token para o utils/jwt.ts validar. Se for autêntico, "pendura" o ID do usuário na requisição e deixa ela seguir o fluxo normal.
*/