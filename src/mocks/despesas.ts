import { DespesaDetail } from "@/types/despesa";

export const mockDespesas: DespesaDetail[] = [
  // --- DESPESAS DO CONDOMÍNIO (idImovel: null) ---
  { id: "DSP-8001", nome: "Manutenção do Elevador Social", valor: 1250.00, data: "2026-02-25", status: "pendente", tipo: "manutencao", formaPagamento: "boleto", idImovel: null, anexos: [{ id: "anx-1", name: "orcamento_otis.pdf", type: "application/pdf", size: 102400, url: "/docs/orcamento_otis.pdf" }] },
  { id: "DSP-8002", nome: "Conta de Energia (Área Comum)", valor: 890.50, data: "2026-02-10", status: "pago", tipo: "consumo", formaPagamento: "transferencia", idImovel: null, anexos: [] },
  { id: "DSP-8003", nome: "Limpeza de Fachada", valor: 3500.00, data: "2026-02-05", status: "pago", tipo: "manutencao", formaPagamento: "pix", idImovel: null, anexos: [] },
  { id: "DSP-8004", nome: "Compra de Câmeras de Segurança", valor: 2100.00, data: "2026-03-01", status: "pendente", tipo: "equipamentos", formaPagamento: "boleto", idImovel: null, anexos: [] },
  { id: "DSP-8005", nome: "Jardinagem Mensal", valor: 400.00, data: "2026-02-15", status: "atrasado", tipo: "servico", formaPagamento: "pix", idImovel: null, anexos: [] },
  { id: "DSP-8006", nome: "Conta de Água", valor: 1450.20, data: "2026-02-12", status: "pago", tipo: "consumo", formaPagamento: "transferencia", idImovel: null, anexos: [] },
  { id: "DSP-8007", nome: "Seguro do Condomínio", valor: 5000.00, data: "2026-01-20", status: "pago", tipo: "boleto", formaPagamento: "boleto", idImovel: null, anexos: [] },
  { id: "DSP-8008", nome: "Reforma da Portaria", valor: 8500.00, data: "2026-03-10", status: "pendente", tipo: "reforma", formaPagamento: "transferencia", idImovel: null, anexos: [] },

  // --- DESPESAS DE IMÓVEIS ESPECÍFICOS ---
  { id: "DSP-9001", nome: "Reparo Hidráulico - Infiltração", valor: 450.00, data: "2026-02-15", status: "pago", tipo: "manutencao", formaPagamento: "pix", idImovel: "AP 302", anexos: [{ id: "anx-2", name: "nota_fiscal_encanador.png", type: "image/png", size: 51200, url: "/docs/nf_encanador.png" }] },
  { id: "DSP-9002", nome: "Troca de Fechadura", valor: 180.00, data: "2026-02-18", status: "pendente", tipo: "manutencao", formaPagamento: "pix", idImovel: "AP 104", anexos: [] },
  { id: "DSP-9003", nome: "Pintura Interna", valor: 1200.00, data: "2026-02-01", status: "atrasado", tipo: "reforma", formaPagamento: "transferencia", idImovel: "AP 501", anexos: [] },
  { id: "DSP-9004", nome: "Instalação de Ar Condicionado", valor: 600.00, data: "2026-02-28", status: "pendente", tipo: "equipamentos", formaPagamento: "pix", idImovel: "AP 202", anexos: [] },
  { id: "DSP-9005", nome: "Limpeza Pós-Obra", valor: 300.00, data: "2026-02-20", status: "pago", tipo: "servico", formaPagamento: "boleto", idImovel: "AP 701", anexos: [] },
  { id: "DSP-9006", nome: "Troca de Vidro Quebrado", valor: 250.00, data: "2026-01-15", status: "pago", tipo: "manutencao", formaPagamento: "pix", idImovel: "AP 405", anexos: [] },
  { id: "DSP-9007", nome: "Desentupimento de Pia", valor: 150.00, data: "2026-02-22", status: "pendente", tipo: "manutencao", formaPagamento: "pix", idImovel: "AP 102", anexos: [] },
];