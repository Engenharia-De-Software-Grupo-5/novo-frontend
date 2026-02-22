import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/components/ui/form";
import { Input } from "@/features/components/ui/input";
import { Button } from "@/features/components/ui/button";



export function EmergencyContacts() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-900">Contatos de Emergência</h2>
        <p className="text-sm text-slate-400">Pessoas a serem contatadas em caso de necessidade</p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-in fade-in slide-in-from-top-2"
          >
            <FormField
              control={control}
              name={`emergencyContacts.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-800 text-[13px]">Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`emergencyContacts.${index}.relationship`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-800 text-[13px]">Parentesco *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pai, Amigo..." {...field} className="h-11 border-slate-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 items-end">
              <FormField
                control={control}
                name={`emergencyContacts.${index}.phone`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-bold text-slate-800 text-[13px]">Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(xx) xxxxx-xxxx" {...field} className="h-11 border-slate-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Só mostra lixeira se houver mais de um contato */}
              {fields.length > 1 && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => remove(index)}
                  className="h-11 w-11 text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full py-6 border-2 border-dashed border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
        onClick={() => append({ name: "", relationship: "", phone: "" })}
      >
        <Plus className="mr-2 h-4 w-4" /> Adicionar contato de emergência
      </Button>
    </section>
  );
}