import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "At least 8 characters").max(72);

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate(next, { replace: true });
  }, [user, loading, next, navigate]);

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const pwd = passwordSchema.safeParse(fd.get("password"));
    if (!email.success) return toast.error(email.error.issues[0].message);
    if (!pwd.success) return toast.error(pwd.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.data, password: pwd.data });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const pwd = passwordSchema.safeParse(fd.get("password"));
    const name = String(fd.get("name") || "").trim().slice(0, 100);
    if (!email.success) return toast.error(email.error.issues[0].message);
    if (!pwd.success) return toast.error(pwd.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.data,
      password: pwd.data,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email if confirmation is required.");
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + next });
    setBusy(false);
    if (result.error) toast.error(result.error.message || "Google sign-in failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <Helmet>
        <title>Sign in — AdSense Approval Checker</title>
        <meta name="description" content="Sign in or create an account to save audit history and access the AdSense Checker dashboard." />
        <link rel="canonical" href="/auth" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-3 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-primary">
            <ShieldCheck className="h-7 w-7" />
            <span className="font-bold">AdSense Checker</span>
          </Link>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Save your audits and unlock the dashboard.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button onClick={onGoogle} disabled={busy} variant="outline" className="w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or email</span></div>
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={onSignIn} className="space-y-3 pt-3">
                <div className="space-y-1">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="si-pwd">Password</Label>
                  <Input id="si-pwd" name="password" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={onSignUp} className="space-y-3 pt-3">
                <div className="space-y-1">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" name="name" type="text" maxLength={100} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="su-pwd">Password</Label>
                  <Input id="su-pwd" name="password" type="password" minLength={8} required autoComplete="new-password" />
                  <p className="text-[11px] text-muted-foreground">Minimum 8 characters.</p>
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground pt-2">
            By continuing you agree to our{" "}
            <Link to="/terms-of-service" className="underline">Terms</Link> and{" "}
            <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
