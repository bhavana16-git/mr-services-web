import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/routes/routePaths";

export default function BlogIndex() {
  const [search, setSearch] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, published_at, tags")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = (posts ?? []).filter((p) =>
    (p.title + p.excerpt).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Seo
        title="Blog | M. R. Services"
        description="Practical, plain-language guides on society accounting, bookkeeping, and compliance from M. R. Services."
        path={ROUTES.blog}
      />
      <Container className="max-w-4xl py-16">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">Blog</h1>
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 max-w-sm"
        />
        {isLoading && <p className="mt-8 text-neutral-700">Loading articles...</p>}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </>
  );
}


