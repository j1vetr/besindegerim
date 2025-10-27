// SSR Rendering logic
import React from "react";
import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Read the compiled CSS for SSR
let cssContent: string = "";
try {
  // In production, Vite builds CSS to dist/assets
  // In development, we'll inject a link to the dev server
  const isDev = process.env.NODE_ENV !== "production";
  
  if (!isDev) {
    // Try to read the built CSS file
    const cssPath = join(process.cwd(), "dist", "assets", "index.css");
    try {
      cssContent = readFileSync(cssPath, "utf-8");
    } catch (e) {
      // CSS not found, will use dev mode
    }
  }
} catch (e) {
  console.warn("CSS file not found for SSR, using dev mode");
}

/**
 * Render a React component to HTML string with injected CSS
 * @param component - React component to render
 * @param pageProps - Serialized props for client-side hydration (optional)
 */
export function renderComponentToHTML(
  component: ReactElement,
  pageProps?: any
): string {
  // Create a QueryClient for SSR
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity, // Prevent refetching during SSR
        retry: false, // Don't retry failed queries during SSR
      },
    },
  });

  // Wrap component with QueryClientProvider for SSR
  const wrappedComponent = React.createElement(
    QueryClientProvider,
    { client: queryClient },
    component
  );

  const reactHtml = renderToString(wrappedComponent);
  
  // Inject compiled CSS or dev server link
  const isDev = process.env.NODE_ENV !== "production";
  const styleTag = isDev
    ? '<link rel="stylesheet" href="/src/index.css" />'
    : `<style>${cssContent}</style>`;

  // Serialize props for client hydration (if provided)
  const propsScript = pageProps
    ? `<script id="__PAGE_PROPS__" type="application/json">${JSON.stringify(pageProps)}</script>`
    : '';

  // Wrap in a div with id="root" for client-side hydration
  return `
    ${styleTag}
    ${propsScript}
    <div id="root">${reactHtml}</div>
  `;
}
