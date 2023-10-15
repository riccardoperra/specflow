import { defineStore } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { generateUUID } from "../utils/id";

interface Snippet {
  id: string;
  title: string;
  lang: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

type Commands = {
  createEmptySnippet: void;
};

export const SnippetsState = defineStore(() => [] as Snippet[])
  .extend(withProxyCommands<Commands>())
  // .extend((ctx) => withEntityPlugin()(ctx))
  .extend((_) => {
    _.hold(_.commands.createEmptySnippet, () =>
      _.set((state) => [
        ...state,
        {
          id: generateUUID(),
          title: "No title",
          lang: "ts",
          code: "",
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
        },
      ]),
    );
  });
