// SSR Rendering logic
import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import { readFileSync } from "fs";
import { join } from "path";

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
 */
export function renderComponentToHTML(component: ReactElement): string {
  const reactHtml = renderToString(component);
  
  // Inject compiled CSS or dev server link
  const isDev = process.env.NODE_ENV !== "production";
  const styleTag = isDev
    ? '<link rel="stylesheet" href="/src/index.css" />'
    : `<style>${cssContent}</style>`;

  // Wrap in a div with id="root" for client-side hydration (if needed)
  return `
    ${styleTag}
    <div id="root">${reactHtml}</div>
  `;
}
