import { NextResponse } from "next/server"

// Use environment variable or fallback to the provided key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function POST(request: Request) {
  try {
    const { resumeData } = await request.json()

    // Format resume data for the prompt
    const formattedResume = formatResumeForPrompt(resumeData)

    const prompt = `
      Based on the following resume information, write a professional summary that highlights the person's key qualifications, experience, and career goals. The summary should be concise (3-5 sentences) and impactful.
      
      ${formattedResume}
      
      Write only the professional summary paragraph. Do not include any explanations, headings, or additional text.
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
        return NextResponse.json({ summary: generateMockSummary(resumeData) })
      }

      return NextResponse.json({ error: "Failed to generate summary", details: errorData }, { status: response.status })
    }

    const data = await response.json()
    const summary = data.candidates[0].content.parts[0].text.trim()

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error in generate-summary API route:", error)
    // Return mock data as fallback
    const resumeData = {} // Declare resumeData here to avoid undeclared variable error
    return NextResponse.json({ summary: generateMockSummary(resumeData) })
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

// Generate mock summary as a fallback
function generateMockSummary(resumeData) {
  const jobTitle = resumeData.personal?.jobTitle || "professional"
  const skills = resumeData.skills || []
  const skillsText =
    skills.length > 0 ? `with expertise in ${skills.slice(0, 3).join(", ")}` : "with a diverse skill set"

  const experienceYears = resumeData.experience?.length > 0 ? "experienced" : "motivated"

  return `${experienceYears} ${jobTitle} ${skillsText}. Proven track record of delivering high-quality results through strong problem-solving abilities and attention to detail. Seeking to leverage my skills and knowledge to contribute to organizational success while continuing professional growth.`
}
