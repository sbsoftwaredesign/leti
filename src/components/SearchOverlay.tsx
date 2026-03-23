import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pagefindRef = useRef<any>(undefined);

  // Load Pagefind on first open
  const loadPagefind = useCallback(async () => {
    if (pagefindRef.current !== undefined) return;
    try {
      // Pagefind generates this file at build time in dist/pagefind/
      const pagefindPath = '/pagefind/pagefind.js';
      const pf = await import(/* @vite-ignore */ pagefindPath);
      await pf.init();
      pagefindRef.current = pf;
    } catch {
      // Pagefind not available (dev mode or test environment)
      pagefindRef.current = null;
    }
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      loadPagefind();
      document.body.style.overflow = 'hidden';
      // Focus input after render
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, loadPagefind]);

  async function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim() || !pagefindRef.current) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const search = await pagefindRef.current.search(value);
      const items: SearchResult[] = [];
      for (const result of search.results.slice(0, 8)) {
        const data = await result.data();
        items.push({
          url: data.url,
          title: data.meta?.title || 'Untitled',
          excerpt: data.excerpt,
        });
      }
      setResults(items);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search documents (Cmd+K)"
        className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <Search size={20} />
      </button>

      {open && (
        <div className="search-overlay" role="dialog" aria-label="Search">
          <div
            className="overlay-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="search-modal" role="search">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]">
              <Search size={18} className="text-[var(--color-text-muted)] shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search documents…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
                aria-label="Search input"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="p-1 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading && (
                <p className="px-4 py-6 text-sm text-[var(--color-text-muted)] text-center">
                  Searching…
                </p>
              )}

              {!loading && query && results.length === 0 && (
                <p className="px-4 py-6 text-sm text-[var(--color-text-muted)] text-center">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}

              {!loading && results.length > 0 && (
                <ul className="py-2">
                  {results.map((result, i) => (
                    <li key={i}>
                      <a
                        href={result.url}
                        className="block px-4 py-3 hover:bg-[var(--color-bg-secondary)] transition-colors"
                      >
                        <span className="block text-sm font-medium">
                          {result.title}
                        </span>
                        <span
                          className="block text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {!loading && !query && (
                <p className="px-4 py-6 text-sm text-[var(--color-text-muted)] text-center">
                  Type to search across all documents
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
