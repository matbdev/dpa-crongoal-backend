/*
Ação registerLocal: Recebe email e senha. Verifica se o email já existe. Se não, usa o utils/password para hashear, salva no banco e devolve o usuário criado.
Ação loginLocal: Recebe email e senha. Busca no banco. Usa o utils/password para validar. Se tudo der certo, usa o utils/jwt para gerar o token e devolve.
Ação loginGoogle: Recebe o código do Google. Bate na API do Google para resgatar os dados do usuário. Verifica no Prisma se já existe alguém com aquele googleId ou email. Se não existir, cria a conta. No fim, gera o seu JWT e devolve.
*/