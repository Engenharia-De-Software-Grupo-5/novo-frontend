"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2, Users } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/components/ui/form"
import { Input } from "@/features/components/ui/input"
import { Button } from "@/features/components/ui/button"

export function AdditionalResidentsSection() {
  const { control } = useFormContext()
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalResidents",
  })

  return (
    <section className="space-y-6">
      {/* Cabeçalho fixo */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">Moradores Adicionais</h2>
        <p className="text-sm text-slate-400">Quem residirá com você no imóvel</p>
      </div>

      {/* Lista de Moradores (aparece acima do botão) */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start p-3  bg-white animate-in slide-in-from-top-3 duration-300"
          >
            {/* Nome */}
            <FormField
              control={control}
              name={`additionalResidents.${index}.name`}
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel className="text-[13px] font-bold text-slate-700">Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo" className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parentesco */}
            <FormField
              control={control}
              name={`additionalResidents.${index}.relationship`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[13px] font-bold text-slate-700">Parentesco</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Filho(a)" className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Idade + Lixeira */}
            <div className="md:col-span-2 flex items-end gap-2">
              <FormField
                control={control}
                name={`additionalResidents.${index}.age`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[13px] font-bold text-slate-700">Idade</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-11 border-slate-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

    
      <Button
        type="button"
        variant="outline"
        className="w-full py-6 border-2 border-dashed border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
        onClick={() => append({ name: "", relationship: "", age: "" })}
      >
        <Plus className="mr-2 h-4 w-4" /> Adicionar morador
      </Button>
    </section>
  )
}