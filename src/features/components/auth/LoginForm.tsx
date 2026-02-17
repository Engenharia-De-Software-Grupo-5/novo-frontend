"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/features/components/ui/button"
import { Input } from "@/features/components/ui/input"
import { Label } from "@/features/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  function validar() {
    if (!email.trim()) setErro("Email é obrigatório.")
    else if (!senha) setErro("Senha é obrigatória.")
    else setErro("")
    return email.trim() && senha
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validar()) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)

    // Simulação
    if (email === "admin@moratta.com" && senha === "12345678") {
      toast.success("Login realizado com sucesso!")
      // aqui no futuro: router.push("/dashboard")
    } else {
      toast.error("Email ou senha inválidos.")
    }
  }

  const campoComErro = Boolean(erro)

  return (
    <>
      <div className="flex justify-center mb-4">
        <Image src="/logo-icon.png" alt="Moratta" width={40} height={40} />
      </div>

      <h1 className="text-2xl font-semibold text-center">Bem vindo de volta</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Faça login com sua conta Moratta
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={campoComErro && !email.trim() ? "border-destructive" : ""}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="senha">Senha</Label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(ev) => setSenha(ev.target.value)}
            className={campoComErro && !senha ? "border-destructive" : ""}
          />
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Login"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link href="/signup" className="text-primary underline">
          Cadastre-se
        </Link>
      </p>

    </>
  )
}