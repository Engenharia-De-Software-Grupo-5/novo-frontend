"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/components/ui/form"
import { Input } from "@/features/components/ui/input"

export function ContactSection() {
  const { control } = useFormContext()

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">Contato</h2>
        <p className="text-sm text-slate-400">
          Dados do proponente para contato
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {/* Email ocupando a largura total no desktop */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Email *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="m@example.com"
                  {...field}
                  className="h-11 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Telefone Principal */}
        <FormField
          control={control}
          name="primaryPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Telefone Principal *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="(xx) xxxxx-xxxx"
                  {...field}
                  className="h-11 border-slate-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Telefone Secundário */}
        <FormField
          control={control}
          name="secondaryPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] font-bold text-slate-800">
                Telefone Secundário
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="(xx) xxxxx-xxxx"
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
  )
}