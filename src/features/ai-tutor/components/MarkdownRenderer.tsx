import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components = {
  h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-bold text-white mt-3 mb-1.5">{children}</h3>
  ),
  h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-sm font-bold text-white mt-3 mb-1.5">{children}</h3>
  ),
  h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-xs font-bold text-white mt-2.5 mb-1">{children}</h4>
  ),
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-xs leading-relaxed text-gray-300 my-1.5">{children}</p>
  ),
  ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-4 space-y-1 my-1.5 text-xs text-gray-300">{children}</ul>
  ),
  ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-4 space-y-1 my-1.5 text-xs text-gray-300">{children}</ol>
  ),
  li: ({ children }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  a: ({ children, href }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ className, children }: React.HTMLAttributes<HTMLElement>) => (
    <code className={className ? 'bg-transparent p-0 font-mono text-[11px] text-emerald-300' : 'px-1 py-0.5 rounded bg-white/10 font-mono text-[11px] text-purple-200'}>
      {children}
    </code>
  ),
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-white/10 bg-slate-950 p-3">{children}</pre>
  ),
  blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-2 border-l-2 border-purple-500/50 pl-3 text-xs text-gray-400">{children}</blockquote>
  ),
  table: ({ children }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-2 overflow-x-auto">
      <table className="min-w-full text-left text-[11px]">{children}</table>
    </div>
  ),
  th: ({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-white/10 px-2 py-1 font-semibold text-gray-300">{children}</th>
  ),
  td: ({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-white/5 px-2 py-1 text-gray-400">{children}</td>
  ),
  hr: () => <hr className="my-3 border-white/10" />,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
