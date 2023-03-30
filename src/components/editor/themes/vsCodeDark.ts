import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

// from: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/packages/highlight/src/lib/core/define-editor-theme.ts#L29

interface ThemeOptions {
  darkMode: boolean;
  selection?: Partial<StyledSelectionOptions>;
  cursor?: StyledCursorOptions;
  lineNumbers?: StyledLineNumbersOptions;
  autocomplete: StyledAutoCompleteOptions;
  highlight: StyledHighlightOptions;
}

const defineEditorTheme = (theme: ThemeOptions) => {
  const { darkMode, highlight, selection, autocomplete, cursor, lineNumbers } =
    theme;

  const base = EditorView.theme({
    "&": {
      color: highlight.base,
    },
  });

  return [
    base,
    styledCursor({
      color: cursor?.color ?? (darkMode ? "#FFF" : "#000"),
    }),
    lineNumbers?.color
      ? styledLineNumbers({
          color: lineNumbers?.color ?? (darkMode ? "#FFF" : "#000"),
        })
      : [],
    styledSelection({
      backgroundColor: selection?.backgroundColor ?? `${highlight.keywords}50`,
      color: selection?.color ?? "inherit",
    }),
    styledAutocomplete(autocomplete),
    styledHighlight(highlight),
  ];
};

// from: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/packages/highlight/src/lib/plugins/autocomplete-style.ts#L10

interface StyledAutoCompleteOptions {
  background: string;
  border?: string;
  selectedBackground: string;
  selectedColor?: string;
}

function styledAutocomplete(options: StyledAutoCompleteOptions) {
  return EditorView.theme({
    ".cm-tooltip": {
      border: options.border ? `1px solid ${options.border}` : "none",
      backgroundColor: options.background,
      borderRadius: "6px",
    },

    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: options.background,
      borderBottomColor: options.background,
    },

    ".cm-tooltip-autocomplete": {
      "& > ul > li": {
        padding: "6px !important",
      },
      "& > ul > li[aria-selected]": {
        backgroundColor: options.selectedBackground,
        color: options.selectedColor ?? "inherit",
      },
    },
  });
}

// from: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/packages/highlight/src/lib/plugins/cursor-style.ts#L7

interface StyledCursorOptions {
  color: string;
}

function styledCursor(options: StyledCursorOptions) {
  return EditorView.theme({
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: options.color },
  });
}

// from: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/packages/highlight/src/lib/plugins/highlight-style.ts#L35

interface StyledHighlightOptions {
  base: string;
  delimiters: string;
  function?: string;
  comments: string;
  numbers: string;
  regexp: string;
  tag: string;
  variableName: string;
  variableNameSpecial?: string;
  keywords: string;
  strings: string;
  boolean?: string;
  background?: string;
  quote?: string;
  meta?: string;
  punctuation?: string;
  paren?: string;
  brackets?: string;
  moduleKeyword?: string;
  propertyName?: string;
  annotation?: string;
  attrName?: string;
  attrValue?: string;
  className?: string;
  operators?: string;
  self?: string;
  typeName?: string;
  atom?: string;
}

function styledHighlight(h: StyledHighlightOptions) {
  return syntaxHighlighting(
    HighlightStyle.define([
      // Base
      {
        tag: [t.emphasis],
        fontStyle: "italic",
      },
      {
        tag: [t.strong],
        fontStyle: "bold",
      },
      {
        tag: [t.link],
        color: h.delimiters,
      },
      { tag: t.local(t.variableName), color: h.variableName },
      { tag: t.definition(t.propertyName), color: h.propertyName },
      { tag: t.special(t.variableName), color: h.variableNameSpecial },
      // Keywords
      {
        tag: [t.moduleKeyword],
        color: h.moduleKeyword ?? h.keywords,
      },
      {
        tag: [t.keyword],
        color: h.keywords,
      },
      {
        tag: [t.typeName, t.typeOperator],
        color: h.typeName ?? h.keywords,
      },
      {
        tag: [t.changed, t.annotation, t.modifier, t.namespace],
        color: h.keywords,
      },
      // Operators
      {
        tag: [t.operator, t.special(t.string)],
        color: h.operators ?? h.delimiters,
      },
      // Type
      {
        tag: [t.bool],
        color: h.boolean ?? h.strings,
      },
      {
        tag: [t.number],
        color: h.numbers,
      },
      {
        tag: [t.string, t.processingInstruction, t.inserted],
        color: h.strings,
      },
      // Classes
      {
        tag: [t.className, t.namespace],
        color: h.className ?? h.function ?? h.base,
      },
      {
        tag: [t.self],
        color: h.self ?? h.keywords,
      },
      // Function
      {
        // Function name with @codemirror/language 0.20
        tag: [t.color, t.constant(t.name), t.standard(t.name)],
        color: h.function,
      },
      {
        tag: [t.function(t.variableName), t.function(t.propertyName)],
        color: h.function,
      },
      // Meta
      { tag: [t.annotation], color: h.annotation ?? h.keywords },
      { tag: [t.punctuation], color: h.punctuation ?? h.delimiters },
      { tag: [t.paren], color: h.paren ?? h.punctuation },
      {
        tag: [t.squareBracket, t.bracket, t.angleBracket],
        color: h.brackets ?? h.delimiters,
      },
      { tag: [t.meta], color: h.meta ?? h.keywords },
      // Other
      { tag: [t.comment], color: h.comments },
      { tag: [t.regexp], color: h.regexp },
      { tag: [t.tagName], color: h.tag },
      {
        tag: [t.atom],
        color: h.atom,
      },
      {
        tag: [t.attributeValue],
        color: h.attrValue ?? h.strings,
      },
      {
        tag: [t.attributeName],
        color: h.attrName ?? h.base,
      },
      // Markdown
      { tag: [t.heading], color: h.keywords, fontWeight: "bold" },
      { tag: [t.quote], color: h.quote },
    ])
  );
}

// from: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/packages/highlight/src/lib/plugins/line-numbers-style.ts#L7

interface StyledLineNumbersOptions {
  color: string;
}

function styledLineNumbers(options: StyledLineNumbersOptions) {
  return EditorView.theme({
    ".cm-lineNumbers .cm-gutterElement": { color: options.color },
  });
}

// from: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/packages/highlight/src/lib/plugins/selection-style.ts#L9

interface StyledSelectionOptions {
  backgroundColor: string;
  color: string;
  activeLine?: string;
}

function styledSelection(options: StyledSelectionOptions) {
  return EditorView.theme({
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        background: options.backgroundColor,
      },
    ".cm-activeLine": {
      backgroundColor: options.activeLine ?? "unset",
    },
  });
}

// from: https://github.com/riccardoperra/codeimage/blob/2ad1730b747b2cd39dc184b6e42f18455a02fa15/packages/highlight/src/lib/themes/vsCodeDark/vsCodeDark.ts#L22

export const background = "#262335";
const foreground = "hsl(204, 3%, 98%)";
const identifier = "hsl(204, 98%, 80%)";
const selection = "hsl(210, 52%, 31%)";
const selectionMatch = "hsl(210, 12%, 22%)";
const matchingBracket = "hsla(204, 3%, 80%, 0.5)";
const lineNumber = "hsl(204, 3%, 50%)";
const activeLine = "hsla(204, 3%, 20%, 0.4)";
const keyword = "hsl(207, 65%, 59%)";
const comment = "hsl(101, 33%, 47%)";
const number = "hsl(99, 28%, 73%)";
const string = "hsl(17, 60%, 64%)";
const func = "hsl(60,42%,76%)";
const regex = "hsl(0, 60%, 62%)";
const tag = "hsl(168, 60%, 55%)";
const purple = "#C586C0";
const yellow = "#DBD700";

export const vsCodeDark = [
  defineEditorTheme({
    selection: {
      backgroundColor: selection,
      activeLine: activeLine,
    },
    lineNumbers: {
      color: lineNumber,
    },
    cursor: {
      color: foreground,
    },
    highlight: {
      base: identifier,
      tag,
      keywords: keyword,
      comments: comment,
      numbers: number,
      strings: string,
      function: func,
      regexp: regex,
      boolean: number,
      propertyName: identifier,
      variableName: identifier,
      punctuation: foreground,
      attrValue: string,
      className: tag,
      delimiters: foreground,
      annotation: string,
      moduleKeyword: purple,
      brackets: yellow,
      paren: yellow,
      typeName: tag,
    },
    darkMode: true,
    autocomplete: {
      background: "#1E1E1E",
      selectedBackground: "#191818",
    },
  }),
  EditorView.theme({
    ".cm-matchingBracket": {
      backgroundColor: selectionMatch,
      outline: `1px solid ${matchingBracket}`,
    },
  }),
];
