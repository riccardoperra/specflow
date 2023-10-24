import {
  Button,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
  TextArea,
  TextField,
} from "@codeui/kit";
import { makeAsyncAction } from "statebuilder/asyncAction";
import { createStore, unwrap } from "solid-js/store";
import { createEffect, createSignal } from "solid-js";
import {
  Project,
  updateProjectSettings,
} from "../../../core/services/projects";
import { ControlledDialogProps } from "../../../core/utils/controlledDialog";

interface ProjectEditSettingsDialogProps extends ControlledDialogProps {
  onSave: (project: Project) => void;
  project: Project;
}

interface Form {
  name: string;
  description: string;
}

export function ProjectEditSettingsDialog(
  props: ProjectEditSettingsDialogProps,
) {
  const [submitted, setSubmitted] = createSignal(false);
  const [form, setForm] = createStore<Form>({
    name: props.project.name,
    description: props.project.description ?? "",
  });

  createEffect(
    () => props.project,
    setForm({
      description: props.project.description ?? "",
      name: props.project.name,
    }),
  );

  const onSave = (project: Project) => {
    props.onSave(project);
  };

  const saveAction = makeAsyncAction((data: Form) =>
    updateProjectSettings(props.project.id, data)
      .then((result) => onSave(result.data!))
      .catch(() => {
        // TODO add error toast
        alert("Error");
      })
      .finally(() => props.onOpenChange(false)),
  );

  const validations = {
    name: {
      state: () => (submitted() && !form.name ? "invalid" : undefined),
      errorMessage: () => "The field is required",
    },
  };

  return (
    <Dialog
      size={"md"}
      title={"Project settings"}
      open={saveAction.loading ? true : props.isOpen}
      onOpenChange={props.onOpenChange}
    >
      <DialogPanelContent>
        <div class={"flex flex-col gap-3"}>
          <TextField
            placeholder={"Enter a title"}
            label={"Title"}
            size={"md"}
            value={form.name}
            validationState={validations.name.state()}
            errorMessage={validations.name.errorMessage()}
            onChange={(value) => setForm("name", value)}
          />

          <TextArea
            placeholder={"Enter a description"}
            label={"Description"}
            size={"md"}
            options={{ autoResize: true }}
            value={form.description}
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
              if (
                Object.values(validations).some(
                  ({ state }) => state() === "invalid",
                )
              ) {
                return;
              }
              saveAction(unwrap(form));
            }}
          >
            Save
          </Button>
        </div>
      </DialogPanelFooter>
    </Dialog>
  );
}
