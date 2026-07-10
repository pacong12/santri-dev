'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/context/auth-context';
import { AuthService } from '../../lib/services/auth.service';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
} from '@org/ui';

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

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred.');
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

      setSuccess('Registration successful! Swapping to login...');
      setTimeout(() => {
        resetForm();
        setActiveTab('login');
      }, 1500);
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-zinc-900 to-indigo-950 p-4 text-white font-sans">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20 mb-3">
            SP
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            SaaS Pembayaran Pesantren
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Platform Administrasi Finansial Mandiri</p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-1 mb-6 flex">
          <button
            onClick={() => {
              resetForm();
              setActiveTab('login');
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveTab('register');
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        <Card className="bg-zinc-900/60 backdrop-blur-lg border-zinc-800 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {activeTab === 'login' ? 'Selamat Datang Kembali' : 'Registrasi Akun Baru'}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {activeTab === 'login'
                ? 'Silakan masuk untuk mengelola pembayaran pesantren'
                : 'Daftarkan akun administrator global Anda'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium">
                  {success}
                </div>
              )}

              {activeTab === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-zinc-300">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-zinc-500 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-zinc-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      required
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-zinc-500 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                  Email Resmi
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@pesantren.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-zinc-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-zinc-500 rounded-xl"
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl font-medium shadow-md shadow-indigo-600/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? 'Memproses...'
                  : activeTab === 'login'
                  ? 'Masuk Aplikasi'
                  : 'Daftar Sekarang'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
