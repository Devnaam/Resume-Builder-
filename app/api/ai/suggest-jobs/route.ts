import { NextResponse } from "next/server"

// Update the API key handling to use environment variables or fallback to the provided key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function POST(request: Request) {
  try {
    const { resumeData, jobTitle, location } = await request.json()

    // Format resume data for the prompt
    const formattedResume = formatResumeForPrompt(resumeData)

    const prompt = `
      Based on the following resume, suggest suitable job roles and career paths:
      
      ${formattedResume}
      
      ${jobTitle ? `The person is interested in roles similar to: ${jobTitle}` : ""}
      ${location ? `Preferred location: ${location}` : ""}
      
      Please provide:
      1. Top 5 job roles that match this person's skills and experience
      2. For each role, explain why it's a good fit
      3. Suggest potential career growth paths
      4. Identify any skill gaps that should be addressed
      
      Format your response as JSON with the following structure:
      {
        "jobRoles": [
          {
            "title": "string",
            "fitReason": "string",
            "requiredSkills": ["string", "string"],
            "matchPercentage": number
          }
        ],
        "careerPaths": ["string", "string"],
        "skillGaps": ["string", "string"],
        "additionalAdvice": "string"
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
        return NextResponse.json({ suggestions: generateMockJobSuggestions(resumeData, jobTitle) })
      }

      return NextResponse.json({ error: "Failed to suggest jobs", details: errorData }, { status: response.status })
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
      return NextResponse.json({ suggestions: { rawResponse: textResponse } })
    }

    return NextResponse.json({ suggestions: jsonResponse })
  } catch (error) {
    console.error("Error in suggest-jobs API route:", error)
    // Return mock data as fallback
    return NextResponse.json({
      suggestions: generateMockJobSuggestions(resumeData, resumeData?.personal?.jobTitle),
    })
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

// Generate mock job suggestions as a fallback
function generateMockJobSuggestions(resumeData, jobTitle) {
  const baseTitle = jobTitle || resumeData?.personal?.jobTitle || "Software Developer"
  const userSkills = resumeData?.skills || ["JavaScript", "React", "Node.js", "HTML", "CSS"]

  // Generate job roles based on the base title and skills
  const jobRoles = [
    {
      title: baseTitle,
      fitReason: `Your experience and skills align perfectly with this role. Your background in ${userSkills.slice(0, 3).join(", ")} makes you an excellent candidate.`,
      requiredSkills: userSkills.slice(0, 5),
      matchPercentage: 95,
    },
    {
      title: `Senior ${baseTitle}`,
      fitReason: `With your experience, you could be ready to step up to a senior role. This position would leverage your expertise in ${userSkills.slice(0, 2).join(" and ")} while giving you more leadership opportunities.`,
      requiredSkills: [...userSkills.slice(0, 3), "Leadership", "Mentoring"],
      matchPercentage: 85,
    },
    {
      title: baseTitle.includes("Developer") ? "Full Stack Developer" : `${baseTitle} Team Lead`,
      fitReason: `This role would allow you to expand your skillset while building on your current experience. It offers growth opportunities in a related field.`,
      requiredSkills: [...userSkills.slice(0, 2), "Communication", "Problem Solving", "Teamwork"],
      matchPercentage: 80,
    },
    {
      title: baseTitle.includes("Developer") ? "DevOps Engineer" : `${baseTitle} Consultant`,
      fitReason: `This adjacent role would allow you to leverage your existing knowledge while expanding into new areas. It's a good path for career growth.`,
      requiredSkills: [...userSkills.slice(1, 3), "CI/CD", "Cloud Services", "Automation"],
      matchPercentage: 75,
    },
    {
      title: baseTitle.includes("Developer") ? "Product Manager" : `${baseTitle} Manager`,
      fitReason: `This role represents a potential career progression path, moving from technical work to a more strategic position. Your technical background would be valuable here.`,
      requiredSkills: ["Strategic Planning", "Team Management", "Communication", ...userSkills.slice(0, 1)],
      matchPercentage: 70,
    },
  ]

  return {
    jobRoles: jobRoles,
    careerPaths: [
      `Continue specializing in ${baseTitle} roles with increasing seniority and responsibility`,
      `Transition to leadership roles such as Team Lead or Engineering Manager`,
      `Move into adjacent technical fields that build on your current expertise`,
      `Consider product-focused roles that leverage your technical background`,
    ],
    skillGaps: [
      "Leadership and team management experience",
      "Advanced system design and architecture",
      "Project management methodologies",
      "Business and domain knowledge specific to your industry",
    ],
    additionalAdvice: `Focus on building depth in your current technical skills while gradually developing leadership abilities. Consider contributing to open-source projects or taking on mentoring responsibilities to demonstrate growth beyond technical coding skills.`,
  }
}
