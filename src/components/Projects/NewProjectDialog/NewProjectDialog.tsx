import { createStore, unwrap } from "solid-js/store";
import {
  Button,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
  TextArea,
  TextField,
} from "@codeui/kit";
import { makeAsyncAction } from "statebuilder/asyncAction";
import { createSignal } from "solid-js";
import { ControlledDialogProps } from "../../../core/utils/controlledDialog";
import { createNewProject, ProjectView } from "../../../core/services/projects";

interface NewProjectDialogProps extends ControlledDialogProps {
  onSave: (project: ProjectView) => void;
}

interface Form {
  name: string;
  description: string;
}

export function NewProjectDialog(props: NewProjectDialogProps) {
  const [submitted, setSubmitted] = createSignal(false);
  const [form, setForm] = createStore<Form>({
    name: "",
    description: "",
  });

  const formValid = () => !!form.name;

  const onSave = (projectView: ProjectView) => {
    props.onOpenChange(false);
    props.onSave(projectView);
  };

  const saveAction = makeAsyncAction((data: Form) =>
    createNewProject(data.name, data.description)
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
      size={"lg"}
      title={"Create new project"}
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

          <TextArea
            placeholder={"Enter a description"}
            label={"Description"}
            options={{ autoResize: true }}
            slotClasses={{
              input: "min-h-[150px]",
            }}
            value={form.description}
            size={"lg"}
            onChange={(value) => setForm("description", value)}
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
