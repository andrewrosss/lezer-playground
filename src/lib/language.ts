import { LRLanguage, LanguageSupport } from "@codemirror/language";
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

export function buildLanguageSupport(grammar: string): LanguageSupport {
  const parser = buildParser(grammar);
  const language = LRLanguage.define({
    parser,
    languageData: {
      closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    },
  });
  return new LanguageSupport(language);
}
