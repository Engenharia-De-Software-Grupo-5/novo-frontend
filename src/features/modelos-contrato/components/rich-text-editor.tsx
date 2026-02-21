'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Table2,
  Underline,
} from 'lucide-react';

import { Button } from '@/features/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/features/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/components/ui/popover';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

type PlaceholderGroup = {
  key: string;
  label: string;
  fields: Array<{ key: string; label: string }>;
};

const PLACEHOLDER_GROUPS: PlaceholderGroup[] = [
  {
    key: 'imovel',
    label: 'Imóvel',
    fields: [
      { key: 'endereco', label: 'Endereço' }
    ],
  },
  {
    key: 'locador',
    label: 'Locador',
    fields: [
      { key: 'nome', label: 'Nome' },
      { key: 'cpf', label: 'CPF' },
      { key: 'telefone', label: 'Telefone' },
      { key: 'email', label: 'E-mail' },
    ],
  },
  {
    key: 'locatario',
    label: 'Locatário',
    fields: [
      { key: 'nome', label: 'Nome Completo' },
      { key: 'data_nascimento', label: 'Data de nascimento' },
      { key: 'rg', label: 'RG' },
      { key: 'cpf', label: 'CPF' },
      { key: 'profissao', label: 'Profissão' },
      { key: 'estado_civil', label: 'Estado civil' },
      { key: 'orgao_expedidor', label: 'Orgao expedidor' },
      { key: 'renda_mensal', label: 'Renda mensal'},
      { key: 'email', label: 'E-mail' },
      { key: 'telefone_principal', label: 'Telefone principal' },
      { key: 'telefone_secundario', label: 'Telefone secundário' },
      { key: 'nome', label: 'Nome do banco' },
      { key: 'agencia', label: 'Agência' },
      { key: 'conta', label: 'Conta' },
      { key: 'tipo', label: 'Tipo de conta' },
    ],
  },
  {
    key: 'segundo_proponente',
    label: 'Segundo proponente',
    fields: [
      { key: 'nome', label: 'Nome Completo' },
      { key: 'data_nascimento', label: 'Data de nascimento' },
      { key: 'rg', label: 'RG' },
      { key: 'cpf', label: 'CPF' },
      { key: 'profissao', label: 'Profissao' },
      { key: 'estado_civil', label: 'Estado civil' },
      { key: 'orgao_expedidor', label: 'Orgao expedidor' },
      { key: 'renda_mensal', label: 'Renda Mensal'},
      { key: 'email', label: 'E-mail' },
      { key: 'telefone_principal', label: 'Telefone principal' },
      { key: 'telefone_secundario', label: 'Telefone secundário' },
      { key: 'nome', label: 'Nome do banco' },
      { key: 'agencia', label: 'Agência' },
      { key: 'conta', label: 'Conta' },
      { key: 'tipo', label: 'Tipo de conta' },
    ],
  },
  {
    key: 'imovel',
    label: 'Imovel',
    fields: [{ key: 'endereco', label: 'Endereço' }],
  },
  {
    key: 'contrato',
    label: 'Contrato',
    fields: [
      { key: 'data_inicio', label: 'Data de início' },
      { key: 'data_fim', label: 'Data de fim' },
      { key: 'informacoes_adicionais', label: 'Informações adicionais' }
    ],
  },
  {
    key: 'financeiro',
    label: 'Financeiro',
    fields: [
      { key: 'valor_aluguel', label: 'Valor aluguel' },
      { key: 'valor_condominio', label: 'Valor condomínio' },
      { key: 'valor_iptu', label: 'Valor IPTU' },
      { key: 'valor_tcr', label: 'Valor TCR' }
    ],
  }
];

const TABLE_GRID_ROWS = 10;
const TABLE_GRID_COLS = 8;

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const slashRangeRef = useRef<Range | null>(null);

  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [slashPosition, setSlashPosition] = useState({ x: 12, y: 12 });

  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const [hoveredRows, setHoveredRows] = useState(0);
  const [hoveredCols, setHoveredCols] = useState(0);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML === value) return;
    editorRef.current.innerHTML = value;
  }, [value]);

  const selectedGroup = useMemo(
    () => PLACEHOLDER_GROUPS.find((item) => item.key === selectedGroupKey) || null,
    [selectedGroupKey]
  );

  const visibleGroups = useMemo(() => {
    const term = slashQuery.trim().toLowerCase();
    if (!term) return PLACEHOLDER_GROUPS;

    return PLACEHOLDER_GROUPS.filter((item) => {
      return (
        item.label.toLowerCase().includes(term) ||
        item.key.toLowerCase().includes(term)
      );
    });
  }, [slashQuery]);

  const visibleFields = useMemo(() => {
    if (!selectedGroup) return [];
    const term = slashQuery.trim().toLowerCase();
    if (!term) return selectedGroup.fields;

    return selectedGroup.fields.filter((field) => {
      return (
        field.label.toLowerCase().includes(term) ||
        field.key.toLowerCase().includes(term)
      );
    });
  }, [selectedGroup, slashQuery]);

  const closeSlashMenu = () => {
    setSlashOpen(false);
    setSlashQuery('');
    setSelectedGroupKey(null);
    slashRangeRef.current = null;
  };

  const syncEditor = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  };

  const runCommand = (command: string, commandValue?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    syncEditor();
  };

  const normalizeLists = () => {
    if (!editorRef.current) return;
    editorRef.current.querySelectorAll('ul').forEach((list) => {
      const element = list as HTMLUListElement;
      element.style.listStyleType = 'disc';
      element.style.paddingLeft = '1.5rem';
      element.style.margin = '0.5rem 0';
    });
    editorRef.current.querySelectorAll('ol').forEach((list) => {
      const element = list as HTMLOListElement;
      element.style.listStyleType = 'decimal';
      element.style.paddingLeft = '1.5rem';
      element.style.margin = '0.5rem 0';
    });
  };

  const toggleUnorderedList = () => {
    runCommand('insertUnorderedList');
    normalizeLists();
    syncEditor();
  };

  const toggleOrderedList = () => {
    runCommand('insertOrderedList');
    normalizeLists();
    syncEditor();
  };

  const insertTable = (rows: number, cols: number) => {
    if (!editorRef.current || rows < 1 || cols < 1) return;
    editorRef.current.focus();

    let headerRow = '';
    for (let c = 1; c <= cols; c += 1) {
      headerRow += `<th style="border:1px solid #d4d4d8;background:#f4f4f5;padding:8px;text-align:left;">Coluna ${c}</th>`;
    }

    let bodyRows = '';
    for (let r = 0; r < rows; r += 1) {
      let cells = '';
      for (let c = 0; c < cols; c += 1) {
        cells += '<td style="border:1px solid #d4d4d8;padding:8px;">Valor</td>';
      }
      bodyRows += `<tr>${cells}</tr>`;
    }

    const tableHtml = `
      <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;">
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      <p></p>
    `;

    document.execCommand('insertHTML', false, tableHtml);
    syncEditor();
    setTablePickerOpen(false);
    setHoveredRows(0);
    setHoveredCols(0);
  };

  const detectSlashTrigger = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
      closeSlashMenu();
      return;
    }

    const range = selection.getRangeAt(0);
    const container = range.startContainer;

    if (container.nodeType !== Node.TEXT_NODE) {
      closeSlashMenu();
      return;
    }

    const textNode = container as Text;
    const textBeforeCaret = textNode.textContent?.slice(0, range.startOffset) || '';
    const slashMatch = textBeforeCaret.match(/\/([a-zA-Z0-9._-]*)$/);

    if (!slashMatch) {
      closeSlashMenu();
      return;
    }

    const matchText = slashMatch[0];
    const typedQuery = slashMatch[1] || '';

    const slashRange = document.createRange();
    slashRange.setStart(textNode, range.startOffset - matchText.length);
    slashRange.setEnd(textNode, range.startOffset);
    slashRangeRef.current = slashRange;

    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    const caretRect = range.getBoundingClientRect();

    if (wrapperRect) {
      const maxLeft = Math.max(12, wrapperRect.width - 380);
      const nextLeft = Math.min(
        maxLeft,
        Math.max(12, caretRect.left - wrapperRect.left)
      );
      const nextTop = Math.max(44, caretRect.bottom - wrapperRect.top + 8);
      setSlashPosition({ x: nextLeft, y: nextTop });
    }

    setSlashOpen(true);
    setSelectedGroupKey(null);
    setSlashQuery(typedQuery);
  };

  const insertTokenAtSlash = (token: string) => {
    if (!editorRef.current || !slashRangeRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = slashRangeRef.current;
    range.deleteContents();
    const tokenNode = document.createTextNode(`{{${token}}}`);
    const spacer = document.createTextNode(' ');
    range.insertNode(tokenNode);
    tokenNode.after(spacer);

    const caretRange = document.createRange();
    caretRange.setStartAfter(spacer);
    caretRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caretRange);

    editorRef.current.focus();
    syncEditor();
    closeSlashMenu();
  };

  const selectFirstSlashOption = () => {
    if (selectedGroup) {
      const firstField = visibleFields[0];
      if (!firstField) return;
      insertTokenAtSlash(`${selectedGroup.key}.${firstField.key}`);
      return;
    }

    const firstGroup = visibleGroups[0];
    if (!firstGroup) return;
    setSelectedGroupKey(firstGroup.key);
    setSlashQuery('');
  };

  return (
    <div ref={wrapperRef} className={cn('relative rounded-md border', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <Button type="button" size="icon" variant="ghost" onClick={() => runCommand('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => runCommand('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => runCommand('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={toggleUnorderedList}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={toggleOrderedList}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Popover
          open={tablePickerOpen}
          onOpenChange={(open) => {
            setTablePickerOpen(open);
            if (!open) {
              setHoveredRows(0);
              setHoveredCols(0);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button type="button" size="icon" variant="ghost">
              <Table2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Inserir tabela</p>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: TABLE_GRID_ROWS * TABLE_GRID_COLS }).map((_, index) => {
                  const row = Math.floor(index / TABLE_GRID_COLS) + 1;
                  const col = (index % TABLE_GRID_COLS) + 1;
                  const active = row <= hoveredRows && col <= hoveredCols;

                  return (
                    <button
                      key={`${row}-${col}`}
                      type="button"
                      className={cn(
                        'h-4 w-4 rounded-xs border border-border',
                        active ? 'bg-primary/70 border-primary/70' : 'bg-background'
                      )}
                      onMouseEnter={() => {
                        setHoveredRows(row);
                        setHoveredCols(col);
                      }}
                      onClick={() => insertTable(row, col)}
                      aria-label={`Inserir tabela ${row} por ${col}`}
                    />
                  );
                })}
              </div>
              <p className="text-muted-foreground text-xs">
                {hoveredRows > 0 && hoveredCols > 0
                  ? `${hoveredRows} x ${hoveredCols}`
                  : 'Passe o mouse e clique para inserir'}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          'min-h-[420px] whitespace-pre-wrap p-4 text-sm outline-none',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2',
          '[&_table]:w-full [&_table]:border-collapse [&_table]:my-3',
          '[&_th]:border [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left',
          '[&_td]:border [&_td]:px-2 [&_td]:py-1.5'
        )}
        onInput={() => {
          syncEditor();
          detectSlashTrigger();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && slashOpen) {
            event.preventDefault();
            closeSlashMenu();
            return;
          }

          if (event.key === 'Enter' && slashOpen) {
            event.preventDefault();
            selectFirstSlashOption();
            return;
          }
        }}
        onKeyUp={() => detectSlashTrigger()}
        onClick={() => detectSlashTrigger()}
      />

      {slashOpen && (
        <div
          className="absolute z-50 w-96 max-w-[calc(100%-24px)] rounded-md border bg-popover shadow-md"
          style={{ left: slashPosition.x, top: slashPosition.y }}
        >
          <Command>
            <CommandInput
              placeholder={
                selectedGroup
                  ? `Buscar campo em ${selectedGroup.label}...`
                  : 'Buscar grupo de dados...'
              }
              value={slashQuery}
              onValueChange={setSlashQuery}
            />
            <CommandList>
              {selectedGroup ? (
                <>
                  <CommandGroup heading={selectedGroup.label}>
                    <CommandItem
                      onSelect={() => {
                        setSelectedGroupKey(null);
                        setSlashQuery('');
                      }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar para grupos
                    </CommandItem>
                    {visibleFields.map((field) => (
                      <CommandItem
                        key={`${selectedGroup.key}.${field.key}`}
                        value={`${selectedGroup.key}.${field.key}`}
                        onSelect={() =>
                          insertTokenAtSlash(`${selectedGroup.key}.${field.key}`)
                        }
                      >
                        {selectedGroup.key}.{field.key}
                        <span className="text-muted-foreground ml-auto text-xs">
                          {field.label}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {visibleFields.length === 0 && (
                    <CommandEmpty>Nenhum campo encontrado.</CommandEmpty>
                  )}
                </>
              ) : (
                <>
                  <CommandGroup heading="Dados do contrato">
                    {visibleGroups.map((group) => (
                      <CommandItem
                        key={group.key}
                        value={group.key}
                        onSelect={() => {
                          setSelectedGroupKey(group.key);
                          setSlashQuery('');
                        }}
                      >
                        {group.label}
                        <span className="text-muted-foreground ml-auto text-xs">
                          {group.key}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {visibleGroups.length === 0 && (
                    <CommandEmpty>Nenhum grupo encontrado.</CommandEmpty>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}

      <p className="text-muted-foreground border-t px-3 py-2 text-xs">
        Digite <strong>/</strong> para inserir campos dinamicos (ex.:{' '}
        <code>{'{{locatario.nome}}'}</code>).
      </p>
    </div>
  );
}
