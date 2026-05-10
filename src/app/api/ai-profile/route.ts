import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, skills, role } = body;

    if (!name || !skills) {
      return NextResponse.json(
        { error: "Name and skills are required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const systemPrompt =
      "You are an expert freelance profile writer for SkillBazaar PK, a Pakistani freelance marketplace. Generate a professional, compelling freelancer profile based on the provided information. The profile should be written in English, sound natural and professional, and highlight the freelancer's strengths. Return ONLY valid JSON (no markdown, no code blocks) with exactly this structure: {\"headline\": \"A catchy professional headline\", \"bio\": \"A compelling 2-3 sentence bio\", \"skills\": [\"skill1\", \"skill2\", \"skill3\", \"skill4\", \"skill5\"], \"hourlyRate\": number (in PKR between 500 and 15000), \"tagline\": \"A short catchy tagline\"}. The profile should mention Pakistani context where relevant.";

    const userMessage = `Generate a professional freelance profile for:
Name: ${name}
Primary Skills: ${skills}
Role: ${role || "freelancer"}

Please create an impressive profile that stands out on a freelance marketplace.`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      thinking: { type: "disabled" },
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "Failed to generate profile" },
        { status: 500 }
      );
    }

    // Try to parse the response as JSON
    let profile;
    try {
      // Strip markdown code blocks if present
      const cleaned = raw
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      profile = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Invalid profile format generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("AI Profile generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong while generating your profile" },
      { status: 500 }
    );
  }
}
