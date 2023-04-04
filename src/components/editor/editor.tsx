import {
  createCodeMirror,
  createEditorControlledValue,
  createEditorReadonly,
} from "solid-codemirror";
import { ComponentProps, VoidProps, onMount, splitProps } from "solid-js";

import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  foldGutter,
  indentOnInput,
} from "@codemirror/language";
import { search, searchKeymap } from "@codemirror/search";
import { EditorState, Extension } from "@codemirror/state";
import {
  EditorView,
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { background, vsCodeDark } from "./themes/vsCodeDark";

// essentially the same as basicSetup from: https://codemirror.net/docs/ref/#codemirror
const BASIC_SETUP_EXTENSION: Extension = [
  highlightSpecialChars(),
  highlightActiveLine(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  history(),
  search({ top: true }),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...completionKeymap,
    ...historyKeymap,
    ...searchKeymap,
    indentWithTab,
  ]),
];

const BASE_THEME_EXTENSION = EditorView.theme({
  "&": {
    textAlign: "left",
    background: "transparent !important",
  },
  ".cm-content": {
    textAlign: "left",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
  },
  ".cm-lineNumbers": {
    position: "sticky",
    flexDirection: "column",
    flexShrink: 0,
  },
  ".cm-gutterElement": {
    display: "flex",
    alignItems: "center",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px 0 16px",
    lineHeight: "21px",
  },
  ".cm-line": {
    backgroundColor: "transparent",
  },
  ".cm-line .cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
  },
  ".cm-line.cm-activeLine": {
    // use a linear gradient to place a line above and below the active line
    // this is a workaround for the fact that the active line is not a real line
    // and therefore cannot have a border
    "--top-bottom-color": "rgba(255, 255, 255, 0.05)",
    background:
      "linear-gradient(to bottom, var(--top-bottom-color) 0 10%, transparent 10% 90%, var(--top-bottom-color) 90% 100%)",
  },
  ".cm-cursor": {
    borderLeftWidth: "2px",
    height: "21px",
  },
  ".cm-indent-markers": {
    "--indent-marker-bg-color": "rgba(255, 255, 255, 0.15)",
  },
  ".cm-gutter.cm-foldGutter": {
    backgroundColor: background,
  },
});

const BASE_FONT_EXTENSION = EditorView.theme({
  ".cm-content *": {
    fontFamily: `Source Code pro, monospace`,
    fontWeight: 500,
    fontVariantLigatures: "normal",
  },
  ".cm-gutters": {
    fontFamily: `Source Code pro, monospace`,
    fontWeight: 400,
    fontVariantLigatures: "normal",
  },
});

// see: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/apps/codeimage/src/state/editor/editor.ts#L40
// for a more complete editor state example

type Props = VoidProps<ComponentProps<"code">> & {
  value: string;
  onValueChange: (value: string) => void;
  language?: Extension;
  isReadOnly?: boolean;
};

export function Editor(props: Props) {
  let editorEl!: HTMLDivElement;

  const [local, rest] = splitProps(props, [
    "value",
    "onValueChange",
    "language",
    "isReadOnly",
  ]);

  const {
    editorView,
    ref: setRef,
    createExtension,
  } = createCodeMirror({ onValueChange: local.onValueChange });

  createEditorReadonly(editorView, () => !!local.isReadOnly);
  createEditorControlledValue(editorView, () => local.value);
  createExtension(BASE_THEME_EXTENSION);
  createExtension(BASIC_SETUP_EXTENSION);
  createExtension(BASE_FONT_EXTENSION);
  createExtension(() => vsCodeDark); // main theme
  createExtension(() => lineNumbers());
  createExtension(() => foldGutter({ openText: "⛛", closedText: "👉" }));
  createExtension(() => local.language ?? []);
  createExtension(() => indentationMarkers());
  createExtension(() =>
    EditorView.domEventHandlers({
      paste(event, view) {
        setTimeout(() => {
          const localValue = view.state.doc.toString();
          // TODO: is this causing a memory leak?
          local.onValueChange(localValue);
        });
      },
    })
  );

  onMount(() => setRef(() => editorEl));

  return (
    <code style={{ "background-color": background }} {...rest}>
      <div ref={(ref) => (editorEl = ref)} />
    </code>
  );
}
