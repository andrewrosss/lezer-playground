import { createRoot } from "solid-js";
import { Container, defineStore } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { JSONfromTree } from "~/lib/language";

import { buildParser } from "@lezer/generator";

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

const createAppStore = () => {
  const config = defineStore(() => ({
    editors: {
      grammar: { code: INITIAL_GRAMMAR },
      specimen: { code: INITIAL_SPECIMEN },
      tree: { code: INITIAL_TREE },
    },
    parser: INITIAL_PARSER,
  })).extend(
    withProxyCommands<{
      setGrammarCode: string;
      setSpecimenCode: string;
    }>()
  );

  const store = container.get(config);

  store
    .hold(store.commands.setGrammarCode, (code, { set, state }) => {
      const parser = buildParser(code);
      const specimenCode = state.editors.specimen.code;
      const treeCode = JSONfromTree(parser.parse(specimenCode));
      set("parser", parser);
      set("editors", "grammar", "code", code);
      set("editors", "tree", "code", treeCode);
    })
    .hold(store.commands.setSpecimenCode, (code, { set, state }) => {
      const treeCode = JSONfromTree(state.parser.parse(code));
      set("editors", "specimen", "code", code);
      set("editors", "tree", "code", treeCode);
    });

  return {
    get state() {
      return store.get;
    },
    setState: store.set,
    actions: store.actions,
  } as const;
};

let store: ReturnType<typeof createAppStore>;
const appStore = () => {
  if (!store) {
    console.log("creating app store");
    store = createAppStore();
  }
  return store;
};

export function getAppStore() {
  return appStore();
}
