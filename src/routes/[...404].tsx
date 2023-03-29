import { A } from "solid-start";

export default function NotFound() {
  return (
    <main class="p-4 h-full w-full grid place-content-center">
      <section class="min-w-[300px] p-8 sm:p-16 rounded-xl sm:rounded-2xl flex flex-col items-center gap-8 border border-slate-200">
        <h1 class="text-5xl sm:text-6xl text-slate-700 text-center font-extralight uppercase">
          Not Found
        </h1>
        <p class="my-4">
          <A href="/" class="text-blue-500 font-medium hover:underline">
            Back to home
          </A>
        </p>
      </section>
    </main>
  );
}
