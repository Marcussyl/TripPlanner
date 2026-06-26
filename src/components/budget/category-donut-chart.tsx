'use client';

const CATEGORY_COLORS: Record<string, string> = {
  food: '#ab3600',
  transport: '#515f74',
  lodging: '#5c5f61',
  activities: '#ff5f1f',
  shopping: '#e3bfb3',
  other: '#8f7066',
};

type CategoryDonutChartProps = {
  byCategory: Record<string, number>;
  totalSpent: number;
};

export function CategoryDonutChart({ byCategory, totalSpent }: CategoryDonutChartProps) {
  const entries = Object.entries(byCategory);
  if (entries.length === 0 || totalSpent === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-outline-variant/60 bg-surface-container-lowest text-body-sm text-on-surface-variant">
        No spending data yet
      </div>
    );
  }

  let offset = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const segments = entries.map(([category, amount]) => {
    const fraction = amount / totalSpent;
    const dash = fraction * circumference;
    const segment = {
      category,
      amount,
      dash,
      offset,
      color: CATEGORY_COLORS[category] ?? '#8f7066',
    };
    offset += dash;
    return segment;
  });

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6">
      <h3 className="text-title-md text-on-background">Spending by category</h3>
      <div className="mt-4 flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0 -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f0edec" strokeWidth="12" />
          {segments.map((segment) => (
            <circle
              key={segment.category}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="12"
              strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
              strokeDashoffset={-segment.offset}
            />
          ))}
        </svg>
        <ul className="space-y-2 text-body-sm">
          {segments.map((segment) => (
            <li key={segment.category} className="flex items-center gap-2 capitalize">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.category} — ${segment.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
