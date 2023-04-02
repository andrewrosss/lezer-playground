import "~/root.css";

// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import { Providers } from "~/components/providers";
import { RootLayout } from "~/components/root-layout";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Lezer Playground</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Providers>
              <RootLayout>
                <Routes>
                  <FileRoutes />
                </Routes>
              </RootLayout>
            </Providers>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
