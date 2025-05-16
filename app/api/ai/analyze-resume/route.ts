import { NextResponse } from "next/server"

// Update the API key handling to use environment variables or fallback to the provided key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function POST(request: Request) {
  try {
    const { resumeData } = await request.json()

    // Format resume data for the prompt
    const formattedResume = formatResumeForPrompt(resumeData)

    const prompt = `
      Analyze this resume and provide detailed feedback to improve it:
      
      ${formattedResume}
      
      Please provide feedback in the following categories:
      1. Overall Impression (strengths and weaknesses)
      2. Content Quality (specific suggestions for each section)
      3. Keywords and ATS Optimization
      4. Formatting and Structure
      5. Action Items (prioritized list of improvements)
      
      Format your response as JSON with the following structure:
      {
        "overallImpression": "string",
        "contentQuality": {
          "summary": "string",
          "experience": "string",
          "education": "string",
          "skills": "string"
        },
        "keywordOptimization": "string",
        "formattingStructure": "string",
        "actionItems": ["string", "string", "string"]
      }
    `

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)

      // If we get a permission denied error, use mock data instead
      if (errorData.error?.status === "PERMISSION_DENIED" || errorData.error?.code === 403) {
        return NextResponse.json({ analysis: generateMockAnalysis(await request.json()) })
      }

      return NextResponse.json({ error: "Failed to analyze resume", details: errorData }, { status: response.status })
    }

    const data = await response.json()

    // Extract the text response from Gemini
    const textResponse = data.candidates[0].content.parts[0].text

    // Parse the JSON from the text response
    let jsonResponse
    try {
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch =
        textResponse.match(/```json\n([\s\S]*?)\n```/) ||
        textResponse.match(/```\n([\s\S]*?)\n```/) ||
        textResponse.match(/{[\s\S]*?}/)

      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse
      jsonResponse = JSON.parse(jsonString)
    } catch (e) {
      console.error("Error parsing JSON from Gemini response:", e)
      // If parsing fails, return the raw text
      return NextResponse.json({ analysis: { rawResponse: textResponse } })
    }

    return NextResponse.json({ analysis: jsonResponse })
  } catch (error) {
    console.error("Error in analyze-resume API route:", error)
    // Return mock data as fallback
    const { resumeData } = await request.json()
    return NextResponse.json({ analysis: generateMockAnalysis(resumeData) })
  }
}

function formatResumeForPrompt(resumeData) {
  let formattedResume = ""

  // Personal Information
  formattedResume += "# PERSONAL INFORMATION\n"
  formattedResume += `Name: ${resumeData.personal?.fullName || "Not provided"}\n`
  formattedResume += `Job Title: ${resumeData.personal?.jobTitle || "Not provided"}\n`
  formattedResume += `Email: ${resumeData.personal?.email || "Not provided"}\n`
  formattedResume += `Phone: ${resumeData.personal?.phone || "Not provided"}\n`
  formattedResume += `Address: ${resumeData.personal?.address || "Not provided"}\n`
  formattedResume += `LinkedIn: ${resumeData.personal?.linkedin || "Not provided"}\n`
  formattedResume += `Website: ${resumeData.personal?.website || "Not provided"}\n\n`

  // Professional Summary
  formattedResume += "# PROFESSIONAL SUMMARY\n"
  formattedResume += `${resumeData.summary || "Not provided"}\n\n`

  // Experience
  formattedResume += "# WORK EXPERIENCE\n"
  if (resumeData.experience && resumeData.experience.length > 0) {
    resumeData.experience.forEach((exp, index) => {
      formattedResume += `## Position ${index + 1}\n`
      formattedResume += `Job Title: ${exp.jobTitle || "Not provided"}\n`
      formattedResume += `Company: ${exp.company || "Not provided"}\n`
      formattedResume += `Duration: ${exp.startDate || "Start Date"} - ${exp.endDate || "Present"}\n`
      formattedResume += `Description:\n${exp.description || "Not provided"}\n\n`
    })
  } else {
    formattedResume += "No work experience provided.\n\n"
  }

  // Education
  formattedResume += "# EDUCATION\n"
  if (resumeData.education && resumeData.education.length > 0) {
    resumeData.education.forEach((edu, index) => {
      formattedResume += `## Education ${index + 1}\n`
      formattedResume += `Degree: ${edu.degree || "Not provided"}\n`
      formattedResume += `School: ${edu.school || "Not provided"}\n`
      formattedResume += `Duration: ${edu.startDate || "Start Date"} - ${edu.endDate || "End Date"}\n`
      formattedResume += `Description:\n${edu.description || "Not provided"}\n\n`
    })
  } else {
    formattedResume += "No education provided.\n\n"
  }

  // Skills
  formattedResume += "# SKILLS\n"
  if (resumeData.skills && resumeData.skills.length > 0) {
    formattedResume += resumeData.skills.join(", ") + "\n\n"
  } else {
    formattedResume += "No skills provided.\n\n"
  }

  return formattedResume
}

// Generate mock analysis data as a fallback
function generateMockAnalysis(resumeData) {
  const hasSummary = resumeData.summary && resumeData.summary.length > 50
  const hasDetailedExperience = resumeData.experience?.some((exp) => exp.description && exp.description.length > 100)
  const hasEducation = resumeData.education?.length > 0
  const hasSkills = resumeData.skills?.length > 3

  // Calculate a mock score based on resume completeness
  const completenessScore = [
    hasSummary ? 25 : 0,
    hasDetailedExperience ? 30 : resumeData.experience?.length > 0 ? 15 : 0,
    hasEducation ? 20 : 0,
    hasSkills ? 25 : resumeData.skills?.length > 0 ? 10 : 0,
  ].reduce((sum, score) => sum + score, 0)

  // Generate appropriate feedback based on completeness
  const overallImpression =
    completenessScore >= 80
      ? "Your resume is well-structured and contains good information about your background and skills. It presents a professional image and effectively communicates your qualifications."
      : completenessScore >= 50
        ? "Your resume has a good foundation but could benefit from some improvements to make it more impactful and comprehensive."
        : "Your resume needs significant improvement to effectively showcase your qualifications and stand out to employers."

  return {
    overallImpression: overallImpression,
    contentQuality: {
      summary: hasSummary
        ? "Your professional summary effectively highlights your key qualifications and career focus."
        : "Your summary needs to be more comprehensive. Consider adding a 3-5 sentence overview that highlights your key qualifications, experience, and career goals.",
      experience: hasDetailedExperience
        ? "Your work experience section is detailed and showcases your responsibilities and achievements well."
        : "Your experience section needs more detail. Add specific accomplishments with measurable results and use action verbs to describe your responsibilities.",
      education: hasEducation
        ? "Your education section is well-structured and provides the necessary information."
        : "Consider adding more details to your education section, including relevant coursework, academic achievements, or extracurricular activities.",
      skills: hasSkills
        ? "Your skills section effectively showcases your technical and professional abilities."
        : "Expand your skills section to include more industry-specific technical skills and relevant soft skills.",
    },
    keywordOptimization:
      completenessScore >= 70
        ? "Your resume includes relevant industry keywords that will help with ATS screening."
        : "Add more industry-specific keywords throughout your resume to improve ATS compatibility and visibility to recruiters.",
    formattingStructure:
      "Ensure consistent formatting throughout your resume. Use bullet points for experience and achievements, maintain consistent spacing, and use a clean, professional font.",
    actionItems: [
      "Add more quantifiable achievements with specific metrics and results",
      "Incorporate more industry-specific keywords relevant to your target roles",
      "Ensure consistent formatting and bullet point structure throughout",
      "Tailor your resume for each specific job application",
      "Keep your resume concise and focused on the most relevant information",
    ],
  }
}
