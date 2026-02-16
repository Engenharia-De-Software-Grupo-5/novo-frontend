import Image from "next/image"
import { Card, CardContent } from "@/features/components/ui/card"

export default function AuthCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-muted flex flex-col items-center justify-center px-4">

      {/* CAIXA */}
      <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">

          {/* ESQUERDA */}
          <div className="p-6 flex flex-col justify-center max-w-md mx-auto w-full">
            {children}
          </div>

          {/* DIREITA */}
          <div className="hidden md:flex items-center justify-center bg-muted p-6">
            <Image
              src="/auth-illustration.png"
              alt="Ilustração Moratta"
              width={420}
              height={320}
              priority
            />
          </div>

        </CardContent>
      </Card>

      {/* TEXTO FORA DA CAIXA */}
      <p className="mt-6 text-center text-xs text-muted-foreground max-w-md">
        Ao continuar você concorda com os nossos{" "}
        <span className="underline cursor-pointer">
          Termos de Serviço
        </span>{" "}
        e com a nossa{" "}
        <span className="underline cursor-pointer">
          Política de Privacidade
        </span>.
      </p>

    </main>
  )
}