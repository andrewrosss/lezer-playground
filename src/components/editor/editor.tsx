import {
  createCodeMirror,
  createEditorControlledValue,
} from "solid-codemirror";
import { TbChevronDown, TbChevronRight } from "solid-icons/tb";
import { ComponentProps, VoidProps, createSignal, onMount } from "solid-js";

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
import { javascript } from "@codemirror/lang-javascript";
import {
  bracketMatching,
  codeFolding,
  foldGutter,
  indentOnInput,
} from "@codemirror/language";
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

const EDITOR_BASE_SETUP: Extension = [
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
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...completionKeymap,
    ...historyKeymap,
    indentWithTab,
  ]),
];

interface Props {}

const selectedLanguage = "typescript";

export function Editor(props: VoidProps<ComponentProps<"div">>) {
  let editorEl!: HTMLDivElement;

  // see: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/apps/codeimage/src/state/editor/editor.ts#L40
  // for a more complete editor state example
  const [code, setCode] = createSignal(`\
function greet(name: string) {
  return "Hello, " + name + "!";
}

function helloWorld() {
  console.log(greet("world"));
}`);

  const {
    editorView,
    ref: setRef,
    createExtension,
  } = createCodeMirror({
    value: code(),
    onValueChange: setCode,
  });

  const baseTheme = EditorView.theme({
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

  const customFontExtension = (): Extension => {
    const fontName = "Source Code pro";
    return EditorView.theme({
      ".cm-content *": {
        fontFamily: `${fontName}, monospace`,
        fontWeight: 500,
        fontVariantLigatures: "normal",
      },
      ".cm-gutters": {
        fontFamily: `${fontName}, monospace`,
        fontWeight: 400,
        fontVariantLigatures: "normal",
      },
    });
  };

  // fold gutter
  const markerDOM = (open: boolean) =>
    (open ? (
      <TbChevronDown class="text-[1.25em]" />
    ) : (
      <TbChevronRight class="text-[1.25em]" />
    )) as HTMLElement;

  onMount(() => {
    setRef(() => editorEl);
  });
  createEditorControlledValue(editorView, () => code() ?? "");
  createExtension(() => codeFolding());
  createExtension(() => lineNumbers());
  createExtension(() => foldGutter({ markerDOM }));
  createExtension(EDITOR_BASE_SETUP);
  createExtension(baseTheme);
  createExtension(() => vsCodeDark); // theme
  createExtension(() => customFontExtension());
  createExtension(() => javascript({ jsx: true, typescript: true }));
  createExtension(() =>
    EditorView.domEventHandlers({
      paste(event, view) {
        setTimeout(() => {
          const localValue = view.state.doc.toString();
          // TODO: tie this in with the editor state
          setCode(localValue);
        });
      },
    })
  );

  return (
    <code
      class={`language-${selectedLanguage}`}
      classList={{ [props.class ?? ""]: !!props.class }}
      style={{ "background-color": background }}
    >
      <div ref={(ref) => (editorEl = ref)} />
    </code>
  );
}
