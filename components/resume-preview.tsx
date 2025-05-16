"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import templates to avoid SSR issues
const ModernTemplate = dynamic(() => import("./resume-templates/modern-template"), { ssr: false })
const ModernPlusTemplate = dynamic(() => import("./resume-templates/modern-plus-template"), { ssr: false })
const CreativeTemplate = dynamic(() => import("./resume-templates/creative-template"), { ssr: false })
const ProfessionalTemplate = dynamic(() => import("./resume-templates/professional-template"), { ssr: false })
const MinimalTemplate = dynamic(() => import("./resume-templates/minimal-template"), { ssr: false })
const MinimalistTemplate = dynamic(() => import("./resume-templates/minimalist-template"), { ssr: false })
const ExecutiveTemplate = dynamic(() => import("./resume-templates/executive-template"), { ssr: false })
const TechTemplate = dynamic(() => import("./resume-templates/tech-template"), { ssr: false })
const FinanceTemplate = dynamic(() => import("./resume-templates/finance-template"), { ssr: false })
const DesignTemplate = dynamic(() => import("./resume-templates/design-template"), { ssr: false })
const EducationTemplate = dynamic(() => import("./resume-templates/education-template"), { ssr: false })
const ElegantTemplate = dynamic(() => import("./resume-templates/elegant-template"), { ssr: false })

export function ResumePreview({ templateId, resumeData, customization = null }) {
  const [mounted, setMounted] = useState(false)

  // This is needed to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[1000px] bg-white"></div>
  }

  // Apply font size scaling to the container
  const fontSizeScale = customization?.fontSize || 1
  const containerStyle = {
    fontSize: `${fontSizeScale * 100}%`,
    height: "1000px", // Fixed height for consistent rendering
  }

  // Apply spacing option
  let spacingClass = ""
  if (customization?.spacing === "compact") {
    spacingClass = "space-y-2"
  } else if (customization?.spacing === "relaxed") {
    spacingClass = "space-y-6"
  } else {
    spacingClass = "space-y-4" // standard
  }

  // Create customization object with spacing class
  const templateCustomization = customization
    ? {
        ...customization,
        spacing: spacingClass,
      }
    : null

  // Render the selected template
  switch (templateId) {
    case "modern":
      return (
        <div style={containerStyle}>
          <ModernTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "modern-plus":
      return (
        <div style={containerStyle}>
          <ModernPlusTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "creative":
      return (
        <div style={containerStyle}>
          <CreativeTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "professional":
      return (
        <div style={containerStyle}>
          <ProfessionalTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "minimal":
      return (
        <div style={containerStyle}>
          <MinimalTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "minimalist":
      return (
        <div style={containerStyle}>
          <MinimalistTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "executive":
      return (
        <div style={containerStyle}>
          <ExecutiveTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "tech":
      return (
        <div style={containerStyle}>
          <TechTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "finance":
      return (
        <div style={containerStyle}>
          <FinanceTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "design":
      return (
        <div style={containerStyle}>
          <DesignTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "education":
      return (
        <div style={containerStyle}>
          <EducationTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    case "elegant":
      return (
        <div style={containerStyle}>
          <ElegantTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
    default:
      return (
        <div style={containerStyle}>
          <ModernTemplate resumeData={resumeData} customization={templateCustomization} />
        </div>
      )
  }
}
