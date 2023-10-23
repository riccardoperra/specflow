import { HankoProfile } from "./HankoProfile";
import { Dialog, DialogPanelContent } from "@codeui/kit";
import { ControlledDialogProps } from "../../core/utils/controlledDialog";
import { createBreakpoints } from "../../core/utils/breakpoint";

export function ProfileDialog(props: ControlledDialogProps) {
  const breakpoint = createBreakpoints();
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
      modal={true}
      size={!breakpoint.sm ? "full" : "lg"}
      title={"Profile"}
    >
      <DialogPanelContent>
        <div class={`w-full h-full flex relative`}>
          <div class={`relative z-1`}>
            <div class={`w-full flex justify-center overflow-auto`}>
              <HankoProfile />
            </div>
          </div>
        </div>
      </DialogPanelContent>
    </Dialog>
  );
}
