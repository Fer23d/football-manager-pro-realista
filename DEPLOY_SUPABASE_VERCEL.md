# Football Manager Pro: Vercel + Supabase

## 1. Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Rode o conteúdo de `supabase_schema.sql`.
4. Em Authentication, habilite login por email/senha.

## 2. Variáveis na Vercel

Configure no projeto da Vercel:

```text
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend. Ela é usada apenas nas funções `/api`.

## 3. Endpoints

- `GET /api/config`: envia URL e anon key pública para o frontend.
- `POST /api/saveGame`: salva `save_data` em `game_saves`.
- `GET /api/loadGame`: carrega o save do usuário autenticado.
- `POST /api/updateMarket`: alias de save para eventos de mercado.
- `POST /api/processSeason`: alias de save para eventos de temporada.

## 4. Fluxo

1. Usuário cria conta ou faz login no frontend.
2. Supabase Auth mantém a sessão.
3. O jogo chama `/api/loadGame`.
4. A função valida o Bearer token no Supabase.
5. O progresso é salvo em `game_saves.save_data`.

Sem Supabase configurado, o jogo continua funcionando com localStorage.
