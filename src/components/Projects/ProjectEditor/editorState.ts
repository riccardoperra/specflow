import { defineStore } from "statebuilder";
import {
  ProjectPageView,
  ProjectView,
  updateProjectContent,
} from "../../../core/services/projects";
import { withProxyCommands } from "statebuilder/commands";
import { debounceTime, from, switchMap, tap } from "rxjs";
import { generateMermaidDiagramCode } from "../../../core/services/gpt";

interface EditorState {
  activePageId: string | null;
  projectView: ProjectView | null;
  pendingUpdate: boolean;
}

type Commands = {
  setActivePage: string | null;
  setProjectView: ProjectView | null;
  updateProjectViewContent: { id: string; content: string };
  updateProjectSettings: ProjectPageView;
  updateLoading: boolean;
  triggerSave: boolean;
};

export const EditorState = defineStore<EditorState>(() => ({
  activePageId: null,
  projectView: null,
  pendingUpdate: false,
}))
  .extend(
    withProxyCommands<Commands>({
      devtools: { storeName: "editor" },
    }),
  )
  .extend((_) => ({
    selectedPage() {
      const pages = _.get.projectView?.project_page ?? [];
      return pages.find((page) => page.id === _.get.activePageId);
    },
  }))
  .extend((_) => {
    _.hold(_.commands.setActivePage, (payload) =>
      _.set("activePageId", payload),
    );
    _.hold(_.commands.setProjectView, (payload) =>
      _.set("projectView", payload),
    );
    _.hold(_.commands.updateProjectViewContent, ({ id, content }) =>
      _.set(
        "projectView",
        "project_page",
        (_) => _.id === id,
        "content",
        // TODO: fix type
        (v: any) => ({ ...v, content }),
      ),
    );
    _.hold(_.commands.updateProjectSettings, ({ id, name, description }) =>
      _.set(
        "projectView",
        "project_page",
        (_) => _.id === id,
        (v) => ({ ...v, name, description }),
      ),
    );
  })
  .extend((_) => {
    from(_.watchCommand([_.commands.updateProjectViewContent]))
      .pipe(
        debounceTime(100),
        tap(() => _.set("pendingUpdate", true)),
        debounceTime(1000),
        switchMap(() => {
          const updatedJson = _.selectedPage()!.content as Record<string, any>;
          return updateProjectContent(_.selectedPage()!.id, updatedJson);
        }),
        tap(() => _.set("pendingUpdate", false)),
      )
      .subscribe();
  });
