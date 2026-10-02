import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogContent({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-heading prose-a:text-primary-500">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}


