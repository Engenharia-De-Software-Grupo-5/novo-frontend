"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/features/components/ui/button"
import { Input } from "@/features/components/ui/input"
import { Label } from "@/features/components/ui/label"

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState("")
  const [nova, setNova] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  function validate() {
    const e: { [k: string]: string } = {}
    if (!email.trim()) e.email = "Email é obrigatório."
    if (!nova) e.nova = "Nova senha é obrigatória."
    if (nova && nova.length < 8) e.nova = "Deve conter no mínimo 8 caracteres."
    if (!confirmar) e.confirmar = "Confirme sua senha."
    if (nova && confirmar && nova !== confirmar) e.confirmar = "As senhas não coincidem."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)

    toast.success("Senha alterada com sucesso!")
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Recuperar senha</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Digite abaixo a sua nova senha
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            Você está alterando a senha para o seguinte e-mail.
          </p>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nova">Nova Senha</Label>
            <Input
              id="nova"
              type="password"
              value={nova}
              onChange={(ev) => setNova(ev.target.value)}
              className={errors.nova ? "border-destructive" : ""}
            />
            {errors.nova && <p className="text-xs text-destructive">{errors.nova}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmar">Confirmar Senha</Label>
            <Input
              id="confirmar"
              type="password"
              value={confirmar}
              onChange={(ev) => setConfirmar(ev.target.value)}
              className={errors.confirmar ? "border-destructive" : ""}
            />
            {errors.confirmar && <p className="text-xs text-destructive">{errors.confirmar}</p>}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Deve conter no mínimo 8 caracteres</p>

        <Button className="w-full" disabled={loading}>
          {loading ? "Alterando..." : "Alterar Senha"}
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