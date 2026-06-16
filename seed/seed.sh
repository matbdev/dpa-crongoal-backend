#!/bin/bash
# ============================================================
# CronGoal API Seed Script
# Popula o banco de dados com dados realistas para testes.
#
# Uso:
#   chmod +x seed.sh
#   ./seed.sh
#
# Requisitos:
#   - API rodando em localhost:5000
#   - curl e jq instalados
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL="${BASE_URL:-http://localhost:5000/api}"

# Lê DATABASE_URL do .env (que fica um nível acima do seed.sh)
ENV_FILE="${SCRIPT_DIR}/../.env"

set -uo pipefail

# ── Cores para output ───────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ok()   { echo -e "  ${GREEN}✔${NC} $1"; }
info() { echo -e "  ${CYAN}ℹ${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail() { echo -e "  ${RED}✖${NC} $1"; exit 1; }

section() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  $1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ── Verificações ─────────────────────────────────────────────
command -v curl >/dev/null 2>&1 || fail "curl não está instalado"
command -v jq   >/dev/null 2>&1 || fail "jq não está instalado"

# ── Helper para chamadas autenticadas ────────────────────────
auth_post() {
  local endpoint="$1"
  local data="$2"
  curl -s -X POST "${BASE_URL}${endpoint}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}" \
    -d "${data}"
}

auth_post_file() {
  local endpoint="$1"
  local field="$2"
  local filepath="$3"
  curl -s -X POST "${BASE_URL}${endpoint}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -F "${field}=@${filepath}"
}

auth_get() {
  local endpoint="$1"
  curl -s -X GET "${BASE_URL}${endpoint}" \
    -H "Authorization: Bearer ${TOKEN}"
}

# ── Arrays para armazenar IDs criados ────────────────────────
declare -a TASK_IDS=()
declare -a PROJECT_IDS=()
declare -a REWARD_IDS=()
declare -a ROUTINE_IDS=()

# ============================================================
# 1. REGISTRO E LOGIN
# ============================================================
section "1/9 — Criando usuário de teste"

REGISTER_RESP=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seeduser@crongoal.test",
    "password": "Xk9#mNpQ!wZ4",
    "fullName": "Usuário Seed Teste",
    "displayName": "seeduser_fire"
  }')

# Tenta login caso o usuário já exista
LOGIN_RESP=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seeduser@crongoal.test",
    "password": "Xk9#mNpQ!wZ4"
  }')

TOKEN=$(echo "$LOGIN_RESP" | jq -r '.authToken // .token // .accessToken // .data.token // .data.accessToken // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  # Tenta extrair do registro
  TOKEN=$(echo "$REGISTER_RESP" | jq -r '.authToken // .token // .accessToken // .data.token // .data.accessToken // empty')
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  warn "Não conseguiu extrair token automaticamente."
  echo "  Resposta register: $REGISTER_RESP"
  echo "  Resposta login: $LOGIN_RESP"
  echo ""
  read -rp "  Cole o JWT token manualmente: " TOKEN
fi

ok "Token obtido: ${TOKEN:0:30}..."

# ── Helper DELETE ────────────────────────────────────────────
auth_delete() {
  local endpoint="$1"
  curl -s -X DELETE "${BASE_URL}${endpoint}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}"
}

# ============================================================
# LIMPEZA — Remove dados existentes do seed user
# ============================================================
section "2/9 — Limpando dados existentes"

# Deletar rotinas
EXISTING_ROUTINES=$(auth_get "/routine" | jq -r '.[].id // empty' 2>/dev/null)
for rid in $EXISTING_ROUTINES; do
  auth_delete "/routine/$rid" >/dev/null 2>&1
done
ok "Rotinas removidas"

# Deletar projetos (antes das tasks pois projetos referenciam tasks)
EXISTING_PROJECTS=$(auth_get "/project" | jq -r '.[].id // empty' 2>/dev/null)
for pid in $EXISTING_PROJECTS; do
  auth_delete "/project/$pid" >/dev/null 2>&1
done
ok "Projetos removidos"

# Deletar rewards
EXISTING_REWARDS=$(auth_get "/reward" | jq -r '.[].id // empty' 2>/dev/null)
for wid in $EXISTING_REWARDS; do
  auth_delete "/reward/$wid" >/dev/null 2>&1
done
ok "Recompensas removidas"

# Deletar tasks (deleta daily_registers em cascata)
EXISTING_TASKS=$(auth_get "/task" | jq -r '.[].id // empty' 2>/dev/null)
for tid in $EXISTING_TASKS; do
  auth_delete "/task/$tid" >/dev/null 2>&1
done
ok "Tasks e registros removidos"

info "Limpeza concluída — criando dados novos..."

# ============================================================
# 2. TASKS (45 tarefas variadas)
# ============================================================
section "3/9 — Criando 45 tarefas"

TASKS_JSON=(
  '{"title":"Estudar TypeScript avançado","type":"RECURRENT","generatedPoints":15,"description":"Revisar generics, utility types e decorators"}'
  '{"title":"Fazer exercícios físicos","type":"RECURRENT","generatedPoints":10,"description":"30 min de cardio ou musculação"}'
  '{"title":"Ler 20 páginas de livro","type":"RECURRENT","generatedPoints":8,"description":"Leitura diária para manter o hábito"}'
  '{"title":"Meditar 10 minutos","type":"UNIQUE","generatedPoints":5,"description":"Meditação guiada ou silenciosa"}'
  '{"title":"Revisar pull requests","type":"RECURRENT","generatedPoints":12,"description":"Code review de PRs pendentes no time"}'
  '{"title":"Escrever testes unitários","type":"RECURRENT","generatedPoints":20,"description":"Cobrir funções críticas com testes"}'
  '{"title":"Organizar mesa de trabalho","type":"RECURRENT","generatedPoints":3,"description":"Limpar e organizar workspace","status":"DONE","isCompleted":true}'
  '{"title":"Configurar CI/CD pipeline","type":"RECURRENT","generatedPoints":25,"description":"GitHub Actions para deploy automático","status":"IN_PROGRESS"}'
  '{"title":"Documentar API REST","type":"RECURRENT","generatedPoints":18,"description":"Swagger/OpenAPI para endpoints","status":"IN_PROGRESS"}'
  '{"title":"Refatorar módulo de autenticação","type":"RECURRENT","generatedPoints":30,"description":"Melhorar segurança e legibilidade"}'
  '{"title":"Beber 2L de água","type":"RECURRENT","generatedPoints":5,"description":"Manter hidratação adequada"}'
  '{"title":"Atualizar dependências do projeto","type":"UNIQUE","generatedPoints":10,"description":"npm audit fix e atualizar pacotes"}'
  '{"title":"Praticar algoritmos no LeetCode","type":"RECURRENT","generatedPoints":15,"description":"Resolver 2 problemas por dia"}'
  '{"title":"Fazer backup do banco de dados","type":"RECURRENT","generatedPoints":8,"description":"pg_dump semanal"}'
  '{"title":"Estudar design patterns","type":"RECURRENT","generatedPoints":12,"description":"GoF patterns aplicados a TypeScript"}'
  '{"title":"Criar wireframe do dashboard","type":"RECURRENT","generatedPoints":20,"description":"Figma mockup do painel principal","status":"IN_PROGRESS"}'
  '{"title":"Implementar dark mode","type":"RECURRENT","generatedPoints":18,"description":"CSS variables para tema escuro","status":"DONE","isCompleted":true}'
  '{"title":"Otimizar queries do Prisma","type":"RECURRENT","generatedPoints":22,"description":"Analisar e melhorar N+1 queries"}'
  '{"title":"Configurar monitoramento","type":"RECURRENT","generatedPoints":15,"description":"Sentry ou similar para error tracking","status":"IN_PROGRESS"}'
  '{"title":"Caminhar 30 minutos","type":"RECURRENT","generatedPoints":7,"description":"Caminhada ao ar livre"}'
  '{"title":"Preparar apresentação do sprint","type":"RECURRENT","generatedPoints":10,"description":"Slides para sprint review","status":"IN_PROGRESS"}'
  '{"title":"Estudar Docker Compose","type":"RECURRENT","generatedPoints":12,"description":"Multi-container applications"}'
  '{"title":"Revisar anotações da faculdade","type":"RECURRENT","generatedPoints":8,"description":"Revisão de conteúdo acadêmico"}'
  '{"title":"Limpar e-mails da inbox","type":"RECURRENT","generatedPoints":4,"description":"Inbox zero strategy"}'
  '{"title":"Implementar cache Redis","type":"RECURRENT","generatedPoints":25,"description":"Cache layer para endpoints pesados"}'
  '{"title":"Fazer daily standup notes","type":"RECURRENT","generatedPoints":3,"description":"Anotar o que fez, vai fazer e bloqueios"}'
  '{"title":"Estudar PostgreSQL avançado","type":"RECURRENT","generatedPoints":14,"description":"Window functions, CTEs e indexação"}'
  '{"title":"Configurar ESLint e Prettier","type":"RECURRENT","generatedPoints":8,"description":"Padronização de código"}'
  '{"title":"Criar seed script para testes","type":"RECURRENT","generatedPoints":15,"description":"Script para popular banco com dados fake"}'
  '{"title":"Implementar paginação na API","type":"RECURRENT","generatedPoints":20,"description":"Cursor-based pagination"}'
  '{"title":"Praticar inglês 15min","type":"UNIQUE","generatedPoints":6,"description":"Duolingo ou conversa"}'
  '{"title":"Dormir antes das 23h","type":"RECURRENT","generatedPoints":10,"description":"Manter rotina de sono saudável"}'
  '{"title":"Escrever no journal","type":"RECURRENT","generatedPoints":5,"description":"Reflexão diária e gratidão"}'
  '{"title":"Fazer code review do backend","type":"RECURRENT","generatedPoints":12,"description":"Revisar qualidade do código"}'
  '{"title":"Implementar websockets","type":"RECURRENT","generatedPoints":28,"description":"Real-time notifications"}'
  '{"title":"Estudar Kubernetes básico","type":"RECURRENT","generatedPoints":16,"description":"Pods, services e deployments"}'
  '{"title":"Configurar HTTPS local","type":"RECURRENT","generatedPoints":10,"description":"mkcert para dev environment"}'
  '{"title":"Planejar semana no Notion","type":"RECURRENT","generatedPoints":6,"description":"Planejamento semanal estruturado"}'
  '{"title":"Criar componente de gráficos","type":"RECURRENT","generatedPoints":22,"description":"Chart.js ou D3 para dashboards"}'
  '{"title":"Fazer stretch e alongamento","type":"RECURRENT","generatedPoints":4,"description":"Pausa ativa a cada 2h"}'
  '{"title":"Revisar backlog de bugs","type":"UNIQUE","generatedPoints":8,"description":"Classificar e limpar bugs antigos","status":"IN_PROGRESS"}'
  '{"title":"Criar apresentação de métricas","type":"UNIQUE","generatedPoints":15,"description":"Apresentação pro time executivo","status":"IN_PROGRESS"}'
  '{"title":"Pesquisar nova ferramenta de BI","type":"UNIQUE","generatedPoints":20,"description":"Analisar Metabase vs Superset"}'
  '{"title":"Limpar arquivos temporários","type":"UNIQUE","generatedPoints":5,"description":"Limpeza de disco do ambiente dev","status":"DONE","isCompleted":true}'
  '{"title":"Atualizar perfil no LinkedIn","type":"UNIQUE","generatedPoints":10,"description":"Adicionar novas certificações","status":"IN_PROGRESS"}'
)

for task_json in "${TASKS_JSON[@]}"; do
  TITLE=$(echo "$task_json" | jq -r '.title')
  RESP=$(auth_post "/task" "$task_json")
  TASK_ID=$(echo "$RESP" | jq -r '.id // .data.id // empty')

  if [ -n "$TASK_ID" ] && [ "$TASK_ID" != "null" ]; then
    TASK_IDS+=("$TASK_ID")
    ok "Task: $TITLE"
  else
    warn "Falha ao criar task: $TITLE — $RESP"
  fi
done

info "Total de tasks criadas: ${#TASK_IDS[@]}"

# ============================================================
# 3. PROJECTS (8 projetos com tasks associadas)
# ============================================================
section "4/9 — Criando 8 projetos"

# Calcula data futura (compatível com Linux e macOS)
future_date() {
  local days=$1
  date -d "+${days} days" '+%Y-%m-%dT00:00:00.000Z' 2>/dev/null || \
  date -v+${days}d '+%Y-%m-%dT00:00:00.000Z' 2>/dev/null
}

# Cada projeto recebe um subconjunto de tasks
create_project() {
  local title="$1"
  local desc="$2"
  local days="$3"
  shift 3
  local task_indices=("$@")

  # Monta array de taskIds
  local ids_json="["
  local first=true
  for idx in "${task_indices[@]}"; do
    if [ "$idx" -lt "${#TASK_IDS[@]}" ]; then
      if [ "$first" = true ]; then first=false; else ids_json+=","; fi
      ids_json+="\"${TASK_IDS[$idx]}\""
    fi
  done
  ids_json+="]"

  local limit_date
  limit_date=$(future_date "$days")

  local payload
  payload=$(jq -n \
    --arg t "$title" \
    --arg d "$desc" \
    --arg ld "$limit_date" \
    --argjson ti "$ids_json" \
    '{title: $t, description: $d, limitDate: $ld, taskIds: $ti}')

  RESP=$(auth_post "/project" "$payload")
  PROJECT_ID=$(echo "$RESP" | jq -r '.id // .data.id // empty')

  if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
    PROJECT_IDS+=("$PROJECT_ID")
    ok "Projeto: $title (${#task_indices[@]} tasks)"
  else
    warn "Falha ao criar projeto: $title — $RESP"
  fi
}

# IMPORTANTE: Os índices de tasks aqui NÃO devem se sobrepor com os das rotinas.
# Rotinas usam: 0,1,2,3,4,5,6,10,12,13,14,19,20,21,22,23,25,26,31,32,33,35,37,39
# Projetos usam: 7,8,9,15,16,17,18,24,27,28,29,34,36,38
# Avulsas (sem projeto/rotina): 3,11,30,40,41,42,43,44

create_project "Refatoração do Backend" \
  "Modernizar a arquitetura do backend com clean architecture" \
  30  7 8 9 17

create_project "Landing Page v2" \
  "Redesign completo da landing page com animações" \
  45  15 16 38

create_project "Infraestrutura DevOps" \
  "Configurar pipeline completo de CI/CD e monitoramento" \
  60  18 36 29

create_project "App Mobile React Native" \
  "Versão mobile do CronGoal" \
  90  24 34 28

create_project "Sistema de Notificações" \
  "Implementar notificações push e real-time" \
  20  27 9 17

create_project "Dashboard Analytics" \
  "Painel com métricas e gráficos de produtividade" \
  40  38 7 29

create_project "Módulo de Gamificação v2" \
  "Evolução do sistema de pontos e rewards" \
  50  28 34 36

create_project "Documentação Técnica" \
  "Documentar toda a API e guias de contribuição" \
  35  8 9 27

info "Total de projetos criados: ${#PROJECT_IDS[@]}"

# ============================================================
# 4. REWARDS (12 recompensas)
# ============================================================
section "5/9 — Criando 12 recompensas"

REWARDS_JSON=(
  '{"title":"Café especial","pointsToGet":15,"description":"Um café gourmet da cafeteria favorita","icon":"☕","iconName":"cafe"}'
  '{"title":"Episódio de série","pointsToGet":25,"description":"Assistir 1 episódio sem culpa","icon":"📺","iconName":"serie"}'
  '{"title":"Almoço fora","pointsToGet":50,"description":"Almoço no restaurante que quiser","icon":"🍽️","iconName":"almoco"}'
  '{"title":"Comprar um livro","pointsToGet":80,"description":"Livro novo da wishlist","icon":"📚","iconName":"livro"}'
  '{"title":"Dia de folga","pointsToGet":200,"description":"Um dia inteiro sem obrigações","icon":"🏖️","iconName":"folga"}'
  '{"title":"Jogo novo na Steam","pointsToGet":150,"description":"Jogo da wishlist da Steam","icon":"🎮","iconName":"jogo"}'
  '{"title":"Sessão de cinema","pointsToGet":60,"description":"Cinema com pipoca e refrigerante","icon":"🎬","iconName":"cinema"}'
  '{"title":"Sorvete premium","pointsToGet":20,"description":"Sorvete artesanal 2 bolas","icon":"🍨","iconName":"sorvete"}'
  '{"title":"Gadget tech","pointsToGet":300,"description":"Acessório tech da wishlist","icon":"⌨️","iconName":"gadget"}'
  '{"title":"Viagem de fim de semana","pointsToGet":500,"description":"Mini trip para destino próximo","icon":"✈️","iconName":"viagem"}'
  '{"title":"Hora extra de gaming","pointsToGet":30,"description":"1h a mais de jogo no dia","icon":"🕹️","iconName":"gaming"}'
  '{"title":"Pedido de delivery","pointsToGet":40,"description":"Pedir comida no iFood","icon":"🛵","iconName":"delivery"}'
)

# Arrays com os paths dos ícones (se existirem)
ICONS_DIR="${SCRIPT_DIR}/icons"

if [ -d "$ICONS_DIR" ]; then
  info "Pasta $ICONS_DIR encontrada. O script tentará mapear ícones específicos para cada recompensa."
else
  info "Pasta $ICONS_DIR não encontrada. Os emojis padrões serão mantidos."
fi

for reward_json in "${REWARDS_JSON[@]}"; do
  TITLE=$(echo "$reward_json" | jq -r '.title')
  ICON_NAME=$(echo "$reward_json" | jq -r '.iconName // empty')

  # Procura por um arquivo com o nome exato (suportando png, jpg, jpeg, svg, webp)
  SPECIFIC_ICON=""
  if [ -n "$ICON_NAME" ] && [ -d "$ICONS_DIR" ]; then
    for ext in png jpg jpeg svg webp; do
      if [ -f "$ICONS_DIR/${ICON_NAME}.${ext}" ]; then
        SPECIFIC_ICON="$ICONS_DIR/${ICON_NAME}.${ext}"
        break
      fi
    done
  fi

  if [ -n "$SPECIFIC_ICON" ]; then
    UPLOAD_RESP=$(auth_post_file "/upload/reward-icon" "icon" "$SPECIFIC_ICON")
    ICON_URL=$(echo "$UPLOAD_RESP" | jq -r '.url // empty')
    
    if [ -n "$ICON_URL" ] && [ "$ICON_URL" != "null" ]; then
      # Atualiza JSON removendo iconName e setando icon como a URL
      reward_json=$(echo "$reward_json" | jq -c --arg url "$ICON_URL" 'del(.iconName) | .icon = $url')
    else
      warn "Falha ao fazer upload do ícone $SPECIFIC_ICON: $UPLOAD_RESP"
    fi
  else
    # Apenas remove a propriedade temporária iconName para não ir pro backend
    reward_json=$(echo "$reward_json" | jq -c 'del(.iconName)')
  fi

  RESP=$(auth_post "/reward" "$reward_json")
  REWARD_ID=$(echo "$RESP" | jq -r '.id // .data.id // empty')

  if [ -n "$REWARD_ID" ] && [ "$REWARD_ID" != "null" ]; then
    REWARD_IDS+=("$REWARD_ID")
    ok "Reward: $TITLE"
  else
    warn "Falha ao criar reward: $TITLE — $RESP"
  fi
done

info "Total de rewards criadas: ${#REWARD_IDS[@]}"

# ============================================================
# 5. ROUTINES (6 rotinas com tasks associadas)
# ============================================================
section "6/9 — Criando 6 rotinas"

create_routine() {
  local name="$1"
  local desc="$2"
  local period="$3"
  shift 3
  local task_indices=("$@")

  local ids_json="["
  local first=true
  for idx in "${task_indices[@]}"; do
    if [ "$idx" -lt "${#TASK_IDS[@]}" ]; then
      if [ "$first" = true ]; then first=false; else ids_json+=","; fi
      ids_json+="\"${TASK_IDS[$idx]}\""
    fi
  done
  ids_json+="]"

  local payload
  payload=$(jq -n \
    --arg n "$name" \
    --arg d "$desc" \
    --arg p "$period" \
    --argjson ti "$ids_json" \
    '{name: $n, description: $d, period: $p, taskIds: $ti}')

  RESP=$(auth_post "/routine" "$payload")
  ROUTINE_ID=$(echo "$RESP" | jq -r '.id // .data.id // empty')

  if [ -n "$ROUTINE_ID" ] && [ "$ROUTINE_ID" != "null" ]; then
    ROUTINE_IDS+=("$ROUTINE_ID")
    ok "Rotina: $name ($period)"
  else
    warn "Falha ao criar rotina: $name — $RESP"
  fi
}

create_routine "Rotina Matinal" \
  "Atividades para começar o dia com foco" \
  "DAILY"  1 3 10 39

create_routine "Desenvolvimento Semanal" \
  "Tarefas técnicas recorrentes da semana" \
  "WEEKLY"  0 4 5 12 14

create_routine "Saúde e Bem-estar" \
  "Cuidados com saúde física e mental" \
  "DAILY"  1 10 19 31 32 39

create_routine "Estudo Contínuo" \
  "Aprendizado constante em tecnologia" \
  "WEEKLY"  0 12 14 21 22 26 35

create_routine "Organização Pessoal" \
  "Manter tudo em ordem" \
  "DAILY"  6 23 25 37

create_routine "Review Mensal" \
  "Revisão mensal de progresso e metas" \
  "MONTHLY"  2 13 20 33

info "Total de rotinas criadas: ${#ROUTINE_IDS[@]}"

# ============================================================
# 6. DAILY REGISTERS (registros de conclusão)
# ============================================================
section "7/9 — Criando registros diários de conclusão"

OBSERVATIONS=(
  "Concluído com foco total"
  "Feito parcialmente, preciso revisar"
  "Ótimo progresso hoje!"
  "Mais difícil do que esperado"
  "Terminei rápido, sobrou tempo"
  "Precisei de ajuda mas consegui"
  "Excelente resultado"
  ""
  "Vou continuar amanhã"
  "Feito no prazo"
)

REGISTER_COUNT=0

# Cria registros para as primeiras 20 tasks (2-3 registros cada)
for i in $(seq 0 19); do
  if [ "$i" -ge "${#TASK_IDS[@]}" ]; then break; fi

  TID="${TASK_IDS[$i]}"
  REGISTERS_PER_TASK=$(( (RANDOM % 3) + 1 ))

  for r in $(seq 1 "$REGISTERS_PER_TASK"); do
    IS_DONE="true"
    # 20% de chance de não estar feito
    if [ $((RANDOM % 5)) -eq 0 ]; then IS_DONE="false"; fi

    OBS_IDX=$((RANDOM % ${#OBSERVATIONS[@]}))
    OBS="${OBSERVATIONS[$OBS_IDX]}"

    PAYLOAD=$(jq -n \
      --arg tid "$TID" \
      --argjson done "$IS_DONE" \
      --arg obs "$OBS" \
      '{taskId: $tid, isDone: $done, obs: $obs}')

    RESP=$(auth_post "/task/daily" "$PAYLOAD")
    REG_ID=$(echo "$RESP" | jq -r '.id // .data.id // empty')

    if [ -n "$REG_ID" ] && [ "$REG_ID" != "null" ]; then
      REGISTER_COUNT=$((REGISTER_COUNT + 1))
    fi
  done
  ok "Task #$((i+1)): $REGISTERS_PER_TASK registros"
done

info "Total de daily registers criados: $REGISTER_COUNT"

# ============================================================
# 7. REDEEM REWARDS (Resgatando recompensas)
# ============================================================
section "8/9 — Resgatando recompensas"

# Primeiro, dar pontos suficientes ao usuário para garantir os resgates
if npx tsx "$SCRIPT_DIR/adjust-seed.ts" points >/dev/null 2>&1; then
  ok "Saldo do usuário ajustado para 5000 pontos via Prisma"
else
  warn "Falha ao ajustar saldo via Prisma (verifique se npx tsx funciona)"
fi

REDEEM_COUNT=0
REDEEMS_TO_MAKE=15

for r in $(seq 1 "$REDEEMS_TO_MAKE"); do
  if [ ${#REWARD_IDS[@]} -eq 0 ]; then break; fi
  RW_IDX=$((RANDOM % ${#REWARD_IDS[@]}))
  RW_ID="${REWARD_IDS[$RW_IDX]}"

  RESP=$(auth_post "/reward/$RW_ID/redeem" "{}")
  RED_ID=$(echo "$RESP" | jq -r '.id // .data.id // empty')

  if [ -n "$RED_ID" ] && [ "$RED_ID" != "null" ]; then
    REDEEM_COUNT=$((REDEEM_COUNT + 1))
    RW_TITLE=$(echo "$RESP" | jq -r '.reward.title // empty' 2>/dev/null)
    ok "Resgate #${r}: ${RW_TITLE:-recompensa}"
  else
    warn "Falha ao resgatar — $RESP"
  fi
done

info "Total de recompensas resgatadas: $REDEEM_COUNT"

# ============================================================
# 8. DISPERSAR DATAS (via Prisma)
# ============================================================
section "9/9 — Dispersando datas de criação e simulando atrasos"

if npx tsx "$SCRIPT_DIR/adjust-seed.ts" disperse >/dev/null 2>&1; then
  ok "Datas dispersas com sucesso"
  ok "Projetos vencidos e tasks atrasadas gerados com sucesso"
else
  warn "Falha ao dispersar datas via Prisma (verifique se npx tsx funciona)"
fi

# ============================================================
# RESUMO FINAL
# ============================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ SEED COMPLETO!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${YELLOW}Resumo:${NC}"
echo -e "    Tasks:            ${GREEN}${#TASK_IDS[@]}${NC}"
echo -e "    Projetos:         ${GREEN}${#PROJECT_IDS[@]}${NC}"

echo -e "    Recompensas:      ${GREEN}${#REWARD_IDS[@]}${NC}"
echo -e "    Rotinas:          ${GREEN}${#ROUTINE_IDS[@]}${NC}"
echo -e "    Daily Registers:  ${GREEN}${REGISTER_COUNT}${NC}"
echo -e "    Resgates (Redeems): ${GREEN}${REDEEM_COUNT}${NC}"
echo ""
echo -e "  ${CYAN}Credenciais:${NC}"
echo -e "    Email:    seeduser@crongoal.test"
echo -e "    Senha:    Xk9#mNpQ!wZ4"
echo ""
echo -e "  ${CYAN}Token JWT:${NC}"
echo -e "    ${TOKEN:0:60}..."
echo ""

