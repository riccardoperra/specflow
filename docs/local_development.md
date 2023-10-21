# Local Development

## Table of contents

- [1. Preparing the environment](#1-preparing-the-environment)
- [2. Connect Hanko](#2-init-hanko)
- [3. Initialize supabase](#3-initialize-supabase)
    - [3.1 Connect an external instance](#31-connect-an-external-instance)
    - [3.2 Connect to a local instance](#32-connect-to-a-local-instance)
    - [3.3 Setup environment variables](#33-setup-environment-variables)
- [4. Enable mocks for client-side authentication flow (optional)](#4-enable-mocks-for-client-side-authentication-flow-optional)
- [5. Run the dev servers](#5-run-the-dev-servers)

## 1. Preparing the environment

This repository uses [pnpm](https://pnpm.io/it/). You need to install **pnpm 8**
and **Node.js v16** or higher.

You can run the following commands in your terminal to check your local Node.js and npm versions:

```bash
node -v
pnpm -v
```

From the project root directory, you can run the following command to install the project's dependencies:

```bash
pnpm install
```

Next, you have to rename and modify the `.env.example` in order to put the environment variables needed by the app.

```bash
cp .env.example .env.local # or .env
```

Env variables will be loaded by vite: https://vitejs.dev/guide/env-and-mode.html

## 2. Init Hanko

In order to init hanko authentication, you must sign-up to their website and register a new project.

https://www.hanko.io/

> [!IMPORTANT]
> Consider that Hanko does not currently support multiple app/redirect urls, so to integrate their
> frontend components you should add "http://localhost:3000" as the App URL in their Dashboard -> Settings -> General
> page.

You can follow their setup guide to init a new Hanko Cloud project: https://docs.hanko.io/setup-hanko-cloud

Once that, you should populate the variable in the `.env` file in order to integrate the authentication in the client
app.

```dotenv
VITE_HANKO_API_URL=https://f4****-4802-49ad-8e0b-3d3****ab32.hanko.io # just an example
```

## 3. Initialize Supabase

SpecFlow integrates [supabase](https://supabase.com/) for database service and edge functions. You can use an existing
hosted instance or provide a self-hosted one.

### 3.1 Connect an external instance

You can follow the supabase documentation and wizard to bootstrap a new remote instance for free.

https://supabase.com/docs/guides/getting-started

### 3.2 Connect to a local instance

To run supabase locally you can run the command below, or follow their local development guide for more details.

```bash
pnpm supabase start
```

You can follow the supabase official local development guide for more details.

https://supabase.com/docs/guides/cli/local-development

### 3.3 Setup environment variables

Once supabase is initialized, you should setup the environment variables needed to access the supabase instance
from the client-side library.

```dotenv
# If you are running supabase locally, put http://localhost:3000, 
# otherwise you should retrieve it from the dashboard,
VITE_CLIENT_SUPABASE_URL=
# If you are running supabase locally, put the `anon key` retrieved by the `pnpm supabase status` command,
# otherwise you should retrieve it from the dashboard,
VITE_CLIENT_SUPABASE_KEY=
```

### 4. Enable mocks for client-side authentication flow (optional)

If you want to skip Hanko's authentication process locally, you can enable the dedicated environment variable. More
information about it in the [Hanko integration section](#hanko-integration-details).

```dotenv
VITE_ENABLE_AUTH_MOCK=true
```

## 5. Run the dev servers

Once everything is started, you can run the command `supabase:serve:functions` to run the lambda locally

```bash
pnpm supabase:serve:functions
```

> [!IMPORTANT]
> Supabase functions need some environment variables to run correctly (without mocks).

```dotenv
# supabase/.env.local
HANKO_API_URL=https://f4****-4802-49ad-8e0b-3d3****ab32.hanko.io
PRIVATE_KEY_SUPABASE=<string>
OPENAI_TOKEN=<string>
SKIP_AUTH=<true|false>
```

To run the application locally, you can run the `dev` command.

```bash
pnpm dev
```
