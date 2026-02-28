import type { BlogBlock, BlogContent } from '@/types/blog';

export const emptyBlogContent = (): BlogContent => ({
  time: Date.now(),
  blocks: [{ type: 'paragraph', data: { text: '' } }],
  version: '2.0.0',
});

export const isValidBlogContent = (value: unknown): value is BlogContent => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<BlogContent>;
  return Array.isArray(candidate.blocks);
};

export const markdownToBlocks = (markdown: string): BlogContent => {
  const lines = markdown.split('\n');
  const blocks: BlogBlock[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'header', data: { text: trimmed.slice(4), level: 3 } });
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'header', data: { text: trimmed.slice(3), level: 2 } });
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'header', data: { text: trimmed.slice(2), level: 1 } });
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({ type: 'list', data: { style: 'unordered', items: [trimmed.slice(2)] } });
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      blocks.push({ type: 'list', data: { style: 'ordered', items: [trimmed.replace(/^\d+\.\s/, '')] } });
      continue;
    }

    if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'quote', data: { text: trimmed.slice(2), caption: '' } });
      continue;
    }

    if (trimmed.startsWith('```')) {
      continue;
    }

    blocks.push({ type: 'paragraph', data: { text: trimmed } });
  }

  return {
    time: Date.now(),
    blocks: blocks.length > 0 ? blocks : [{ type: 'paragraph', data: { text: markdown || '' } }],
    version: '2.0.0',
  };
};

export const blocksToPlainText = (content: BlogContent): string =>
  content.blocks
    .map((block) => {
      if (block.type === 'list') {
        const items = block.data.items;
        return Array.isArray(items) ? items.join(' ') : '';
      }

      const text = block.data.text;
      return typeof text === 'string' ? text : '';
    })
    .filter(Boolean)
    .join('\n');
