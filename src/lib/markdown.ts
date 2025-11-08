// Simple markdown parser for rendering blog content
export function renderMarkdown(content: string): string {
  let html = content;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-primary mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-primary mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-primary mt-8 mb-6">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>');

  // Italic
  html = html.replace(/\*(.*)\*/gim, '<em class="italic">$1</em>');

  // Code (inline)
  html = html.replace(/`([^`]*)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');

  // Code blocks
  html = html.replace(/```([^`]*)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>');

  // Links
  html = html.replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2" class="text-accent hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img src="$2" alt="$1" class="rounded-lg shadow-lg my-6 max-w-full" />');

  // Unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>');

  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li[^>]*>.*<\/li>\s*)+/gim, '<ul class="list-disc pl-6 my-4">$&</ul>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-accent pl-6 italic text-muted-foreground my-8">$1</blockquote>');

  // Paragraphs (convert double line breaks to paragraphs)
  html = html.replace(/\n\n/gim, '</p><p class="mb-4">');
  html = '<p class="mb-4">' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p[^>]*><\/p>/gim, '');

  // Line breaks
  html = html.replace(/\n/gim, '<br />');

  return html;
}
