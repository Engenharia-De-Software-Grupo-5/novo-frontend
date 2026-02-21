'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Imovel } from '@/types/imoveis';
import { mockImoveis } from '@/mocks/imoveis';

import { CONTRACT_STATUSES } from '../constants';
import { ContratoFormData, contratoSchema } from '../schemas/contratoSchema';
import { postContrato } from '../services/contratoService';

const formatPropertyName = (imovel: Imovel) => {
  return `${imovel.idImovel} / ${imovel.nome}`;
};

const formatPropertyAddress = (imovel: Imovel) => {
  const { rua, numero, bairro, cidade, estado } = imovel.endereco;
  return `${rua}, ${numero} - ${bairro}, ${cidade}/${estado}`;
};

export function AddContractDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const properties = useMemo(() => {
    const filtered = mockImoveis.filter((item) => item.idCondominio === condId);
    return filtered.length > 0 ? filtered : mockImoveis;
  }, [condId]);

  const form = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      tenantName: '',
      property: '',
      propertyAddress: '',
      status: 'agendado',
      startDate: '',
      endDate: '',
    },
  });

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const selected = properties.find((item) => item.idImovel === propertyId);

    if (!selected) return;

    form.setValue('property', formatPropertyName(selected), {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue('propertyAddress', formatPropertyAddress(selected), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  async function onSubmit(data: ContratoFormData) {
    try {
      setIsSubmitting(true);
      await postContrato(condId, data);
      toast.success(`Contrato de "${data.tenantName}" criado com sucesso!`);
      router.refresh();
      setOpen(false);
      setSelectedPropertyId('');
      form.reset();
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('Erro ao criar contrato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setSelectedPropertyId('');
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Adicionar Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Adicionar Contrato</DialogTitle>
          <DialogDescription>
            Fluxo baseado no rascunho: selecione um imóvel e preencha os dados
            do locatário e vigência do contrato.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium">
                Imóvel cadastrado (atalho)
              </label>
              <Select
                value={selectedPropertyId}
                onValueChange={handlePropertySelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.idImovel} value={property.idImovel}>
                      {formatPropertyName(property)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="tenantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome locatário *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imóvel *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex.: IMV-001 / Edifício Paulista"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço do imóvel *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex.: Av. Paulista, 1000 - Bela Vista, São Paulo/SP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Início *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Vencimento *</FormLabel>
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONTRACT_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar contrato'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
