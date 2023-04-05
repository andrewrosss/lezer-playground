import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { createEffect, createRoot, on } from "solid-js";
import { Container, defineStore } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { z } from "zod";
import { JSONfromTree } from "~/lib/language";

import { buildParser } from "@lezer/generator";
import { debounce } from "@solid-primitives/scheduled";

export const container = createRoot(() => Container.create());

const DEFAULT_GRAMMAR = `\
@top Program { expression }

expression { Name | Number | BinaryExpression }

BinaryExpression { "(" expression Operator expression ")" }

@tokens {
  Name { @asciiLetter+ }
  Number { @digit+ }
  Operator { $[+-] }
}

@detectDelim
`;

const DEFAULT_SPECIMEN = `(100-(foo+4))`;

const STORAGE_KEY = "lezer-playground-state";
const storageSchema = z.object({
  editors: z.object({
    grammar: z.object({ code: z.string() }),
    specimen: z.object({ code: z.string() }),
  }),
});

type TState = {
  editors: {
    grammar: { code: string };
    specimen: { code: string };
    tree: { code: string };
  };
  parser:
    | { parser: ReturnType<typeof buildParser>; error: null }
    | { parser: null; error: string };
};

function generateState(grammar: string, specimen: string): TState {
  let parser: ReturnType<typeof buildParser>;
  try {
    parser = buildParser(grammar);
  } catch (e) {
    const genericMessage = "Failed to build parser";
    const message = e instanceof Error ? e.message : genericMessage;
    return {
      editors: {
        grammar: { code: grammar },
        specimen: { code: specimen },
        tree: { code: "{}" },
      },
      parser: { parser: null, error: message },
    };
  }

  return {
    editors: {
      grammar: { code: grammar },
      specimen: { code: specimen },
      tree: { code: JSONfromTree(parser.parse(specimen)) },
    },
    parser: { parser, error: null },
  };
}

const store = createRoot(() => {
  const config = defineStore(() =>
    generateState(DEFAULT_GRAMMAR, DEFAULT_SPECIMEN)
  )
    .extend((state) => {
      const storageState = deserializeStateFromStorage();
      if (storageState != null) {
        const {
          editors: { grammar, specimen },
        } = storageState;
        state.set(generateState(grammar.code, specimen.code));
      }

      const g = () => state().editors.grammar.code;
      const s = () => state().editors.specimen.code;

      createEffect(
        on([g, s], () => {
          console.log("saving state to storage", g(), s());
          serializeStateToStorage(state());
        })
      );
    })
    .extend(
      withProxyCommands<{
        setGrammarCode: string;
        setSpecimenCode: string;
        rebuildParser: void;
        rebuildTree: void;
        parserGenerationError: string | null;
      }>()
    );

  const store = container.get(config);

  const debouncedDispatch = debounce(store.dispatch, 500);

  store
    .hold(store.commands.setGrammarCode, (code, { set }) => {
      set("editors", "grammar", "code", code);
      debouncedDispatch(store.commands.rebuildParser, void 0);
    })
    .hold(store.commands.setSpecimenCode, (code, { set }) => {
      set("editors", "specimen", "code", code);
      setTimeout(() => store.actions.rebuildTree());
    })
    .hold(store.commands.rebuildParser, (_void0, { set, state }) => {
      try {
        const parser = buildParser(state.editors.grammar.code);
        set("parser", "parser", parser);
        set("parser", "error", null);
        setTimeout(() => store.actions.rebuildTree());
      } catch (e) {
        const genericMessage = "Failed to build parser";
        const message = e instanceof Error ? e.message : genericMessage;
        set("parser", "error", message);
        set("parser", "parser", null);
      }
    })
    .hold(store.commands.rebuildTree, (_void0, { set, state }) => {
      const parser = state.parser.parser;
      if (parser == null) return; // cannot rebuild tree without parser
      const specimenCode = state.editors.specimen.code;
      const treeCode = JSONfromTree(parser.parse(specimenCode));
      set("editors", "tree", "code", treeCode);
    });

  return {
    get state() {
      return store.get;
    },
    setState: store.set,
    actions: store.actions,
  } as const;
});

export function getAppStore() {
  return store;
}

// --- state serialization plugin ---

function serializeStateToStorage(state: any): void {
  const serialized = storageSchema.safeParse(state); // will strip out extra fields
  if (!serialized.success) return;
  const s = JSON.stringify(serialized.data);
  compressToHash(s);
  // compressToLocalStorage(s);
}

function deserializeStateFromStorage():
  | z.infer<typeof storageSchema>
  | undefined {
  const s = decompressFromHash(); //?? decompressFromLocalStorage();
  if (s == null) return;
  let state: any;
  try {
    state = JSON.parse(s);
  } catch (e) {
    console.log("Failed to parse state from storage", e);
    return;
  }
  const parsed = storageSchema.safeParse(state);
  if (!parsed.success) return;
  return parsed.data;
}

function compressToHash(s: string): void {
  if (typeof window === "undefined") return;
  const compressed = compressToEncodedURIComponent(s);
  window.location.hash = `#${compressed}`;
}

function decompressFromHash(): string | undefined {
  if (typeof window === "undefined") return;
  const match = window.location.hash.match(/#(.*)$/);
  if (!match) return;
  const compressed = match[1];
  const s = decompressFromEncodedURIComponent(compressed);
  return s;
}

function compressToLocalStorage(s: string): void {
  if (typeof window === "undefined") return;
  const compressed = compressToEncodedURIComponent(s);
  window.localStorage.setItem(STORAGE_KEY, compressed);
}

function decompressFromLocalStorage(): string | undefined {
  if (typeof window === "undefined") return;
  const compressed = window.localStorage.getItem(STORAGE_KEY);
  if (!compressed) return;
  const s = decompressFromEncodedURIComponent(compressed);
  return s;
}
