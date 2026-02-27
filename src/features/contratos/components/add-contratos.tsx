'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Check,
  ChevronsUpDown,
  FilePlus2,
  FileText,
  RefreshCcw,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { PDFViewer } from '@embedpdf/react-pdf-viewer';

import { CONTRACT_STATUSES } from '@/features/contratos/constants';
import { postContrato } from '@/features/contratos/services/contratoService';
import { getCondominoById } from '@/features/condominos/services/condominos.service';
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
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/features/components/ui/field';
import { Input } from '@/features/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import { Separator } from '@/features/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/components/ui/tabs';
import { Textarea } from '@/features/components/ui/textarea';
import { getCondominoById } from '@/features/condominos/services/condominos.service';
import { CONTRACT_STATUSES } from '@/features/contratos/constants';
import { postContrato } from '@/features/contratos/services/contratoService';
import {
  getModeloContratoById,
  getModelosContrato,
} from '@/features/modelos-contrato/services/modeloContratoService';
import {
  Calendar,
  Check,
  ChevronsUpDown,
  FilePlus2,
  FileText,
  RefreshCcw,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

import { CondominoFull, CondominoSummary } from '@/types/condomino';
import { ImovelSummary } from '@/types/imoveis';
import {
  ModeloContratoInput,
  ModeloContratoSummary,
} from '@/types/modelo-contrato';
import { cn } from '@/lib/utils';

interface AddContratoProps {
  readonly condId: string;
  readonly properties: ImovelSummary[];
  readonly tenants: CondominoSummary[];
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

const normalizeGroup = (value?: string | null) => {
  const normalized = (value || '').trim().toLowerCase();

  if (normalized === 'second_proposer' || normalized === 'segundo-proponente') {
    return 'segundo_proponente';
  }

  return normalized || 'geral';
};

const inputKeyMatches = (input: ModeloContratoInput, token: string) => {
  const normalizedToken = token.toLowerCase();
  return (
    input.key.toLowerCase() === normalizedToken ||
    `${normalizeGroup(input.group)}.${input.field}`.toLowerCase() ===
      normalizedToken
  );
};

const getTokenFromInput = (input: ModeloContratoInput) => {
  if (input.key.includes('.')) return input.key;
  const group = normalizeGroup(input.group);
  return `${group}.${input.field || input.key}`;
};

const sanitizeCurrencyInput = (value: string) => {
  const cleaned = value.replace(/[^\d.,]/g, '');
  const [integerPart, ...rest] = cleaned.split(',');
  if (rest.length === 0) return integerPart;
  return `${integerPart},${rest.join('').replace(/,/g, '')}`;
};

const isMonetaryModelInput = (input: ModeloContratoInput) => {
  const token = getTokenFromInput(input).toLowerCase();
  const group = normalizeGroup(input.group);
  return (
    group === 'financeiro' ||
    token.includes('valor') ||
    token.includes('renda') ||
    token.includes('aluguel') ||
    token.includes('condominio') ||
    token.includes('iptu') ||
    token.includes('tcr')
  );
};

export default function AddContratos({ condId, properties, tenants }: AddContratoProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [openProperty, setOpenProperty] = useState(false);
  const [openTenant, setOpenTenant] = useState(false);

  const [creationMode, setCreationMode] = useState<'upload' | 'model' | ''>('');
  const [contractPdf, setContractPdf] = useState<File | null>(null);

  const [models, setModels] = useState<ModeloContratoSummary[]>([]);
  const [openModel, setOpenModel] = useState(false);
  const [modelId, setModelId] = useState('');
  const [modelInputs, setModelInputs] = useState<ModeloContratoInput[]>([]);
  const [modelInputValues, setModelInputValues] = useState<
    Record<string, string>
  >({});
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingModelInputs, setIsLoadingModelInputs] = useState(false);

  const [selectedSecondProposerId, setSelectedSecondProposerId] = useState('');
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

  const [status, setStatus] = useState<string>('agendado');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tenantDetailsById, setTenantDetailsById] = useState<
    Record<string, TenantViewModel>
  >({});
  const [isLoadingTenant, setIsLoadingTenant] = useState(false);
  const [isLoadingSecondProposer, setIsLoadingSecondProposer] = useState(false);
  const [isPreviewRequested, setIsPreviewRequested] = useState(false);

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

  const selectedModel = useMemo(
    () => models.find((item) => item.id === modelId),
    [models, modelId]
  );

  const secondProposerOptions = useMemo(
    () => tenants.filter((item) => item.id !== selectedTenantId),
    [selectedTenantId, tenants]
  );

  const modelInputsByGroup = useMemo(() => {
    return modelInputs.reduce<Record<string, ModeloContratoInput[]>>(
      (acc, input) => {
        const group = normalizeGroup(input.group || input.key.split('.')[0]);
        if (!acc[group]) acc[group] = [];
        acc[group].push(input);
        return acc;
      },
      {}
    );
  }, [modelInputs]);

  const locadorInputs = modelInputsByGroup.locador || [];
  const contractInputs = [
    ...(modelInputsByGroup.contrato || []),
    ...(modelInputsByGroup.financeiro || []),
  ];
  const secondProposerInputs = modelInputsByGroup.segundo_proponente || [];

  const hasLocadorSection =
    creationMode === 'model' && locadorInputs.length > 0;
  const hasSecondProposerSection =
    creationMode === 'model' && secondProposerInputs.length > 0;

  const listPath = `/condominios/${condId}/contratos`;

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
    void loadTenantDetails(selectedTenantId, 'tenant');
  }, [selectedTenantId, loadTenantDetails]);

  useEffect(() => {
    if (!selectedSecondProposerId) return;
    void loadTenantDetails(selectedSecondProposerId, 'secondProposer');
  }, [selectedSecondProposerId, loadTenantDetails]);

  useEffect(() => {
    if (creationMode !== 'model') {
      setModelId('');
      setModelInputs([]);
      setModelInputValues({});
      return;
    }

    const loadModels = async () => {
      setIsLoadingModels(true);
      try {
        const response = await getModelosContrato(condId, {
          page: 1,
          limit: 100,
        });
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Não foi possível carregar os modelos de contrato.');
      } finally {
        setIsLoadingModels(false);
      }
    };

    void loadModels();
  }, [condId, creationMode]);

  useEffect(() => {
    if (!modelId || creationMode !== 'model') {
      setModelInputs([]);
      setModelInputValues({});
      return;
    }

    const loadModelInputs = async () => {
      setIsLoadingModelInputs(true);
      try {
        const model = await getModeloContratoById(condId, modelId);
        setModelInputs(model.inputs);
        setModelInputValues((current) => {
          const next: Record<string, string> = {};
          model.inputs.forEach((input) => {
            next[input.key] = current[input.key] || '';
          });
          return next;
        });
      } catch (error) {
        console.error('Error loading model details:', error);
        toast.error('Não foi possível carregar os campos do modelo.');
      } finally {
        setIsLoadingModelInputs(false);
      }
    };

    void loadModelInputs();
  }, [condId, creationMode, modelId]);

  useEffect(() => {
    if (!hasSecondProposerSection) {
      setSelectedSecondProposerId('');
      return;
    }
  }, [hasSecondProposerSection]);

  useEffect(() => {
    if (!startDate) setStartDate(new Date().toISOString().slice(0, 10));
    if (!endDate) setEndDate(new Date().toISOString().slice(0, 10));
  }, [startDate, endDate]);

  const locadorTokenMap = useMemo<Record<string, string>>(
    () => ({
      'locador.nome': renterName,
      'locador.cpf': renterCpf,
      'locador.telefone': renterPhone,
      'locador.email': renterEmail,
    }),
    [renterName, renterCpf, renterPhone, renterEmail]
  );

  const contratoTokenMap = useMemo<Record<string, string>>(
    () => ({
      'financeiro.valor_aluguel': rentValue,
      'financeiro.valor_condominio': condoFee,
      'financeiro.valor_iptu': iptuValue,
      'financeiro.valor_tcr': tcrValue,
      'contrato.informacoes_adicionais': additionalInfo,
      'contrato.status': status,
      'contrato.data_inicio': startDate,
      'contrato.data_fim': endDate,
    }),
    [
      rentValue,
      condoFee,
      iptuValue,
      tcrValue,
      additionalInfo,
      status,
      startDate,
      endDate,
    ]
  );

  const locatarioTokenMap = useMemo<Record<string, string>>(
    () => ({
      'locatario.nome': selectedTenant?.personalData.fullName ?? '',
      'locatario.data_nascimento': selectedTenant?.personalData.birthDate ?? '',
      'locatario.rg': selectedTenant?.personalData.rg ?? '',
      'locatario.cpf': selectedTenant?.personalData.cpf ?? '',
      'locatario.profissao': selectedTenant?.personalData.profession ?? '',
      'locatario.estado_civil':
        selectedTenant?.personalData.maritalStatus ?? '',
      'locatario.orgao_expedidor': selectedTenant?.personalData.rgIssuer ?? '',
      'locatario.renda_mensal':
        selectedTenant?.personalData.monthlyIncome ?? '',
      'locatario.email': selectedTenant?.contact.email ?? '',
      'locatario.telefone_principal': selectedTenant?.contact.mainPhone ?? '',
      'locatario.telefone_secundario':
        selectedTenant?.contact.secondaryPhone ?? '',
      'locatario.agencia': selectedTenant?.bankData.agency ?? '',
      'locatario.conta': selectedTenant?.bankData.accountNumber ?? '',
      'locatario.tipo': selectedTenant?.bankData.accountType ?? '',
    }),
    [selectedTenant]
  );

  const segundoProponenteTokenMap = useMemo<Record<string, string>>(
    () => ({
      'segundo_proponente.nome':
        selectedSecondProposer?.personalData.fullName ?? '',
      'segundo_proponente.data_nascimento':
        selectedSecondProposer?.personalData.birthDate ?? '',
      'segundo_proponente.rg': selectedSecondProposer?.personalData.rg ?? '',
      'segundo_proponente.cpf': selectedSecondProposer?.personalData.cpf ?? '',
      'segundo_proponente.profissao':
        selectedSecondProposer?.personalData.profession ?? '',
      'segundo_proponente.estado_civil':
        selectedSecondProposer?.personalData.maritalStatus ?? '',
      'segundo_proponente.orgao_expedidor':
        selectedSecondProposer?.personalData.rgIssuer ?? '',
      'segundo_proponente.renda_mensal':
        selectedSecondProposer?.personalData.monthlyIncome ?? '',
      'segundo_proponente.email': selectedSecondProposer?.contact.email ?? '',
      'segundo_proponente.telefone_principal':
        selectedSecondProposer?.contact.mainPhone ?? '',
      'segundo_proponente.telefone_secundario':
        selectedSecondProposer?.contact.secondaryPhone ?? '',
      'segundo_proponente.agencia':
        selectedSecondProposer?.bankData.agency ?? '',
      'segundo_proponente.conta':
        selectedSecondProposer?.bankData.accountNumber ?? '',
      'segundo_proponente.tipo':
        selectedSecondProposer?.bankData.accountType ?? '',
    }),
    [selectedSecondProposer]
  );

  const getModelValueForInput = useCallback(
    (input: ModeloContratoInput) => {
      const token = getTokenFromInput(input).toLowerCase();

      const fromLocador = locadorTokenMap[token];
      if (fromLocador !== undefined) return fromLocador;

      const fromContrato = contratoTokenMap[token];
      if (fromContrato !== undefined) return fromContrato;

      if (token === 'imovel.endereco' && selectedProperty) {
        return `${selectedProperty.endereco} - ${selectedProperty.bairro}, ${selectedProperty.cidade}`;
      }

      const fromLocatario = locatarioTokenMap[token];
      if (fromLocatario !== undefined) return fromLocatario;

      const fromSegundoProponente = segundoProponenteTokenMap[token];
      if (fromSegundoProponente !== undefined) return fromSegundoProponente;

      return modelInputValues[input.key] ?? '';
    },
    [
      locadorTokenMap,
      contratoTokenMap,
      selectedProperty,
      locatarioTokenMap,
      segundoProponenteTokenMap,
      modelInputValues,
    ]
  );

  const missingModelInputs = useMemo(() => {
    if (creationMode !== 'model') return [];
    return modelInputs.filter((input) => !getModelValueForInput(input).trim());
  }, [creationMode, getModelValueForInput, modelInputs]);

  const missingModelInputKeys = useMemo(
    () => new Set(missingModelInputs.map((input) => input.key)),
    [missingModelInputs]
  );

  const isMissingModelToken = useCallback(
    (token: string) => missingModelInputs.some((input) => inputKeyMatches(input, token)),
    [missingModelInputs]
  );

  const knownLocadorTokens = new Set([
    'locador.nome',
    'locador.cpf',
    'locador.telefone',
    'locador.email',
  ]);

  const knownContractTokens = new Set([
    'financeiro.valor_aluguel',
    'financeiro.valor_condominio',
    'financeiro.valor_iptu',
    'financeiro.valor_tcr',
    'contrato.informacoes_adicionais',
    'contrato.status',
    'contrato.data_inicio',
    'contrato.data_fim',
  ]);

  const knownSecondProposerTokens = new Set([
    'segundo_proponente.nome',
    'segundo_proponente.data_nascimento',
    'segundo_proponente.rg',
    'segundo_proponente.cpf',
    'segundo_proponente.profissao',
    'segundo_proponente.estado_civil',
    'segundo_proponente.orgao_expedidor',
    'segundo_proponente.renda_mensal',
    'segundo_proponente.email',
    'segundo_proponente.telefone_principal',
    'segundo_proponente.telefone_secundario',
    'segundo_proponente.agencia',
    'segundo_proponente.conta',
    'segundo_proponente.tipo',
  ]);

  const customLocadorInputs = locadorInputs.filter(
    (input) => !knownLocadorTokens.has(getTokenFromInput(input).toLowerCase())
  );

  const customContractInputs = contractInputs.filter(
    (input) => !knownContractTokens.has(getTokenFromInput(input).toLowerCase())
  );

  const customSecondProposerInputs = secondProposerInputs.filter(
    (input) =>
      !knownSecondProposerTokens.has(getTokenFromInput(input).toLowerCase())
  );

  const showRentField = contractInputs.some((input) =>
    inputKeyMatches(input, 'financeiro.valor_aluguel')
  );
  const showCondoField = contractInputs.some((input) =>
    inputKeyMatches(input, 'financeiro.valor_condominio')
  );
  const showIptuField = contractInputs.some((input) =>
    inputKeyMatches(input, 'financeiro.valor_iptu')
  );
  const showTcrField = contractInputs.some((input) =>
    inputKeyMatches(input, 'financeiro.valor_tcr')
  );
  const showAdditionalInfoField = contractInputs.some((input) =>
    inputKeyMatches(input, 'contrato.informacoes_adicionais')
  );
  const showStatusField = contractInputs.some((input) =>
    inputKeyMatches(input, 'contrato.status')
  );

  const isPropertyInvalid = hasSubmitAttempt && !selectedPropertyId;
  const isTenantInvalid = hasSubmitAttempt && !selectedTenantId;
  const isRenterNameInvalid =
    hasSubmitAttempt &&
    hasLocadorSection &&
    locadorInputs.some((i) => inputKeyMatches(i, 'locador.nome')) &&
    !renterName.trim();
  const isRenterCpfInvalid =
    hasSubmitAttempt &&
    hasLocadorSection &&
    locadorInputs.some((i) => inputKeyMatches(i, 'locador.cpf')) &&
    !renterCpf.trim();
  const isRenterPhoneInvalid =
    hasSubmitAttempt &&
    hasLocadorSection &&
    locadorInputs.some((i) => inputKeyMatches(i, 'locador.telefone')) &&
    !renterPhone.trim();
  const isRenterEmailInvalid =
    hasSubmitAttempt && hasLocadorSection && locadorInputs.some((i) => inputKeyMatches(i, 'locador.email')) && !renterEmail.trim();
  const isRentValueInvalid = hasSubmitAttempt && showRentField && !rentValue.trim();
  const isCondoFeeInvalid =
    hasSubmitAttempt && showCondoField && isMissingModelToken('financeiro.valor_condominio');
  const isIptuValueInvalid =
    hasSubmitAttempt && showIptuField && isMissingModelToken('financeiro.valor_iptu');
  const isTcrValueInvalid =
    hasSubmitAttempt && showTcrField && isMissingModelToken('financeiro.valor_tcr');
  const isStartDateInvalid = hasSubmitAttempt && !startDate;
  const isEndDateInvalid = hasSubmitAttempt && !endDate;
  const isStatusInvalid = hasSubmitAttempt && showStatusField && !status;
  const isAdditionalInfoInvalid =
    hasSubmitAttempt &&
    showAdditionalInfoField &&
    isMissingModelToken('contrato.informacoes_adicionais');
  const isSecondProposerInvalid =
    hasSubmitAttempt && hasSecondProposerSection && !selectedSecondProposerId;
  const isUploadInvalid =
    hasSubmitAttempt && creationMode === 'upload' && !contractPdf;
  const isModeInvalid = hasSubmitAttempt && !creationMode;
  const isModelInvalid =
    hasSubmitAttempt && creationMode === 'model' && !modelId;

  const hasLocadorFieldsMissing =
    hasLocadorSection &&
    ((locadorInputs.some((i) => inputKeyMatches(i, 'locador.nome')) &&
      !renterName.trim()) ||
      (locadorInputs.some((i) => inputKeyMatches(i, 'locador.cpf')) &&
        !renterCpf.trim()) ||
      (locadorInputs.some((i) => inputKeyMatches(i, 'locador.telefone')) &&
        !renterPhone.trim()) ||
      (locadorInputs.some((i) => inputKeyMatches(i, 'locador.email')) &&
        !renterEmail.trim()));

  const hasModelFieldsMissing =
    creationMode === 'model' &&
    (!modelId ||
      hasLocadorFieldsMissing ||
      (showRentField && !rentValue.trim()) ||
      (hasSecondProposerSection && !selectedSecondProposerId) ||
      missingModelInputs.length > 0);

  const hasRequiredFieldsMissing =
    !selectedPropertyId ||
    !selectedTenantId ||
    !startDate ||
    !endDate ||
    !creationMode ||
    (creationMode === 'upload' && !contractPdf) ||
    hasModelFieldsMissing;

  const canShowPreview = !hasRequiredFieldsMissing;
  const shouldShowPreview = isPreviewRequested && canShowPreview;

  useEffect(() => {
    setIsPreviewRequested(false);
  }, [
    selectedPropertyId,
    selectedTenantId,
    startDate,
    endDate,
    creationMode,
    contractPdf,
    modelId,
    renterName,
    renterCpf,
    renterPhone,
    renterEmail,
    rentValue,
    condoFee,
    iptuValue,
    tcrValue,
    additionalInfo,
    status,
    selectedSecondProposerId,
    missingModelInputs.length,
  ]);

  const validateDates = () => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  };

  const postUploadContract = async () => {
    if (!contractPdf || !selectedProperty || !selectedTenant) return;
    const formData = new FormData();
    formData.append('sourceType', 'upload');
    formData.append('propertyId', selectedProperty.idImovel);
    formData.append('property', formatPropertyLabel(selectedProperty));
    formData.append('tenantId', selectedTenant.id);
    formData.append('tenantName', selectedTenant.name);
    formData.append('createdAt', startDate);
    formData.append('dueDate', endDate);
    formData.append('contractPdf', contractPdf);
    await postContrato(condId, formData);
  };

  const postModelContract = async () => {
    if (!selectedProperty || !selectedTenant) return;
    const normalizedModelValues = Object.fromEntries(
      modelInputs.map((input) => [input.key, getModelValueForInput(input)])
    );
    await postContrato(condId, {
      sourceType: 'model',
      tenantName: selectedTenant.name,
      tenantId: selectedTenant.id,
      property: formatPropertyLabel(selectedProperty),
      propertyId: selectedProperty.idImovel,
      createdAt: startDate,
      dueDate: endDate,
      modelId,
      modelName: selectedModel?.name,
      modelInputValues: normalizedModelValues,
    });
  };

  const handleSubmit = async () => {
    setHasSubmitAttempt(true);

    if (hasRequiredFieldsMissing) {
      toast.error(
        'Preencha todos os campos obrigatórios (*) antes de adicionar o contrato.'
      );
      return;
    }

    if (!selectedTenant || !selectedProperty) {
      toast.error('Selecione um locatário e um imóvel para criar o contrato.');
      return;
    }

    if (!validateDates()) {
      toast.error(
        'A data de vencimento deve ser maior ou igual à data de início.'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      if (creationMode === 'upload' && contractPdf) {
        const formData = new FormData();
        formData.append('tenantId', selectedTenant.id);
        formData.append('propertyId', selectedProperty.idImovel);
        formData.append('content', `Arquivo enviado: ${contractPdf.name}`);
        formData.append('startDate', startDate);
        formData.append('dueDate', endDate);
        formData.append('sourceType', 'upload');
        formData.append('contractPdf', contractPdf);

        await postContrato(condId, formData);
      } else {
        const normalizedModelValues = Object.fromEntries(
          modelInputs.map((input) => [input.key, getModelValueForInput(input)])
        );

        await postContrato(condId, {
          tenantId: selectedTenant.id,
          propertyId: selectedProperty.idImovel,
          content: JSON.stringify(normalizedModelValues),
          startDate: startDate,
          dueDate: endDate,
          sourceType: 'model',
          modelId,
          modelName: selectedModel?.name,
          modelInputValues: normalizedModelValues,
        });
      }

      toast.success('Contrato criado com sucesso.');
      router.push(listPath);
      router.refresh();
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
        <h1 className="text-xl font-semibold sm:text-2xl">
          Adicionar Contrato
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Selecione um condômino e um imóvel já cadastrados para iniciar o novo
          contrato.
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
              {shouldShowPreview ? (
                <>
                  <div className="flex-1 min-h-0">
                    <PDFViewer
                      config={{
                        src: 'https://snippet.embedpdf.com/ebook.pdf',
                        disabledCategories: [
                          'annotation',
                          'shapes',
                          'redaction',
                          'document',
                          'panel',
                          'selection',
                          'history',
                        ],
                        theme: {
                          preference: 'light',
                          light: {
                            background: {
                              app: '#f8fafc',
                              surface: '#f8fafc',
                              surfaceAlt: '#eoeoeo',
                            },
                          },
                        },
                      }}
                      style={{ height: '100%', width: '100%' }}
                      onReady={(registry) => {
                        console.log('PDF viewer ready!', registry);
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-muted/30 border-border text-muted-foreground flex flex-1 flex-col items-center justify-center rounded-md border p-6 text-center">
                  <FileText className="mb-3 h-9 w-9" />
                  <p className="font-medium">Preview em preparação</p>
                  <p className="mt-1 text-sm">
                    O PDF será disponibilizado aqui conforme os dados forem preenchidos.
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="mt-4 w-full"
                size="sm"
                type="button"
                onClick={() => setIsPreviewRequested(true)}
                disabled={!canShowPreview}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Recarregar
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Accordion
            type="multiple"
            defaultValue={['property', 'tenant', 'contract']}
            className="space-y-6"
          >
            <AccordionItem value="property" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div>
                      <CardTitle className="text-left">
                        Dados do Imóvel
                      </CardTitle>
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
                      <Popover
                        open={openProperty}
                        onOpenChange={setOpenProperty}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProperty}
                            className={cn(
                              'w-full justify-between',
                              !selectedPropertyId && 'text-muted-foreground',
                              isPropertyInvalid &&
                                'border-destructive text-destructive'
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
                              <CommandEmpty>
                                Nenhum imóvel encontrado.
                              </CommandEmpty>
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
                                <p className="text-muted-foreground text-sm">
                                  Identificação
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedProperty.idImovel}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">
                                  Nome
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedProperty.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">
                                  Tipo
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedProperty.tipo}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">
                                  Situação
                                </p>
                                <p className="text-sm font-medium capitalize">
                                  {selectedProperty.situacao}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="endereco" className="mt-4">
                          <div className="space-y-4 rounded-lg border p-4">
                            <p className="text-sm font-medium">
                              {selectedProperty.endereco}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {selectedProperty.bairro},{' '}
                              {selectedProperty.cidade}
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
                      <CardTitle className="text-left">
                        Dados do Locatário
                      </CardTitle>
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
                              isTenantInvalid &&
                                'border-destructive text-destructive'
                            )}
                          >
                            {selectedTenantId
                              ? tenants.find(
                                  (tenant) => tenant.id === selectedTenantId
                                )?.name || 'Selecionar condômino'
                              : 'Selecionar condômino'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder="Procurar condômino..." />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum condômino encontrado.
                              </CommandEmpty>
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
                        É preciso que o locatário tenha preenchido o formulário
                        de pré-cadastro devidamente.
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
                          <TabsTrigger value="pessoais">
                            Dados Pessoais
                          </TabsTrigger>
                          <TabsTrigger value="contato">Contato</TabsTrigger>
                          <TabsTrigger value="bancarios">
                            Dados Bancários
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pessoais" className="mt-6">
                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Nome Completo
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.fullName}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Data de Nascimento
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.birthDate}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Estado Civil
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.maritalStatus}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  RG
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.rg}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Órgão Expedidor
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.rgIssuer}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  CPF
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.cpf}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Renda Mensal
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.monthlyIncome}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Profissão
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.personalData.profession}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="contato" className="mt-6">
                          <div className="space-y-4 rounded-lg border p-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Email
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.contact.email}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Telefone Principal
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.contact.mainPhone}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Telefone Secundário
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.contact.secondaryPhone}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Endereço
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.contact.address}
                                </p>
                              </div>

                              {selectedTenant.emergencyContacts.length > 0 && (
                                <>
                                  <div className="col-span-2 mt-2">
                                    <Separator />
                                  </div>
                                  <div className="col-span-2">
                                    <p className="mb-3 text-sm font-semibold">
                                      Contatos de Emergência
                                    </p>
                                  </div>
                                  {selectedTenant.emergencyContacts.map(
                                    (contact, index) => (
                                      <div
                                        key={index}
                                        className="col-span-2 grid grid-cols-3 gap-4"
                                      >
                                        <div>
                                          <p className="text-muted-foreground mb-1 text-sm">
                                            Nome
                                          </p>
                                          <p className="text-sm font-medium">
                                            {contact.name}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground mb-1 text-sm">
                                            Parentesco
                                          </p>
                                          <p className="text-sm font-medium">
                                            {contact.relationship}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground mb-1 text-sm">
                                            Telefone
                                          </p>
                                          <p className="text-sm font-medium">
                                            {contact.phone}
                                          </p>
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
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Banco
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.bankData.bank}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Tipo de Conta
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.bankData.accountType}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Agência
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.bankData.agency}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground mb-1 text-sm">
                                  Número da Conta
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedTenant.bankData.accountNumber}
                                </p>
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

            <AccordionItem value="contract" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div>
                      <CardTitle className="text-left">
                        Dados Contratuais
                      </CardTitle>
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
                        <FieldLabel htmlFor="start-date">
                          Data Início *
                        </FieldLabel>
                        <div className="relative">
                          <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 h-4 w-4" />
                          <Input
                            id="start-date"
                            type="date"
                            className={cn(
                              'pl-9',
                              isStartDateInvalid && 'border-destructive'
                            )}
                            value={startDate}
                            onChange={(event) =>
                              setStartDate(event.target.value)
                            }
                          />
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="end-date">
                          Data Vencimento *
                        </FieldLabel>
                        <div className="relative">
                          <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 h-4 w-4" />
                          <Input
                            id="end-date"
                            type="date"
                            className={cn(
                              'pl-9',
                              isEndDateInvalid && 'border-destructive'
                            )}
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                          />
                        </div>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="creation-mode">
                        Modo de criação *
                      </FieldLabel>
                      <Select
                        value={creationMode}
                        onValueChange={(value) => {
                          const mode = value as 'upload' | 'model';
                          setCreationMode(mode);
                          setContractPdf(null);
                          setModelId('');
                          setModelInputs([]);
                          setModelInputValues({});
                          setHasSubmitAttempt(false);
                        }}
                      >
                        <SelectTrigger
                          id="creation-mode"
                          className={cn(isModeInvalid && 'border-destructive')}
                        >
                          <SelectValue placeholder="Selecionar modo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upload">
                            <span className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Upload de PDF
                            </span>
                          </SelectItem>
                          <SelectItem value="model">
                            <span className="flex items-center gap-2">
                              <FilePlus2 className="h-4 w-4" />
                              Criar por modelo
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    {creationMode === 'model' && (
                      <Field>
                        <FieldLabel htmlFor="model-select">Modelo *</FieldLabel>
                        <Popover open={openModel} onOpenChange={setOpenModel}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openModel}
                              className={cn(
                                'w-full justify-between',
                                !modelId && 'text-muted-foreground',
                                isModelInvalid &&
                                  'border-destructive text-destructive'
                              )}
                              disabled={isLoadingModels}
                            >
                              {selectedModel?.name || 'Selecionar modelo'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput placeholder="Procurar modelo..." />
                              <CommandList>
                                <CommandEmpty>
                                  Nenhum modelo encontrado.
                                </CommandEmpty>
                                <CommandGroup>
                                  {models.map((model) => (
                                    <CommandItem
                                      key={model.id}
                                      value={`${model.name} ${model.purpose}`}
                                      onSelect={() => {
                                        setModelId(model.id);
                                        setOpenModel(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          model.id === modelId
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {model.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </Field>
                    )}

                    {creationMode === 'upload' && (
                      <Field>
                        <FieldLabel htmlFor="contractPdf">
                          Arquivo PDF *
                        </FieldLabel>
                        <Input
                          id="contractPdf"
                          type="file"
                          accept="application/pdf"
                          onChange={(event) =>
                            setContractPdf(event.target.files?.[0] || null)
                          }
                          className={cn(
                            isUploadInvalid && 'border-destructive'
                          )}
                        />
                        <FieldDescription>
                          Somente arquivos PDF são aceitos.
                        </FieldDescription>
                      </Field>
                    )}

                    {creationMode === 'model' && isLoadingModelInputs && (
                      <p className="text-muted-foreground text-sm">
                        Carregando campos do modelo...
                      </p>
                    )}

                    {creationMode === 'model' && !isLoadingModelInputs && (
                      <>
                        {(showRentField ||
                          showCondoField ||
                          showIptuField ||
                          showTcrField) && (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {showRentField && (
                              <Field>
                                <FieldLabel htmlFor="rent-value">
                                  Valor do Aluguel *
                                </FieldLabel>
                                <Input
                                  id="rent-value"
                                  placeholder="R$ 0,00"
                                  value={rentValue}
                                  onChange={(event) =>
                                    setRentValue(sanitizeCurrencyInput(event.target.value))
                                  }
                                  className={cn(isRentValueInvalid && 'border-destructive')}
                                  inputMode="decimal"
                                />
                              </Field>
                            )}

                            {showCondoField && (
                              <Field>
                                <FieldLabel htmlFor="condo-fee">Taxa de Condomínio *</FieldLabel>
                                <Input
                                  id="condo-fee"
                                  placeholder="R$ 0,00"
                                  value={condoFee}
                                  onChange={(event) =>
                                    setCondoFee(sanitizeCurrencyInput(event.target.value))
                                  }
                                  className={cn(isCondoFeeInvalid && 'border-destructive')}
                                  inputMode="decimal"
                                />
                              </Field>
                            )}

                            {showIptuField && (
                              <Field>
                                <FieldLabel htmlFor="iptu-value">Valor IPTU *</FieldLabel>
                                <Input
                                  id="iptu-value"
                                  placeholder="R$ 0,00"
                                  value={iptuValue}
                                  onChange={(event) =>
                                    setIptuValue(sanitizeCurrencyInput(event.target.value))
                                  }
                                  className={cn(isIptuValueInvalid && 'border-destructive')}
                                  inputMode="decimal"
                                />
                              </Field>
                            )}

                            {showTcrField && (
                              <Field>
                                <FieldLabel htmlFor="tcr-value">Valor TCR *</FieldLabel>
                                <Input
                                  id="tcr-value"
                                  placeholder="R$ 0,00"
                                  value={tcrValue}
                                  onChange={(event) =>
                                    setTcrValue(sanitizeCurrencyInput(event.target.value))
                                  }
                                  className={cn(isTcrValueInvalid && 'border-destructive')}
                                  inputMode="decimal"
                                />
                              </Field>
                            )}
                          </div>
                        )}

                        {showStatusField && (
                          <Field>
                            <FieldLabel htmlFor="contract-status">
                              Status *
                            </FieldLabel>
                            <Select
                              value={status}
                              onValueChange={(value) => setStatus(value)}
                            >
                              <SelectTrigger
                                id="contract-status"
                                className={cn(
                                  isStatusInvalid && 'border-destructive'
                                )}
                              >
                                <SelectValue placeholder="Selecionar status" />
                              </SelectTrigger>
                              <SelectContent>
                                {CONTRACT_STATUSES.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}

                        {showAdditionalInfoField && (
                          <Field>
                            <FieldLabel htmlFor="additional-info">
                              Informações Adicionais *
                            </FieldLabel>
                            <Textarea
                              id="additional-info"
                              placeholder="Digite observações ou cláusulas especiais do contrato..."
                              className={cn(
                                'min-h-24',
                                isAdditionalInfoInvalid && 'border-destructive'
                              )}
                              value={additionalInfo}
                              onChange={(event) =>
                                setAdditionalInfo(event.target.value)
                              }
                            />
                            <FieldDescription>
                              Inclua quaisquer observações ou cláusulas
                              especiais do contrato.
                            </FieldDescription>
                          </Field>
                        )}

                        {customContractInputs.map((input) => (
                          <Field key={input.key}>
                            <FieldLabel htmlFor={`model-${input.key}`}>
                              {input.label} *
                            </FieldLabel>
                            <Input
                              id={`model-${input.key}`}
                              value={modelInputValues[input.key] || ''}
                              onChange={(event) =>
                                setModelInputValues((current) => ({
                                  ...current,
                                  [input.key]: isMonetaryModelInput(input)
                                    ? sanitizeCurrencyInput(event.target.value)
                                    : event.target.value,
                                }))
                              }
                              className={cn(
                                hasSubmitAttempt &&
                                  missingModelInputKeys.has(input.key) &&
                                  'border-destructive'
                              )}
                              inputMode={isMonetaryModelInput(input) ? 'decimal' : undefined}
                            />
                            <FieldDescription>
                              Placeholder: {'{{'}
                              {getTokenFromInput(input)}
                              {'}}'}
                            </FieldDescription>
                          </Field>
                        ))}
                      </>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {hasLocadorSection && (
              <AccordionItem value="renter" className="border-none">
                <Card>
                  <CardHeader className="pb-3">
                    <AccordionTrigger className="py-0 hover:no-underline">
                      <div>
                        <CardTitle className="text-left">
                          Dados do Locador
                        </CardTitle>
                        <CardDescription className="text-left">
                          Informações do locador conforme exigência do modelo.
                        </CardDescription>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="space-y-4">
                      {locadorInputs.some((i) =>
                        inputKeyMatches(i, 'locador.nome')
                      ) && (
                        <Field>
                          <FieldLabel htmlFor="renter-name">
                            Nome Completo *
                          </FieldLabel>
                          <Input
                            id="renter-name"
                            placeholder="Ex.: João da Silva"
                            value={renterName}
                            onChange={(event) =>
                              setRenterName(event.target.value)
                            }
                            className={cn(
                              isRenterNameInvalid && 'border-destructive'
                            )}
                          />
                        </Field>
                      )}

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {locadorInputs.some((i) =>
                          inputKeyMatches(i, 'locador.cpf')
                        ) && (
                          <Field>
                            <FieldLabel htmlFor="renter-cpf">CPF *</FieldLabel>
                            <Input
                              id="renter-cpf"
                              placeholder="000.000.000-00"
                              value={renterCpf}
                              onChange={(event) =>
                                setRenterCpf(event.target.value)
                              }
                              className={cn(
                                isRenterCpfInvalid && 'border-destructive'
                              )}
                            />
                          </Field>
                        )}

                        {locadorInputs.some((i) =>
                          inputKeyMatches(i, 'locador.telefone')
                        ) && (
                          <Field>
                            <FieldLabel htmlFor="renter-phone">
                              Telefone Principal *
                            </FieldLabel>
                            <Input
                              id="renter-phone"
                              placeholder="(00) 90000-0000"
                              value={renterPhone}
                              onChange={(event) =>
                                setRenterPhone(event.target.value)
                              }
                              className={cn(
                                isRenterPhoneInvalid && 'border-destructive'
                              )}
                            />
                          </Field>
                        )}
                      </div>

                      {locadorInputs.some((i) =>
                        inputKeyMatches(i, 'locador.email')
                      ) && (
                        <Field>
                          <FieldLabel htmlFor="renter-email">
                            Email *
                          </FieldLabel>
                          <Input
                            id="renter-email"
                            type="email"
                            placeholder="nome@email.com"
                            value={renterEmail}
                            onChange={(event) =>
                              setRenterEmail(event.target.value)
                            }
                            className={cn(
                              isRenterEmailInvalid && 'border-destructive'
                            )}
                          />
                        </Field>
                      )}

                      {customLocadorInputs.map((input) => (
                        <Field key={input.key}>
                          <FieldLabel htmlFor={`model-${input.key}`}>
                            {input.label} *
                          </FieldLabel>
                          <Input
                            id={`model-${input.key}`}
                            value={modelInputValues[input.key] || ''}
                            onChange={(event) =>
                              setModelInputValues((current) => ({
                                ...current,
                                [input.key]: isMonetaryModelInput(input)
                                  ? sanitizeCurrencyInput(event.target.value)
                                  : event.target.value,
                              }))
                            }
                            className={cn(
                              hasSubmitAttempt &&
                                missingModelInputKeys.has(input.key) &&
                                'border-destructive'
                            )}
                            inputMode={isMonetaryModelInput(input) ? 'decimal' : undefined}
                          />
                          <FieldDescription>
                            Placeholder: {'{{'}
                            {getTokenFromInput(input)}
                            {'}}'}
                          </FieldDescription>
                        </Field>
                      ))}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            )}

            {hasSecondProposerSection && (
              <AccordionItem value="second-proposer" className="border-none">
                <Card>
                  <CardHeader className="pb-3">
                    <AccordionTrigger className="py-0 hover:no-underline">
                      <div>
                        <CardTitle className="text-left">
                          Segundo Proponente
                        </CardTitle>
                        <CardDescription className="text-left">
                          Informações caso o modelo exija outro proponente.
                        </CardDescription>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent>
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
                                !selectedSecondProposerId &&
                                  'text-muted-foreground',
                                isSecondProposerInvalid &&
                                  'border-destructive text-destructive'
                              )}
                            >
                              {selectedSecondProposerId
                                ? secondProposerOptions.find(
                                    (tenant) =>
                                      tenant.id === selectedSecondProposerId
                                  )?.name || 'Selecionar condômino'
                                : 'Selecionar condômino'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput placeholder="Procurar condômino..." />
                              <CommandList>
                                <CommandEmpty>
                                  Nenhum condômino encontrado.
                                </CommandEmpty>
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
                          É preciso que o segundo proponente tenha preenchido o
                          formulário de pré-cadastro devidamente.
                        </FieldDescription>
                      </Field>

                      {selectedSecondProposerId &&
                        !selectedSecondProposer &&
                        isLoadingSecondProposer && (
                          <div className="mt-6 rounded-lg border p-4">
                            <p className="text-muted-foreground text-sm">
                              Carregando dados completos do segundo
                              proponente...
                            </p>
                          </div>
                        )}

                      {selectedSecondProposer && (
                        <Tabs defaultValue="pessoais" className="mt-6">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="pessoais">
                              Dados Pessoais
                            </TabsTrigger>
                            <TabsTrigger value="contato">Contato</TabsTrigger>
                            <TabsTrigger value="bancarios">
                              Dados Bancários
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="pessoais" className="mt-6">
                            <div className="space-y-4 rounded-lg border p-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Nome Completo
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.personalData
                                        .fullName
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Data de Nascimento
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.personalData
                                        .birthDate
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Estado Civil
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.personalData
                                        .maritalStatus
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    RG
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSecondProposer.personalData.rg}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Órgão Expedidor
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.personalData
                                        .rgIssuer
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    CPF
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSecondProposer.personalData.cpf}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Renda Mensal
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.personalData
                                        .monthlyIncome
                                    }
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Profissão
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.personalData
                                        .profession
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="contato" className="mt-6">
                            <div className="space-y-4 rounded-lg border p-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Email
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSecondProposer.contact.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Telefone Principal
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSecondProposer.contact.mainPhone}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Telefone Secundário
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.contact
                                        .secondaryPhone
                                    }
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Endereço
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSecondProposer.contact.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="bancarios" className="mt-6">
                            <div className="space-y-4 rounded-lg border p-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Banco
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSecondProposer.bankData.bank}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Tipo de Conta
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.bankData
                                        .accountType
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Agência
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSecondProposer.bankData.agency}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-muted-foreground mb-1 text-sm">
                                    Número da Conta
                                  </p>
                                  <p className="text-sm font-medium">
                                    {
                                      selectedSecondProposer.bankData
                                        .accountNumber
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}

                      {customSecondProposerInputs.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {customSecondProposerInputs.map((input) => (
                            <Field key={input.key}>
                              <FieldLabel htmlFor={`model-${input.key}`}>
                                {input.label} *
                              </FieldLabel>
                              <Input
                                id={`model-${input.key}`}
                                value={modelInputValues[input.key] || ''}
                                onChange={(event) =>
                                  setModelInputValues((current) => ({
                                    ...current,
                                    [input.key]: isMonetaryModelInput(input)
                                      ? sanitizeCurrencyInput(event.target.value)
                                      : event.target.value,
                                  }))
                                }
                                className={cn(
                                  hasSubmitAttempt &&
                                    missingModelInputKeys.has(input.key) &&
                                    'border-destructive'
                                )}
                                inputMode={isMonetaryModelInput(input) ? 'decimal' : undefined}
                              />
                              <FieldDescription>
                                Placeholder: {'{{'}
                                {getTokenFromInput(input)}
                                {'}}'}
                              </FieldDescription>
                            </Field>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            )}
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
