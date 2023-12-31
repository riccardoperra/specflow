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
> It's an MVP made in less than two weeks far away to be a complete product, born with the aim of testing integrations
> and interactions between new tech/libraries, and to better understand the authentication flow by also integrating
> passkeys.
>
> More in detail, in this project I experiment with Hanko's authentication by integrating it with a third party system
> like supabase, the latter used trying to take advantage of the generated types, RLS policies, realtime and edge
> functions.
>
> Furthermore, I made a small use of OpenAI API via edge functions to generate code directly from a user-defined
> prompt.
>
> This project it's also a way to improve my [UI Kit library](https://github.com/riccardoperra/codeui) based
> on [Kobalte](https://github.com/kobaltedev/kobalte) and [Vanilla Extract](https://vanilla-extract.style/) that I'm
> working on, initially born to be the CodeImage design system.

<img alt="Homepage of SpecFlow" src="./docs/1.png" width="100%"/>

Read the integration post: 

https://dev.to/riccardoperra/specflow-integrating-hanko-and-supabase-in-a-solidjs-client-side-application-550m

## 💡 Features

- ✅ SpecFlow provides you with a single hub to organize and centralize all your project specs and documentation. No more
  endless searching; everything you need is just a click away.
- ✅ Write your project notes, requirements, and specifications using a Markdown-like interface.
- ✅ Write and export diagrams such as sequence diagrams, ER, Mind maps etc complaint to Mermaid syntax.
- ✅ AI-Powered Assistance: with SpecFlow, you can harness the power of AI to
  effortlessly generate content, saving you time and effort.
  > [!WARNING]
  > Currently for the hackathon it is only possible to generate mermaid diagrams using my personal OpenAI key which has
  a limit usage.
- ✅ Collaborative Team Sharing (Work in Progress): Soon, SpecFlow will enable sharing of project pages with all
  team members. This feature ensures that everyone has access to the essential information they need to excel in their
  roles.

<img alt="Homepage of SpecFlow" src="./docs/2.png" width="100%"/>
<span align="center">

_SpecFlow project page markdown view_

</span>

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
    - [@solid-primitives/media](https://github.com/solidjs-community/solid-primitives/tree/main/packages/media#readme):
      Primitives to deal with media queries
    - [@solid-primitives/storage](https://github.com/solidjs-community/solid-primitives/tree/main/packages/storage#readme):
      Primitives to deal with storage API (cookie handling)
    - [@solid-primitives/event-bus](https://github.com/solidjs-community/solid-primitives/tree/main/packages/event-bus#readme):
      Primitives to deal with event-bus (statebuilder/commands)
    - [@solid-primitives/date](https://github.com/solidjs-community/solid-primitives/tree/main/packages/date):
      Primitives to deal with dates
- [codemirror-lang-mermaid](https://github.com/inspirnathan/codemirror-lang-mermaid): I would never
  have thought of making this application without this library.
- [solid-codemirror](https://github.com/riccardoperra/solid-codemirror): Solid CodeMirror wrapper.
- [CodeUI](https://github.com/riccardoperra/codeui): My own UI kit (**still wip**)
  for [CodeImage](https://github.com/riccardoperra/codeimage)
- [statebuilder](https://github.com/riccardoperra/statebuilder): My own pluggable state management library

## Local development

Follow the [local_development.md](docs/local_development.md) guide for more information.

## 🔐 Hanko integration details

SpecFlow is a single-page application which integrates Hanko for authentication. All related code which
handles the authentication is in these files/folders:

- [auth.ts](src/core/state/auth.ts): Handles auth state and sync with supabase instance
- [src/components/Auth](src/components/Auth): Auth page and profile component using hanko element using Vanilla Extract
  for custom styling

### Authentication flow

Supabase Database comes with a useful [RLS policy](https://supabase.com/docs/guides/auth/row-level-security) which
allows to restrict data access using custom rules. Since we need that each user can operate only inside their projects,
we need to somehow make supabase understand who is making the requests.

Hanko **is replacing** supabase traditional auth (which is disabled), so after the sign-in from the UI we need to
extract the data we need from Hanko's JWT, and sign our own to send to Supabase.

We can do that using hanko `authFlowCompleted` event, which gets called once the user authenticates through the UI.

```typescript
hanko.onAuthFlowCompleted(() => {
  const session = hanko.session.get();
  supabase.functions.invoke("hanko-auth", {body: {token: session.jwt}});
});
```

During that event we will call the supabase edge function
in [supabase/functions/hanko-auth](supabase/functions/hanko-auth/index.ts) which will validate the Hanko JWT retrieving
the JWKS
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
  .setProtectedHeader({alg: "HS256"})
  .sign(secret);
```

Our payload for the JWT will contain the user's identifier from Hanko and the same expiration date.

> [!IMPORTANT]
> We are signing this JWT using Supabase's signing secret token, so we'll be able to check the jwt authenticity.
> This is a crucial step which obviously for security reasons cannot be done on the client side.

Once that each supabase fetch call should include our custom token which contains the Hanko **userId**.

```ts
import {createClient} from "supabase";

const supabaseUrl = import.meta.env.VITE_CLIENT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_CLIENT_SUPABASE_KEY;

const client = createClient(supabaseUrl, supabaseKey);

// Get headers after creating the supabase client. 
// The authorization bearer is valuated with the `supabaseKey`
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
create function auth.hanko_user_id() returns text as $$
select nullif(current_setting('request.jwt.claims', true)::json ->> 'userId', '')::text;
$$
language sql stable;
```

We can now define a new RLS using our hanko user_id retrieved through our custom function.

```sql
CREATE
POLICY "Allows all operations" ON public.project_page
    AS PERMISSIVE FOR ALL
    TO public
    -- ✅ Use our user_id function to get hanko user_id from jwt
    USING ((auth.hanko_user_id() = user_id))
    WITH CHECK ((auth.hanko_user_id() = user_id));

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

## 🖌️ Styling Hanko

Hanko Elements come with two useful web components that allows to handle the auth flow and the user profile.
There are several ways to customize
them ([docs](https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md)).

For SpecFlow I chose 2 approaches to manage customizations:

- Vanilla-Extract: Used to override css variables and define styles
  via [::part attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- Plain CSS: Used to override some internal elements by classes inside the shadow dom. Note that I didn't disable the
  shadow dom since the hanko authors doesn't recommend it

Most of the styles will use part of CodeUI kit variables so that it integrates into the application ui in the best
way.

### Files

- Auth
    - [Auth.tsx](src/components/Auth/Auth.tsx): Auth page component
    - [Auth.css.ts](src/components/Auth/Auth.css.ts): Auth page component layout styles
    - [HankoAuth.tsx](src/components/Auth/HankoAuth.tsx): SolidJS wrapper for hanko auth web component
    - [HankoAuth.css.ts](src/components/Auth/HankoAuth.css.ts): Styles for Hanko auth web components
    - [hanko-auth-overrides.css](src/components/Auth/hanko-auth-overrides.css): Hanko auth css overrides injected into
      the shadow dom
- Profile
    - [Profile.tsx](src/components/Auth/ProfileDialog.tsx): Profile page dialog
    - [HankoProfile.tsx](src/components/Auth/HankoProfile.tsx): SolidJS wrapper for hanko auth web component
    - [HankoProfile.css.ts](src/components/Auth/HankoProfile.css.ts): Styles for Hanko profile web components
    - [hanko-profile-overrides.css](src/components/Auth/hanko-profile-overrides.css): Hanko profile css overrides
      injected
      into
      the shadow dom
- Shared
    - [hanko-base.css.ts](src/components/Auth/hanko-base.css.ts): Base layout styles for hanko web components

### Details

First, I made a solid component for each web component in order to decouple it's logic, and to extend some behaviors and
the JSX interface, since solid has its own.

Each web component will have attached a custom class generated by vanilla-extract, then a custom `<style>` tag inside
the
shadow dom which I add once the component is mounted to the dom.

```tsx
// src/components/auth/HankoAuth.tsx
import * as styles from "./HankoAuth.css";
import {onMount} from "solid-js";
import overrides from "./hanko-auth-overrides.css?raw"; // Get the css text from the file.

export function HankoAuth() {
  let hankoAuth: HTMLElement;

  onMount(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = overrides;
    hankoAuth.shadowRoot!.appendChild(styleElement);
  });

  return (<hanko-auth ref={(ref) => (hankoAuth = ref!)} class={styles.hankoAuth}/>);
}

type GlobalJsx = JSX.IntrinsicElements;

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "hanko-auth": GlobalJsx["hanko-auth"];
    }
  }
}
```

The generated class from vanilla-extract will contain all custom vars and base styles defined through a base class, and
the custom ones needed only for the auth/profile component. Basically, I made the base styles for the "Layout"
components like buttons, forms, headlines etc.

```ts
export const base = style([
  hankoTheme,
  {
    vars: {
      "--color": hankoVars.foregroundColor,
      // Other vars...
    },
    selectors: {
      // Base layout styles
      "&::part(error)": {
        background: hankoVars.dangerColor,
        color: hankoVars.foregroundColor,
        border: "unset",
        padding: `0 ${themeTokens.spacing["4"]}`,
        gap: themeTokens.spacing["2"],
      },
      // Button styles
      "&::part(button)": {
        border: "none",
        transition: transitions,
      },
      // Other styles...
    }
  }
]);

export const hankoAuth = style([
  base,
  {
    // custom styles for hanko auth wc...
  }
]);

export const hankoProfile = style([
  base,
  {
    // custom styles for hanko profile wc...
  }
])
```

Then the override file will contain only some particular styles that cannot be accessed outside the shadow dom

```css
/* src/components/Auth/hanko-profile-overrides.css */

.hanko_paragraph:has(h2.hanko_headline) {
    color: var(--paragraph-inner-color);
}
```

Here's the final result:

<img src="docs/login-1.png" alt="Login Page - Email">
<span align="center">

_Login Page - Email Insert_

</span>

<img src="docs/login-2.png" alt="Login Page - Passcode challenge">
<span align="center">

_Login Page - Passcode challenge._

</span>

<img src="docs/profile-1.png" alt="Profile Page">
<span align="center">

_Profile Page Dialog._

</span>

## License

MIT © [Riccardo Perra](https://github.com/riccardoperra)
