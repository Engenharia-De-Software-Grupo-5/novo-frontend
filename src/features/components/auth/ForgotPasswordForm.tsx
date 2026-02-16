"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/features/components/ui/button"
import { Input } from "@/features/components/ui/input"
import { Label } from "@/features/components/ui/label"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro("")

    if (!email.trim()) {
      setErro("Informe um e-mail válido.")
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)

    toast.success("Solicitação enviada com sucesso!")
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Esqueceu a senha?</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Siga as instruções abaixo para recuperá-la
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={erro ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            Digite aqui o seu e-mail usado no sistema Moratta. Nós enviaremos um link para recuperar sua senha.
          </p>
          {erro && <p className="text-xs text-destructive">{erro}</p>}
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Enviando..." : "Enviar e-mail"}
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