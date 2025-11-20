import { CheckResult } from "@/components/CheckResults";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

interface DetailedRecommendationsProps {
  results: CheckResult[];
}

const recommendationDetails: Record<string, { steps: string[]; tips: string[] }> = {
  "Domain Criteria": {
    steps: [
      "Ensure your domain is at least 6 months old",
      "Use a custom domain (not subdomain)",
      "Verify domain ownership in Google Search Console",
      "Keep WHOIS information accurate and accessible"
    ],
    tips: [
      "Older domains have better credibility",
      "Avoid using free hosting with shared domains",
      "Consider domain history before purchasing"
    ]
  },
  "Site Availability": {
    steps: [
      "Enable HTTPS/SSL certificate (use Let's Encrypt for free)",
      "Test website loading on multiple devices and browsers",
      "Implement 301 redirects for HTTP to HTTPS",
      "Monitor uptime using tools like UptimeRobot"
    ],
    tips: [
      "SSL is mandatory for AdSense approval",
      "Aim for 99.9% uptime",
      "Fix broken links and 404 errors regularly"
    ]
  },
  "Site Content": {
    steps: [
      "Create at least 20-30 high-quality, original articles",
      "Write posts with minimum 1000 words each",
      "Add proper headings, images, and formatting",
      "Ensure content is unique and not copied",
      "Add essential pages: About Us, Contact, Privacy Policy, Terms"
    ],
    tips: [
      "Focus on one niche for better targeting",
      "Update content regularly",
      "Use proper grammar and avoid spam",
      "Make content helpful and valuable to readers"
    ]
  },
  "Site Performance": {
    steps: [
      "Optimize images (compress and use modern formats like WebP)",
      "Enable browser caching and GZIP compression",
      "Minimize CSS, JavaScript, and HTML files",
      "Use a Content Delivery Network (CDN)",
      "Implement lazy loading for images"
    ],
    tips: [
      "Target page load time under 3 seconds",
      "Test speed with Google PageSpeed Insights",
      "Mobile speed is crucial for AdSense",
      "Consider using a faster hosting provider"
    ]
  }
};

export const DetailedRecommendations = ({ results }: DetailedRecommendationsProps) => {
  const failedChecks = results.filter(r => 
    r.checks.some(c => c.status === 'fail' || c.status === 'warning')
  );

  if (failedChecks.length === 0) {
    return (
      <div className="flex items-center gap-3 p-6 bg-success/10 border border-success/20 rounded-lg">
        <CheckCircle2 className="h-6 w-6 text-success" />
        <div>
          <h3 className="font-semibold text-success">Excellent Work!</h3>
          <p className="text-sm text-muted-foreground">All checks passed. Your site is ready for AdSense.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-warning" />
        <h3 className="text-lg font-semibold">Detailed Improvement Guide</h3>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-2">
        {failedChecks.map((check, index) => {
          const details = recommendationDetails[check.category] || { steps: [], tips: [] };
          const passed = check.checks.filter(c => c.status === 'pass').length;
          const total = check.checks.length;
          
          return (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div className="text-left">
                    <div className="font-semibold">{check.category}</div>
                    <div className="text-sm text-muted-foreground">
                      {passed}/{total} checks passed
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Action Steps
                  </h4>
                  <ol className="space-y-2 ml-4">
                    {details.steps.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary font-medium">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    Pro Tips
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {details.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-warning">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
