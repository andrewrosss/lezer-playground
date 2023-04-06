import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { Tree } from "@lezer/common";
import { buildParser } from "@lezer/generator";

// TODO: ability to load particular version of @lezer/generator from CDN
//         - also have to change the language support to match that version?
//
// import { createResource } from "solid-js";
//
// const lezerGeneratorUrl = (version?: string | null) => {
//   const v = version != null ? `@${version}` : "";
//   return `https://cdn.skypack.dev/@lezer/generator${v}?min`;
// };
//
// export const parserBuilderResource = () =>
//   createResource(() => import(lezerGeneratorUrl()).then((m) => m.buildParser));

export function languageFromParser(
  parser: ReturnType<typeof buildParser>
): LanguageSupport {
  const language = LRLanguage.define({
    parser,
    languageData: {
      closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    },
  });
  return new LanguageSupport(language);
}

export function languageFromGrammar(grammar: string): LanguageSupport {
  const parser = buildParser(grammar);
  return languageFromParser(parser);
}

export function JSONFromTree(tree: Tree, text: string): string {
  let json = "";
  tree.iterate({
    enter(type) {
      const { name, from, to } = type;
      const value = text.slice(from, to);
      const obj = { type: name, from, to, value, children: [] };
      json += JSON.stringify(obj).slice(0, -2);
    },
    leave(type) {
      json += `]}`;
      if (type.node.nextSibling != null) json += `,`;
    },
  });
  return JSON.stringify(JSON.parse(json), null, 2);
}
