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
      Based on the following resume information, suggest relevant professional skills that would strengthen this person's resume:
      
      ${formattedResume}
      
      Please provide:
      1. Technical skills relevant to their field
      2. Soft skills that complement their experience
      3. Industry-specific skills that would be valuable
      
      Format your response as a simple list of skills, with no additional text or explanations.
      Provide at least 10-15 skills total.
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
        return NextResponse.json({ skills: generateMockSkills(resumeData) })
      }

      return NextResponse.json({ error: "Failed to generate skills", details: errorData }, { status: response.status })
    }

    const data = await response.json()
    const skillsText = data.candidates[0].content.parts[0].text.trim()

    // Parse the skills from the response
    // This handles various formats the AI might return
    const skills = parseSkillsFromText(skillsText)

    return NextResponse.json({ skills })
  } catch (error) {
    console.error("Error in generate-skills API route:", error)
    // Return mock data as fallback
    return NextResponse.json({ skills: [] })
  }
}

function formatResumeForPrompt(resumeData) {
  let formattedResume = ""

  // Personal Information
  formattedResume += "# PERSONAL INFORMATION\n"
  formattedResume += `Job Title: ${resumeData.personal?.jobTitle || "Not provided"}\n\n`

  // Experience
  formattedResume += "# WORK EXPERIENCE\n"
  if (resumeData.experience && resumeData.experience.length > 0) {
    resumeData.experience.forEach((exp, index) => {
      formattedResume += `## Position ${index + 1}\n`
      formattedResume += `Job Title: ${exp.jobTitle || "Not provided"}\n`
      formattedResume += `Company: ${exp.company || "Not provided"}\n`
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
      formattedResume += `School: ${edu.school || "Not provided"}\n\n`
    })
  } else {
    formattedResume += "No education provided.\n\n"
  }

  // Existing Skills
  formattedResume += "# EXISTING SKILLS\n"
  if (resumeData.skills && resumeData.skills.length > 0) {
    formattedResume += resumeData.skills.join(", ") + "\n\n"
  } else {
    formattedResume += "No skills provided.\n\n"
  }

  return formattedResume
}

// Parse skills from various text formats the AI might return
function parseSkillsFromText(text) {
  // Remove any markdown formatting
  const cleanText = text.replace(/^#.*$/gm, "").trim()

  // Try to extract skills from different formats
  let skills = []

  // Try bullet points or numbered lists
  const bulletMatches = cleanText.match(/[•\-*\d+.]\s*([^•\-*\d.][^\n]+)/g)
  if (bulletMatches && bulletMatches.length > 0) {
    skills = bulletMatches.map((item) => item.replace(/^[•\-*\d+.]\s*/, "").trim())
  } else {
    // Try comma or newline separated
    skills = cleanText
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  // Remove any duplicates and empty items
  return [...new Set(skills)].filter((skill) => skill.length > 0)
}

// Generate mock skills as a fallback
function generateMockSkills(resumeData) {
  const jobTitle = resumeData.personal?.jobTitle?.toLowerCase() || ""
  const existingSkills = resumeData.skills || []

  // Base skills that are valuable across many fields
  const baseSkills = [
    "Project Management",
    "Team Leadership",
    "Strategic Planning",
    "Problem Solving",
    "Communication",
    "Time Management",
    "Critical Thinking",
    "Attention to Detail",
    "Collaboration",
    "Adaptability",
  ]

  // Technical skills based on job title
  let technicalSkills = []

  if (jobTitle.includes("developer") || jobTitle.includes("engineer") || jobTitle.includes("programmer")) {
    technicalSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "REST APIs",
      "Git",
      "CI/CD",
      "AWS",
      "Docker",
      "Database Design",
      "System Architecture",
      "Agile Methodologies",
    ]
  } else if (jobTitle.includes("design")) {
    technicalSkills = [
      "UI/UX Design",
      "Figma",
      "Adobe Creative Suite",
      "Wireframing",
      "Prototyping",
      "User Research",
      "Design Systems",
      "Typography",
      "Color Theory",
      "Responsive Design",
      "Accessibility Standards",
      "Information Architecture",
    ]
  } else if (jobTitle.includes("market")) {
    technicalSkills = [
      "Digital Marketing",
      "SEO/SEM",
      "Content Strategy",
      "Social Media Marketing",
      "Email Marketing",
      "Google Analytics",
      "CRM Systems",
      "A/B Testing",
      "Marketing Automation",
      "Brand Management",
      "Market Research",
      "Campaign Management",
    ]
  } else if (jobTitle.includes("data") || jobTitle.includes("analyst")) {
    technicalSkills = [
      "SQL",
      "Python",
      "Data Visualization",
      "Statistical Analysis",
      "Tableau",
      "Power BI",
      "Excel Advanced Functions",
      "ETL Processes",
      "Machine Learning",
      "Data Modeling",
      "Business Intelligence",
      "Predictive Analytics",
    ]
  } else if (jobTitle.includes("manager") || jobTitle.includes("director")) {
    technicalSkills = [
      "Team Leadership",
      "Strategic Planning",
      "Budget Management",
      "Performance Evaluation",
      "Stakeholder Management",
      "Risk Assessment",
      "Process Improvement",
      "Change Management",
      "Resource Allocation",
      "KPI Development",
      "Business Strategy",
      "Vendor Management",
    ]
  } else {
    technicalSkills = [
      "Microsoft Office Suite",
      "Data Analysis",
      "Research",
      "Reporting",
      "Presentation Skills",
      "CRM Software",
      "Project Coordination",
      "Process Documentation",
      "Client Relationship Management",
      "Quality Assurance",
      "Technical Writing",
      "Training & Development",
    ]
  }

  // Combine all skills and filter out existing ones
  const allSkills = [...baseSkills, ...technicalSkills]
  const newSkills = allSkills.filter((skill) => !existingSkills.includes(skill))

  // Return a mix of new skills (up to 15)
  return newSkills.slice(0, 15)
}
