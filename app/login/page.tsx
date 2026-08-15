'use client';

import React, { Suspense, useState } from 'react';
import { useAuth as useAuthContext } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Floating background emoji list
const FLOATING_EMOJIS = [
  { char: '🐱', delay: 0, x: '10%', y: '20%', size: '3rem' },
  { char: '🚀', delay: 2, x: '80%', y: '15%', size: '4.5rem' },
  { char: '🍕', delay: 4, x: '15%', y: '75%', size: '3.5rem' },
  { char: '🎩', delay: 1, x: '85%', y: '80%', size: '2.5rem' },
  { char: '🧙‍♂️', delay: 3, x: '75%', y: '45%', size: '3.8rem' },
  { char: '🦄', delay: 5, x: '5%', y: '45%', size: '4rem' },
  { char: '🛸', delay: 6, x: '45%', y: '85%', size: '3.2rem' },
  { char: '🍿', delay: 2.5, x: '50%', y: '10%', size: '2.8rem' },
];

function AuthForm() {
  const { login, signup, isLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    let success = false;
    if (isSignUp) {
      success = await signup(email, password, name);
    } else {
      success = await login(email, password);
    }

    if (success) {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md px-4">
      {/* Back to Home Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors group">
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Back to storyteller
      </Link>

      <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <CardHeader className="space-y-1.5 text-center pb-4">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-1">
            <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
          </div>
          <CardTitle className="text-3xl font-heading font-normal leading-normal py-1 px-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/95 to-primary/80 select-none">
            Emojinary
          </CardTitle>
          <CardDescription className="text-xs">
            {isSignUp ? 'Create an account to start weaving tales' : 'Log in to unlock unlimited emoji stories'}
          </CardDescription>
        </CardHeader>

        {/* Tab Selection */}
        <div className="px-6 pb-2">
          <div className="grid grid-cols-2 p-1 bg-secondary/40 border border-border/20 rounded-2xl">
            <button
              onClick={() => {
                setIsSignUp(false);
                setName('');
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                !isSignUp ? 'bg-background text-foreground shadow-sm border border-border/30' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                isSignUp ? 'bg-background text-foreground shadow-sm border border-border/30' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <CardContent className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-xs font-medium text-muted-foreground px-1">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Storyteller Jack"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground px-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4 h-11 rounded-xl cursor-pointer font-semibold text-sm transition-all active:scale-98" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isSignUp ? (
                'Create Account & Start Creating'
              ) : (
                'Sign In & Unlock Stories'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-[10px] text-muted-foreground/75 border-t border-border/20 pt-4 pb-6 bg-muted/10">
          <span>By continuing, you agree to unleash your imagination.</span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden selection:bg-primary/20">
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {FLOATING_EMOJIS.map((emoji, idx) => (
          <motion.div
            key={idx}
            initial={{ y: '10vh', opacity: 0.15, rotate: 0 }}
            animate={{
              y: ['0vh', '-15px', '15px', '0vh'],
              x: ['0px', '15px', '-15px', '0px'],
              rotate: [0, 10, -10, 0],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8 + idx * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: emoji.delay,
            }}
            style={{
              position: 'absolute',
              left: emoji.x,
              top: emoji.y,
              fontSize: emoji.size,
              userSelect: 'none',
              filter: 'blur(0.5px)',
            }}
          >
            {emoji.char}
          </motion.div>
        ))}
      </div>

      {/* Grid Pattern Background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Main Form Wrapped in Suspense */}
      <Suspense fallback={
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading authentication...</span>
        </div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  );
}
