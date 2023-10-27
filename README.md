<div align="center">

# SpecFlow

[![Netlify Status](https://api.netlify.com/api/v1/badges/3018697f-1796-4a9e-9578-82b5af56a193/deploy-status)](https://app.netlify.com/sites/specflow/deploys)
[![Made with Hanko](https://img.shields.io/badge/Built%20with-Hanko-red)](https://www.hanko.io/)
[![Made with SolidJS](https://img.shields.io/badge/Built%20with-SolidJS-blue)](https://github.com/solidjs/solid)
[![Made with Vanilla Extract](https://img.shields.io/badge/Built%20with-Vanilla%20Extract-ff69b4)](https://github.com/seek-oss/vanilla-extract)
<br>
[![Made with Supabase](https://supabase.com/badge-made-with-supabase-dark.svg)](https://supabase.com)

</div>

> [!NOTE]
> SpecFlow is an open-source tool (MIT License) made for the [Hanko hackathon](https://www.hanko.io/hackathon).
> It's a MVP made in two weeks far away to be a complete product, born with the aim of testing integrations and interactions between new
> tech/libraries, and to better understand the authentication flow by also integrating the passkeys.
>
> More in detail, in this project I experiment with Hanko's authentication by integrating it with a third party system
> like supabase, the latter used trying to take advantage of the generated types, RSL policies, realtime and edge
> functions.
>
> Furthermore, I make a small usage of OpenAI API via edge functions to generate code directly from a user-defined
> prompt.
>
> This project it's also a way to improve my [UI Kit library](https://github.com/riccardoperra/codeui) based
> on [Kobalte](https://github.com/kobaltedev/kobalte) and [Vanilla Extract](https://vanilla-extract.style/) that I'm
> working on, initially born to be the CodeImage design system.

## 💡 Features

- ✅ SpecFlow provides you with a single hub to organize and centralize all your project specs and documentation. No more
  endless searching; everything you need is just a click away.

- ✅ Write your project notes, requirements, and specifications using a Markdown-like interface
  In SpecFlow, users can manage their projects, write markdown like documentation and generate diagrams such as
  sequence diagrams, ER, Mind maps etc complaint to Mermaid syntax.

- ✅ AI-Powered Assistance: with SpecFlow, you can harness the power of AI to
  effortlessly generate content, saving you time and effort.
  > [!NOTE]
  > Currently for the hackathon it is only possible to generate mermaid diagrams using my personal openai key

- ✅ Collaborative Team Sharing (Work in Progress): Soon, SpecFlow will enable sharing of project pages with all
  team members. This feature ensures that everyone has access to the essential information they need to excel in their
  roles.

Users can use AI as an assistant to generate the content they need to show.

Users can share their project pages with all members of the team, assuring that everyone has all necessary information
for their work. (This is still wip)

## 🤖 Tech stack

SpecFlow tech stack is mainly composed by these technologies:

- [Hanko](https://hanko.io)
- [Supabase](https://supabase.com) (Edge Functions and Database)
- [SolidJS](https://github.com/solidjs/solid)
- [Vanilla-Extract](https://vanilla-extract.style/)
- [TailwindCSS](https://tailwindcss.com/)
- [CodeMirror6](https://codemirror.net)
- [TipTap Editor](https://tiptap.dev)
- [Mock Service Worker](https://mswjs.io/)

Other libraries that I should mention:

- [Kobalte](https://github.com/kobaltedev/kobalte): A SolidJS UI toolkit for building accessible components
- [solid-primitives](https://github.com/solidjs-community/solid-primitives): High quality primitives for SolidJS
  applications.
- [codemirror-lang-mermaid](https://github.com/inspirnathan/codemirror-lang-mermaid): I would never
  have thought of making this application without this library.
- [solid-codemirror](https://github.com/riccardoperra/solid-codemirror): Solid CodeMirror wrapper.
- [CodeUI](https://github.com/riccardoperra/codeui): My UI kit (still wip)
  for [CodeImage](https://github.com/riccardoperra/codeimage)
- [statebuilder](https://github.com/riccardoperra/statebuilder): My composable state management library

## 🔐 Hanko integration details

SpecFlow is a single-page application which integrates Hanko for authentication. All related code which
handles the authentication is in these files/folders:

- [auth.ts](src/core/state/auth.ts): Handles auth state and sync with supabase instance
- [src/components/Auth](src/components/Auth): Auth page and profile component using hanko element using Vanilla Extract
  for custom styling

### Authentication flow

Supabase Database comes with a useful RSL policy which allows to restrict the access from our data using custom rules.
Since we need that each user can operate only inside it's projects, we need to somehow make supabase
understand who is making the requests.

Hanko **is replacing** supabase traditional auth (which is disabled), so after the sign-in from the UI we need to
extract the data we need
from Hanko's JWT, and sign our own to send to Supabase.

We can do that using hanko `authFlowCompleted` event, which gets called once the user authenticates through the UI.

```typescript
hanko.onAuthFlowCompleted(() => {
  supabase.functions.invoke("hanko-auth", {body: {token: session.jwt}});
});
```

After that event we will call the supabase edge function
in [supabase/functions/hanko-auth](supabase/functions/hanko-auth/index.ts) which validate Hanko JWT retrieving the JWKS
config, then sign ourselves a new token for supabase.

```ts
import * as jose from "https://deno.land/x/jose@v4.9.0/index.ts";

const hankoApiUrl = Deno.env.get("HANKO_API_URL");
// 1. ✅ Retrieves Hanko JWKS configuration
const JWKS = jose.createRemoteJWKSet(
  new URL(`${hankoApiUrl}/.well-known/jwks.json`),
);
// 2. ✅ Verify Hanko token
const data = await jose.jwtVerify(session.jwt, JWKS);
const payload = {
  exp: data.payload.exp,
  userId: data.payload.sub,
};
// 3. ✅ Sign new token for supabase using it's private key
const supabaseToken = Deno.env.get("PRIVATE_KEY_SUPABASE");
const secret = new TextEncoder().encode(supabaseToken);
const token = await jose
  .SignJWT(payload)
  .setExpirationTime(data.payload.exp) // We'll set the same expiration time as Hanko token
  .setProtectedHeader({alg: "HS256"}) // Supabase uses a different algorithm
  .sign(secret);
```

Our payload for the JWT will contain the user's identifier from Hanko and the same expiration date.

> [!IMPORTANT]
> We are signing this JWT using Supabase's signing secret token, so it will be able to check the jwt authenticity.
> This is a crucial step which obviously for security reasons cannot be done on the client side.

Once that each supabase fetch call should include our custom token which contains the Hanko **userId**.

```ts
import {createClient} from "supabase";

const supabaseUrl = import.meta.env.VITE_CLIENT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_CLIENT_SUPABASE_KEY;
const client = createClient(supabaseUrl, supabaseKey);
const originalHeaders = structuredClone(client.rest.headers);

export function patchSupabaseRestClient(accessToken: string | null) {
  // ✅ Set functions auth in order to put the jwt token for edge functions which need authentication
  client.functions.setAuth(accessToken ?? supabaseKey);
  if (accessToken) {
    // ✅ Patching rest headers that will be used for querying the database through rest.
    client["rest"].headers = {
      ...client.rest.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  } else {
    client["rest"].headers = originalHeaders;
  }
}
```

Next, thanks to a **postgres function** we can extract the userId from the jwt in order to let supabase knows which user
is authenticated.

```sql
create
or replace function auth.user_id() returns text as
$$
select nullif(current_setting('request.jwt.claims', true)::json ->> 'userId', '')::text;
$$
language sql stable;
```

We can use RLS now using our user_id from hanko.

```sql
CREATE
POLICY "Allows all operations" ON public.project_page
    AS PERMISSIVE FOR ALL
    TO public
    -- ✅ Use our user_id function to get hanko user_id from jwt
    USING ((auth.user_id() = user_id))
    WITH CHECK ((auth.user_id() = user_id));

ALTER TABLE public.project_page ENABLE ROW LEVEL SECURITY;
```

The supabase database schema is up through the initial migration which will define all functions, tables and rls.

[20231020190554_schema_init.sql](supabase/migrations/20231020190554_schema_init.sql).

You can find all others migrations [here](https://github.com/riccardoperra/specflow/tree/main/supabase/migrations).

Here a sequence diagram of an in-depth detail of the client side authentication flow (made through SpecFlow 😉)

```mermaid
sequenceDiagram
    participant Client
    participant Hanko Server
    participant Supabase Edge Functions
    participant Supabase Database
    Client ->> Hanko Server: Authentication Flow
    activate Client
    activate Hanko Server
    Hanko Server -->> Client: Set user session and "hanko" cookie
    deactivate Hanko Server
    Client ->> Supabase Edge Functions: /functions/v1/hanko-auth
    activate Supabase Edge Functions
    Note right of Client: Pass session info like jwt, userId
    Supabase Edge Functions ->> Hanko Server: Retrieves JWKS configuration
    activate Hanko Server
    Note over Supabase Edge Functions, Hanko Server: <hankoUrl>/.well-known/jwks.json
    Hanko Server -->> Supabase Edge Functions: Returns configuration
    deactivate Hanko Server
    activate Supabase Edge Functions
    Supabase Edge Functions ->> Supabase Edge Functions: Verify Hanko jwt token
    Supabase Edge Functions ->> Supabase Edge Functions: Sign new jwt token containing the hanko user_id.
    Note right of Supabase Edge Functions: Signing a token for supabase is needed to integrate the db RLS policies.
    Supabase Edge Functions -->> Client: Returns access token for supabase
    deactivate Supabase Edge Functions
    deactivate Supabase Edge Functions
    activate Client
    Client ->> Client: Patch supabase client Authorization header
    Client ->> Client: Set "sb-token" session cookie
    Client ->> Supabase Database: Call /rest/ api to do some operations
    note over Client, Supabase Database: Will pass the token received from the supabase edge function
    deactivate Client
```

### Mocking Hanko for local development

SpecFlow integrates the latest version of [MockServiceWorker](https://mswjs.io/) to mock locally the entire Hanko
authentication flow.

The mocking handlers are written in [src/mocks/hanko-handlers.ts](src/mocks/hanko-handlers.ts) file.

When the environment variable `VITE_ENABLE_AUTH_MOCK` is true, MSW will be initialized in order to login with two
different users.

- User1:

    - email: **user1@example.com**
    - password: **password**
    - passcode: 123456

- User2:
    - email: **user2@example.com**
    - password: **password**
    - passcode: 123456

Currently both passcode and password flows are mocked, you can toggle them by updating the `ENABLE_PASSCODE_FLOW`
constant in [src/mocks/hanko-handlers.ts](src/mocks/hanko-handlers.ts).

## Local development

Follow the [local_development.md](docs/local_development.md) guide for more information.

## License

MIT © [Riccardo Perra](https://github.com/riccardoperra)
