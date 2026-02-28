import type { BlogContent } from '@/types/blog';

interface BlockContentRendererProps {
  content: BlogContent;
}

const normalizeText = (value: string) => value.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ');

const asString = (value: unknown) => (typeof value === 'string' ? normalizeText(value) : '');

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
          {node.text}
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
            {asString(block.data.text)}
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
        const url = typeof file?.url === 'string' ? file.url : '';
        const caption = asString(block.data.caption);

        if (!url) {
          return null;
        }

        return (
          <figure key={key} className="space-y-3 my-8">
            <img src={url} alt={caption || 'Post image'} className="w-full aspect-[16/9] object-cover rounded-xl" />
            {caption && <figcaption className="text-sm text-muted-foreground text-center">{caption}</figcaption>}
          </figure>
        );
      }

      if (block.type === 'delimiter') {
        return <hr key={key} className="border-border my-8" />;
      }

      return (
        <p
          key={key}
          className="text-foreground/90"
          dangerouslySetInnerHTML={{ __html: asString(block.data.text) }}
        />
      );
    })}
  </div>
);

export default BlockContentRenderer;
