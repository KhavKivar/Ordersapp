import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/Card/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getRevenue } from "@/features/revenue/api/get-revenue";
import type { Revenue } from "@/features/revenue/api/revenue-schema";
import { formatChileanPeso } from "@/utils/format-currency";
import { useQuery } from "@tanstack/react-query";

type WeeklyGain = {
  label: string;
  gain: number;
  start: Date;
};

type DailyGain = {
  label: string;
  gain: number;
  date: Date;
};

const chartConfig = {
  gain: {
    label: "Ganancias",
    color: "#f97316",
  },
} satisfies ChartConfig;

const MONTHS_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const parseRevenueDate = (value: string) => {
  const [day, month, year] = value.split("/").map((part) => Number(part));
  if (!day || !month || !year) {
    return null;
  }
  return new Date(year, month - 1, day);
};

const formatShortDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")} ${
    MONTHS_SHORT[date.getMonth()]
  }`;

const getWeekStart = (date: Date) => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const normalizeRevenue = (entries: Revenue[]) => {
  const dailyMap = new Map<string, DailyGain>();

  entries.forEach((entry) => {
    const date = parseRevenueDate(entry.day);
    if (!date) {
      return;
    }
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
    const gain = Number(entry.totalGain) || 0;
    const existing = dailyMap.get(key);
    if (existing) {
      existing.gain += gain;
      return;
    }
    dailyMap.set(key, { date, label: entry.day, gain });
  });

  const dailyGains = Array.from(dailyMap.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const weeklyMap = new Map<number, WeeklyGain>();
  dailyGains.forEach((entry) => {
    const weekStart = getWeekStart(entry.date);
    const weekKey = weekStart.getTime();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const label = `${formatShortDate(weekStart)} - ${formatShortDate(
      weekEnd,
    )}`;
    const existing = weeklyMap.get(weekKey);
    if (existing) {
      existing.gain += entry.gain;
      return;
    }
    weeklyMap.set(weekKey, {
      label,
      gain: entry.gain,
      start: weekStart,
    });
  });

  const weeklyGains = Array.from(weeklyMap.values()).sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  return { dailyGains, weeklyGains };
};

export default function StatsPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ["revenue"],
    queryFn: getRevenue,
  });

  const { dailyGains, weeklyGains } = useMemo(
    () => normalizeRevenue(data?.revenue ?? []),
    [data],
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <p className="max-w-2xl text-base text-muted-foreground">
          Ganancias por semana con detalle dia a dia.
        </p>
        {isPending && <div>Cargando...</div>}
        {error && <div>Error cargando ingresos</div>}
        {!isPending && !error && weeklyGains.length === 0 && (
          <Card className="rounded-3xl border border-border/70 bg-card/90 p-6 text-left">
            <p className="text-sm text-muted-foreground">
              No hay datos disponibles aun.
            </p>
          </Card>
        )}
        {!isPending && !error && weeklyGains.length > 0 && (
          <>
            <Card className="rounded-3xl border border-border/70 bg-card/90 p-6 text-left">
              <h2 className="text-lg font-semibold text-foreground">
                Ganancias por semana
              </h2>
              <ChartContainer
                config={chartConfig}
                className="mt-4 h-[260px] w-full sm:h-[320px]"
              >
                <BarChart accessibilityLayer data={weeklyGains}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatChileanPeso(Number(value))}
                    width={90}
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(251, 146, 60, 0.12)" }}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatChileanPeso(Number(value))}
                      />
                    }
                  />
                  <Bar dataKey="gain" fill="var(--color-gain)" radius={8} />
                </BarChart>
              </ChartContainer>
            </Card>

            <Card className="rounded-3xl border border-border/70 bg-card/90 p-6 text-left">
              <h2 className="text-lg font-semibold text-foreground">Dia a dia</h2>
              <div className="mt-4 divide-y divide-border/60 rounded-2xl border border-border/60 bg-white/80">
                {dailyGains.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-foreground">
                      {entry.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatChileanPeso(entry.gain)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
