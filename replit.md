# besindegerim.com - Türkçe Besin Değerleri Platformu

## Overview

besindegerim.com is a Turkish-language nutritional values platform providing real portion-based calorie and nutrient information. It leverages data from the USDA FoodData Central API, utilizes AI-generated professional visuals, and is designed to function fully even with JavaScript disabled, ensuring robust SEO. The platform also offers 16 scientific calculators for comprehensive nutrition and fitness tools. Its primary purpose is to deliver accurate, easily accessible nutritional data to Turkish users, supporting healthier dietary choices.

## User Preferences

The user prefers detailed explanations for complex topics. The user wants the agent to prioritize high-level architectural decisions and system design over granular implementation details when discussing changes or proposing new features. Before making any significant changes to the codebase, the user wants the agent to ask for explicit approval. Do not make changes to the `attached_assets/` folder.

## System Architecture

The platform is built on an SSR (Server-Side Rendering) architecture using React on the frontend and Express.js with Node.js on the backend. It employs a pure HTML rendering approach, returning only strings without client-side React components for initial loads. A Bot Detection Middleware ensures SSR for bots and static file serving for production. Meta tags are dynamically injected using a `REPLACE` strategy within `client/index.html` placeholders to optimize SEO without duplicate tags.

**Key Architectural Decisions:**

*   **SSR First:** Prioritizes server-side rendering for performance and SEO, ensuring full functionality even with JavaScript disabled.
*   **Database:** PostgreSQL is used for storing food data, serving sizes, nutritional information, and a hierarchical category system. Drizzle ORM manages database interactions.
*   **Caching:** An in-memory, TTL-based cache is implemented to reduce API calls to USDA and ensure fast response times for frequently accessed data.
*   **SEO Optimization:** Extensive SEO features include unique meta tags (title, description, keywords), canonical URLs, Open Graph, Twitter Cards, and JSON-LD structured data (NutritionInformation, BreadcrumbList, Organization, FAQPage, Article).
*   **URL Structure:** Slug-based routing for food items (`/:slug`) and a hierarchical category system (`/kategori/:categorySlug`, `/kategori/:categorySlug/:subcategorySlug`) with ASCII-converted Turkish characters for SEO-friendly URLs.
*   **UI/UX:** Modern, responsive design using Tailwind CSS with a green gradient theme. Features include a glassmorphic search bar, Shadcn Card components, and a responsive navigation system (horizontal scroll with hover dropdowns for desktop, hamburger menu for mobile).
*   **Image Handling:** Utilizes 326 AI-generated (DALL-E 3) professional food photos, achieving 100% product image coverage. Images are optimized from PNG to WebP using the Sharp library, resulting in 92-98% size reduction, and served with aggressive cache headers.

## External Dependencies

*   **API:** USDA FoodData Central API for nutritional data.
*   **Database:** PostgreSQL (standard `pg` driver) for data storage.
*   **Image Generation:** OpenAI DALL-E 3 for AI-generated food images.
*   **Image Processing:** Sharp library for image optimization (PNG to WebP conversion).
*   **Deployment Tools:** PM2 (process manager), Nginx (reverse proxy), Ubuntu 22.
*   **Hosting Platform:** Replit.