'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/features/components/ui/button';
import { Card } from '@/features/components/ui/card';
import { Input } from '@/features/components/ui/input';
import { Label } from '@/features/components/ui/label';



export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError('');

  try {
    const user = await login(email, password);

    router.push(`/condominio/${user.condominioId}/usuarios`);

  } catch {
    setError('Email ou senha inválidos');
  }
}

  return (
    <div className="bg-brand-background flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="grid w-full max-w-4xl grid-cols-1 overflow-hidden border-none bg-transparent shadow-none md:grid-cols-2">
        <div className="bg-brand-white flex flex-col justify-center rounded-l-2xl p-8 md:p-12 lg:p-16">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <Image
              src="/images/logo.svg"
              width={40}
              height={40}
              alt="Logo Moratta"
            />

            <div className="space-y-2">
              <h1 className="text-brand-dark text-2xl font-semibold tracking-tight">
                Bem vindo de volta
              </h1>
              <p className="text-brand-gray text-sm">
                Faça login com sua conta Moratta
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-dark font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                className="focus:ring-brand-blue h-12 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-brand-dark font-medium"
                >
                  Senha
                </Label>
                <Link
                  href="#"
                  className="text-brand-dark text-xs font-medium hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="bg-brand-blue text-brand-blue-text h-12 w-full hover:opacity-90">
              Login
            </Button>
          </form>

          <p className="text-brand-gray mt-8 text-center text-sm">
            Ainda não tem uma conta?{' '}
            <Link
              href="#"
              className="text-brand-blue font-medium hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className="bg-brand-background hidden items-center justify-center rounded-r-2xl p-8 md:flex">
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

 
      <div className="text-brand-gray bottom-8 text-center text-[10px] md:text-xs">
        Ao continuar você concorda com os nossos{' '}
        <Link href="#" className="underline">
          Termos de Serviço
        </Link>{' '}
        e com a nossa{' '}
        <Link href="#" className="underline">
          Política de Privacidade
        </Link>
        .
      </div>
    </div>
  );
}
