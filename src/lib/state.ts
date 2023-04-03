import { createRoot } from "solid-js";
import { Container, defineStore } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { JSONfromTree } from "~/lib/language";

import { buildParser } from "@lezer/generator";
import { debounce } from "@solid-primitives/scheduled";

export const container = createRoot(() => Container.create());

const INITIAL_GRAMMAR = `\
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

const INITIAL_PARSER = buildParser(INITIAL_GRAMMAR);

const INITIAL_SPECIMEN = `(100-(foo+4))`;

const INITIAL_TREE = JSONfromTree(INITIAL_PARSER.parse(INITIAL_SPECIMEN));

const store = createRoot(() => {
  const config = defineStore(() => ({
    editors: {
      grammar: { code: INITIAL_GRAMMAR },
      specimen: { code: INITIAL_SPECIMEN },
      tree: { code: INITIAL_TREE },
    },
    parser: {
      parser: INITIAL_PARSER,
      error: null as string | null,
    },
  })).extend(
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
      debouncedDispatch(store.commands.rebuildTree, void 0);
    })
    .hold(store.commands.rebuildParser, (_void0, { set, state }) => {
      try {
        const parser = buildParser(state.editors.grammar.code);
        set("parser", "parser", parser);
        set("parser", "error", null);
        store.dispatch(store.commands.rebuildTree, void 0);
      } catch (e) {
        const genericMessage = "Failed to build parser";
        const message = e instanceof Error ? e.message : genericMessage;
        set("parser", "error", message);
      }
    })
    .hold(store.commands.rebuildTree, (_void0, { set, state }) => {
      const parser = state.parser.parser;
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
