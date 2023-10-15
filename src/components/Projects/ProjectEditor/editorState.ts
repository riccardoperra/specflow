import { defineStore } from "statebuilder";
import { ProjectView } from "../../../core/services/projects";
import { withProxyCommands } from "statebuilder/commands";

interface EditorState {
  activePageId: string | null;
  projectView: ProjectView | null;
}

type Commands = {
  setActivePage: string | null;
  setProjectView: ProjectView | null;
};

export const EditorState = defineStore<EditorState>(() => ({
  activePageId: null,
  projectView: null,
}))
  .extend(
    withProxyCommands<Commands>({
      devtools: { storeName: "editor" },
    }),
  )
  .extend((_) => {
    _.hold(_.commands.setActivePage, (v) => _.set("activePageId", v));
    _.hold(_.commands.setProjectView, (v) => _.set("projectView", v));
  })
  .extend((_) => ({
    selectedPage() {
      const pages = _.get.projectView?.project_page ?? [];
      return pages.find((page) => page.id === _.get.activePageId);
    },
  }));
