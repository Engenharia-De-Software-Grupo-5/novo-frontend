'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/features/components/ui/form';
import { Input } from '@/features/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import { CalculatorFormValues, calculatorSchema } from '../schemas/calculatorSchema';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export function CalculatorDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      dueDate: '',
      paymentDate: '',
      value: '',
      penalty: '',
      interest: '',
    },
    mode: 'onChange',
  });

  const watched = useWatch({
    control: form.control,
  });

  const result = useMemo(() => {
    const dueDate = watched.dueDate ? new Date(watched.dueDate) : null;
    const paymentDate = watched.paymentDate ? new Date(watched.paymentDate) : null;
    const baseValue = Number(watched.value || 0);
    const penaltyFixed = Number(watched.penalty || 0);
    const interestPercent = Number(watched.interest || 0);

    if (!dueDate || !paymentDate || Number.isNaN(baseValue) || baseValue <= 0) {
      return {
        overdueDays: 0,
        penaltyValue: 0,
        interestValue: 0,
        totalValue: baseValue > 0 ? baseValue : 0,
      };
    }

    dueDate.setHours(0, 0, 0, 0);
    paymentDate.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const overdueDays = Math.max(
      0,
      Math.floor((paymentDate.getTime() - dueDate.getTime()) / msPerDay)
    );

    const penaltyValue = overdueDays > 0 ? penaltyFixed : 0;
    const interestValue =
      overdueDays > 0 ? penaltyValue * (interestPercent / 100) * (overdueDays / 30) : 0;

    return {
      overdueDays,
      penaltyValue,
      interestValue,
      totalValue: baseValue + penaltyValue + interestValue,
    };
  }, [watched.dueDate, watched.paymentDate, watched.value, watched.penalty, watched.interest]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Calculator className="mr-1 h-4 w-4" />
          Calculadora de multa e juros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader className="space-y-2 pb-1">
          <DialogTitle>Calculadora de multas e juros</DialogTitle>
          <DialogDescription>
            Calcule o valor final com multa fixa e juros aplicados sobre a multa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Data de vencimento *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Data de pagamento *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Valor *</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="R$ 0,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="penalty"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Multa (R$) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="R$ 0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Juros (%) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1 rounded-md border bg-muted/30 p-4 text-sm">
              <p>
                <span className="font-medium">Dias de atraso:</span> {result.overdueDays} dias
              </p>
              <p>
                <span className="font-medium">Valor da multa:</span>{' '}
                {formatCurrency(result.penaltyValue)}
              </p>
              <p>
                <span className="font-medium">Valor dos juros:</span>{' '}
                {formatCurrency(result.interestValue)}
              </p>
              <p>
                <span className="font-medium">Valor total:</span>{' '}
                {formatCurrency(result.totalValue)}
              </p>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
