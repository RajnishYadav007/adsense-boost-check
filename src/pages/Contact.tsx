import { Helmet } from "react-helmet-async";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/card";
import { Mail, Shield, Scale, Pencil, MapPin, Phone } from "lucide-react";
import { Placeholder } from "@/components/eeat/Placeholder";
import { eeat, isMissing } from "@/config/eeat";

export default function Contact() {
  const c = eeat.company;
  const channels = [
    {
      icon: Mail,
      label: "General",
      value: c.contactEmail,
      placeholder: "Contact Email",
    },
    {
      icon: Pencil,
      label: "Editorial & corrections",
      value: c.editorialEmail,
      placeholder: "Editorial Email",
    },
    {
      icon: Shield,
      label: "Privacy",
      value: c.privacyEmail,
      placeholder: "Privacy Email",
    },
    {
      icon: Scale,
      label: "Legal & DMCA",
      value: c.legalEmail,
      placeholder: "Legal Email",
    },
  ];

  return (
    <SiteLayout>
      <Helmet>
        <title>Contact — {c.brandName}</title>
        <meta
          name="description"
          content={`How to reach ${c.brandName} for support, editorial, privacy, or legal enquiries.`}
        />
        <link
          rel="canonical"
          href="https://adsense-boost-check.lovable.app/contact"
        />
      </Helmet>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact us</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          We answer every email. Pick the channel that matches your enquiry.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {channels.map(({ icon: Icon, label, value, placeholder }) => (
            <Card key={label} className="p-6 glass-card">
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {value ? (
                      <a
                        href={`mailto:${value}`}
                        className="text-primary underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <Placeholder value={value} label={placeholder} />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 glass-card mt-6">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-semibold">Postal address</div>
              <address className="not-italic text-sm text-muted-foreground mt-1 leading-relaxed">
                <Placeholder value={c.legalName} label="Legal Company Name" />
                <br />
                <Placeholder value={c.addressLine1} label="Street Address" />
                {!isMissing(c.addressLine2) && (
                  <>
                    <br />
                    {c.addressLine2}
                  </>
                )}
                <br />
                <Placeholder value={c.city} label="City" />,{" "}
                <Placeholder value={c.region} label="State / Region" />{" "}
                <Placeholder value={c.postalCode} label="Postal Code" />
                <br />
                <Placeholder value={c.country} label="Country" />
              </address>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card mt-6">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-semibold">Phone</div>
              <div className="text-sm text-muted-foreground mt-1">
                <Placeholder value={c.phone} label="Phone (optional)" />
              </div>
            </div>
          </div>
        </Card>

        <p className="text-sm text-muted-foreground mt-8">
          Response time: we aim to reply to every email within two business
          days. For factual errors, please use the Editorial address and
          include the article URL and source — see our{" "}
          <a href="/corrections-policy" className="text-primary underline">
            Corrections Policy
          </a>
          .
        </p>
      </section>
    </SiteLayout>
  );
}
