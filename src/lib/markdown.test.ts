import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '@/lib/markdown';

describe('Markdown Utils', () => {
  it('should render plain text', () => {
    const input = 'Hello World';
    const output = renderMarkdown(input);
    expect(output).toContain('Hello World');
  });

  it('should render bold text', () => {
    const input = '**bold**';
    const output = renderMarkdown(input);
    expect(output).toContain('<strong>bold</strong>');
  });

  it('should render italic text', () => {
    const input = '*italic*';
    const output = renderMarkdown(input);
    expect(output).toContain('<em>italic</em>');
  });

  it('should render headings', () => {
    const input = '# Heading 1';
    const output = renderMarkdown(input);
    expect(output).toContain('<h1>Heading 1</h1>');
  });

  it('should render links', () => {
    const input = '[Google](https://google.com)';
    const output = renderMarkdown(input);
    expect(output).toContain('href=');
    expect(output).toContain('google.com');
  });

  it('should handle empty input', () => {
    const input = '';
    const output = renderMarkdown(input);
    expect(output).toBeDefined();
  });
});
