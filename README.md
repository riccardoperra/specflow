## SpecFlow

SpecFlow is an online tool which allows to everyone in the tech field (mostly devs and analysts) to store and centralize the project specification.

In SpecFlow, users can manage their projects, write markdown like documentation and generate diagrams such as sequence diagrams, ER, Mind maps etc. 

In SpecFlow, users can use AI as an assistant to generate the content they need to show.

In SpecFlow, users can share their project pages with all members of the team, assuring that everyone has all necessary information for their work.

### Roadmap

**Bootstrap**
- [ ] Add README
- [ ] Add contributions page
- [ ] Add MSW to run locally withouth  DB/Auth
**Hanko**
- [X] Add auth component
- [ ] Add profile component
- [X] Hanko authorization token integration with supabase
- [ ] Hanko sign with GitHub
**Features**
- [ ] Project CRUD with supabase security policy
- [X] Project page CRUD with supabase security policy
- [X] Allows to write markdown like pages
- [X] Allows to use mermaid to generate diagram with a real-time preview
- [X] Generate diagrams with OpenAI
- [ ] Generate page markdown content with OpenAI
- [ ] Share link
- [ ] Export mermaid diagram to image
- [ ] Export page to md
- [ ] Sync file with File System API
- [ ] Add responsive layout for mobile/tablet


## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
