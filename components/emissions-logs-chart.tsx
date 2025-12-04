"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  useEmissionLogs,
  transformLogsForChart,
} from "@/hooks/use-emission-logs";
import { Loader2 } from "lucide-react";

const chartConfig = {
  transport: {
    label: "Transport",
    color: "var(--chart-1)",
  },
  food: {
    label: "Food",
    color: "var(--chart-2)",
  },
  energy: {
    label: "Energy",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function EmissionLogsChart() {
  const { data: logs = [], isLoading } = useEmissionLogs(30);
  const chartData = transformLogsForChart(logs);

  if (isLoading) {
    return (
      <Card className="w-full md:w-2/3 shadow-none border border-foreground/20 rounded-3xl">
        <CardHeader>
          <CardTitle>Daily Emissions Logs</CardTitle>
          <CardDescription>
            Your emissions breakdown by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="w-full md:w-2/3 shadow-none border border-foreground/20 rounded-3xl">
        <CardHeader>
          <CardTitle>Daily Emissions Logs</CardTitle>
          <CardDescription>
            Your emissions breakdown by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p className="text-center text-xs">
              No emission logs yet. Start logging your daily activities!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:w-2/3 bg-background shadow-none border border-foreground/20 rounded-3xl">
      <CardHeader>
        <CardTitle>Daily Emissions Logs</CardTitle>
        <CardDescription>
          Your emissions breakdown by category (Last 30 days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            barCategoryGap={20}
          >
            <CartesianGrid vertical={false} strokeDasharray="6 6" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}kg`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return `Date: ${new Date(
                        data.date
                      ).toLocaleDateString()}`;
                    }
                    return value;
                  }}
                  formatter={(value, name) => {
                    return [`${value} kg CO₂`, name];
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="transport"
              stackId="a"
              fill="var(--color-transport)"
              radius={[0, 0, 10, 10]}
              stroke="var(--background)"
              strokeWidth={2}
            />
            <Bar
              dataKey="food"
              stackId="a"
              fill="var(--color-food)"
              radius={[0, 0, 0, 0]}
              stroke="var(--background)"
              strokeWidth={2}
            />
            <Bar
              dataKey="energy"
              stackId="a"
              fill="var(--color-energy)"
              radius={[10, 10, 0, 0]}
              stroke="var(--background)"
              strokeWidth={2}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
