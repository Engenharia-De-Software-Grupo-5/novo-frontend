'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/features/components/ui/form';
import { Input } from '@/features/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/components/ui/select';
import { useFormContext } from 'react-hook-form';

export function BankingInfoSection() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">
          Informações Bancárias
        </h2>
        <p className="text-sm text-slate-400">
          Dados para referências financeiras
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <FormField
          control={control}
          name="bankingInfo.bank"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Banco
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Itaú, Nubank..."
                  {...field}
                  className="h-11 border-slate-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bankingInfo.accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Tipo de Conta *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 border-slate-200 text-slate-600 focus:ring-slate-400">
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="corrente">Conta Corrente</SelectItem>
                  <SelectItem value="poupanca">Conta Poupança</SelectItem>
                  <SelectItem value="pagamento">Conta de Pagamento</SelectItem>
                  <SelectItem value="salario">Conta Salário</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bankingInfo.accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Número da Conta
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="00000-0"
                  {...field}
                  className="h-11 border-slate-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bankingInfo.agency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Agência
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="0000"
                  {...field}
                  className="h-11 border-slate-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
