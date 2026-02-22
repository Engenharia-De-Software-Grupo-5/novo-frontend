'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Building2,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';

import { RoleGuard } from '@/features/components/auth/RoleGuard';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/features/components/ui/chart';
import { Badge } from '@/features/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/components/ui/card';
import { CobrancaSummary } from '@/types/cobranca';
import { DespesaSummary } from '@/types/despesa';
import { EmployeeSummary } from '@/types/employee';
import { ImovelSummary } from '@/types/imoveis';
import { PaymentSummary } from '@/types/payment';

interface DashboardClientProps {
  readonly pagamentos: PaymentSummary[];
  readonly despesas: DespesaSummary[];
  readonly cobrancas: CobrancaSummary[];
  readonly funcionarios: EmployeeSummary[];
  readonly imoveis: ImovelSummary[];
  readonly condominosTotal: number;
}

type ChartPoint = {
  monthKey: string;
  label: string;
  gastos: number;
  lucro: number;
};

type RhRolePoint = {
  cargo: string;
  total: number;
  fill: string;
};

type FinanceRadarPoint = {
  indicador: string;
  score: number;
  valor: number;
};

type CountRadarPoint = {
  categoria: string;
  score: number;
  total: number;
};

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: '2-digit',
});

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('pt-BR');

function toMonthKey(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function toMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return monthFormatter.format(date).replace('.', '');
}

const compactCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const chartConfig = {
  lucro: {
    label: 'Lucro (cobranças)',
    color: 'var(--chart-1)',
  },
  gastos: {
    label: 'Gastos (pagamentos + despesas)',
    color: 'var(--chart-5)',
  },
  saldo: {
    label: 'Saldo',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const rhChartConfig = {
  total: {
    label: 'Funcionários',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const financeRadarChartConfig = {
  score: {
    label: 'Equilíbrio',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

const cobrancaStatusRadarChartConfig = {
  score: {
    label: 'Status',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

const despesaTipoRadarChartConfig = {
  score: {
    label: 'Tipo',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

const rhBarScale = ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];

function KpiCard({
  title,
  value,
  icon: Icon,
}: {
  readonly title: string;
  readonly value: string;
  readonly icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground size-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function BreakdownCard({
  title,
  data,
}: {
  readonly title: string;
  readonly data: [string, number][];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">Sem dados para exibir.</p>
        ) : (
          data.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-sm">{label}</span>
              <Badge variant="secondary">{numberFormatter.format(value)}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardClient({
  pagamentos,
  despesas,
  cobrancas,
  funcionarios,
  imoveis,
  condominosTotal,
}: DashboardClientProps) {
  const [activeFinanceChart, setActiveFinanceChart] =
    useState<keyof typeof chartConfig>('lucro');

  const totalGastosPagamentos = pagamentos.reduce((acc, item) => acc + item.value, 0);
  const totalGastosDespesas = despesas.reduce((acc, item) => acc + item.valor, 0);
  const totalGastos = totalGastosPagamentos + totalGastosDespesas;
  const totalLucro = cobrancas.reduce((acc, item) => acc + item.value, 0);
  const saldo = totalLucro - totalGastos;

  const chartData = useMemo<ChartPoint[]>(() => {
    const grouped = new Map<string, { gastos: number; lucro: number }>();
    const paymentDates = pagamentos.map((item) => {
      const withDueDate = item as PaymentSummary & { dueDate?: string };
      return item.paymentDate || withDueDate.dueDate;
    });

    for (let index = 0; index < pagamentos.length; index += 1) {
      const date = paymentDates[index];
      if (!date) continue;
      const key = toMonthKey(date);
      const current = grouped.get(key) ?? { gastos: 0, lucro: 0 };
      current.gastos += pagamentos[index].value;
      grouped.set(key, current);
    }

    for (const despesa of despesas) {
      const key = toMonthKey(despesa.data);
      const current = grouped.get(key) ?? { gastos: 0, lucro: 0 };
      current.gastos += despesa.valor;
      grouped.set(key, current);
    }

    for (const cobranca of cobrancas) {
      const key = toMonthKey(cobranca.dueDate);
      const current = grouped.get(key) ?? { gastos: 0, lucro: 0 };
      current.lucro += cobranca.value;
      grouped.set(key, current);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([monthKey, values]) => ({
        monthKey,
        label: toMonthLabel(monthKey),
        gastos: values.gastos,
        lucro: values.lucro,
        saldo: values.lucro - values.gastos,
      }));
  }, [cobrancas, despesas, pagamentos]);

  const financeTotals = useMemo(
    () => ({
      lucro: chartData.reduce((acc, curr) => acc + curr.lucro, 0),
      gastos: chartData.reduce((acc, curr) => acc + curr.gastos, 0),
      saldo: chartData.reduce((acc, curr) => acc + curr.lucro - curr.gastos, 0),
    }),
    [chartData]
  );

  const despesasPorTipo = Object.entries(
    despesas.reduce<Record<string, number>>((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const cobrancasPorStatus = Object.entries(
    cobrancas.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const funcionariosPorStatus = Object.entries(
    funcionarios.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const funcionariosPorCargo = Object.entries(
    funcionarios.reduce<Record<string, number>>((acc, item) => {
      acc[item.role] = (acc[item.role] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const imoveisPorTipo = Object.entries(
    imoveis.reduce<Record<string, number>>((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const imoveisPorSituacao = Object.entries(
    imoveis.reduce<Record<string, number>>((acc, item) => {
      acc[item.situacao] = (acc[item.situacao] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const rhChartData = useMemo<RhRolePoint[]>(
    () =>
      funcionariosPorCargo.map(([cargo, total], index) => ({
        cargo,
        total,
        fill: rhBarScale[index % rhBarScale.length],
      })),
    [funcionariosPorCargo]
  );

  const financeRadarData = useMemo<FinanceRadarPoint[]>(() => {
    const recebida = cobrancas
      .filter((item) => item.status === 'pago')
      .reduce((acc, item) => acc + item.value, 0);
    const aReceber = cobrancas
      .filter((item) => item.status === 'pendente')
      .reduce((acc, item) => acc + item.value, 0);
    const inadimplencia = cobrancas
      .filter((item) => item.status === 'vencida')
      .reduce((acc, item) => acc + item.value, 0);

    const metrics = [
      { indicador: 'Receita recebida', valor: recebida },
      { indicador: 'Receita a receber', valor: aReceber },
      { indicador: 'Folha salarial', valor: totalGastosPagamentos },
      { indicador: 'Despesas gerais', valor: totalGastosDespesas },
      { indicador: 'Inadimplência', valor: inadimplencia },
    ];

    const maxValue = Math.max(1, ...metrics.map((item) => item.valor));
    return metrics.map((item) => ({
      ...item,
      score: Number(((item.valor / maxValue) * 100).toFixed(1)),
    }));
  }, [cobrancas, totalGastosDespesas, totalGastosPagamentos]);

  const cobrancasStatusRadarData = useMemo<CountRadarPoint[]>(() => {
    const maxValue = Math.max(1, ...cobrancasPorStatus.map(([, total]) => total));
    return cobrancasPorStatus.map(([categoria, total]) => ({
      categoria,
      total,
      score: Number(((total / maxValue) * 100).toFixed(1)),
    }));
  }, [cobrancasPorStatus]);

  const despesasTipoRadarData = useMemo<CountRadarPoint[]>(() => {
    const maxValue = Math.max(1, ...despesasPorTipo.map(([, total]) => total));
    return despesasPorTipo.map(([categoria, total]) => ({
      categoria,
      total,
      score: Number(((total / maxValue) * 100).toFixed(1)),
    }));
  }, [despesasPorTipo]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <div className="h-1 w-full bg-gradient-to-r from-primary/70 via-primary/40 to-primary/10" />
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border border-border/70 bg-white p-2 shadow-sm">
              <Image src="/logo-icon.png" alt="Moratta" width={36} height={36} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Dashboard
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-sm md:text-base">
                Bem-vindo ao painel Moratta, a central administrativa do seu condomínio.
                Aqui você acompanha receitas, despesas, equipe, imóveis e indicadores
                estratégicos em um só lugar.
              </p>
            </div>
          </div>
        </div>
      </div>

      <RoleGuard roles={['Admin', 'Financeiro', 'RH']}>
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="text-sm text-muted-foreground">Visão geral do condomínio</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-card/80 p-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <Building2 className="size-4" />
                <span className="text-sm">Imóveis cadastrados</span>
              </div>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {numberFormatter.format(imoveis.length)}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card/80 p-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <Users className="size-4" />
                <span className="text-sm">Funcionários cadastrados</span>
              </div>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {numberFormatter.format(funcionarios.length)}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card/80 p-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <User className="size-4" />
                <span className="text-sm">Condôminos cadastrados</span>
              </div>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {numberFormatter.format(condominosTotal)}
              </p>
            </div>
          </div>
        </div>
      </RoleGuard>

      <RoleGuard roles={['Financeiro', 'Admin']}>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Resumo financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Total de lucro (cobranças)"
                value={currencyFormatter.format(totalLucro)}
                icon={CircleDollarSign}
              />
              <KpiCard
                title="Total de gastos"
                value={currencyFormatter.format(totalGastos)}
                icon={BanknoteArrowDown}
              />
              <KpiCard
                title="Gastos com funcionários"
                value={currencyFormatter.format(totalGastosPagamentos)}
                icon={Users}
              />
              <KpiCard
                title="Gastos em despesas"
                value={currencyFormatter.format(totalGastosDespesas)}
                icon={Building2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
              <CardTitle>Lucro x gastos ao longo do tempo</CardTitle>
              <p className="text-muted-foreground text-sm">
                Gastos = pagamentos de funcionários + despesas. Lucro = cobranças.
              </p>
            </div>
            <div className="grid grid-cols-3 border-t sm:border-t-0 sm:border-l">
              {(['lucro', 'gastos', 'saldo'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  data-active={activeFinanceChart === key}
                  className="data-[active=true]:bg-muted/50 flex flex-col justify-center gap-1 border-l px-4 py-3 text-left first:border-l-0"
                  onClick={() => setActiveFinanceChart(key)}
                >
                  <span className="text-muted-foreground text-[11px]">
                    {chartConfig[key].label}
                  </span>
                  <span className="text-sm font-semibold md:text-base">
                    {currencyFormatter.format(financeTotals[key])}
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sem dados suficientes para o gráfico.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Badge
                    className={
                      saldo >= 0
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50'
                        : 'bg-red-50 text-red-600 hover:bg-red-50'
                    }
                  >
                    Saldo {saldo >= 0 ? 'positivo' : 'negativo'}: {currencyFormatter.format(saldo)}
                  </Badge>
                </div>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ left: 8, right: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={60}
                      tickFormatter={(value) =>
                        compactCurrencyFormatter.format(Number(value))
                      }
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) =>
                            currencyFormatter.format(Number(value))
                          }
                          labelFormatter={(label) => `Mês: ${label}`}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="lucro"
                      stroke="var(--color-lucro)"
                      strokeWidth={activeFinanceChart === 'lucro' ? 3 : 1.5}
                      strokeOpacity={activeFinanceChart === 'lucro' ? 1 : 0.35}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="gastos"
                      stroke="var(--color-gastos)"
                      strokeWidth={activeFinanceChart === 'gastos' ? 3 : 1.5}
                      strokeOpacity={activeFinanceChart === 'gastos' ? 1 : 0.35}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="saldo"
                      stroke="var(--color-saldo)"
                      strokeWidth={activeFinanceChart === 'saldo' ? 3 : 1.5}
                      strokeOpacity={activeFinanceChart === 'saldo' ? 1 : 0.35}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {chartData.slice(-8).map((item) => (
                    <div
                      key={item.monthKey}
                      className="rounded-md border p-3 text-sm"
                    >
                      <p className="font-medium uppercase">{item.label}</p>
                      <p className="text-muted-foreground">
                        Lucro: {currencyFormatter.format(item.lucro)}
                      </p>
                      <p className="text-muted-foreground">
                        Gastos: {currencyFormatter.format(item.gastos)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Radar de equilíbrio financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={financeRadarChartConfig} className="h-72 w-full">
                <RadarChart data={financeRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="indicador" />
                  <PolarRadiusAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(_, __, item) => {
                          const payload = item.payload as FinanceRadarPoint;
                          return (
                            <div className="flex w-full items-center justify-between gap-2">
                              <span>{payload.indicador}</span>
                              <span className="font-mono">
                                {currencyFormatter.format(payload.valor)}
                              </span>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Radar
                    dataKey="score"
                    stroke="var(--color-score)"
                    fill="var(--color-score)"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                <div className="text-muted-foreground grid grid-cols-2 text-xs font-medium uppercase">
                  <span>Tipo</span>
                  <span className="text-right">Valor</span>
                </div>
                {financeRadarData.map((item) => (
                  <div key={item.indicador} className="grid grid-cols-2 text-sm">
                    <span>{item.indicador}</span>
                    <span className="text-right font-medium">
                      {currencyFormatter.format(item.valor)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cobranças por status</CardTitle>
            </CardHeader>
            <CardContent>
              {cobrancasStatusRadarData.length === 0 ? (
                <p className="text-muted-foreground text-sm">Sem dados para exibir.</p>
              ) : (
                <>
                  <ChartContainer config={cobrancaStatusRadarChartConfig} className="h-72 w-full">
                    <RadarChart data={cobrancasStatusRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="categoria" />
                      <PolarRadiusAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(_, __, item) => {
                              const payload = item.payload as CountRadarPoint;
                              return (
                                <div className="flex w-full items-center justify-between gap-2">
                                  <span>{payload.categoria}</span>
                                  <span className="font-mono">
                                    {numberFormatter.format(payload.total)}
                                  </span>
                                </div>
                              );
                            }}
                          />
                        }
                      />
                      <Radar
                        dataKey="score"
                        stroke="var(--color-score)"
                        fill="var(--color-score)"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    <div className="text-muted-foreground grid grid-cols-2 text-xs font-medium uppercase">
                      <span>Tipo</span>
                      <span className="text-right">Valor</span>
                    </div>
                    {cobrancasStatusRadarData.map((item) => (
                      <div key={item.categoria} className="grid grid-cols-2 text-sm">
                        <span>{item.categoria}</span>
                        <span className="text-right font-medium">
                          {numberFormatter.format(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Despesas por tipo</CardTitle>
            </CardHeader>
            <CardContent>
              {despesasTipoRadarData.length === 0 ? (
                <p className="text-muted-foreground text-sm">Sem dados para exibir.</p>
              ) : (
                <>
                  <ChartContainer config={despesaTipoRadarChartConfig} className="h-72 w-full">
                    <RadarChart data={despesasTipoRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="categoria" />
                      <PolarRadiusAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(_, __, item) => {
                              const payload = item.payload as CountRadarPoint;
                              return (
                                <div className="flex w-full items-center justify-between gap-2">
                                  <span>{payload.categoria}</span>
                                  <span className="font-mono">
                                    {numberFormatter.format(payload.total)}
                                  </span>
                                </div>
                              );
                            }}
                          />
                        }
                      />
                      <Radar
                        dataKey="score"
                        stroke="var(--color-score)"
                        fill="var(--color-score)"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    <div className="text-muted-foreground grid grid-cols-2 text-xs font-medium uppercase">
                      <span>Tipo</span>
                      <span className="text-right">Valor</span>
                    </div>
                    {despesasTipoRadarData.map((item) => (
                      <div key={item.categoria} className="grid grid-cols-2 text-sm">
                        <span>{item.categoria}</span>
                        <span className="text-right font-medium">
                          {numberFormatter.format(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </RoleGuard>

      <RoleGuard roles={['RH', 'Admin']}>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Resumo de RH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <KpiCard title="Funcionários ativos" value={numberFormatter.format(funcionariosPorStatus.find(([label]) => label === 'ativo')?.[1] ?? 0)} icon={TrendingUp} />
              <KpiCard title="Funcionários pendentes" value={numberFormatter.format(funcionariosPorStatus.find(([label]) => label === 'pendente')?.[1] ?? 0)} icon={BanknoteArrowUp} />
              <KpiCard title="Funcionários inativos" value={numberFormatter.format(funcionariosPorStatus.find(([label]) => label === 'inativo')?.[1] ?? 0)} icon={TrendingDown} />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Distribuição de funcionários por cargo</CardTitle>
            </CardHeader>
            <CardContent>
              {rhChartData.length === 0 ? (
                <p className="text-muted-foreground text-sm">Sem dados para exibir.</p>
              ) : (
                <ChartContainer config={rhChartConfig} className="h-72 w-full">
                  <BarChart data={rhChartData} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="cargo" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => numberFormatter.format(Number(value))}
                        />
                      }
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                      {rhChartData.map((entry) => (
                        <Cell key={entry.cargo} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <BreakdownCard title="Funcionários por status" data={funcionariosPorStatus} />
            <BreakdownCard title="Funcionários por cargo" data={funcionariosPorCargo} />
          </div>
        </div>
      </RoleGuard>

      <RoleGuard roles={['Admin']}>
        <div className="grid gap-4 lg:grid-cols-2">
          <BreakdownCard title="Imóveis por tipo" data={imoveisPorTipo} />
          <BreakdownCard title="Imóveis por situação" data={imoveisPorSituacao} />
        </div>
      </RoleGuard>
    </div>
  );
}
