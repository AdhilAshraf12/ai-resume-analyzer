import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a professional resume analyzer. Analyze how well the following resume matches the job description.

Return your response as a JSON object with exactly this structure:
{
  "score": <number 0-100>,
  "matchedKeywords": [<list of keywords found in both resume and job description>],
  "missingKeywords": [<list of important keywords from job description missing in resume>],
  "strengths": [<list of strong points>],
  "gaps": [<list of gaps or weaknesses>],
  "suggestions": [<list of actionable improvement suggestions>]
}

Resume:
${resume}

Job Description:
${jobDescription}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
