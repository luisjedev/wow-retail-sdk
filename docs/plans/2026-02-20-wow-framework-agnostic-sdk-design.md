# WoW Framework-Agnostic SDK — Design

Date: 2026-02-20
Status: Approved

## 1) Objetivo

Construir una librería sencilla y agnóstica al framework que encapsule endpoints públicos de World of Warcraft (Armory + PvP inicialmente), exportando una función por endpoint.

La librería debe permitir que cada desarrollador la integre donde quiera (Node, serverless, backend propio, edge), sin acoplarse a React ni a un framework concreto.

## 2) Decisiones clave

- No habrá hooks en v1.
- Se implementará un core agnóstico de framework.
- Se expondrá una función por endpoint con naming claro.
- El manejo de secretos no vive en frontend.
- La librería usará un `tokenProvider` inyectado por el consumidor.

## 3) Alcance MVP

### Incluido

- Cliente principal `createWowClient(config)`.
- Endpoints de personaje (armory base):
  - `getCharacterProfile`
  - `getCharacterStatus`
- Endpoints PvP personaje:
  - `getCharacterPvpSummary`
  - `getCharacterPvpBracket`
- Endpoints PvP temporada:
  - `getPvpSeasonsIndex`
  - `getPvpSeason`
  - `getPvpLeaderboardsIndex`
  - `getPvpLeaderboard`
  - `getPvpRewardsIndex`
- Tipos base de inputs y outputs para cada endpoint MVP.
- Errores tipados.
- Tests unitarios de construcción de requests y manejo de errores.

### Fuera de alcance v1

- Hooks React.
- UI o componentes visuales.
- Cobertura completa de todos los endpoints de Blizzard en v1.
- Sistema complejo de cache distribuida.

## 4) Requisitos de seguridad

- `client_secret` no debe ir en cliente web.
- El secreto se mantiene en entorno servidor del consumidor (backend/serverless/edge seguro).
- La librería no obliga a almacenar secretos; solo consume tokens mediante `tokenProvider`.

## 5) API pública propuesta

## 5.1 Factory

`createWowClient(config)`

Config inicial:
- `region`: `"us" | "eu" | "kr" | "tw"`
- `locale`: string (`"en_US"`, `"es_ES"`, etc.)
- `tokenProvider`: `() => Promise<string>`
- opcional: `fetchImpl`, `timeoutMs`, `retryPolicy`, `baseUrlOverride`

## 5.2 Funciones MVP

Character:
- `getCharacterProfile({ realmSlug, characterName })`
- `getCharacterStatus({ realmSlug, characterName })`

PvP Character:
- `getCharacterPvpSummary({ realmSlug, characterName })`
- `getCharacterPvpBracket({ realmSlug, characterName, bracket })`

PvP Seasons:
- `getPvpSeasonsIndex()`
- `getPvpSeason({ seasonId })`
- `getPvpLeaderboardsIndex({ seasonId })`
- `getPvpLeaderboard({ seasonId, bracket })`
- `getPvpRewardsIndex({ seasonId })`

## 6) Arquitectura

Capas:
1. `client` (factory + config global)
2. `http` (request común, headers, retry, timeout)
3. `endpoints` (funciones por dominio)
4. `types` (contracts)
5. `errors` (errores tipados)

Cada función de endpoint:
1. Valida input mínimo.
2. Resuelve URL y namespace correcto.
3. Obtiene token con `tokenProvider`.
4. Ejecuta request HTTP.
5. Mapea error/respuesta y devuelve objeto tipado.

## 7) Data flow

`consumer code` -> `createWowClient` -> `endpoint function` -> `tokenProvider` -> `Blizzard API` -> `typed result`

Parámetros globales en cada request:
- `namespace` (`profile-{region}` o `dynamic-{region}` según endpoint)
- `locale`
- `Authorization: Bearer <token>`

## 8) Manejo de errores

Errores tipados iniciales:
- `WowAuthError` (401/403 o token inválido)
- `WowNotFoundError` (404)
- `WowRateLimitError` (429)
- `WowApiError` (5xx u otros)
- `WowValidationError` (input inválido)

Comportamiento:
- No silenciar errores.
- Devolver metadata útil (`status`, `path`, `requestId` si existe).

## 9) Testing

Tests unitarios prioritarios:
- URL final por endpoint.
- Namespace correcto por endpoint.
- Inclusión de locale y auth header.
- Mapping de errores HTTP a errores tipados.
- Reintento básico en fallos transitorios (si aplica política).

Tests de contrato (mock HTTP):
- Responses de éxito representativas para Character y PvP.
- Casos 404/429/5xx.

## 10) Estrategia de crecimiento

Fase 2:
- Añadir módulos PvE (`encounters`, `mythic-keystone`, etc.).
- Añadir más endpoints de profile/game data de forma incremental.
- Mantener un patrón estable: una función por endpoint + tipos + tests.

Fase 3:
- Publicación y versionado semántico.
- Guías de integración por runtime (Node/serverless/Next server route).

## 11) Criterios de éxito

- DX simple: importar cliente y llamar funciones por endpoint sin boilerplate.
- Seguridad correcta: sin secretos en frontend.
- Portabilidad: usable en distintos frameworks/runtimes.
- Escalabilidad: sumar endpoints sin romper API existente.

## 12) Ejemplo de uso conceptual

```ts
const wow = createWowClient({
  region: 'eu',
  locale: 'es_ES',
  tokenProvider: async () => getTokenFromMyBackend(),
});

const profile = await wow.getCharacterProfile({
  realmSlug: 'ravencrest',
  characterName: 'thrallito',
});

const pvp = await wow.getCharacterPvpSummary({
  realmSlug: 'ravencrest',
  characterName: 'thrallito',
});
```

Este diseño queda aprobado como baseline para iniciar el plan de implementación.