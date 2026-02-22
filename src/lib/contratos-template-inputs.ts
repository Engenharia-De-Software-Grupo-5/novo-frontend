import { ModeloContratoInput } from '@/types/modelo-contrato';

const PLACEHOLDER_REGEX = /\{\{\s*([^{}]+?)\s*\}\}/g;

const normalizeLabel = (value: string) => {
  return value
    .split('.')
    .pop()
    ?.replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) || value;
};

export const extractTemplateInputs = (rawText: string): ModeloContratoInput[] => {
  const unique = new Set<string>();
  const inputs: ModeloContratoInput[] = [];
  const matches = rawText.matchAll(PLACEHOLDER_REGEX);

  for (const match of matches) {
    const key = match[1].trim();
    if (!key || key.startsWith('#') || key.startsWith('/')) continue;
    if (unique.has(key)) continue;

    unique.add(key);

    const [group, field] = key.includes('.') ? key.split('.', 2) : [null, key];
    inputs.push({
      key,
      group,
      field,
      label: normalizeLabel(key),
    });
  }

  return inputs;
};
