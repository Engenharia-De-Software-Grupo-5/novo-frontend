'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/features/components/ui/form';
import { Input } from '@/features/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function ProfessionalInfoSection() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">
          Informações Profissionais
        </h2>
        <p className="text-sm text-slate-400">Dados sobre sua ocupação atual</p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <FormField
          control={control}
          name="professionalInfo.companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Nome Empresa
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome da empresa"
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
          name="professionalInfo.companyPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Telefone Empresa
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="(xx) xxxx-xxxx"
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
          name="professionalInfo.companyAddress"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Endereço Empresa
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Rua, número, bairro..."
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
          name="professionalInfo.position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Cargo Ocupado
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Analista de Sistemas"
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
          name="professionalInfo.yearsWorking"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Tempo de Trabalho (meses)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  min={0}
                  className="h-11 border-slate-200"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);

                    if (value < 0) {
                      field.onChange(0);
                    } else {
                      field.onChange(e.target.value);
                    }
                  }}
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
