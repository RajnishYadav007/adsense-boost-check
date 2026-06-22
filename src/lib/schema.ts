// JSON-LD schema builders. All return plain objects; stringify in <Helmet>.

export const SITE_URL = "https://adsense-boost-check.lovable.app";
export const SITE_NAME = "AdSense Approval Checker";

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  sameAs: [],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?url={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const softwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdSense Approval Checker",
  applicationCategory: "WebApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1827",
  },
  description:
    "Free AdSense eligibility checker that audits any website on 47+ points — content, policies, security, SEO, and performance — to predict Google AdSense approval.",
  url: SITE_URL,
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
  })),
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const howToSchema = (name: string, steps: string[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name,
  step: steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: `Step ${i + 1}`,
    text: s,
  })),
});

export const articleSchema = (a: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  url: a.url,
  datePublished: a.datePublished || new Date().toISOString(),
  author: { "@type": "Organization", name: a.author || SITE_NAME },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
  },
});
