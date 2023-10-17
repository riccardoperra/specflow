import { defineStore } from "statebuilder";
import {
  ProjectPageView,
  ProjectView,
  updateProjectContent,
} from "../../../core/services/projects";
import { withProxyCommands } from "statebuilder/commands";
import { debounceTime, from, switchMap, tap } from "rxjs";
import { useSearchParams } from "@solidjs/router";
import { createEffect, on } from "solid-js";

interface EditorState {
  activePageId: string | null;
  projectView: ProjectView | null;
  pendingUpdate: boolean;
  previewMode: "editor-with-preview" | "editor" | "preview";
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
};

export const EditorState = defineStore<EditorState>(() => ({
  activePageId: null,
  projectView: null,
  pendingUpdate: false,
  previewMode: "editor-with-preview",
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
    _.hold(_.commands.addNewPage, (page) => {
      _.set("projectView", "project_page", (result) => [...result, page]);
      _.set("activePageId", page.id);
    });
    _.hold(_.commands.removePage, (id) =>
      _.set("projectView", "project_page", (pages) =>
        pages.filter((page) => page.id !== id),
      ),
    );
    _.hold(_.commands.setPreviewMode, (payload) =>
      _.set("previewMode", payload as EditorState["previewMode"]),
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
      console.log("remove id", command);
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
  });
