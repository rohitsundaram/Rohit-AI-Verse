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

  const parseTableRow = (value: string) =>
    value
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim());

  const isTableDivider = (value: string) =>
    /^(\|?\s*:?-{3,}:?\s*)+\|?$/.test(value.trim());

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const nextLine = lines[index + 1]?.trim() || '';
    if (trimmed.includes('|') && nextLine && isTableDivider(nextLine)) {
      const header = parseTableRow(trimmed);
      const content = [header];
      index += 2;

      while (index < lines.length) {
        const tableLine = lines[index].trim();
        if (!tableLine || !tableLine.includes('|')) {
          break;
        }

        content.push(parseTableRow(tableLine));
        index += 1;
      }

      blocks.push({
        type: 'table',
        data: {
          withHeadings: true,
          content,
        },
      });
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'header', data: { text: trimmed.slice(4), level: 3 } });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'header', data: { text: trimmed.slice(3), level: 2 } });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'header', data: { text: trimmed.slice(2), level: 1 } });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({ type: 'list', data: { style: 'unordered', items: [trimmed.slice(2)] } });
      index += 1;
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      blocks.push({ type: 'list', data: { style: 'ordered', items: [trimmed.replace(/^\d+\.\s/, '')] } });
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: 'delimiter', data: {} });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'quote', data: { text: trimmed.slice(2), caption: '' } });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      index += 1;
      continue;
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imageMatch) {
      blocks.push({
        type: 'image',
        data: {
          file: { url: imageMatch[2] },
          caption: imageMatch[1] || '',
        },
      });
      index += 1;
      continue;
    }

    blocks.push({ type: 'paragraph', data: { text: trimmed } });
    index += 1;
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

export const blocksToMarkdown = (content: BlogContent): string =>
  content.blocks
    .map((block) => {
      if (block.type === 'header') {
        const text = typeof block.data.text === 'string' ? block.data.text : '';
        const level = Number(block.data.level) || 2;
        if (!text) {
          return '';
        }
        return `${'#'.repeat(Math.min(Math.max(level, 1), 6))} ${text}`;
      }

      if (block.type === 'list') {
        const items = Array.isArray(block.data.items) ? block.data.items : [];
        const style = typeof block.data.style === 'string' ? block.data.style : 'unordered';
        return items
          .map((item, index) => {
            const text = typeof item === 'string' ? item : '';
            if (!text) {
              return '';
            }
            return style === 'ordered' ? `${index + 1}. ${text}` : `- ${text}`;
          })
          .filter(Boolean)
          .join('\n');
      }

      if (block.type === 'quote') {
        const text = typeof block.data.text === 'string' ? block.data.text : '';
        return text ? `> ${text}` : '';
      }

      if (block.type === 'code') {
        const code = typeof block.data.code === 'string' ? block.data.code : '';
        return code ? `\`\`\`\n${code}\n\`\`\`` : '';
      }

      if (block.type === 'image') {
        const file = block.data.file as { url?: unknown } | undefined;
        const url = typeof file?.url === 'string' ? file.url : '';
        const caption = typeof block.data.caption === 'string' ? block.data.caption : '';
        return url ? `![${caption}](${url})` : '';
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
          return '';
        }

        const [header, ...body] = normalizedRows;
        const divider = header.map(() => '---');
        const headerLine = `| ${header.join(' | ')} |`;
        const dividerLine = `| ${divider.join(' | ')} |`;
        const bodyLines = body.map((row) => `| ${row.join(' | ')} |`);

        return [headerLine, dividerLine, ...bodyLines].join('\n');
      }

      if (block.type === 'delimiter') {
        return '---';
      }

      const text = typeof block.data.text === 'string' ? block.data.text : '';
      return text;
    })
    .filter(Boolean)
    .join('\n\n');
