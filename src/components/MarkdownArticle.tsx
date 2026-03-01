import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toRenderableImageUrl } from '@/lib/imageUrl';

interface MarkdownArticleProps {
  markdown: string;
}

const decodeMarkdownText = (value: string) => {
  const normalized = value.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ');
  if (typeof window === 'undefined') {
    return normalized;
  }

  const parser = document.createElement('textarea');
  parser.innerHTML = normalized;
  return parser.value;
};

const MarkdownArticle = ({ markdown }: MarkdownArticleProps) => (
  <div className="blog-article">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node: _node, ...props }) => <h1 className="blog-heading-1 mt-8 mb-4" {...props} />,
        h2: ({ node: _node, ...props }) => <h2 className="blog-heading-2 mt-8 mb-3" {...props} />,
        h3: ({ node: _node, ...props }) => <h3 className="blog-heading-3 mt-6 mb-3" {...props} />,
        p: ({ node: _node, ...props }) => <p className="mb-4 text-foreground/90 leading-8" {...props} />,
        ul: ({ node: _node, ...props }) => <ul className="mb-4 ml-7 list-disc space-y-2" {...props} />,
        ol: ({ node: _node, ...props }) => <ol className="mb-4 ml-7 list-decimal space-y-2" {...props} />,
        li: ({ node: _node, ...props }) => <li className="text-foreground/90" {...props} />,
        a: ({ node: _node, ...props }) => <a className="text-primary underline underline-offset-2" {...props} />,
        blockquote: ({ node: _node, ...props }) => (
          <blockquote className="border-l-4 border-primary pl-5 italic text-foreground/85 my-5" {...props} />
        ),
        hr: ({ node: _node, ...props }) => <hr className="my-8 border-border" {...props} />,
        pre: ({ node: _node, ...props }) => (
          <pre className="bg-secondary/50 rounded-xl p-5 overflow-x-auto text-sm leading-7 my-5" {...props} />
        ),
        code: ({ node: _node, inline, className, children, ...props }) =>
          inline ? (
            <code className="rounded bg-secondary/50 px-1.5 py-0.5 text-sm" {...props}>
              {children}
            </code>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          ),
        table: ({ node: _node, ...props }) => (
          <div className="my-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-base" {...props} />
          </div>
        ),
        thead: ({ node: _node, ...props }) => <thead className="bg-muted/50" {...props} />,
        tbody: ({ node: _node, ...props }) => <tbody {...props} />,
        tr: ({ node: _node, ...props }) => <tr {...props} />,
        th: ({ node: _node, ...props }) => <th className="border border-border px-3 py-2 text-left font-semibold" {...props} />,
        td: ({ node: _node, ...props }) => <td className="border border-border px-3 py-2 align-top" {...props} />,
        img: ({ node: _node, src, alt, ...props }) => (
          <img
            src={toRenderableImageUrl(src || '')}
            alt={alt || 'Post image'}
            className="w-full h-auto object-contain rounded-xl my-6"
            {...props}
          />
        ),
      }}
    >
      {decodeMarkdownText(markdown)}
    </ReactMarkdown>
  </div>
);

export default MarkdownArticle;
