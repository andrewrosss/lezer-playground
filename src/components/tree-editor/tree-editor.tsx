import { createSignal } from "solid-js";
import { Editor } from "~/components/editor";

import { json } from "@codemirror/lang-json";

const INITIAL_TREE = `\
{
  "name": "Program",
  "from": 0,
  "to": 13,
  "children": [
    {
      "name": "BinaryExpression",
      "from": 0,
      "to": 13,
      "children": [
        {
          "name": "Number",
          "from": 1,
          "to": 4,
          "children": []
        },
        {
          "name": "Operator",
          "from": 4,
          "to": 5,
          "children": []
        },
        {
          "name": "BinaryExpression",
          "from": 5,
          "to": 12,
          "children": [
            {
              "name": "Name",
              "from": 6,
              "to": 9,
              "children": []
            },
            {
              "name": "Operator",
              "from": 9,
              "to": 10,
              "children": []
            },
            {
              "name": "Number",
              "from": 10,
              "to": 11,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
`;

export const TreeEditor = () => {
  const [code, setCode] = createSignal(INITIAL_TREE);

  return (
    <section
      class="w-full h-full grid"
      style={{ "grid-template-rows": "auto 1fr" }}
    >
      <h2 class="px-4 py-2 text-sm border-b border-slate-700">Tree</h2>

      {/* the classes: 'flex-auto overflow-y-auto h-24' are inspired by this
          answer (https://stackoverflow.com/a/14964944) to make the element
          grow and scroll when it's bigger */}
      <div class="overflow-auto flex flex-col">
        <Editor
          class="flex-auto overflow-y-auto h-24 text-sm"
          value={code()}
          onValueChange={setCode}
          language={json()}
        />
      </div>
    </section>
  );
};
