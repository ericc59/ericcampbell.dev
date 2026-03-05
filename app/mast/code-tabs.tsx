'use client';

import { useMemo, useState } from 'react';
import { highlight } from 'sugar-high';

type Tab = {
  id: string;
  label: string;
  lang: string;
  code: string;
  blurb?: string;
};

export function CodeTabs({
  tabs,
  defaultTab,
}: {
  tabs: Tab[];
  defaultTab?: string;
}) {
  const initialTab =
    tabs.find((tab) => tab.id === defaultTab)?.id ?? tabs[0]?.id ?? '';
  const [activeTab, setActiveTab] = useState(initialTab);

  const currentTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab, tabs],
  );

  if (!currentTab) {
    return null;
  }

  const html = highlight(currentTab.code);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60">
      <div className="border-b border-zinc-800 bg-zinc-950/80 px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === currentTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors',
                  isActive
                    ? 'border-zinc-600 bg-zinc-100 text-zinc-950'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
                ].join(' ')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            {currentTab.lang}
          </span>
          {currentTab.blurb ? (
            <p className="text-xs text-zinc-500">{currentTab.blurb}</p>
          ) : null}
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-zinc-100">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
