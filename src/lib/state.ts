import { createRoot } from "solid-js";
import { Container, defineStore } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
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
  ).extend(
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
