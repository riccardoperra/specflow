import { ControlledDialogProps } from "../../../../core/utils/controlledDialog";
import {
  Button,
  Checkbox,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
} from "@codeui/kit";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../../../../ui/SegmentedControl/SegmentedControl";
import { createSignal, Match, Switch } from "solid-js";
import { provideState } from "statebuilder";
import { PreviewState } from "../previewState";
import { ProjectPageView } from "../../../../core/services/projects";
import { DynamicSizedContainer } from "../../../../ui/DynamicSizedContainer/DynamicSizedContainer";

interface ProjectEditorExportDiagramDialog extends ControlledDialogProps {
  projectPage: ProjectPageView;
}

export function ProjectEditorExportDiagramDialog(
  props: ProjectEditorExportDiagramDialog,
) {
  const [extension, setExtension] = createSignal<string>("png");
  const [showBackground, setShowBackground] = createSignal<boolean>(true);
  const [scale, setScale] = createSignal<number>(6);

  const { exportAndSave } = provideState(PreviewState);

  return (
    <Dialog
      title={"Export"}
      size={"md"}
      onOpenChange={props.onOpenChange}
      open={props.isOpen}
    >
      <DialogPanelContent>
        <DynamicSizedContainer>
          <div class={"flex flex-col gap-6"}>
            {/* TODO: bad */}
            <div>
              <p>File extension</p>
              <div class={"h-[44px] mt-3"}>
                <SegmentedControl value={extension()} onChange={setExtension}>
                  <SegmentedControlItem value={"png"}>PNG</SegmentedControlItem>
                  <SegmentedControlItem value={"svg"}>SVG</SegmentedControlItem>
                </SegmentedControl>
              </div>
            </div>

            <div>
              <p>Scale</p>
              <div class={"h-[44px] mt-3"}>
                <SegmentedControl
                  value={String(scale())}
                  onChange={(value) => setScale(parseInt(value))}
                >
                  <SegmentedControlItem value={"1"}>1x</SegmentedControlItem>
                  <SegmentedControlItem value={"3"}>3x</SegmentedControlItem>
                  <SegmentedControlItem value={"6"}>6x</SegmentedControlItem>
                  <SegmentedControlItem value={"12"}>12x</SegmentedControlItem>
                </SegmentedControl>
              </div>
            </div>

            <Switch>
              <Match when={extension() === "png"}>
                <div class={"mt-2"}>
                  <Checkbox
                    label={"Show background"}
                    checked={showBackground()}
                    value={String(showBackground())}
                    onChange={setShowBackground}
                  />
                </div>
              </Match>
            </Switch>
          </div>
        </DynamicSizedContainer>
      </DialogPanelContent>
      <DialogPanelFooter>
        <div class={"flex gap-2"}>
          <Button
            size={"md"}
            theme={"secondary"}
            block
            onClick={() => props.onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            loading={exportAndSave.loading}
            size={"md"}
            theme={"primary"}
            block
            onClick={() =>
              exportAndSave({
                type: extension() as "png" | "svg",
                scale: scale(),
                fileName: props.projectPage.name,
                showBackground: showBackground(),
              })
            }
          >
            Export
          </Button>
        </div>
      </DialogPanelFooter>
    </Dialog>
  );
}
