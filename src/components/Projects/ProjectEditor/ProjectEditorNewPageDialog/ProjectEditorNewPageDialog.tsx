import {
  createProjectPageText,
  ProjectPageView,
} from "../../../../core/services/projects";
import { createStore, unwrap } from "solid-js/store";
import {
  Button,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
  TextField,
} from "@codeui/kit";
import { makeAsyncAction } from "statebuilder/asyncAction";
import { ControlledDialogProps } from "../../../../core/utils/controlledDialog";
import { createSignal } from "solid-js";

interface ProjectEditorPageSettingsDialogProps extends ControlledDialogProps {
  onSave: (projectPageView: ProjectPageView) => void;
  projectId: string;
}

interface Form {
  name: string;
}

export function ProjectEditorNewPageDialog(
  props: ProjectEditorPageSettingsDialogProps,
) {
  const [submitted, setSubmitted] = createSignal(false);
  const [form, setForm] = createStore<Form>({
    name: "",
  });

  const formValid = () => !!form.name;

  const onSave = (projectPageView: ProjectPageView) => {
    props.onOpenChange(false);
    props.onSave(projectPageView);
  };

  const saveAction = makeAsyncAction((data: Form) =>
    createProjectPageText(props.projectId, {
      name: data.name,
      content: "",
    })
      .then((result) => onSave(result.data!))
      .catch(() => {
        // TODO add error toast
        alert("Error");
      }),
  );

  const validations = {
    name: {
      state: () => (submitted() && !form.name ? "invalid" : undefined),
      errorMessage: () => "The field is required",
    },
  };

  return (
    <Dialog
      size={"sm"}
      title={"Create new page"}
      open={saveAction.loading ? true : props.isOpen}
      onOpenChange={props.onOpenChange}
    >
      <DialogPanelContent>
        <div class={"flex flex-col gap-3"}>
          <TextField
            placeholder={"Enter a name"}
            label={"Title (required)"}
            size={"lg"}
            required={true}
            value={form.name}
            validationState={validations.name.state()}
            errorMessage={validations.name.errorMessage()}
            onChange={(value) => setForm("name", value)}
          />
        </div>
      </DialogPanelContent>
      <DialogPanelFooter>
        <div class={"flex gap-2 justify-end"}>
          <Button
            disabled={saveAction.loading}
            theme={"secondary"}
            onClick={() => props.onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            loading={saveAction.loading}
            theme={"primary"}
            onClick={() => {
              setSubmitted(true);
              if (formValid()) {
                saveAction(unwrap(form));
              }
            }}
          >
            Save
          </Button>
        </div>
      </DialogPanelFooter>
    </Dialog>
  );
}
