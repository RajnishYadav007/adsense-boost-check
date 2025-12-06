import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, CheckCircle, AlertTriangle, Lightbulb, Clock, Target, FileText, Users } from "lucide-react";
import Header from "@/components/Header";

const Resources = () => {
  const tips = [
    {
      icon: FileText,
      title: "Quality Content is King",
      description: "Create at least 15-20 high-quality, original articles with 800+ words each. Focus on providing value to your readers.",
      priority: "critical"
    },
    {
      icon: Clock,
      title: "Age Your Domain",
      description: "Google prefers websites that are at least 6 months old. Use this time to build quality content and traffic.",
      priority: "high"
    },
    {
      icon: Target,
      title: "Choose a Niche",
      description: "Focus on a specific topic or niche. This helps establish authority and makes your content more valuable to advertisers.",
      priority: "high"
    },
    {
      icon: Users,
      title: "Build Organic Traffic",
      description: "Focus on SEO and organic traffic. Google values websites with genuine, consistent traffic from search engines.",
      priority: "medium"
    }
  ];

  const requirements = [
    { name: "Privacy Policy", status: "required", description: "A clear privacy policy page explaining how you handle user data" },
    { name: "Contact Page", status: "required", description: "Provide a way for visitors and Google to contact you" },
    { name: "About Page", status: "recommended", description: "Tell visitors about your website and its purpose" },
    { name: "Terms of Service", status: "recommended", description: "Outline the terms users agree to when using your site" },
    { name: "SSL Certificate", status: "required", description: "Your website must use HTTPS encryption" },
    { name: "Mobile Responsive", status: "required", description: "Your site must work well on mobile devices" },
  ];

  const faqs = [
    {
      question: "How long does AdSense approval take?",
      answer: "The approval process typically takes 1-2 weeks, but can take up to a month. During high-volume periods, it may take longer. Ensure your site meets all requirements before applying."
    },
    {
      question: "Can I reapply after rejection?",
      answer: "Yes! You can reapply after fixing the issues mentioned in the rejection email. Wait at least 2-3 weeks before reapplying, and make sure to address all concerns thoroughly."
    },
    {
      question: "How many pages do I need?",
      answer: "There's no official minimum, but having at least 15-20 quality pages of content significantly improves your chances. Quality matters more than quantity."
    },
    {
      question: "Does traffic amount matter?",
      answer: "Google doesn't require a minimum traffic level, but having consistent organic traffic shows your site provides value to users, which can help with approval."
    },
    {
      question: "Can I use other ad networks while waiting?",
      answer: "Yes, you can use other ad networks. However, avoid placing too many ads that could negatively affect user experience before applying to AdSense."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AdSense Resources</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Complete Guide to AdSense Approval
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn everything you need to know about getting approved for Google AdSense and maximizing your earnings.
          </p>
        </div>

        {/* Tips Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-warning" />
            Pro Tips for Approval
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                      </div>
                      <Badge variant={tip.priority === "critical" ? "destructive" : tip.priority === "high" ? "default" : "secondary"}>
                        {tip.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Requirements Checklist */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            Essential Requirements
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    {req.status === "required" ? (
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{req.name}</span>
                        <Badge variant={req.status === "required" ? "default" : "outline"} className="text-xs">
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Resources;
