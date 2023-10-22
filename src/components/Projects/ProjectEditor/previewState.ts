import { defineSignal } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { withAsyncAction } from "statebuilder/asyncAction";
import {
  domToBlob,
  domToPng,
  downloadFile,
  exportMermaidPreview,
  openInNewPage,
  svgToFile,
} from "../../../core/utils/export";

type Commands = {
  setRef: HTMLElement;
};

export type GenericExportOptions = { fileName: string };

export type ExportOptions = ExportPngOptions | ExportSvgOptions;

export interface ExportPngOptions extends GenericExportOptions {
  type: "png";
  scale: number;
  showBackground: boolean;
}

export interface ExportSvgOptions extends GenericExportOptions {
  type: "svg";
}

export const PreviewState = defineSignal<HTMLElement | null>(() => null)
  .extend(withProxyCommands<Commands>({ devtools: { storeName: "ref" } }))
  .extend(withAsyncAction())
  .extend((_) => {
    _.hold(_.commands.setRef, (ref) => _.set(() => ref));
  })
  .extend((_) => {
    const node = () => {
      const ref = _()!;
      return ref.firstChild as SVGElement;
    };

    const exportAndSave = _.asyncAction((options: ExportOptions) => {
      switch (options.type) {
        case "png": {
          return exportMermaidPreview(node(), (element) => {
            const node = options.showBackground
              ? element
              : (element.firstChild as SVGElement);
            return domToPng(node, options).then(downloadFile);
          });
        }
        case "svg": {
          return exportMermaidPreview(node(), (element) => {
            const svg = element.firstChild as SVGElement;
            return new Promise((r) => {
              downloadFile(svgToFile(svg, options));
              r(true);
            });
          });
        }
        default: {
          throw new TypeError(`Type not valid`);
        }
      }
    });

    const openToExternalWindow = _.asyncAction(() =>
      domToBlob(node()).then(openInNewPage),
    );

    return {
      openToExternalWindow,
      exportAndSave,
    };
  });
