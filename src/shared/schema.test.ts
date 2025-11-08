import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Schema Validation', () => {
  const postFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().min(1, "Excerpt is required").max(500),
    category: z.string().min(1, "Category is required"),
    coverImage: z.string().optional(),
    published: z.boolean(),
    authorId: z.number(),
  });

  it('should validate valid post data', () => {
    const validData = {
      title: 'Test Post',
      content: 'Test content',
      excerpt: 'Test excerpt',
      category: 'Technology',
      published: true,
      authorId: 1,
    };
    const result = postFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject missing title', () => {
    const invalidData = {
      content: 'Test content',
      excerpt: 'Test excerpt',
      category: 'Technology',
      published: true,
      authorId: 1,
    };
    const result = postFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject title exceeding max length', () => {
    const invalidData = {
      title: 'a'.repeat(201),
      content: 'Test content',
      excerpt: 'Test excerpt',
      category: 'Technology',
      published: true,
      authorId: 1,
    };
    const result = postFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should allow optional cover image', () => {
    const validData = {
      title: 'Test Post',
      content: 'Test content',
      excerpt: 'Test excerpt',
      category: 'Technology',
      published: true,
      authorId: 1,
      coverImage: undefined,
    };
    const result = postFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
