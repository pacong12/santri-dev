'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/context/auth-context';
import { AuthService } from '../../lib/services/auth.service';
import { LoginForm, SignupForm } from '@org/ui';
import { GalleryVerticalEnd } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setName('');
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await AuthService.login({ email, password });
      login(data.token, data.user, data.memberships);

      setSuccess('Masuk berhasil! Mengalihkan...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: unknown) {
      setError((err as Error).message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await AuthService.register({
        username,
        email,
        password,
        name: name || null,
      });

      setSuccess('Registrasi berhasil! Beralih ke halaman masuk...');
      setTimeout(() => {
        resetForm();
        setActiveTab('login');
      }, 1500);
    } catch (err: unknown) {
      setError((err as Error).message || 'Terjadi kesalahan saat registrasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-zinc-950 text-white font-sans">
      <div className="flex flex-col gap-4 p-6 md:p-10 justify-between">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              SaaS Pesantren
            </span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium">
                {success}
              </div>
            )}

            {activeTab === 'login' ? (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={handleLogin}
                onSwitchToRegister={() => {
                  resetForm();
                  setActiveTab('register');
                }}
                isLoading={isLoading}
              />
            ) : (
              <SignupForm
                name={name}
                setName={setName}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={handleRegister}
                onSwitchToLogin={() => {
                  resetForm();
                  setActiveTab('login');
                }}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500">
          Dengan melanjutkan, Anda menyetujui <a href="#" className="underline">Ketentuan Layanan</a> dan <a href="#" className="underline">Kebijakan Privasi</a> kami.
        </div>
      </div>

      <div className="relative hidden bg-zinc-950 lg:block border-l border-zinc-900 overflow-hidden">
        {/* Beautiful premium grid and gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-zinc-950 to-slate-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
              SP
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">SaaS Pembayaran Pesantren</span>
          </div>
          <div className="space-y-4 max-w-md">
            <blockquote className="space-y-2">
              <p className="text-xl text-zinc-200 font-light leading-relaxed">
                &ldquo;Platform administrasi finansial mandiri untuk efisiensi, akuntabilitas, dan kemudahan pembayaran biaya pendidikan santri.&rdquo;
              </p>
              <footer className="text-sm text-zinc-500 font-mono">— Tim Pengembang Sistem Pembayaran</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
