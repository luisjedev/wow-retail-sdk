# wow-sdk

## Quick start

```ts
import { createWowClient } from 'wow-sdk';

const wow = createWowClient({
  region: 'eu',
  locale: 'es_ES',
  tokenProvider: async () => getTokenFromBackend(),
});
```

Do not expose Blizzard client_secret in frontend code.
