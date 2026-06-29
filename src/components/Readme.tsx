import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type ReadmeVisualizerProps = {
  url: string;
};

export default function ReadmeVisualizer({ url }: ReadmeVisualizerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMarkdown() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err: any) {
        setError(err.message || "An error occurred fetching the markdown.");
      } finally {
        setLoading(false);
      }
    }

    if (url) {
      fetchMarkdown();
    }
  }, [url]);

  if (loading) {
    return (
      <div className="mt-6 border border-border bg-terminal-bg px-4 py-8 text-center text-muted-foreground font-mono text-xs">
        Fetching documentation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 border border-border bg-terminal-bg px-4 py-8 text-center text-red-500 font-mono text-xs">
        Error: {error}
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="mt-6 border border-border bg-muted px-3 sm:px-4 py-4 relative overflow-hidden">
      <div className="font-mono text-xs text-terminal-fg leading-relaxed max-w-none
        [&_h1]:font-mono [&_h1]:text-sm [&_h1]:font-bold [&_h1]:text-terminal-green [&_h1]:mb-2 [&_h1]:mt-0
        [&_h2]:font-mono [&_h2]:text-xs [&_h2]:font-bold [&_h2]:text-terminal-green [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:mb-2 [&_h2]:mt-4
        [&_h3]:font-mono [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mb-1 [&_h3]:mt-3
        [&_p]:text-terminal-fg [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-left
        [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-4 [&_ul]:space-y-1
        [&_li]:text-terminal-fg [&_li]:leading-relaxed
        [&_strong]:text-foreground [&_strong]:font-bold
        [&_em]:text-muted-foreground [&_em]:italic
        [&_a]:text-terminal-cyan [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-terminal-cyan/30 [&_a:hover]:decoration-terminal-cyan [&_a]:transition-colors
        [&_code]:text-terminal-green [&_code]:bg-transparent [&_code]:text-xs
        [&_table]:w-full [&_table]:border-collapse [&_table]:font-mono [&_table]:text-xs
        [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-terminal-green [&_th]:font-bold
        [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-terminal-fg
        [&_tr:nth-child(even)]:bg-muted/20 [&_tr:hover]:bg-muted/40 [&_tr]:transition-colors
        **:[[align=center]]:text-center
        [&_img]:inline-block [&_img]:max-w-full
        [&_svg]:inline-block [&_svg]:max-w-full [&_svg]:text-terminal-fg
        [&_blockquote]:border-l-2 [&_blockquote]:border-terminal-green [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4
        [&_pre]:overflow-x-auto [&_pre]:p-3 sm:[&_pre]:p-4 [&_pre]:border [&_pre]:border-border [&_pre]:my-4 [&_pre]:bg-background">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw, rehypeSlug]}
          components={{
            img: ({ node, ...props }: any) => {
              const style = { ...props.style };
              if (props.height) style.height = props.height;
              if (props.width) style.width = props.width;
              
              return <img {...props} style={style} />;
            },
            table: ({ node, ...props }: any) => (
              <div className="w-full overflow-x-auto mb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <table {...props} />
              </div>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}