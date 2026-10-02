import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import BlogContent from "@/components/blog/BlogContent";
import NotFound from "@/pages/public/NotFound";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const safeSlug = slug ?? "";

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", safeSlug)
        .eq("is_published", true)
        .maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <Container className="py-16">Loading...</Container>;
  if (!post) return <NotFound />;

  return (
    <>
      <Seo title={`${post.title} | M. R. Services Blog`} description={post.excerpt ?? post.title} path={ROUTES.blogPost(post.slug)} />
      <Container className="max-w-3xl py-16">
        <Link to={ROUTES.blog} className="text-sm text-primary-500 hover:underline">&larr; Back to Blog</Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-neutral-900 md:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-neutral-400">
          {post.published_at ? formatDate(post.published_at) : ""}
        </p>
        <div className="mt-8">
          <BlogContent markdown={post.content_markdown} />
        </div>
      </Container>
    </>
  );
}







