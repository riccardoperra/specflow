import { defineSignal } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { withAsyncAction } from "statebuilder/asyncAction";
import { createUniqueId } from "solid-js";

type Commands = {
  setRef: HTMLElement;
};

export const PreviewState = defineSignal<HTMLElement | null>(() => null)
  .extend(withProxyCommands<Commands>({ devtools: { storeName: "ref" } }))
  .extend(withAsyncAction())
  .extend((_) => {
    _.hold(_.commands.setRef, (ref) => _.set(() => ref));
  })
  .extend((_) => {
    const exportPreview = (
      svg: SVGElement,
      exportFn: (node: HTMLElement) => Promise<any>,
    ) => {
      const uuid = createUniqueId();
      const id = `export-preview-${uuid}`;
      const preview = document.createElement("div");
      preview.setAttribute("id", id);
      // TODO: should be customizable
      preview.classList.add("bg-neutral-800");
      preview.style.position = "absolute";
      preview.style.left = "0px";
      preview.style.top = "0px";
      preview.style.zIndex = "-1";
      preview.style.width = "fit-content";
      preview.style.height = "fit-content";
      const clonedSvg = svg.cloneNode(true) as SVGElement;
      clonedSvg.style.removeProperty("max-width");
      clonedSvg.style.removeProperty("transform-origin");
      clonedSvg.style.removeProperty("transform");
      preview.appendChild(clonedSvg);
      document.body.appendChild(preview);
      return exportFn(preview).finally(() => preview.remove());
    };

    const node = () => {
      const ref = _()!;
      return ref.firstChild as SVGElement;
    };

    const domToBlob = () =>
      import("modern-screenshot").then((m) =>
        exportPreview(node(), (svg) =>
          m.domToBlob(svg, {
            scale: 6,
            debug: true,
            style: { padding: "0px", margin: "0px" },
          }),
        ),
      );

    const openToExternalWindow = _.asyncAction(() =>
      domToBlob().then((result) => {
        console.log(result, "result");
        const link = document.createElement("a");
        link.target = "_blank";
        link.href = URL.createObjectURL(result);
        link.click();
        link.remove();
      }),
    );

    return {
      openToExternalWindow,
    };
  });
