import { Show } from "solid-js";
import { Editor } from "~/components/editor";
import { getAppStore } from "~/lib/state";

import { lezer } from "@codemirror/lang-lezer";

export const GrammarEditor = () => {
  const {
    state,
    actions: { setGrammarCode },
  } = getAppStore();

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
          value={state.editors.grammar.code}
          onValueChange={setGrammarCode}
          language={lezer()}
        />
      </div>

      <Show when={state.parser.error != null}>
        <div class="p-2 bg-rose-300 text-rose-900 font-mono overflow-x-auto">
          <pre>Error: {state.parser.error}</pre>
        </div>
      </Show>
    </section>
  );
};
