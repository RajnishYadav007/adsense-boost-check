import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 chars").max(4000),
});

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject ?? "",
      message: parsed.data.message,
    };
    const { error } = await supabase.from("contact_submissions").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Could not send message. Try again.");
      return;
    }
    toast.success("Message sent. We'll reply within 2 business days.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <SiteLayout>
      <Helmet>
        <title>Contact — AdSense Approval Checker</title>
        <meta name="description" content="Reach the AdSense Approval Checker team for support, partnerships, or feedback. We respond within two business days." />
        <link rel="canonical" href="https://adsense-boost-check.lovable.app/contact" />
      </Helmet>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact us</h1>
          <p className="text-muted-foreground">Questions, partnerships, feedback — we read everything.</p>
        </header>

        <div className="grid gap-8 md:grid-cols-[1fr,360px]">
          <form onSubmit={submit} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label className="mb-1.5 block">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Subject</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1.5 block">Message</Label>
              <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <Button type="submit" disabled={loading} className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
              {loading ? "Sending..." : "Send message"}
            </Button>
          </form>

          <aside className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <Mail className="h-5 w-5 text-primary mb-2" />
              <div className="font-medium">Email</div>
              <div className="text-sm text-muted-foreground">hello@adsenseapprovalchecker.net</div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <MessageSquare className="h-5 w-5 text-primary mb-2" />
              <div className="font-medium">Response time</div>
              <div className="text-sm text-muted-foreground">Within 2 business days</div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <MapPin className="h-5 w-5 text-primary mb-2" />
              <div className="font-medium">Location</div>
              <div className="text-sm text-muted-foreground">Remote, worldwide</div>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
