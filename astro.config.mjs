import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { transformerMetaWordHighlight, transformerMetaHighlight } from '@shikijs/transformers';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://yusuf.fyi",
  integrations: [mdx(), sitemap(), tailwind(), react()],
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      theme: "vitesse-light",
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://shiki.style/languages
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: false,
      // Add custom transformers: https://shiki.style/guide/transformers
      // Find common transformers: https://shiki.style/packages/transformers
      transformers: [
        transformerMetaWordHighlight(),
        transformerMetaHighlight(),
        {
          pre(node) {
            if (!this.options.meta) {
              return
            }

            if (!this.options.meta.__raw) {
              return
            }
            const meta = this.options.meta.__raw
            const titleMatch = meta.match(/title="([^"]*)"/);
            const title = titleMatch?.[1] ?? null;
            node.properties['data-title'] = title
          }
        }
      ],
    }
  }
});
