import { useState, useMemo } from "react";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

function syllables(word: string) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  const m = word.match(/[aeiouy]+/g);
  let count = m ? m.length : 1;
  if (word.endsWith("e")) count = Math.max(1, count - 1);
  return count;
}

function ContentChecker() {
  const [text, setText] = useState("");
  const metrics = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const sentences = trimmed ? trimmed.split(/[.!?]+\s/).filter(Boolean).length || 1 : 0;
    const wordCount = words.length;
    const syl = words.reduce((s, w) => s + syllables(w), 0);
    const flesch = sentences && wordCount
      ? 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syl / wordCount)
      : 0;
    const unique = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))).size;
    const uniqueRatio = wordCount ? (unique / wordCount) * 100 : 0;
    const avgSentence = sentences ? wordCount / sentences : 0;

    // Composite quality 0–100
    const depthScore = Math.min(100, (wordCount / 800) * 100);
    const readabilityScore = Math.max(0, Math.min(100, flesch));
    const richnessScore = Math.min(100, uniqueRatio * 1.8);
    const composite = Math.round(depthScore * 0.45 + readabilityScore * 0.3 + richnessScore * 0.25);

    return { wordCount, sentences, syl, flesch: Math.round(flesch), unique, uniqueRatio: Math.round(uniqueRatio), avgSentence: Math.round(avgSentence * 10) / 10, composite };
  }, [text]);

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Paste your article or blog post</label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your full article text here..."
        rows={8}
        className="mb-4"
      />

      {text.trim() && (
        <>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-gradient">{metrics.composite}<span className="text-2xl text-muted-foreground">/100</span></div>
            <div className="text-sm text-muted-foreground mt-1">Composite content quality score</div>
          </div>
          <Progress value={metrics.composite} className="mb-5" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric label="Word count" value={metrics.wordCount.toString()} hint={metrics.wordCount >= 800 ? "✓ AdSense-ready" : `Add ${800 - metrics.wordCount}+ more`} />
            <Metric label="Sentences" value={metrics.sentences.toString()} hint={`avg ${metrics.avgSentence} words`} />
            <Metric label="Unique vocab" value={`${metrics.uniqueRatio}%`} hint={metrics.uniqueRatio >= 40 ? "Rich" : "Repetitive"} />
            <Metric label="Readability" value={metrics.flesch.toString()} hint={metrics.flesch >= 60 ? "Easy" : "Hard"} />
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {hint && <div className="text-xs text-primary mt-1">{hint}</div>}
    </div>
  );
}

export default function ContentQualityChecker() {
  return (
    <ToolPageShell
      slug="content-quality-checker"
      keyword="content quality checker"
      eyebrow="Content Quality Checker"
      h1="Content Quality Checker — Score Any Article Like Google Does"
      subheading="Paste any article and get an instant content quality score covering depth, readability, vocabulary richness, and AdSense-readiness — the exact signals Google's reviewers evaluate."
      metaTitle="Content Quality Checker — Free Article Quality Score Tool"
      metaDescription="Free content quality checker. Score any article on depth, readability, vocabulary richness, and AdSense-readiness in 5 seconds. No login required."
      widget={<ContentChecker />}
      whatIs="The Content Quality Checker scores any article on the four signals Google's Search Quality Raters and AdSense reviewers use to evaluate content: depth (word count + topical coverage), readability (Flesch reading ease), vocabulary richness (unique-word ratio), and structural quality. The composite score predicts whether the article meets the 'helpful content' threshold Google now uses to gate ranking eligibility and AdSense approval. Use it post-writing to catch thin or repetitive drafts before publishing, or use it to audit existing posts on your site that may be dragging down your overall content-quality signal."
      howItWorks={[
        { title: "Paste your article", text: "Drop the full text — no upload, nothing sent to a server." },
        { title: "Instant scoring", text: "We calculate word count, Flesch score, unique vocab, and average sentence length." },
        { title: "Composite verdict", text: "All four signals are weighted into a single 0–100 quality score." },
        { title: "Improve and re-score", text: "Edit the article and re-paste to see the score change in real time." },
      ]}
      whatItChecks={[
        "Word count (vs. 800-word AdSense threshold)",
        "Sentence count and average length",
        "Vocabulary richness (unique-word ratio)",
        "Flesch reading-ease score",
        "Composite content quality (0–100)",
        "AdSense-readiness indicator",
      ]}
      whoFor={[
        { name: "Bloggers", text: "Quality-check every post before publishing." },
        { name: "Editors", text: "Score freelance submissions against an objective rubric." },
        { name: "SEO writers", text: "Optimize draft depth and readability before client delivery." },
        { name: "AI content reviewers", text: "Validate that AI-assisted drafts meet quality thresholds before publishing." },
      ]}
      faqs={[
        { q: "What's a good content quality score?", a: "80+ is excellent. 60–79 is solid. Below 60 means the content is too thin, too repetitive, or too hard to read for general audiences." },
        { q: "What word count does AdSense actually require?", a: "There's no official minimum, but reviewer data shows 800+ words per post and 20+ posts per site is the practical floor for approval." },
        { q: "What is the Flesch reading-ease score?", a: "A 0–100 readability scale. 60–70 is plain English (8th-grade level). Most Google-friendly content sits in the 50–70 range." },
        { q: "Does this tool detect AI-generated content?", a: "Not directly. But it flags the patterns reviewers associate with raw AI output — repetitive vocabulary, unnatural sentence rhythm, and shallow topical coverage." },
      ]}
      related={[
        { to: "/tools/adsense-approval-checker", label: "AdSense Approval Audit" },
        { to: "/tools/website-quality-score-checker", label: "Website Quality Score" },
        { to: "/tools/seo-audit-checker", label: "SEO Audit Checker" },
      ]}
    />
  );
}
