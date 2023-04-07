import { Editor } from "~/components/editor";
import { languageFromParser } from "~/lib/language";
import { getAppStore } from "~/lib/state";

export const SpecimenEditor = () => {
  const {
    state,
    actions: { setSpecimenCode },
  } = getAppStore();
  const language = () =>
    state.parser.parser != null
      ? languageFromParser(state.parser.parser)
      : undefined;

  return (
    <section
      class="w-full h-full grid"
      style={{ "grid-template-rows": "auto 1fr" }}
    >
      <h2 class="px-4 py-2 text-sm border-b border-slate-700">Test String</h2>

      {/* the classes: 'flex-auto overflow-y-auto h-24' are inspired by this
          answer (https://stackoverflow.com/a/14964944) to make the element
          grow and scroll when it's bigger */}
      <div class="overflow-auto flex flex-col">
        <Editor
          class="flex-auto overflow-y-auto h-24 text-sm"
          value={state.editors.specimen.code}
          onValueChange={setSpecimenCode}
          language={language()}
        />
      </div>
    </section>
  );
};
