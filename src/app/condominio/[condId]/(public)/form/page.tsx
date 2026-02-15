'use client';

import Image from 'next/image';
import { Button } from '@/features/components/ui/button';
import { Form } from '@/features/components/ui/form';
import { Separator } from '@/features/components/ui/separator';
import { AdditionalResidentsSection } from '@/features/form/components/AdditionalResidentsSecton';
import { BankingInfoSection } from '@/features/form/components/BankingInfoSection';
import { ContactSection } from '@/features/form/components/ContactSection';
import { DocumentsSection } from '@/features/form/components/DocumentsSection';
import { EmergencyContacts } from '@/features/form/components/EmergencyContacts';
import { PersonalDataSection } from '@/features/form/components/PersonalDataSection';
import { ProfessionalInfoSection } from '@/features/form/components/ProfessionalInfoSection';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  // Dados Pessoais
  name: z.string().min(1, 'Nome completo é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  maritalStatus: z.string().min(1, 'Estado civil é obrigatório'),
  rg: z.string().min(1, 'RG é obrigatório'),
  issuingAuthority: z.string().min(1, 'Órgão expedidor é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14),
  monthlyIncome: z.coerce.number().min(1, 'Informe sua renda mensal'),

  // Contato
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  primaryPhone: z.string().min(1, 'Telefone principal é obrigatório'),
  secondaryPhone: z.string().optional(), 
  address: z.string().min(1, 'Endereço é obrigatório'),

  // Contatos de Emergência 
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        relationship: z.string().min(1, 'Parentesco é obrigatório'),
        phone: z.string().min(1, 'Telefone é obrigatório'),
      })
    )
    .min(1),

  // Profissional
  professionalInfo: z.object({
    companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
    companyPhone: z.string().min(1, 'Telefone da empresa é obrigatório'),
    companyAddress: z.string().min(1, 'Endereço da empresa é obrigatório'),
    position: z.string().min(1, 'Cargo é obrigatório'),
    yearsWorking: z.coerce.number().min(0),
  }),

  // Bancário
  bankingInfo: z.object({
    bank: z.string().min(1, 'Banco é obrigatório'),
    accountType: z.string().min(1, 'Tipo de conta é obrigatório'),
    accountNumber: z.string().min(1, 'Número da conta é obrigatório'),
    agency: z.string().min(1, 'Agência é obrigatória'),
  }),

  // Cônjuge 
  spouse: z
    .object({
      name: z.string().optional(),
      rg: z.string().optional(),
      cpf: z.string().optional(),
      monthlyIncome: z.coerce.number().optional(),
    })
    .optional(),

  // Moradores Adicionais 
  additionalResidents: z
    .array(
      z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        relationship: z.string().min(1, 'Parentesco é obrigatório'),
        age: z.coerce.number().min(0),
      })
    )
    .default([]),

  documents: z.object({
    rg: z
      .any()
      .refine((file) => file instanceof File, 'O upload do RG é obrigatório'),
    cpf: z
      .any()
      .refine((file) => file instanceof File, 'O upload do CPF é obrigatório'),
    income: z
      .any()
      .refine(
        (file) => file instanceof File,
        'O comprovante de renda é obrigatório'
      ),
  }),
});

export default function PreCadastroForm() {
  // Dentro do seu PreCadastroForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      maritalStatus: '',
      rg: '',
      issuingAuthority: '',
      cpf: '',
      email: '',
      primaryPhone: '',
      secondaryPhone: '',
      address: '',
      // Inicialize o objeto spouse para evitar o erro de undefined ao renderizar
      spouse: {
        name: '',
        rg: '',
        cpf: '',
        monthlyIncome: 0,
      },
      emergencyContacts: [{ name: '', relationship: '', phone: '' }],
      professionalInfo: {
        companyName: '',
        companyPhone: '',
        companyAddress: '',
        position: '',
        yearsWorking: 0,
      },
      bankingInfo: {
        bank: '',
        accountType: '',
        accountNumber: '',
        agency: '',
      },
      additionalResidents: [],
      documents: {
        rg: undefined,
        cpf: undefined,
        income: undefined,
      },
    },
  });
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Aqui você chamaria seu service de cadastro
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-10">
      <div className="flex flex-col items-center space-y-2 text-center">
        <Image
          src="/images/logo.svg"
          width={40}
          height={40}
          alt="Logo Moratta"
        />

        <h1 className="text-brand-dark text-3xl font-bold">
          Pré-cadastro de Condômino
        </h1>
        <p className="text-muted-foreground">
          Formulário para pre-cadastro de proponentes a locatário.
          <br /> Preencha cuidadosamente as informações a seguir.
        </p>
      </div>
      {/* SEÇÃO: DADOS PESSOAIS */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <PersonalDataSection />
          {/* <Separator className="bg-slate-100" /> */}
          {/* CONTATO */}
          <ContactSection />
          {/* CONTATO EMERGÊNCIA */}
          <EmergencyContacts />

          {/* INFORMAÇÕES PROFISSIONAIS */}
          <ProfessionalInfoSection />

          {/* INFORMAÇÕES BANCÁRIAS */}
          <BankingInfoSection />
          {/* MORADORES ADICIONAIS */}
          <AdditionalResidentsSection />

          {/* DOCUMENTOS */}
          <DocumentsSection />
          <div className="mt-10 flex flex-col-reverse items-center justify-end gap-4 border-t border-slate-100 pt-8 md:flex-row">
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full bg-gray-200 px-8 hover:bg-gray-300 md:w-auto"
              onClick={() => {
                
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="h-12 w-full bg-blue-600 px-10 text-[16px] font-bold shadow-sm hover:bg-blue-700 md:w-auto"
            >
              Enviar Cadastro
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
