'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ProgressPoint = {
  checkpoint: string;
  train: number;
  test?: number;
  eval?: number;
};

export function ProgressChart({ data }: { data: ProgressPoint[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="h-60 w-full md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="rgb(39 39 42)" strokeDasharray="3 3" />
            <XAxis
              dataKey="checkpoint"
              tick={{ fill: 'rgb(113 113 122)', fontSize: 11 }}
              axisLine={{ stroke: 'rgb(63 63 70)' }}
              tickLine={{ stroke: 'rgb(63 63 70)' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'rgb(113 113 122)', fontSize: 11 }}
              axisLine={{ stroke: 'rgb(63 63 70)' }}
              tickLine={{ stroke: 'rgb(63 63 70)' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, undefined]}
              contentStyle={{
                backgroundColor: 'rgb(24 24 27)',
                border: '1px solid rgb(63 63 70)',
                borderRadius: 8,
                color: 'rgb(228 228 231)',
              }}
              labelStyle={{ color: 'rgb(212 212 216)' }}
            />
            <Line
              type="monotone"
              dataKey="train"
              stroke="rgb(16 185 129)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Train exact"
            />
            <Line
              type="monotone"
              dataKey="test"
              stroke="rgb(59 130 246)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              name="Test exact"
            />
            <Line
              type="monotone"
              dataKey="eval"
              stroke="rgb(251 146 60)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              name="Eval joint"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
