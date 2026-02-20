'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import { Input } from '@/features/components/ui/input';
import { Label } from '@/features/components/ui/label';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  function validar() {
    if (!email.trim()) setErro('Email é obrigatório.');
    else if (!senha) setErro('Senha é obrigatória.');
    else setErro('');
    return email.trim() && senha;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const result = await signIn('credentials', {
      email,
      password: senha,
      redirect: false, // não redireciona automaticamente
    });

    if (result?.error) {
      setErro('Email ou senha inválidos');
      return;
    }

    router.push('/condominios/0/dashboard');
  }

  const campoComErro = Boolean(erro);

  return (
    <>
      <div className="mb-4 flex justify-center">
        <Image src="/logo-icon.png" alt="Moratta" width={40} height={40} />
      </div>

      <h1 className="text-center text-2xl font-semibold">Bem vindo de volta</h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">
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
            className={
              campoComErro && !email.trim() ? 'border-destructive' : ''
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="senha">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-primary text-sm hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(ev) => setSenha(ev.target.value)}
            className={campoComErro && !senha ? 'border-destructive' : ''}
          />
        </div>

        {erro && <p className="text-destructive text-sm">{erro}</p>}

        <Button className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Login'}
        </Button>
      </form>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Ainda não tem uma conta?{' '}
        <Link href="/signup" className="text-primary underline">
          Cadastre-se
        </Link>
      </p>
    </>
  );
}
