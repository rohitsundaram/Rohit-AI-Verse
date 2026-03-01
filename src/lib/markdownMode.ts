const MARKDOWN_MODE_MARKER = '<!-- markdown -->';

export const hasMarkdownModeMarker = (value?: string | null) =>
  Boolean(value && value.trimStart().startsWith(MARKDOWN_MODE_MARKER));

export const stripMarkdownModeMarker = (value?: string | null) => {
  if (!value) {
    return '';
  }

  return value.replace(/^\s*<!--\s*markdown\s*-->\s*/i, '');
};

export const withMarkdownModeMarker = (value: string) => {
  const stripped = stripMarkdownModeMarker(value);
  return `${MARKDOWN_MODE_MARKER}\n\n${stripped}`.trim();
};
