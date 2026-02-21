"use client"

import { useFormContext } from "react-hook-form"
import { Upload } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/components/ui/form"
import { Input } from "@/features/components/ui/input"

export function DocumentsSection() {
  const { control } = useFormContext()

  const documentTypes = [
    { name: "documents.rg", label: "RG", description: "Frente e verso (PDF ou Imagem)" },
    { name: "documents.cpf", label: "CPF", description: "Documento oficial contendo o número" },
    { name: "documents.incomeProof", label: "Comprovante de Renda", description: "Últimos 3 holerites ou declaração de IR" },
  ]

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">
          Documentos do Proponente
        </h2>
        <p className="text-sm text-slate-400">
          Anexe as cópias comprobatórias legíveis
        </p>
      </div>

      <div className="space-y-6">
  {documentTypes.map((doc) => (
    <FormField
      key={doc.name}
      control={control}
      name={doc.name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-[14px] font-bold text-slate-800">
            {doc.label} (PDF)
          </FormLabel>

          <FormControl>
            <div className="relative">
              <label className="flex items-center justify-center w-full h-15 px-4 border border-dashed border-slate-300 rounded-md bg-white cursor-pointer hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-slate-500" />
                  <span className="text-[14px] text-slate-600">
                    {value instanceof File ? (
                      <span className="text-blue-600 font-medium">
                        {value.name}
                      </span>
                    ) : (
                      "Clique para fazer upload"
                    )}
                  </span>
                </div>

                <Input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...fieldProps}
                />
              </label>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  ))}
</div>

    </section>
  )
}
