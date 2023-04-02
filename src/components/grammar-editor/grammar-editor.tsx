import { createSignal } from "solid-js";
import { Editor } from "~/components/editor";

import { lezer } from "@codemirror/lang-lezer";

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

export const GrammarEditor = () => {
  const [code, setCode] = createSignal(INITIAL_GRAMMAR);

  return (
    <section
      class="w-full h-full grid"
      style={{ "grid-template-rows": "auto 1fr" }}
    >
      <h2 class="px-4 py-2 text-sm border-b border-slate-700">Grammar</h2>

      {/* the classes: 'flex-auto overflow-y-auto h-24' are inspired by this
          answer (https://stackoverflow.com/a/14964944) to make the element
          grow and scroll when it's bigger */}
      <div class="overflow-auto flex flex-col">
        <Editor
          class="flex-auto overflow-y-auto h-24 text-sm"
          value={code()}
          onValueChange={setCode}
          language={lezer()}
        />
      </div>
    </section>
  );
};
