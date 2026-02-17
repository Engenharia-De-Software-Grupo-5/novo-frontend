'use client'; 

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Plus } from "lucide-react";

import { Button } from "@/features/components/ui/button";
import { Input } from "@/features/components/ui/input";
import { ImoveisTable } from "@/features/components/imoveis/imoveis-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/components/ui/select";

import { mockImoveis } from "@/mocks/imoveis";
import { Imovel } from "@/types/imoveis";

export default function ImoveisTablePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const filteredImoveis = mockImoveis.filter((imovel: Imovel) => {
    const termosBusca = searchTerm.toLowerCase().trim().split(/\s+/);
    const bateTipo = filtroTipo === "todos" || imovel.tipo.toLowerCase() === filtroTipo.toLowerCase();
    const bateStatus = filtroStatus === "todos" || imovel.situacao.toLowerCase() === filtroStatus.toLowerCase();

    if (termosBusca.length === 1 && termosBusca[0] === "") {
      return bateTipo && bateStatus;
    }

    const informacoesAlvo = [
      imovel.idImovel,
      imovel.tipo,
      imovel.endereco.rua,
      imovel.endereco.numero,
      imovel.endereco.bairro,
      imovel.endereco.cidade,
      imovel.endereco.nomePredio || "",
    ].join(" ").toLowerCase();

    const bateBusca = termosBusca.every(termo => informacoesAlvo.includes(termo));
    return bateBusca && bateTipo && bateStatus;
  });

  return (
    <div className="container mx-auto p-8 space-y-8 max-w-screen-2xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Gerencie os imóveis do sistema
        </h1>
        <p className="text-muted-foreground text-sm max-w-3xl">
          Visualize a lista completa em tabela, monitore a ocupação e gerencie os contratos de aluguel.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-1 gap-3 w-full md:w-auto items-center">
          <div className="relative w-full max-w-xs">
            <Input 
              placeholder="Filtrar imóveis..." 
              className="bg-background border-border h-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[140px] rounded-full bg-background border-border text-muted-foreground">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[140px] rounded-full bg-background border-border text-muted-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="manutenção">Manutenção</SelectItem>
              <SelectItem value="na planta">Na Planta</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center bg-muted p-1 rounded-lg border border-border h-10">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/imoveis">
                <LayoutGrid className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background shadow-sm rounded-md text-foreground cursor-default">
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 font-medium" asChild>
            <Link href="/imoveis/novo">
              Adicionar Imóvel
            </Link>
          </Button>
        </div>
      </div>

      <ImoveisTable data={filteredImoveis} />

      {filteredImoveis.length === 0 && (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
          Nenhum imóvel encontrado para os critérios selecionados.
        </div>
      )}
    </div>
  );
}