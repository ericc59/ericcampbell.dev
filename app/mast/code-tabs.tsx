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
		<div className="overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-950/30">
			<div className="border-b border-zinc-800/50 bg-zinc-950/50 px-4 py-4">
				<div className="flex flex-wrap gap-2">
					{tabs.map((tab) => {
						const isActive = tab.id === currentTab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={[
									'rounded-lg border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors',
									isActive
										? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
										: 'border-zinc-800/50 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700/50 hover:text-zinc-300',
								].join(' ')}
							>
								{tab.label}
							</button>
						);
					})}
				</div>
				<div className="mt-4 flex flex-wrap items-center justify-between gap-2">
					<span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
						{currentTab.lang}
					</span>
					{currentTab.blurb ? (
						<p className="text-xs text-zinc-500">{currentTab.blurb}</p>
					) : null}
				</div>
			</div>
			<pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-zinc-100">
				<code dangerouslySetInnerHTML={{ __html: html }} />
			</pre>
		</div>
	);
}
