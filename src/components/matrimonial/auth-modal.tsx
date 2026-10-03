"use client";

import * as React from "react";
import { CircleAlert, Gem, Sparkles } from "lucide-react";

import { Modal, ModalBody } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/ui/auth-forms";
import { SignupForm } from "@/components/ui/auth-forms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "./auth-provider";

export interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which tab is shown when the modal opens. */
  initialTab?: "signin" | "signup";
}

/**
 * Member sign-in / registration modal, composed entirely from library
 * primitives (Modal + Tabs + LoginForm + SignupForm + Alert).
 */
export function AuthModal({ open, onOpenChange, initialTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = React.useState<"signin" | "signup">(initialTab);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const { signIn, signUp } = useAuth();

  React.useEffect(() => {
    if (open) {
      setTab(initialTab);
      setError(null);
    }
  }, [open, initialTab]);

  async function handleLogin(data: { email: string; password: string }) {
    setBusy(true);
    setError(null);
    const result = await signIn(data.email, data.password);
    setBusy(false);
    if (result.ok) {
      onOpenChange(false);
    } else {
      setError(result.error ?? "Sign in failed.");
    }
  }

  async function handleSignup(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
  }) {
    setBusy(true);
    setError(null);
    const result = await signUp({
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
    setBusy(false);
    if (result.ok) {
      onOpenChange(false);
    } else {
      setError(result.error ?? "Could not create the account.");
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={
        <span className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-sm">
            <Gem className="size-4" />
          </span>
          Welcome to Saptapadi
        </span>
      }
      description="One account for interests, shortlists and membership."
    >
      <ModalBody>
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as "signin" | "signup");
            setError(null);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="pt-4">
            {error && tab === "signin" && (
              <Alert variant="destructive" className="mb-4">
                <CircleAlert />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <LoginForm
              showSocial={false}
              onSubmit={handleLogin}
            />
          </TabsContent>

          <TabsContent value="signup" className="pt-4">
            {error && tab === "signup" && (
              <Alert variant="destructive" className="mb-4">
                <CircleAlert />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <SignupForm onSubmit={handleSignup} />
          </TabsContent>
        </Tabs>

        <p className="flex items-center justify-center gap-1.5 pt-2 text-center text-xs text-muted-foreground">
          <Sparkles className="size-3 text-gold" />
          Free forever — premium upgrades optional.
        </p>
      </ModalBody>
    </Modal>
  );
}
