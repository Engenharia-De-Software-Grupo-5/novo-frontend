"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/features/components/ui/button"
import { Input } from "@/features/components/ui/input"
import { Label } from "@/features/components/ui/label"

export default function SignupForm() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  function validate() {
    const e: { [k: string]: string } = {}
    if (!nome.trim()) e.nome = "Nome é obrigatório."
    if (!email.trim()) e.email = "Email é obrigatório."
    if (!senha) e.senha = "Senha é obrigatória."
    if (senha && senha.length < 8) e.senha = "Deve conter no mínimo 8 caracteres."
    if (!confirmar) e.confirmar = "Confirme sua senha."
    if (senha && confirmar && senha !== confirmar) e.confirmar = "As senhas não coincidem."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (!validate()) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)

    toast.success("Conta criada com sucesso!")
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Crie sua conta</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Insira seu e-mail abaixo para criar uma conta
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={errors.nome ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">Como devemos lhe chamar?</p>
          {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            Usaremos este e-mail para entrar em contato com você. Não compartilharemos com mais ninguém.
          </p>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={errors.senha ? "border-destructive" : ""}
            />
            {errors.senha && <p className="text-xs text-destructive">{errors.senha}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmar">Confirmar Senha</Label>
            <Input
              id="confirmar"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className={errors.confirmar ? "border-destructive" : ""}
            />
            {errors.confirmar && <p className="text-xs text-destructive">{errors.confirmar}</p>}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Deve conter no mínimo 8 caracteres</p>

        <Button className="w-full" disabled={loading}>
          {loading ? "Criando..." : "Criar Conta"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Já possui uma conta Moratta?{" "}
        <Link href="/login" className="text-primary underline">
          Login
        </Link>
      </p>

    </>
  )
}