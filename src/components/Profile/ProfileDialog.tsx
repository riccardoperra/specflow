import { HankoProfile } from "./HankoProfile";
import { backdrop, container, inner, profileContainer } from "./Profile.css";
import { Button, Dialog, DialogPanelContent, IconButton } from "@codeui/kit";
import { ControlledDialogProps } from "../../core/utils/controlledDialog";
import { CloseIcon } from "../../icons/CloseIcon";

export function ProfileDialog(props: ControlledDialogProps) {
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
      modal={true}
      size={"full"}
    >
      <DialogPanelContent>
        <div
          class={`w-full h-full flex items-center justify-center ${container} relative`}
        >
          <div class={`relative z-1 ${backdrop}`}>
            <div class={"absolute top-8 right-8"}>
              <IconButton
                aria-label={"Close"}
                size={"xl"}
                pill
                theme={"secondary"}
                onClick={() => props.onOpenChange(false)}
              >
                <CloseIcon class={"w-6 h-6"} />
              </IconButton>
            </div>

            <div
              class={`rounded-3xl flex bg-neutral-950 items-stretch gap-4 ${inner}`}
            >
              <div class={`w-full flex justify-center ${profileContainer}`}>
                <HankoProfile />
              </div>
            </div>
          </div>
        </div>
      </DialogPanelContent>
    </Dialog>
  );
}
