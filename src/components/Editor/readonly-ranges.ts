import {
  EditorState,
  StateEffect,
  StateField,
  Transaction,
} from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

const addUnderline = StateEffect.define<{ from: number; to: number }>({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  }),
});

const disabledLineField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes);
    for (let e of tr.effects)
      if (e.is(addUnderline)) {
        underlines = underlines.update({
          add: [underlineMark.range(e.value.from, e.value.to)],
        });
      }
    return underlines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const underlineMark = Decoration.mark({ class: "cm-disabled-line" });

export function readOnlyTransactionFilter() {
  return EditorState.transactionFilter.of((tr) => {
    let readonlyRangeSet = tr.startState.field(disabledLineField, false);
    if (
      readonlyRangeSet &&
      tr.docChanged &&
      !tr.annotation(Transaction.remote)
    ) {
      let block = false;
      tr.changes.iterChangedRanges((chFrom, chTo) => {
        readonlyRangeSet!.between(chFrom, chTo, (roFrom, roTo) => {
          if (chTo > roFrom && chFrom < roTo) block = true;
        });
      });
      if (block) return [];
    }
    return tr;
  });
}

export function disabledLineSelection(
  view: EditorView,
  from: number,
  to: number,
) {
  let effects: StateEffect<unknown>[] = [addUnderline.of({ from, to })];
  if (!effects.length) return false;

  if (!view.state.field(disabledLineField, false))
    effects.push(StateEffect.appendConfig.of([disabledLineField]));
  view.dispatch({ effects });
  return true;
}
