import { describe, it, expect } from 'vitest';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cn } from '@/lib/utils';

describe('Utils', () => {
  it('should merge classnames correctly', () => {
    const result = cn('px-2 py-1', 'px-3');
    expect(result).toBe('py-1 px-3');
  });

  it('should handle empty strings', () => {
    const result = cn('', 'px-2');
    expect(result).toBe('px-2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'added', false && 'not-added');
    expect(result).toContain('base');
    expect(result).toContain('added');
    expect(result).not.toContain('not-added');
  });

  it('should handle array of classnames', () => {
    const result = cn(['class1', 'class2']);
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });
});
