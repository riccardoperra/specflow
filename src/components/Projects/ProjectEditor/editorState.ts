import { defineStore } from "statebuilder";
import {
  ProjectPageView,
  ProjectView,
  updateProjectContent,
} from "../../../core/services/projects";
import { withProxyCommands } from "statebuilder/commands";
import { debounceTime, from, switchMap, tap } from "rxjs";
import { useSearchParams } from "@solidjs/router";
import { createEffect, on, runWithOwner } from "solid-js";
import { createControlledDialog } from "../../../core/utils/controlledDialog";
import { ProjectEditorNewPageDialog } from "./ProjectEditorNewPageDialog/ProjectEditorNewPageDialog";
import { ProjectEditorNewDiagramDialog } from "./ProjectEditorNewPageDialog/ProjectEditorNewDiagramDialog";
import { PlatformState } from "../../../core/state/platform";
import { ContainerState } from "../../../core/+container";

interface EditorState {
  activePageId: string | null;
  projectView: ProjectView | null;
  pendingUpdate: boolean;
  previewMode: "editor-with-preview" | "editor" | "preview";
  showSidebar: boolean;
}

type Commands = {
  setActivePage: string | null;
  setProjectView: ProjectView | null;
  updateProjectViewContent: { id: string; content: string };
  updateProjectSettings: ProjectPageView;
  updateLoading: boolean;
  triggerSave: boolean;
  addNewPage: ProjectPageView;
  removePage: string;
  setPreviewMode: EditorState["previewMode"] | (string & {});
  setShowSidebar: boolean;
  toggleSidebar: void;
};

export const EditorState = defineStore<EditorState>(() => ({
  activePageId: null,
  projectView: null,
  pendingUpdate: false,
  previewMode: "editor-with-preview",
  showSidebar: true,
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
    _.hold(_.commands.setActivePage, (payload, { set }) =>
      set("activePageId", payload),
    );
    _.hold(_.commands.setProjectView, (payload, { set }) =>
      set("projectView", payload),
    );
    _.hold(_.commands.updateProjectViewContent, ({ id, content }, { set }) =>
      set(
        "projectView",
        "project_page",
        (_) => _.id === id,
        "content",
        // TODO: fix type
        (v: any) => ({ ...v, content }),
      ),
    );
    _.hold(
      _.commands.updateProjectSettings,
      ({ id, name, description }, { set }) =>
        set(
          "projectView",
          "project_page",
          (_) => _.id === id,
          (v) => ({ ...v, name, description }),
        ),
    );
    _.hold(_.commands.addNewPage, (page, { set }) => {
      set("projectView", "project_page", (result) => [...result, page]);
      set("activePageId", page.id);
    });
    _.hold(_.commands.removePage, (id, { set }) =>
      set("projectView", "project_page", (pages) =>
        pages.filter((page) => page.id !== id),
      ),
    );
    _.hold(_.commands.setPreviewMode, (payload) =>
      _.set("previewMode", payload as EditorState["previewMode"]),
    );
    _.hold(_.commands.setShowSidebar, (payload, { set }) =>
      set("showSidebar", payload),
    );
    _.hold(_.commands.toggleSidebar, (payload, { set, state }) =>
      set("showSidebar", !state.showSidebar),
    );
  })
  .extend((_) => {
    const [searchParams, setSearchParams] = useSearchParams();

    createEffect(
      on(
        () => searchParams.pageId,
        (pageId) => {
          if (!pageId) {
            setSearchParams({ pageId: _.get.activePageId });
          }
        },
      ),
    );

    _.watchCommand([_.commands.setActivePage]).subscribe(() =>
      setSearchParams({
        pageId: _.get.activePageId,
      }),
    );

    _.watchCommand([_.commands.setProjectView]).subscribe(() => {
      const pages = _.get.projectView?.project_page ?? [];
      if (
        searchParams.pageId &&
        !!pages.find((page) => page.id === searchParams.pageId)
      ) {
        _.actions.setActivePage(searchParams.pageId);
      } else if (pages.length > 0) {
        _.actions.setActivePage(
          _.get.projectView?.project_page?.[0].id ?? null,
        );
      }
    });

    _.watchCommand([_.commands.removePage]).subscribe((command) => {
      // TODO fix type
      const deletedId = (command as any)["consumerValue"];
      if (_.get.activePageId === deletedId) {
        const pages = _.get.projectView?.project_page ?? [];
        _.actions.setActivePage(pages[0]?.id);
      }
    });

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
  })
  .extend((_) => {
    // TODO: statebuilder should allows to inject state in context
    const platformState = ContainerState.get(PlatformState);
    const maxPageLimit = () => platformState()?.max_project_page_per_user ?? 1;

    return {
      maxPageLimit,
      canCreateNewProjectPage() {
        return (
          (_.get.projectView?.project_page?.length || 0) <
          // todo: is this safe?
          maxPageLimit()
        );
      },
      openNewPageDialog(owner: any, projectId: number) {
        return runWithOwner(owner, () => {
          return createControlledDialog()(ProjectEditorNewPageDialog, {
            onSave: (result) => _.actions.addNewPage(result),
            projectId,
          });
        });
      },
      openNewDiagramDialog(owner: any, projectId: number) {
        return runWithOwner(owner, () => {
          return createControlledDialog()(ProjectEditorNewDiagramDialog, {
            onSave: (result) => _.actions.addNewPage(result),
            projectId,
          });
        });
      },
    };
  });
