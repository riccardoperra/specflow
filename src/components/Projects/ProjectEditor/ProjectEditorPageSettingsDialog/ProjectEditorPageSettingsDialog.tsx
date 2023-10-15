import {
  Button,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
  TextField,
} from "@codeui/kit";
import {
  ProjectPageView,
  updateProjectContent,
  updateProjectSettings,
} from "../../../../core/services/projects";
import { makeAsyncAction } from "statebuilder/asyncAction";
import { createStore, unwrap } from "solid-js/store";
import { createEffect } from "solid-js";

interface ProjectEditorPageSettingsDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSave: (projectPageView: ProjectPageView) => void;
  projectPage: ProjectPageView;
}

interface Form {
  name: string;
  description: string;
}

export function ProjectEditorPageSettingsDialog(
  props: ProjectEditorPageSettingsDialogProps,
) {
  const [form, setForm] = createStore<Form>({
    name: props.projectPage.name,
    description: props.projectPage.description ?? "",
  });

  createEffect(
    () => props.projectPage,
    setForm({
      description: props.projectPage.description ?? "",
      name: props.projectPage.name,
    }),
  );

  const onSave = (projectPageView: ProjectPageView) => {
    props.onOpenChange(false);
    props.onSave(projectPageView);
  };

  const saveAction = makeAsyncAction((data: Form) =>
    updateProjectSettings(props.projectPage.id, data)
      .then((result) => onSave(result.data!))
      .catch(() => {
        // TODO add error toast
        alert("Error");
      }),
  );

  return (
    <Dialog
      size={"md"}
      title={"Page settings"}
      open={saveAction.loading ? true : props.open}
      onOpenChange={props.onOpenChange}
    >
      <DialogPanelContent>
        <div class={"flex flex-col gap-3"}>
          <TextField
            placeholder={"Enter a title"}
            label={"Title"}
            size={"md"}
            value={form.name}
            onChange={(value) => setForm("name", value)}
          />

          <TextField
            placeholder={"Enter a description"}
            label={"Description"}
            size={"md"}
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
            onClick={() => saveAction(unwrap(form))}
          >
            Save
          </Button>
        </div>
      </DialogPanelFooter>
    </Dialog>
  );
}
