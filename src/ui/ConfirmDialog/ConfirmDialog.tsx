import {
  Button,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
} from "@codeui/kit";
import { Accessor, JSXElement, mergeProps, VoidProps } from "solid-js";
import { ControlledDialogProps } from "../../core/utils/controlledDialog";

interface ConfirmDialogProps extends ControlledDialogProps {
  onConfirm: () => void;
  closeOnConfirm?: boolean;
  title: string;
  loading?: Accessor<boolean>;
  message: JSXElement;
  actionType?: "primary" | "danger";
}

export function ConfirmDialog(
  props: VoidProps<ConfirmDialogProps>,
): JSXElement {
  const propsWithDefault = mergeProps(
    { actionType: "primary", loading: false } as const,
    props,
  );
  return (
    <Dialog
      size={"xs"}
      title={propsWithDefault.title}
      onOpenChange={propsWithDefault.onOpenChange}
      open={propsWithDefault.isOpen}
    >
      <DialogPanelContent>
        <p class={"text-lg"}>{propsWithDefault.message}</p>
      </DialogPanelContent>
      <DialogPanelFooter>
        <div class={"flex flex-end gap-2"}>
          <Button
            block
            size={"md"}
            type="button"
            theme={"secondary"}
            onClick={() => props.onOpenChange?.(false)}
          >
            Close
          </Button>

          <Button
            block
            size={"md"}
            type="submit"
            loading={
              propsWithDefault.loading ? propsWithDefault.loading() : false
            }
            theme={
              propsWithDefault.actionType === "primary" ? "primary" : "negative"
            }
            onClick={() => {
              propsWithDefault.onConfirm();
              if (props.closeOnConfirm) {
                propsWithDefault.onOpenChange(false);
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogPanelFooter>
    </Dialog>
  );
}
