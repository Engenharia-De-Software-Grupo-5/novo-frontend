import Image from "next/image";
import { Button } from "@/features/components/ui/button";
import { Input } from "@/features/components/ui/input";
import { Label } from "@/features/components/ui/label";
import { Card, CardContent } from "@/features/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
 return (
  // Fundo da página (Cinza claro #f7f7f8)
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-background p-4">
      
      {/* O Card aqui serve como o "Frame" que divide as duas partes. 
         Removemos o bg-white e as bordas dele. 
      */}
      <Card className="grid w-full max-w-4xl  grid-cols-1 overflow-hidden border-none bg-transparent shadow-none md:grid-cols-2">
        
        {/* LADO ESQUERDO: FUNDO BRANCO (#ffffff) */}
        <div className="flex flex-col justify-center bg-brand-white p-8 md:p-12 lg:p-16 rounded-l-2xl">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <Image src="/images/logo.svg" width={40} height={40} alt="Logo Moratta" />
            
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-brand-dark">
                Bem vindo de volta
              </h1>
              <p className="text-sm text-brand-gray">
                Faça login com sua conta Moratta
              </p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-dark font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                className="h-12 border-slate-200 focus:ring-brand-blue"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-brand-dark font-medium">Senha</Label>
                <Link href="#" className="text-xs font-medium text-brand-dark hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input id="password" type="password" className="h-12" />
            </div>

            <Button className="h-12 w-full bg-brand-blue text-brand-blue-text hover:opacity-90">
              Login
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-brand-gray">
            Ainda não tem uma conta?{" "}
            <Link href="#" className="font-medium text-brand-blue hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* LADO DIREITO: MESMO FUNDO DA PÁGINA (#f7f7f8) */}
        <div className="hidden items-center justify-center bg-brand-background p-8 md:flex rounded-r-2xl">
          <div className="relative aspect-square w-full max-w-sm">
            <Image 
              src="/images/login-illustration.png" 
              fill 
              alt="Ilustração Moratta" 
              className="object-contain"
              priority
            />
          </div>
        </div>
      </Card>

      {/* Rodapé fixo */}
      <div className="bottom-8 text-center text-[10px] text-brand-gray md:text-xs">
        Ao continuar você concorda com os nossos{" "}
        <Link href="#" className="underline">Termos de Serviço</Link> e com a nossa{" "}
        <Link href="#" className="underline">Política de Privacidade</Link>.
      </div>
    </div>
  );
}