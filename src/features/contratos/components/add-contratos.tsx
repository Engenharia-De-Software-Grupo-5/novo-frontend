'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/features/components/ui/command';
import { Input } from '@/features/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/components/ui/popover';
import { Textarea } from '@/features/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/components/ui/tabs';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/features/components/ui/field';
import { Checkbox } from '@/features/components/ui/checkbox';
import { Separator } from '@/features/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/features/components/ui/accordion';
import { Calendar, Check, ChevronsUpDown, FileText, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

import { CONTRACT_STATUSES } from '@/features/contratos/constants';
import { postContrato } from '@/features/contratos/services/contratoService';
import { getCondominoById } from '@/features/condominos/services/condominos.service';
import { CondominoFull, CondominoSummary } from '@/types/condomino';
import { ContractStatus } from '@/types/contrato';
import { ImovelSummary } from '@/types/imoveis';
import { cn } from '@/lib/utils';

interface AddContratoProps {
  condId: string;
  properties: ImovelSummary[];
  tenants: CondominoSummary[];
}

interface TenantViewModel {
  id: string;
  name: string;
  personalData: {
    fullName: string;
    birthDate: string;
    rg: string;
    rgIssuer: string;
    cpf: string;
    monthlyIncome: string;
    profession: string;
    maritalStatus: string;
  };
  contact: {
    email: string;
    mainPhone: string;
    secondaryPhone: string;
    address: string;
  };
  bankData: {
    bank: string;
    accountType: string;
    agency: string;
    accountNumber: string;
  };
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
  }[];
}

const formatPropertyLabel = (property: ImovelSummary) =>
  `${property.idImovel} / ${property.name}`;

const formatPropertyAddress = (property: ImovelSummary) =>
  `${property.endereco} - ${property.bairro}, ${property.cidade}`;

const formatBirthDate = (value: string) => {
  if (!value) return '-';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
};

const formatCurrency = (value: number) => {
  if (!Number.isFinite(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const mapCondominoToTenant = (condomino: CondominoFull): TenantViewModel => ({
  id: condomino.id,
  name: condomino.name,
  personalData: {
    fullName: condomino.name,
    birthDate: formatBirthDate(condomino.birthDate),
    rg: condomino.rg,
    rgIssuer: condomino.issuingAuthority,
    cpf: condomino.cpf,
    monthlyIncome: formatCurrency(condomino.monthlyIncome),
    profession: condomino.professionalInfo?.position || '-',
    maritalStatus: condomino.maritalStatus,
  },
  contact: {
    email: condomino.email,
    mainPhone: condomino.primaryPhone,
    secondaryPhone: condomino.secondaryPhone || '-',
    address: condomino.address,
  },
  bankData: {
    bank: condomino.bankingInfo?.bank || '-',
    accountType: condomino.bankingInfo?.accountType || '-',
    agency: condomino.bankingInfo?.agency || '-',
    accountNumber: condomino.bankingInfo?.accountNumber || '-',
  },
  emergencyContacts: condomino.emergencyContacts || [],
});

export default function AddContratos({
  condId,
  properties,
  tenants,
}: AddContratoProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [hasSecondProposer, setHasSecondProposer] = useState(false);
  const [selectedSecondProposerId, setSelectedSecondProposerId] = useState('');
  const [openProperty, setOpenProperty] = useState(false);
  const [openTenant, setOpenTenant] = useState(false);
  const [openSecondProposer, setOpenSecondProposer] = useState(false);

  const [rentValue, setRentValue] = useState('');
  const [condoFee, setCondoFee] = useState('');
  const [iptuValue, setIptuValue] = useState('');
  const [tcrValue, setTcrValue] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [renterName, setRenterName] = useState('');
  const [renterCpf, setRenterCpf] = useState('');
  const [renterPhone, setRenterPhone] = useState('');
  const [renterEmail, setRenterEmail] = useState('');

  const [status, setStatus] = useState<ContractStatus>('agendado');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tenantDetailsById, setTenantDetailsById] = useState<
    Record<string, TenantViewModel>
  >({});
  const [isLoadingTenant, setIsLoadingTenant] = useState(false);
  const [isLoadingSecondProposer, setIsLoadingSecondProposer] = useState(false);

  const selectedProperty = useMemo(
    () => properties.find((item) => item.idImovel === selectedPropertyId),
    [properties, selectedPropertyId]
  );

  const selectedTenant = useMemo(
    () => tenantDetailsById[selectedTenantId],
    [selectedTenantId, tenantDetailsById]
  );

  const selectedSecondProposer = useMemo(
    () => tenantDetailsById[selectedSecondProposerId],
    [selectedSecondProposerId, tenantDetailsById]
  );

  const secondProposerOptions = useMemo(
    () => tenants.filter((item) => item.id !== selectedTenantId),
    [selectedTenantId, tenants]
  );

  const loadTenantDetails = useCallback(
    async (tenantId: string, kind: 'tenant' | 'secondProposer') => {
      if (!tenantId || tenantDetailsById[tenantId]) return;

      if (kind === 'tenant') {
        setIsLoadingTenant(true);
      } else {
        setIsLoadingSecondProposer(true);
      }

      try {
        const condomino = await getCondominoById(condId, tenantId);
        const mapped = mapCondominoToTenant(condomino);
        setTenantDetailsById((current) => ({ ...current, [tenantId]: mapped }));
      } catch (error) {
        console.error('Error fetching condomino details:', error);
        toast.error('Erro ao carregar os dados completos do condômino.');
      } finally {
        if (kind === 'tenant') {
          setIsLoadingTenant(false);
        } else {
          setIsLoadingSecondProposer(false);
        }
      }
    },
    [condId, tenantDetailsById]
  );

  useEffect(() => {
    if (!selectedTenantId) return;
    loadTenantDetails(selectedTenantId, 'tenant');
  }, [selectedTenantId, loadTenantDetails]);

  useEffect(() => {
    if (!selectedSecondProposerId) return;
    loadTenantDetails(selectedSecondProposerId, 'secondProposer');
  }, [selectedSecondProposerId, loadTenantDetails]);

  const listPath = `/condominios/${condId}/contratos`;

  const resetForm = () => {
    setSelectedPropertyId('');
    setSelectedTenantId('');
    setHasSecondProposer(false);
    setSelectedSecondProposerId('');
    setStatus('agendado');
    setStartDate('');
    setEndDate('');
    setRentValue('');
    setCondoFee('');
    setIptuValue('');
    setTcrValue('');
    setAdditionalInfo('');
    setRenterName('');
    setRenterCpf('');
    setRenterPhone('');
    setRenterEmail('');
    setHasSubmitAttempt(false);
  };

  const validateDates = () => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  };

  const isPropertyInvalid = hasSubmitAttempt && !selectedPropertyId;
  const isTenantInvalid = hasSubmitAttempt && !selectedTenantId;
  const isRenterNameInvalid = hasSubmitAttempt && !renterName.trim();
  const isRenterCpfInvalid = hasSubmitAttempt && !renterCpf.trim();
  const isRenterPhoneInvalid = hasSubmitAttempt && !renterPhone.trim();
  const isRenterEmailInvalid = hasSubmitAttempt && !renterEmail.trim();
  const isRentValueInvalid = hasSubmitAttempt && !rentValue.trim();
  const isStartDateInvalid = hasSubmitAttempt && !startDate;
  const isEndDateInvalid = hasSubmitAttempt && !endDate;
  const isStatusInvalid = hasSubmitAttempt && !status;
  const isSecondProposerInvalid =
    hasSubmitAttempt && hasSecondProposer && !selectedSecondProposerId;

  const hasRequiredFieldsMissing =
    !selectedPropertyId ||
    !selectedTenantId ||
    !renterName.trim() ||
    !renterCpf.trim() ||
    !renterPhone.trim() ||
    !renterEmail.trim() ||
    !rentValue.trim() ||
    !startDate ||
    !endDate ||
    !status ||
    (hasSecondProposer && !selectedSecondProposerId);

  const handleSubmit = async () => {
    setHasSubmitAttempt(true);

    if (hasRequiredFieldsMissing) {
      toast.error('Preencha todos os campos obrigatórios (*) antes de adicionar o contrato.');
      return;
    }

    if (!selectedTenant || !selectedProperty) {
      toast.error('Selecione um locatário e um imóvel para criar o contrato.');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Informe as datas de início e vencimento.');
      return;
    }

    if (!validateDates()) {
      toast.error('A data de vencimento deve ser maior ou igual à data de início.');
      return;
    }

    try {
      setIsSubmitting(true);

      await postContrato(condId, {
        tenantName: selectedTenant.name,
        property: formatPropertyLabel(selectedProperty),
        propertyAddress: formatPropertyAddress(selectedProperty),
        status,
        startDate,
        endDate,
      });

      toast.success('Contrato criado com sucesso.');
      router.push(listPath);
      router.refresh();
      resetForm();
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('Erro ao criar contrato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Adicionar Contrato</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Selecione um condômino e um imóvel já cadastrados para iniciar o novo contrato.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <Card className="xl:h-[calc(100vh-13rem)]">
            <CardHeader>
              <CardTitle>Pré-visualização do PDF</CardTitle>
              <CardDescription>
                Estrutura de visualização para o contrato que será gerado.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-5rem)] flex-col">
              <div className="bg-muted/30 border-border text-muted-foreground flex flex-1 flex-col items-center justify-center rounded-md border p-6 text-center">
                <FileText className="mb-3 h-9 w-9" />
                <p className="font-medium">Preview em preparação</p>
                <p className="mt-1 text-sm">
                  O PDF será disponibilizado aqui conforme os dados forem preenchidos.
                </p>
              </div>
              <Button variant="outline" className="mt-4 w-full" size="sm" type="button">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Recarregar
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Accordion
            type="multiple"
            defaultValue={['property', 'tenant', 'renter', 'contract']}
            className="space-y-6"
          >
            <AccordionItem value="property" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div>
                      <CardTitle className="text-left">Dados do Imóvel</CardTitle>
                      <CardDescription className="text-left">
                        Selecione um imóvel já cadastrado.
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <Field>
                      <FieldLabel htmlFor="property">Imóvel *</FieldLabel>
                      <Popover open={openProperty} onOpenChange={setOpenProperty}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProperty}
                            className={cn(
                              'w-full justify-between',
                              !selectedPropertyId && 'text-muted-foreground',
                              isPropertyInvalid && 'border-destructive text-destructive'
                            )}
                          >
                            {selectedProperty
                              ? formatPropertyLabel(selectedProperty)
                              : 'Selecionar imóvel'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder="Procurar imóvel..." />
                            <CommandList>
                              <CommandEmpty>Nenhum imóvel encontrado.</CommandEmpty>
                              <CommandGroup>
                                {properties.map((property) => (
                                  <CommandItem
                                    key={property.idImovel}
                                    value={`${property.idImovel} ${property.name}`}
                                    onSelect={() => {
                                      setSelectedPropertyId(property.idImovel);
                                      setOpenProperty(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        property.idImovel === selectedPropertyId
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {formatPropertyLabel(property)}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FieldDescription>
                        É preciso que o imóvel esteja previamente cadastrado.
                      </FieldDescription>
                    </Field>

                    {selectedProperty && (
                      <Tabs defaultValue="basicas" className="mt-2">
                        <TabsList className="w-full">
                          <TabsTrigger value="basicas" className="flex-1">
                            Informações Básicas
                          </TabsTrigger>
                          <TabsTrigger value="endereco" className="flex-1">
                            Endereço
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basicas" className="mt-4">
                          <div className="space-y-4 rounded-lg border p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-muted-foreground text-sm">Identificação</p>
                                <p className="text-sm font-medium">{selectedProperty.idImovel}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">Nome</p>
                                <p className="text-sm font-medium">{selectedProperty.name}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">Tipo</p>
                                <p className="text-sm font-medium">{selectedProperty.tipo}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">Situação</p>
                                <p className="text-sm font-medium capitalize">
                                  {selectedProperty.situacao}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="endereco" className="mt-4">
                          <div className="space-y-4 rounded-lg border p-4">
                            <p className="text-sm font-medium">{selectedProperty.endereco}</p>
                            <p className="text-muted-foreground text-sm">
                              {selectedProperty.bairro}, {selectedProperty.cidade}
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="tenant" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div>
                      <CardTitle className="text-left">Dados do Locatário</CardTitle>
                      <CardDescription className="text-left">
                        Informações contratuais do locatário.
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <Field>
                      <FieldLabel htmlFor="tenant">Condômino *</FieldLabel>
                      <Popover open={openTenant} onOpenChange={setOpenTenant}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTenant}
                            className={cn(
                              'w-full justify-between',
                              !selectedTenantId && 'text-muted-foreground',
                              isTenantInvalid && 'border-destructive text-destructive'
                            )}
                          >
                            {selectedTenantId
                              ? tenants.find((tenant) => tenant.id === selectedTenantId)
                                  ?.name || 'Selecionar condômino'
                              : 'Selecionar condômino'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder="Procurar condômino..." />
                            <CommandList>
                              <CommandEmpty>Nenhum condômino encontrado.</CommandEmpty>
                              <CommandGroup>
                                {tenants.map((tenant) => (
                                  <CommandItem
                                    key={tenant.id}
                                    value={`${tenant.name} ${tenant.cpf}`}
                                    onSelect={() => {
                                      setSelectedTenantId(tenant.id);
                                      setOpenTenant(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        tenant.id === selectedTenantId
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {tenant.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FieldDescription>
                        É preciso que o locatário tenha preenchido o formulário de pré-cadastro devidamente.
                      </FieldDescription>
                    </Field>

                    {selectedTenantId && !selectedTenant && isLoadingTenant && (
                      <div className="mt-6 rounded-lg border p-4">
                        <p className="text-muted-foreground text-sm">
                          Carregando dados completos do locatário...
                        </p>
                      </div>
                    )}

                    {selectedTenant && (
                      <Tabs defaultValue="pessoais" className="mt-6">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
                          <TabsTrigger value="contato">Contato</TabsTrigger>
                          <TabsTrigger value="bancarios">Dados Bancários</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pessoais" className="mt-6">
                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">Nome Completo</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.fullName}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Data de Nascimento</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.birthDate}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Estado Civil</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.maritalStatus}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">RG</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.rg}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Órgão Expedidor</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.rgIssuer}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">CPF</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.cpf}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Renda Mensal</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.monthlyIncome}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">Profissão</p>
                                <p className="text-sm font-medium">{selectedTenant.personalData.profession}</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="contato" className="mt-6">
                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">Email</p>
                                <p className="text-sm font-medium">{selectedTenant.contact.email}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Telefone Principal</p>
                                <p className="text-sm font-medium">{selectedTenant.contact.mainPhone}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Telefone Secundário</p>
                                <p className="text-sm font-medium">{selectedTenant.contact.secondaryPhone}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">Endereço</p>
                                <p className="text-sm font-medium">{selectedTenant.contact.address}</p>
                              </div>

                              {selectedTenant.emergencyContacts.length > 0 && (
                                <>
                                  <div className="col-span-2 mt-2">
                                    <Separator />
                                  </div>
                                  <div className="col-span-2">
                                    <p className="mb-3 text-sm font-semibold">Contatos de Emergência</p>
                                  </div>
                                  {selectedTenant.emergencyContacts.map((contact, index) => (
                                    <div key={index} className="col-span-2 grid grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-muted-foreground mb-1 text-sm">Nome</p>
                                        <p className="text-sm font-medium">{contact.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground mb-1 text-sm">Parentesco</p>
                                        <p className="text-sm font-medium">{contact.relationship}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground mb-1 text-sm">Telefone</p>
                                        <p className="text-sm font-medium">{contact.phone}</p>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="bancarios" className="mt-6">
                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">Banco</p>
                                <p className="text-sm font-medium">{selectedTenant.bankData.bank}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Tipo de Conta</p>
                                <p className="text-sm font-medium">{selectedTenant.bankData.accountType}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">Agência</p>
                                <p className="text-sm font-medium">{selectedTenant.bankData.agency}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">Número da Conta</p>
                                <p className="text-sm font-medium">{selectedTenant.bankData.accountNumber}</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="renter" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div>
                      <CardTitle className="text-left">Dados do Locador</CardTitle>
                      <CardDescription className="text-left">
                        Informações do locador.
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <Field>
                      <FieldLabel htmlFor="renter-name">Nome Completo *</FieldLabel>
                      <Input
                        id="renter-name"
                        placeholder="Ex.: João da Silva"
                        value={renterName}
                        onChange={(event) => setRenterName(event.target.value)}
                        className={cn(isRenterNameInvalid && 'border-destructive')}
                      />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="renter-cpf">CPF *</FieldLabel>
                        <Input
                          id="renter-cpf"
                          placeholder="000.000.000-00"
                          value={renterCpf}
                          onChange={(event) => setRenterCpf(event.target.value)}
                          className={cn(isRenterCpfInvalid && 'border-destructive')}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="renter-phone">Telefone Principal *</FieldLabel>
                        <Input
                          id="renter-phone"
                          placeholder="(00) 90000-0000"
                          value={renterPhone}
                          onChange={(event) => setRenterPhone(event.target.value)}
                          className={cn(isRenterPhoneInvalid && 'border-destructive')}
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="renter-email">Email *</FieldLabel>
                      <Input
                        id="renter-email"
                        type="email"
                        placeholder="nome@email.com"
                        value={renterEmail}
                        onChange={(event) => setRenterEmail(event.target.value)}
                        className={cn(isRenterEmailInvalid && 'border-destructive')}
                      />
                    </Field>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="contract" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div>
                      <CardTitle className="text-left">Dados Contratuais</CardTitle>
                      <CardDescription className="text-left">
                        Informações financeiras e contratuais.
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="rent-value">Valor do Aluguel *</FieldLabel>
                        <Input
                          id="rent-value"
                          placeholder="R$ 0,00"
                          value={rentValue}
                          onChange={(event) => setRentValue(event.target.value)}
                          className={cn(isRentValueInvalid && 'border-destructive')}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="condo-fee">Taxa de Condomínio</FieldLabel>
                        <Input
                          id="condo-fee"
                          placeholder="R$ 0,00"
                          value={condoFee}
                          onChange={(event) => setCondoFee(event.target.value)}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="iptu-value">Valor IPTU</FieldLabel>
                        <Input
                          id="iptu-value"
                          placeholder="R$ 0,00"
                          value={iptuValue}
                          onChange={(event) => setIptuValue(event.target.value)}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="tcr-value">Valor TCR</FieldLabel>
                        <Input
                          id="tcr-value"
                          placeholder="R$ 0,00"
                          value={tcrValue}
                          onChange={(event) => setTcrValue(event.target.value)}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="start-date">Data Início *</FieldLabel>
                        <div className="relative">
                          <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 h-4 w-4" />
                          <Input
                            id="start-date"
                            type="date"
                            className={cn('pl-9', isStartDateInvalid && 'border-destructive')}
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                          />
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="end-date">Data Vencimento *</FieldLabel>
                        <div className="relative">
                          <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 h-4 w-4" />
                          <Input
                            id="end-date"
                            type="date"
                            className={cn('pl-9', isEndDateInvalid && 'border-destructive')}
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                          />
                        </div>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="contract-status">Status *</FieldLabel>
                      <Select
                        value={status}
                        onValueChange={(value) => setStatus(value as ContractStatus)}
                      >
                        <SelectTrigger
                          id="contract-status"
                          className={cn(isStatusInvalid && 'border-destructive')}
                        >
                          <SelectValue placeholder="Selecionar status" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTRACT_STATUSES.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="additional-info">Informações Adicionais</FieldLabel>
                      <Textarea
                        id="additional-info"
                        placeholder="Digite observações ou cláusulas especiais do contrato..."
                        className="min-h-24"
                        value={additionalInfo}
                        onChange={(event) => setAdditionalInfo(event.target.value)}
                      />
                      <FieldDescription>
                        Inclua quaisquer observações ou cláusulas especiais do contrato.
                      </FieldDescription>
                    </Field>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="second-proposer" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div>
                      <CardTitle className="text-left">Segundo Proponente</CardTitle>
                      <CardDescription className="text-left">
                        Informações caso o contrato precise de outro proponente.
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <Field orientation="horizontal">
                      <FieldLabel
                        htmlFor="second-proposer"
                        className="cursor-pointer items-center gap-2"
                      >
                        <Checkbox
                          id="second-proposer"
                          checked={hasSecondProposer}
                          onCheckedChange={(checked) => {
                            setHasSecondProposer(Boolean(checked));
                            if (!checked) {
                              setSelectedSecondProposerId('');
                            }
                          }}
                        />
                        <span>Contrato necessita de 2º proponente</span>
                      </FieldLabel>
                    </Field>

                    {hasSecondProposer && (
                      <div className="mt-6 space-y-4">
                        <Field>
                          <FieldLabel htmlFor="second-proposer-select">
                            Selecionar Condomínio *
                          </FieldLabel>
                          <Popover
                            open={openSecondProposer}
                            onOpenChange={setOpenSecondProposer}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openSecondProposer}
                                className={cn(
                                  'w-full justify-between',
                                  !selectedSecondProposerId && 'text-muted-foreground',
                                  isSecondProposerInvalid &&
                                    'border-destructive text-destructive'
                                )}
                              >
                                {selectedSecondProposerId
                                  ? secondProposerOptions.find(
                                      (tenant) => tenant.id === selectedSecondProposerId
                                    )?.name || 'Selecionar condômino'
                                  : 'Selecionar condômino'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput placeholder="Procurar condômino..." />
                                <CommandList>
                                  <CommandEmpty>Nenhum condômino encontrado.</CommandEmpty>
                                  <CommandGroup>
                                    {secondProposerOptions.map((tenant) => (
                                      <CommandItem
                                        key={tenant.id}
                                        value={`${tenant.name} ${tenant.cpf}`}
                                        onSelect={() => {
                                          setSelectedSecondProposerId(tenant.id);
                                          setOpenSecondProposer(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            tenant.id === selectedSecondProposerId
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {tenant.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FieldDescription>
                            É preciso que o segundo proponente tenha preenchido o formulário de pré-cadastro devidamente.
                          </FieldDescription>
                        </Field>

                        {selectedSecondProposerId &&
                          !selectedSecondProposer &&
                          isLoadingSecondProposer && (
                            <div className="rounded-lg border p-4">
                              <p className="text-muted-foreground text-sm">
                                Carregando dados completos do segundo proponente...
                              </p>
                            </div>
                          )}

                        {selectedSecondProposer && (
                          <Tabs defaultValue="pessoais" className="mt-6">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
                              <TabsTrigger value="contato">Contato</TabsTrigger>
                              <TabsTrigger value="bancarios">Dados Bancários</TabsTrigger>
                            </TabsList>

                            <TabsContent value="pessoais" className="mt-6">
                              <div className="space-y-4 rounded-lg border p-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1 text-sm">Nome Completo</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.fullName}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Data de Nascimento</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.birthDate}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Estado Civil</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.maritalStatus}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">RG</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.rg}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Órgão Expedidor</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.rgIssuer}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">CPF</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.cpf}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Renda Mensal</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.monthlyIncome}
                                    </p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1 text-sm">Profissão</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.personalData.profession}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="contato" className="mt-6">
                              <div className="space-y-4 rounded-lg border p-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1 text-sm">Email</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.contact.email}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Telefone Principal</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.contact.mainPhone}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Telefone Secundário</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.contact.secondaryPhone}
                                    </p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1 text-sm">Endereço</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.contact.address}
                                    </p>
                                  </div>

                                  {selectedSecondProposer.emergencyContacts.length > 0 && (
                                    <>
                                      <div className="col-span-2 mt-2">
                                        <Separator />
                                      </div>
                                      <div className="col-span-2">
                                        <p className="mb-3 text-sm font-semibold">
                                          Contatos de Emergência
                                        </p>
                                      </div>
                                      {selectedSecondProposer.emergencyContacts.map(
                                        (contact, index) => (
                                          <div key={index} className="col-span-2 grid grid-cols-3 gap-4">
                                            <div>
                                              <p className="text-muted-foreground mb-1 text-sm">Nome</p>
                                              <p className="text-sm font-medium">{contact.name}</p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground mb-1 text-sm">Parentesco</p>
                                              <p className="text-sm font-medium">
                                                {contact.relationship}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground mb-1 text-sm">Telefone</p>
                                              <p className="text-sm font-medium">{contact.phone}</p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="bancarios" className="mt-6">
                              <div className="space-y-4 rounded-lg border p-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1 text-sm">Banco</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.bankData.bank}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Tipo de Conta</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.bankData.accountType}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1 text-sm">Agência</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.bankData.agency}
                                    </p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1 text-sm">Número da Conta</p>
                                    <p className="text-sm font-medium">
                                      {selectedSecondProposer.bankData.accountNumber}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:justify-end">
            <Button variant="outline" className="sm:min-w-32" asChild>
              <Link href={listPath}>Cancelar</Link>
            </Button>
            <Button
              className="sm:min-w-40"
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting ? 'Salvando...' : 'Criar Contrato'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
