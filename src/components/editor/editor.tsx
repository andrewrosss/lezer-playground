import {
  createCodeMirror,
  createEditorControlledValue,
} from "solid-codemirror";
import { TbChevronDown, TbChevronRight } from "solid-icons/tb";
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
  codeFolding,
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
    borderTop: "2px solid transparent",
    borderBottom: "2px solid transparent",
  },
  ".cm-line .cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
  },
  ".cm-line.cm-activeLine": {
    borderTop: "2px solid rgba(255, 255, 255, 0.05)",
    borderBottom: "2px solid rgba(255, 255, 255, 0.05)",
    backgroundColor: "transparent",
  },
  ".cm-cursor": {
    borderLeftWidth: "2px",
    height: "21px",
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
};

export function Editor(props: Props) {
  let editorEl!: HTMLDivElement;

  const [local, rest] = splitProps(props, [
    "value",
    "onValueChange",
    "language",
  ]);

  const {
    editorView,
    ref: setRef,
    createExtension,
  } = createCodeMirror({ onValueChange: local.onValueChange });

  // fold gutter
  const markerDOM = (open: boolean) =>
    (open ? (
      <TbChevronDown class="text-[1.25em]" />
    ) : (
      <TbChevronRight class="text-[1.25em]" />
    )) as HTMLElement;

  createEditorControlledValue(editorView, () => local.value);
  createExtension(BASE_THEME_EXTENSION);
  createExtension(BASIC_SETUP_EXTENSION);
  createExtension(BASE_FONT_EXTENSION);
  createExtension(() => vsCodeDark); // main theme
  createExtension(() => lineNumbers());
  createExtension(() => codeFolding());
  createExtension(() => foldGutter({ markerDOM }));
  createExtension(() =>
    EditorView.domEventHandlers({
      paste(event, view) {
        setTimeout(() => {
          const localValue = view.state.doc.toString();
          // TODO: tie this in with the editor state
          local.onValueChange(localValue);
        });
      },
    })
  );

  if (local.language) {
    createExtension(() => local.language);
  }

  onMount(() => setRef(() => editorEl));

  return (
    <code style={{ "background-color": background }} {...rest}>
      <div ref={(ref) => (editorEl = ref)} />
    </code>
  );
}
