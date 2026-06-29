/**
 * EEAT (Experience, Expertise, Authoritativeness, Trust) configuration.
 *
 * FILL IN THESE VALUES. Any field left as an empty string ("") will render as a
 * visible [LABEL] placeholder on the live site so you can see what is missing.
 *
 * DO NOT invent values — leaving a field empty is safer than putting fake data
 * on EEAT pages (Google penalises fabricated authorship, credentials, and
 * compliance claims).
 */

export interface AuthorProfile {
  /** URL slug, e.g. "jane-doe" → /authors/jane-doe */
  slug: string;
  name: string;
  /** Job title, e.g. "Senior SEO Editor" */
  role: string;
  /** 2–4 sentence bio. Real experience only. */
  bio: string;
  /** Years of relevant professional experience as a number, or 0 if unknown. */
  yearsExperience: number;
  /** Bullet list of credentials. Real certifications/employers only. */
  credentials: string[];
  /** Bullet list of areas of expertise. */
  expertise: string[];
  /** Public profile URLs — leave array empty if none. */
  socials: { label: string; url: string }[];
  /** Public-facing email, optional. */
  email: string;
  /** /src/assets path or remote URL. Empty string = initials avatar. */
  photoUrl: string;
  /** "author" | "reviewer" | "both" — controls how they're listed on bylines. */
  role_type: "author" | "reviewer" | "both";
}

export interface EEATConfig {
  company: {
    legalName: string;
    brandName: string;
    foundedYear: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    /** Public contact email shown on Contact + footer. */
    contactEmail: string;
    /** Corrections/editorial email. Can equal contactEmail. */
    editorialEmail: string;
    /** Privacy / DPO email. */
    privacyEmail: string;
    /** Legal / DMCA email. */
    legalEmail: string;
    phone: string;
    /** Public social profiles for Organization schema sameAs. */
    socials: { label: string; url: string }[];
  };
  policies: {
    /** How often the team reviews articles — e.g. "every 90 days". */
    reviewCadence: string;
    /** How quickly corrections are issued — e.g. "within 48 hours". */
    correctionTurnaround: string;
    /** Effective date for legal pages (Privacy, Terms). ISO date. */
    legalEffectiveDate: string;
    /** Governing-law jurisdiction for Terms of Service. */
    governingLaw: string;
  };
  authors: AuthorProfile[];
}

/** EDIT THIS OBJECT. Empty strings render as visible placeholders on the site. */
export const eeat: EEATConfig = {
  company: {
    legalName: "",
    brandName: "AdSense Approval Checker",
    foundedYear: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    contactEmail: "",
    editorialEmail: "",
    privacyEmail: "",
    legalEmail: "",
    phone: "",
    socials: [
      // { label: "Twitter / X", url: "https://x.com/your-handle" },
      // { label: "LinkedIn", url: "https://linkedin.com/company/your-co" },
    ],
  },
  policies: {
    reviewCadence: "",
    correctionTurnaround: "",
    legalEffectiveDate: "",
    governingLaw: "",
  },
  authors: [
    // Example shape — DELETE this comment block and add real authors:
    // {
    //   slug: "jane-doe",
    //   name: "Jane Doe",
    //   role: "Editor in Chief",
    //   bio: "Real bio here. Real experience only.",
    //   yearsExperience: 8,
    //   credentials: ["Google AdSense publisher since 2017"],
    //   expertise: ["Google AdSense policy", "Technical SEO"],
    //   socials: [{ label: "LinkedIn", url: "https://linkedin.com/in/..." }],
    //   email: "",
    //   photoUrl: "",
    //   role_type: "both",
    // },
  ],
};

/** True when a string field has not been filled in. */
export const isMissing = (v: string | undefined | null) =>
  !v || v.trim().length === 0;
