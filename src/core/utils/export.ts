import { createUniqueId } from "solid-js";

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

export const exportMermaidPreview = (
  svg: SVGElement,
  exportFn: (node: HTMLElement) => Promise<any>,
) => {
  const uuid = createUniqueId();
  const id = `export-preview-${uuid}`;
  const preview = document.createElement("div");
  preview.setAttribute("id", id);
  // TODO: should be customizable?
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

export const downloadFile = (file: File) => {
  const link = document.createElement("a");
  link.download = file.name;
  link.href = URL.createObjectURL(file);
  link.click();
  link.remove();
};

export const openInNewPage = (data: Blob | MediaSource) => {
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = URL.createObjectURL(data);
  link.click();
  link.remove();
};

export const svgToFile = (svg: SVGElement, options: ExportSvgOptions) => {
  return new File([svg.outerHTML], options.fileName, {
    type: "image/svg+xml",
  });
};

export const domToPng = (node: Element, options: ExportPngOptions) => {
  return import("modern-screenshot").then((m) =>
    m
      .domToBlob(node, {
        features: { fixSvgXmlDecode: true },
        font: {},
        type: "image/png",
        scale: options.scale ?? 6,
        style: { padding: "0px", margin: "0px" },
      })
      .then(
        (data) =>
          new File([data], `${options.fileName}.png`, {
            type: "image/png",
          }),
      ),
  );
};

export const domToBlob = (node: SVGElement) =>
  import("modern-screenshot").then((m) =>
    exportMermaidPreview(node, (svg) =>
      m.domToBlob(svg, {
        scale: 6,
        debug: true,
        style: { padding: "0px", margin: "0px" },
      }),
    ),
  );
