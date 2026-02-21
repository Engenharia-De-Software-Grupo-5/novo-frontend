'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/features/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/components/ui/card';
import { Field, FieldDescription, FieldLabel } from '@/features/components/ui/field';
import { Input } from '@/features/components/ui/input';
import { Textarea } from '@/features/components/ui/textarea';

import { postModeloContrato } from '../services/modeloContratoService';
import { RichTextEditor } from './rich-text-editor';

interface AddModeloContratoProps {
  condId: string;
}

const DEFAULT_TEMPLATE = `# CONTRATO DE LOCACAO RESIDENCIAL DE IMOVEL URBANO

Pelo presente instrumento particular de contrato de locacao residencial, as partes abaixo identificadas:

## 1. DAS PARTES

### 1.1 LOCADOR(A)

**Nome:** {{locador.nome}}
**CPF:** {{locador.cpf}}
**Telefone:** {{locador.telefone}}
**E-mail:** {{locador.email}}

Doravante denominado(a) simplesmente **LOCADOR(A)**.

---

### 1.2 LOCATARIO(A)

**Nome:** {{locatario.nome}}
**CPF:** {{locatario.cpf}}
**RG:** {{locatario.rg}} - {{locatario.orgao_expedidor}}
**Estado Civil:** {{locatario.estado_civil}}
**Data de Nascimento:** {{locatario.data_nascimento}}
**Profissao:** {{locatario.profissao}}
**Telefone:** {{locatario.telefone_principal}}
**E-mail:** {{locatario.email}}
**Endereco Atual:** {{locatario.endereco}}

Doravante denominado(a) simplesmente **LOCATARIO(A)**.

---

### 1.3 CONJUGE (SE APLICAVEL)

**Nome:** {{conjuge.nome}}
**CPF:** {{conjuge.cpf}}
**RG:** {{conjuge.rg}}
**Profissao:** {{conjuge.profissao}}
**Renda Mensal:** R$ {{conjuge.renda}}

---

### 1.4 MORADORES ADICIONAIS

{{#each moradores}}
* **Nome:** {{nome}} - **Parentesco:** {{parentesco}} - **Idade:** {{idade}}
{{/each}}

---

## 2. DO IMOVEL

O LOCADOR da em locacao ao LOCATARIO o imovel residencial situado em:

Endereco: {{imovel.endereco}}

---

## 3. DO PRAZO DA LOCACAO

O prazo da presente locacao e de {{contrato.prazo_meses}} meses, com inicio em {{contrato.data_inicio}} e termino em {{contrato.data_fim}}.

---

## 4. DOS VALORES E ENCARGOS

| Descricao  | Valor                              |
| ---------- | ---------------------------------- |
| Aluguel    | R$ {{financeiro.valor_aluguel}}    |
| Condominio | R$ {{financeiro.valor_condominio}} |
| IPTU       | R$ {{financeiro.valor_iptu}}       |
| TCR        | R$ {{financeiro.valor_tcr}}        |

**Valor Total Mensal:** R$ {{financeiro.valor_total}}

---

## 9. DAS INFORMACOES ADICIONAIS

{{contrato.informacoes_adicionais}}

---

Data: ____ / ____ / ______`;

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const textToHtml = (value: string) => escapeHtml(value).replaceAll('\n', '<br/>');

export default function AddModeloContrato({ condId }: AddModeloContratoProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [rawText, setRawText] = useState(textToHtml(DEFAULT_TEMPLATE));
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  const listPath = `/condominios/${condId}/modelos`;

  const hasMissingRequired = !name.trim() || !purpose.trim() || !rawText.trim();
  const isNameInvalid = hasSubmitAttempt && !name.trim();
  const isPurposeInvalid = hasSubmitAttempt && !purpose.trim();
  const isContentInvalid = hasSubmitAttempt && !rawText.trim();

  const previewHtml = useMemo(() => {
    if (!rawText) return '<p class="text-muted-foreground">Sem conteudo para visualizar.</p>';
    return rawText;
  }, [rawText]);

  const handleSubmit = async () => {
    setHasSubmitAttempt(true);

    if (hasMissingRequired) {
      toast.error('Preencha nome, finalidade e conteudo do modelo antes de salvar.');
      return;
    }

    try {
      setIsSubmitting(true);
      await postModeloContrato(condId, {
        name: name.trim(),
        purpose: purpose.trim(),
        rawText,
      });
      toast.success('Modelo de contrato criado com sucesso.');
      router.push(listPath);
      router.refresh();
    } catch (error) {
      console.error('Error creating contract model:', error);
      toast.error('Erro ao criar modelo de contrato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Adicionar Modelo de Contrato</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Crie um modelo editavel com placeholders para uso futuro nos contratos reais.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <Card className="xl:h-[calc(100vh-13rem)]">
            <CardHeader>
              <CardTitle>Pre-visualizacao do Modelo</CardTitle>
              <CardDescription>
                O preview e atualizado em tempo real conforme o conteudo do editor.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-5rem)] flex-col">
              <div className="border-border bg-muted/30 flex-1 overflow-auto rounded-md border p-4">
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
              <Button variant="outline" className="mt-4 w-full" size="sm" type="button">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Recarregar Preview
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Modelo</CardTitle>
              <CardDescription>
                Defina as informacoes basicas e o conteudo editavel do contrato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="model-name">Nome do contrato *</FieldLabel>
                <Input
                  id="model-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={isNameInvalid ? 'border-destructive' : undefined}
                  placeholder="Ex.: Locacao Residencial Padrao"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="model-purpose">Finalidade *</FieldLabel>
                <Textarea
                  id="model-purpose"
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  className={isPurposeInvalid ? 'border-destructive min-h-20' : 'min-h-20'}
                  placeholder="Descreva quando este modelo deve ser utilizado."
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="model-content">Conteudo do contrato *</FieldLabel>
                <RichTextEditor
                  value={rawText}
                  onChange={setRawText}
                  className={isContentInvalid ? 'border-destructive' : undefined}
                />
                <FieldDescription>
                  Campos entre chaves (ex.: {'{{locatario.nome}}'}) serao substituidos no uso real.
                </FieldDescription>
              </Field>
            </CardContent>
          </Card>

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
              <FileText className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar Modelo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
