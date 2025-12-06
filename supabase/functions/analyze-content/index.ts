import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl } = await req.json();
    
    if (!websiteUrl) {
      throw new Error("Website URL is required");
    }

    console.log("Analyzing content for:", websiteUrl);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are an expert content analyst specializing in Google AdSense eligibility. Analyze this website URL and provide recommendations for content improvement.

Website: ${websiteUrl}

Based on typical AdSense requirements and best practices, provide a detailed analysis in the following JSON format:

{
  "overallQuality": "excellent" | "good" | "needs_improvement" | "poor",
  "score": <number 0-100>,
  "summary": "<2-3 sentence summary of the content quality>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "recommendations": [
    {
      "category": "<category name>",
      "issue": "<specific issue identified>",
      "suggestion": "<actionable improvement suggestion>",
      "priority": "high" | "medium" | "low"
    }
  ]
}

Consider these aspects:
1. Content originality and uniqueness
2. Article length and depth (800+ words recommended)
3. Grammar and readability
4. Topic focus and niche clarity
5. User engagement potential
6. SEO optimization
7. Content freshness and update frequency
8. Value provided to readers

Provide 3-5 specific, actionable recommendations. Be realistic and helpful.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a content quality analyst. Always respond with valid JSON only, no markdown or code blocks." 
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let analysis;
    try {
      // Clean up potential markdown code blocks
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Provide a fallback response
      analysis = {
        overallQuality: "needs_improvement",
        score: 65,
        summary: "Unable to perform detailed analysis. Based on general best practices, ensure your content is original, well-written, and provides value to readers.",
        strengths: ["Website is accessible"],
        recommendations: [
          {
            category: "Content Quality",
            issue: "Unable to access content for detailed analysis",
            suggestion: "Ensure your website has high-quality, original content with at least 15-20 articles of 800+ words each.",
            priority: "high"
          },
          {
            category: "Essential Pages",
            issue: "Verify essential pages exist",
            suggestion: "Make sure you have Privacy Policy, Contact, and About pages.",
            priority: "high"
          },
          {
            category: "User Experience",
            issue: "Review overall user experience",
            suggestion: "Ensure your site is mobile-friendly, fast-loading, and easy to navigate.",
            priority: "medium"
          }
        ]
      };
    }

    console.log("Analysis complete:", analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-content:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
