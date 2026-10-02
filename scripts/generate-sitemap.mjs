import { createClient } from "@supabase/supabase-js";
import { writeFileSync, existsSync } from "fs";

// Local builds: read .env.local (Netlify sets these values itself)
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const siteUrl = process.env.VITE_SITE_URL;

const staticRoutes = [
  "/", "/about", "/services", "/why-choose-us", "/faq", "/blog", "/contact", "/terms", "/privacy",
];

const { data: posts } = await supabase
  .from("blog_posts")
  .select("slug")
  .eq("is_published", true);

const urls = [
  ...staticRoutes,
  ...(posts ?? []).map((p) => `/blog/${p.slug}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${siteUrl}${u}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);


