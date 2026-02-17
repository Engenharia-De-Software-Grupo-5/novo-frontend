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
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { createCondomino } from '@/features/condominos/services/condominos.service';
import { useParams, useRouter } from 'next/navigation';

const formSchema = z.object({
  // --- DADOS PESSOAIS ---
  name: z.string().trim().min(1, 'Nome completo é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  maritalStatus: z.string().min(1, 'Estado civil é obrigatório'),

  // RG: Aceita letras (alguns estados têm letras) mas remove pontos/traços
  rg: z
    .string()
    .min(1, 'RG é obrigatório')
    .transform((val) => val.replace(/[^a-zA-Z0-9]/g, '')),

  issuingAuthority: z.string().min(1, 'Órgão expedidor é obrigatório'),

  // CPF: Limpa a máscara e valida se tem exatamente 11 dígitos
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z
        .string()
        .length(11, 'CPF deve ter 11 números')
        .regex(/^\d+$/, 'Apenas números são permitidos')
    ),

  monthlyIncome: z.coerce.number().min(1, 'Informe sua renda mensal'),

  // --- CONTATO ---
  email: z
    .email('Digite um formato de e-mail válido (ex: nome@exemplo.com)')
    .min(1, 'E-mail é obrigatório')
    .trim()
    .toLowerCase()
    .refine((val) => val.includes('.'), {
      message: 'O e-mail deve conter um domínio válido (ex: .com ou .com.br)',
    }),

  primaryPhone: z
    .string()
    .min(1, 'Telefone principal é obrigatório')
    // 1. Remove tudo que não for número antes de validar
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z
        .string()
        // DDD (2) + 8 ou 9 dígitos
        .min(10, 'Telefone deve ter no mínimo 10 dígitos (com DDD)')
        .max(11, 'Telefone não pode ter mais de 11 dígitos')
    ),

  secondaryPhone: z
    .string()
    .optional()
    // Se o usuário digitar algo, limpa. Se não, retorna undefined
    .transform((val) =>
      val && val.trim() !== '' ? val.replace(/\D/g, '') : undefined
    )
    .pipe(
      z
        .string()
        .min(10, 'Telefone inválido')
        .max(11, 'Telefone inválido')
        .optional()
        .or(z.literal('')) 
    ),

  address: z.string().min(1, 'Endereço é obrigatório'),

  // --- CONTATOS DE EMERGÊNCIA ---
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        relationship: z.string().min(1, 'Parentesco é obrigatório'),
        phone: z
          .string()
          .min(1, 'Telefone é obrigatório')
          .transform((val) => val.replace(/\D/g, '')),
      })
    )
    .min(1, 'Adicione pelo menos um contato de emergência'),

  // --- PROFISSIONAL ---
  professionalInfo: z.object({
    companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
    companyPhone: z
      .string()
      .min(1, 'Telefone da empresa é obrigatório')
      .transform((v) => v.replace(/\D/g, '')),
    companyAddress: z.string().min(1, 'Endereço da empresa é obrigatório'),
    position: z.string().min(1, 'Cargo é obrigatório'),
    monthsWorking: z.coerce.number().min(0, 'Valor inválido'),
  }),

  // --- BANCÁRIO ---
  bankingInfo: z.object({
    bank: z.string().min(1, 'Banco é obrigatório'),
    accountType: z.string().min(1, 'Tipo de conta é obrigatório'),
    accountNumber: z
      .string()
      .min(1, 'Número da conta é obrigatório')
      .regex(/^\d+$/, 'Apenas números'),
    agency: z
      .string()
      .min(1, 'Agência é obrigatória')
      .regex(/^\d+$/, 'Apenas números'),
  }),

  // --- CÔNJUGE ---
  spouse: z
    .object({
      name: z.string().optional(),
      rg: z
        .string()
        .optional()
        .transform((v) => v?.replace(/[^a-zA-Z0-9]/g, '')),
      cpf: z
        .string()
        .optional()
        .transform((v) => v?.replace(/\D/g, '')),
      monthlyIncome: z.coerce.number().optional(),
    })
    .optional(),

  // --- MORADORES ADICIONAIS ---
  additionalResidents: z
    .array(
      z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        relationship: z.string().min(1, 'Parentesco é obrigatório'),
        age: z.coerce.number().min(0, 'Idade inválida'),
      })
    )
    .default([]),

  // --- DOCUMENTOS (UPLOAD) ---
  documents: z.object({
    rg: z.instanceof(File, { message: 'O upload do RG é obrigatório' }),
    cpf: z.instanceof(File, { message: 'O upload do CPF é obrigatório' }),
    incomeProof: z.instanceof(File, {
      message: 'O comprovante de renda é obrigatório',
    }),
  }),
});

type PreCadastroFormData = z.infer<typeof formSchema>;

export default function PreCadastroForm() {
  const params = useParams();
  const router = useRouter();
  console.log('PARAMS:', params); // veja o que vem aqui
  const condominiumId = params.condId;

  const form = useForm<PreCadastroFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'beatriz',
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
        monthsWorking: 0,
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
        incomeProof: undefined,
      },
    },
  });

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  //   // Aqui você chamaria seu service de cadastro
  // }

  const onSubmit: SubmitHandler<PreCadastroFormData> = async (values) => {
    console.log('FORM VALUES:', values);
    if (!condominiumId) {
      console.error('condominioId não definido!');
      return;
    }

    try {
      const payload = { ...values, condominiumId };

      await createCondomino(condominiumId, payload);

      router.push(`/condominio/${condominiumId}/condominos?page=1&limit=10`);
    } catch (error) {
      console.error(error);
    }
  };

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
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log('FORM ERRORS:', errors)
          )}
          className="space-y-10"
        >
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
              onClick={() => {}}
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
