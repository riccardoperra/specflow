import {
  createProjectPage,
  ProjectPageView,
} from "../../../../core/services/projects";
import { createStore, unwrap } from "solid-js/store";
import {
  Button,
  createSelectOptions,
  Dialog,
  DialogPanelContent,
  DialogPanelFooter,
  Select,
  TextArea,
  TextField,
} from "@codeui/kit";
import { makeAsyncAction } from "statebuilder/asyncAction";
import { ControlledDialogProps } from "../../../../core/utils/controlledDialog";
import { DIAGRAMS } from "../../../../core/constants/diagrams";
import { createSignal } from "solid-js";
import { SparklesIcon } from "../../../../icons/SparklesIcon";
import {
  generateMermaidDiagramCode,
  generateNewMermaidDiagramCode,
} from "../../../../core/services/gpt";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";

interface ProjectEditorPageSettingsDialogProps extends ControlledDialogProps {
  onSave: (projectPageView: ProjectPageView) => void;
  projectId: number;
}

interface Form {
  name: string;
  description: string;
  diagramType: string | null;
}

export function ProjectEditorNewPageDialog(
  props: ProjectEditorPageSettingsDialogProps,
) {
  const editorState = provideState(EditorState);
  const [submitted, setSubmitted] = createSignal(false);
  const [form, setForm] = createStore<Form>({
    name: "",
    description: "",
    diagramType: null,
  });

  const formValid = () => !!form.name && form.diagramType;

  const onSave = (projectPageView: ProjectPageView) => {
    props.onOpenChange(false);
    props.onSave(projectPageView);
  };

  const saveAction = makeAsyncAction((data: Form) =>
    createProjectPage(props.projectId, {
      name: form.name,
      description: form.description,
      diagramType: form.diagramType as keyof typeof DIAGRAMS,
    })
      .then((result) => onSave(result.data!))
      .catch(() => {
        // TODO add error toast
        alert("Error");
      }),
  );

  const generateWithAI = makeAsyncAction((data: Form) => {
    return generateNewMermaidDiagramCode(
      editorState.get.projectView!,
      data,
      data.description,
    ).then((result) => {
      return createProjectPage(props.projectId, {
        name: form.name,
        description: form.description,
        diagramType: form.diagramType as keyof typeof DIAGRAMS,
        content: result.choices[0].text.trim(),
      })
        .then((result) => onSave(result.data!))
        .catch(() => {
          // TODO add error toast
          alert("Error");
        });
    });
  });

  const diagramsOptions = createSelectOptions(
    Object.entries(DIAGRAMS).map(([k, v]) => ({
      label: v.name,
      value: k,
    })),
    { key: "label", valueKey: "value" },
  );

  const validations = {
    name: {
      state: () => (submitted() && !form.name ? "invalid" : undefined),
      errorMessage: () => "The field is required",
    },
    templateDiagram: {
      state: () => (submitted() && !form.diagramType ? "invalid" : undefined),
      errorMessage: () => "The field is required",
    },
  };

  return (
    <Dialog
      size={"xl"}
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

          <Select
            {...diagramsOptions.props()}
            {...diagramsOptions.controlled(
              () => form.diagramType ?? undefined,
              (v) => setForm("diagramType", v ?? null),
            )}
            options={diagramsOptions.options()}
            label={"Template diagram (required)"}
            multiple={false}
            required={true}
            size={"lg"}
            aria-label={"Template diagram"}
            validationState={validations.templateDiagram.state()}
            errorMessage={validations.templateDiagram.errorMessage()}
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
            loading={generateWithAI.loading}
            theme={"tertiary"}
            leftIcon={<SparklesIcon />}
            onClick={() => {
              setSubmitted(true);
              if (formValid()) {
                generateWithAI(unwrap(form));
              }
            }}
          >
            Generate with AI
          </Button>
          <Button
            loading={saveAction.loading || generateWithAI.loading}
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
