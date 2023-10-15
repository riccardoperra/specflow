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
}

type Commands = {
  setActivePage: string | null;
  setProjectView: ProjectView | null;
  updateProjectViewContent: { id: string; content: string };
  updateProjectSettings: ProjectPageView;
  updateLoading: boolean;
  triggerSave: boolean;
  addNewPage: ProjectPageView;
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
    _.hold(_.commands.addNewPage, (page) => {
      _.set("projectView", "project_page", (result) => [...result, page]);
      _.set("activePageId", page.id);
    });
  })
  .extend((_) => {
    const [searchParams, setSearchParams] = useSearchParams();
    // generateMermaidDiagramCode(
    //   _.get.projectView!,
    //   _.selectedPage()!,
    //   "Generate a sequence diagram for an optimistic ui system. when the user write to the editor, we need to call a supabase api for update. the api should be debounced until the user stops to write for 5 seconds. After that, if the api returns an error, the ui should be reverted opening a toast.",
    // ).then((result) => {
    //   _.actions.updateProjectViewContent({
    //     content: result.choices[0].text.trim(),
    //     id: _.selectedPage()!.id,
    //   });
    // });
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
