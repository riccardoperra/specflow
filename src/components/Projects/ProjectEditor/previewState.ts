import { defineSignal } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { withAsyncAction } from "statebuilder/asyncAction";

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
    const domToBlob = () =>
      import("modern-screenshot").then((m) =>
        m.domToBlob(_()!.firstChild!, {
          scale: 3,
          style: { padding: "0px", margin: "0px" },
        }),
      );

    const openToExternalWindow = _.asyncAction(() =>
      domToBlob().then((result) => {
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
