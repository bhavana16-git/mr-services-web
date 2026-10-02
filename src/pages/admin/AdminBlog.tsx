import { useState } from "react";
import {
  useAdminBlogPosts, useSaveBlogPost, useToggleBlogPublished, useDeleteBlogPost,
  errorMessage, type BlogFormValues,
} from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import Seo from "@/components/common/Seo";
import BlogContent from "@/components/blog/BlogContent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

type BlogRow = NonNullable<ReturnType<typeof useAdminBlogPosts>["data"]>[number];

const EMPTY_FORM: BlogFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  content_markdown: "",
  meta_description: "",
  tags: [],
  is_published: false,
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminBlog() {
  const { session } = useAuth();
  const { data: posts, isLoading, error } = useAdminBlogPosts();
  const savePost = useSaveBlogPost();
  const togglePublished = useToggleBlogPublished();
  const deletePost = useDeleteBlogPost();

  const [form, setForm] = useState<BlogFormValues | null>(null); // null means the form is closed
  const [existingPublishedAt, setExistingPublishedAt] = useState<string | null>(null);
  const [tagsText, setTagsText] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function openNew() {
    setForm({ ...EMPTY_FORM });
    setExistingPublishedAt(null);
    setTagsText("");
    setSlugEdited(false);
    setShowPreview(false);
    setFormError(null);
    setNotice(null);
  }

  function openEdit(post: BlogRow) {
    setForm({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      content_markdown: post.content_markdown,
      meta_description: post.meta_description ?? "",
      tags: post.tags ?? [],
      is_published: post.is_published,
    });
    setExistingPublishedAt(post.published_at);
    setTagsText((post.tags ?? []).join(", "));
    setSlugEdited(true); // never auto-change the slug of an existing post: it is the public link
    setShowPreview(false);
    setFormError(null);
    setNotice(null);
  }

  function closeForm() {
    setForm(null);
    setFormError(null);
  }

  function setField<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function handleTitleChange(value: string) {
    setForm((current) =>
      current ? { ...current, title: value, slug: slugEdited ? current.slug : slugify(value) } : current,
    );
  }

  function handleSave() {
    if (!session || !form) return;
    setFormError(null);
    setNotice(null);
    if (form.title.trim().length < 3) {
      setFormError("Please enter a title.");
      return;
    }
    if (!SLUG_PATTERN.test(form.slug)) {
      setFormError("The slug may only contain lowercase letters, numbers and single hyphens, for example my-first-post.");
      return;
    }
    if (!form.content_markdown.trim()) {
      setFormError("Please write the post content.");
      return;
    }
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    savePost.mutate(
      {
        values: { ...form, title: form.title.trim(), tags },
        authorId: session.user.id,
        existingPublishedAt,
      },
      {
        onSuccess: () => {
          setForm(null);
          setNotice("Post saved.");
        },
        onError: (e) => {
          const text = errorMessage(e);
          setFormError(
            text.includes("duplicate key")
              ? "Another post already uses this slug. Change the slug and save again."
              : text,
          );
        },
      },
    );
  }

  function handleDelete(post: BlogRow) {
    if (!window.confirm(`Delete "${post.title}" permanently? This cannot be undone.`)) return;
    setNotice(null);
    deletePost.mutate(post.id, { onSuccess: () => setNotice("Post deleted.") });
  }

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Blog | M. R. Services Admin" description="Write and publish blog posts." />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Blog</h1>
        {!form && <Button onClick={openNew}>New post</Button>}
      </div>

      {notice && <p className="mt-4 text-sm text-teal-500">{notice}</p>}
      {(togglePublished.error || deletePost.error) && (
        <p className="mt-4 text-sm text-danger-500">
          {errorMessage(togglePublished.error ?? deletePost.error)}
        </p>
      )}

      {form && (
        <div className="mt-6 space-y-5 rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-neutral-900">
            {form.id ? "Edit post" : "New post"}
          </h2>

          <div>
            <Label htmlFor="blog-title">Title</Label>
            <Input id="blog-title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="blog-slug">Slug (the web address of the post)</Label>
            <Input
              id="blog-slug"
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                setField("slug", e.target.value);
              }}
            />
            <p className="mt-1 text-xs text-neutral-400">
              Public address: /blog/{form.slug || "your-slug"}. Lowercase letters, numbers and hyphens only.
              Changing it later breaks old links to this post.
            </p>
          </div>

          <div>
            <Label htmlFor="blog-excerpt">Excerpt (short summary shown on the Blog page)</Label>
            <Textarea
              id="blog-excerpt"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="blog-meta">Meta description (shown in Google results, about 150 characters)</Label>
            <Input
              id="blog-meta"
              value={form.meta_description}
              onChange={(e) => setField("meta_description", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="blog-tags">Tags (separate with commas)</Label>
            <Input id="blog-tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="blog-content">Content (Markdown)</Label>
            <Textarea
              id="blog-content"
              rows={16}
              className="font-mono text-sm"
              value={form.content_markdown}
              onChange={(e) => setField("content_markdown", e.target.value)}
            />
            <Button type="button" variant="outline" className="mt-2" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? "Hide preview" : "Show preview"}
            </Button>
            {showPreview && (
              <div className="mt-3 rounded-lg border border-neutral-200 p-4">
                {form.content_markdown.trim() ? (
                  <BlogContent markdown={form.content_markdown} />
                ) : (
                  <p className="text-sm text-neutral-400">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="blog-published"
              checked={form.is_published}
              onCheckedChange={(checked) => setField("is_published", checked)}
            />
            <Label htmlFor="blog-published">Published (visible on the public Blog)</Label>
          </div>

          {formError && <p className="text-sm text-danger-500">{formError}</p>}

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={savePost.isPending}>
              {savePost.isPending ? "Saving..." : "Save post"}
            </Button>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading && <p className="mt-6 text-neutral-700">Loading...</p>}
      {error && <p className="mt-6 text-danger-500">Could not load posts: {errorMessage(error)}</p>}
      {posts && posts.length === 0 && (
        <p className="mt-6 text-neutral-400">No posts yet. Click New post to write the first one.</p>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-700">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published on</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{p.title}</p>
                    <p className="text-xs text-neutral-400">/blog/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={p.is_published}
                        onCheckedChange={(checked) =>
                          togglePublished.mutate({ id: p.id, isPublished: checked, publishedAt: p.published_at })
                        }
                        aria-label={`Publish ${p.title}`}
                      />
                      <span className="text-neutral-700">{p.is_published ? "Published" : "Draft"}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-400">
                    {p.published_at ? formatDate(p.published_at) : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
                    {p.is_published && (
                      <a
                        href={ROUTES.blogPost(p.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 text-primary-500 hover:underline"
                      >
                        View
                      </a>
                    )}
                    <Button variant="ghost" onClick={() => handleDelete(p)} className="text-danger-500">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

