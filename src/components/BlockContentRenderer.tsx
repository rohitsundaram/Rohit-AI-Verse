import type { BlogContent } from '@/types/blog';
import { toRenderableImageUrl } from '@/lib/imageUrl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlockContentRendererProps {
  content: BlogContent;
}

const normalizeText = (value: string) => value.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ');

const asString = (value: unknown) => (typeof value === 'string' ? normalizeText(value) : '');

const renderInlineMarkdown = (value: string) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ node: _node, children }) => <>{children}</>,
      a: ({ node: _node, ...props }) => <a className="text-primary underline underline-offset-2" {...props} />,
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
    }}
  >
    {value}
  </ReactMarkdown>
);

type ListNode = {
  text: string;
  children: ListNode[];
};

const parseListNodes = (value: unknown): ListNode[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return { text: item, children: [] } as ListNode;
      }

      if (item && typeof item === 'object') {
        const raw = item as { content?: unknown; text?: unknown; items?: unknown };
        const text = asString(raw.content) || asString(raw.text);
        const children = parseListNodes(raw.items);

        if (text || children.length > 0) {
          return { text, children } as ListNode;
        }
      }

      return null;
    })
    .filter((node): node is ListNode => Boolean(node));
};

const renderListNodes = (nodes: ListNode[], ordered: boolean, keyPrefix: string) => {
  const ListTag = ordered ? 'ol' : 'ul';
  const className = ordered ? 'ml-7 list-decimal text-foreground/90 space-y-2' : 'ml-7 list-disc text-foreground/90 space-y-2';

  return (
    <ListTag className={className}>
      {nodes.map((node, index) => (
        <li key={`${keyPrefix}-${index}`}>
          {renderInlineMarkdown(node.text)}
          {node.children.length > 0 ? renderListNodes(node.children, ordered, `${keyPrefix}-${index}-child`) : null}
        </li>
      ))}
    </ListTag>
  );
};

const BlockContentRenderer = ({ content }: BlockContentRendererProps) => (
  <div className="blog-article space-y-6 text-foreground">
    {content.blocks.map((block, index) => {
      const key = block.id || `${block.type}-${index}`;

      if (block.type === 'header') {
        const level = Number(block.data.level) || 2;
        const text = asString(block.data.text);

        if (level === 1) {
          return <h1 key={key} className="blog-heading-1 mt-12 first:mt-0">{text}</h1>;
        }

        if (level === 3) {
          return <h3 key={key} className="blog-heading-3 mt-8">{text}</h3>;
        }

        return <h2 key={key} className="blog-heading-2 mt-10">{text}</h2>;
      }

      if (block.type === 'list') {
        const items = parseListNodes(block.data.items);
        const style = asString(block.data.style);
        const ordered = style === 'ordered';

        return <div key={key}>{renderListNodes(items, ordered, key)}</div>;
      }

      if (block.type === 'quote') {
        return (
          <blockquote key={key} className="border-l-4 border-primary pl-5 italic text-foreground/85">
            {renderInlineMarkdown(asString(block.data.text))}
          </blockquote>
        );
      }

      if (block.type === 'code') {
        return (
          <pre key={key} className="bg-secondary/50 rounded-xl p-5 overflow-x-auto text-sm leading-7">
            <code>{asString(block.data.code)}</code>
          </pre>
        );
      }

      if (block.type === 'image') {
        const file = block.data.file as { url?: string } | undefined;
        const url = typeof file?.url === 'string' ? toRenderableImageUrl(file.url) : '';
        const caption = asString(block.data.caption);

        if (!url) {
          return null;
        }

        return (
          <figure key={key} className="space-y-3 my-8">
            <img src={url} alt={caption || 'Post image'} className="w-full h-auto object-contain rounded-xl" />
            {caption && <figcaption className="text-sm text-muted-foreground text-center">{caption}</figcaption>}
          </figure>
        );
      }

      if (block.type === 'delimiter') {
        return <hr key={key} className="border-border my-8" />;
      }

      if (block.type === 'table') {
        const rows = Array.isArray(block.data.content) ? block.data.content : [];
        const normalizedRows = rows
          .map((row) =>
            Array.isArray(row)
              ? row.map((cell) => (typeof cell === 'string' ? cell : String(cell ?? '')))
              : [],
          )
          .filter((row) => row.length > 0);

        if (normalizedRows.length === 0) {
          return null;
        }

        const [header, ...body] = normalizedRows;
        const hasHeader = Boolean(block.data.withHeadings);

        return (
          <div key={key} className="my-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-base">
              {hasHeader && (
                <thead className="bg-muted/50">
                  <tr>
                    {header.map((cell, cellIndex) => (
                      <th key={`${key}-head-${cellIndex}`} className="border border-border px-3 py-2 text-left font-semibold">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {(hasHeader ? body : normalizedRows).map((row, rowIndex) => (
                  <tr key={`${key}-row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${key}-cell-${rowIndex}-${cellIndex}`} className="border border-border px-3 py-2 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      return (
        <p
          key={key}
          className="text-foreground/90"
        >
          {renderInlineMarkdown(asString(block.data.text))}
        </p>
      );
    })}
  </div>
);

export default BlockContentRenderer;
