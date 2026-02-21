"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/components/ui/form"
import { Input } from "@/features/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/components/ui/select"

export function PersonalDataSection() {
  const { control, watch } = useFormContext()

  // Monitora o campo maritalStatus
  const maritalStatus = watch("maritalStatus")

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-900">Dados Pessoais</h2>
        <p className="text-sm text-slate-400">Dados pessoais do proponente</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nome Completo */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-[14px] font-bold text-slate-800">Nome Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Evil Rabbit" {...field} className="h-11 border-slate-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data de Nascimento */}
        <FormField
          control={control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-bold text-slate-800">Data de Nascimento *</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-11 border-slate-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado Civil */}
        <FormField
          control={control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-bold text-slate-800">Estado Civil *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 border-slate-200 text-slate-500">
                    <SelectValue placeholder="selecionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RG e Órgão */}
        <FormField
          control={control}
          name="rg"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-bold text-slate-800">RG *</FormLabel>
              <FormControl>
                <Input placeholder="xx.xxx.xxx-x" {...field} className="h-11 border-slate-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="issuingAuthority"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-bold text-slate-800">Órgão Expedidor *</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: SSP-PE" {...field} className="h-11 border-slate-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CPF e Renda */}
        <FormField
          control={control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-bold text-slate-800">CPF *</FormLabel>
              <FormControl>
                <Input placeholder="xxx.xxx.xxx-xx" {...field} className="h-11 border-slate-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="monthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-bold text-slate-800">Renda Mensal (R$) *</FormLabel>
              <FormControl>
                <Input placeholder="R$ 0,00" {...field} className="h-11 border-slate-200" />
              </FormControl>
              <p className="text-[12px] text-slate-400">Informe valor bruto comprovável.</p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* SEÇÃO DO CÔNJUGE - Aparece apenas se for Casado */}
      {maritalStatus === "casado" && (
        <div className="pt-6 mt-6 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Dados do Cônjuge</h3>
            <p className="text-sm text-slate-400">Preencha as informações do parceiro(a)</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={control}
              name="spouse.name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[14px] font-bold text-slate-800">Nome Completo do Cônjuge *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="spouse.birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-slate-800">Data de Nascimento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="spouse.cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-slate-800">CPF *</FormLabel>
                  <FormControl>
                    <Input placeholder="xxx.xxx.xxx-xx" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="spouse.rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-slate-800">RG *</FormLabel>
                  <FormControl>
                    <Input placeholder="xx.xxx.xxx-x" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="spouse.monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-bold text-slate-800">Renda Mensal (R$) *</FormLabel>
                  <FormControl>
                    <Input placeholder="R$ 0,00" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </section>
  )
}
