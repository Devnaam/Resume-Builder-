"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  FileText,
  Palette,
  Type,
  Layout,
  Check,
  Eye,
  Briefcase,
  Brain,
  Sparkles,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ResumePreview } from "@/components/resume-preview"
import { AIResumeReview } from "@/components/ai-resume-review"
import { JobRecommendations } from "@/components/job-recommendations"
import { TemplateSelector } from "@/components/template-selector"
import { AISuggestionsModal } from "@/components/ai-suggestions-modal"
import { Navbar } from "@/components/navbar"

// Dynamically import browser-only libraries
import dynamic from "next/dynamic"

// Create placeholder functions for SSR
const noop = () => Promise.resolve()
const noopBlob = () => new Blob([""], { type: "text/plain" })

// Client-side only imports
const html2pdfModule = dynamic(() => import("html2pdf.js"), { ssr: false })
const saveAsModule = dynamic(() => import("file-saver").then((mod) => ({ saveAs: mod.saveAs })), { ssr: false })
const docxModule = dynamic(
  () =>
    import("docx").then((mod) => ({
      Document: mod.Document,
      Packer: mod.Packer,
      Paragraph: mod.Paragraph,
      TextRun: mod.TextRun,
      HeadingLevel: mod.HeadingLevel,
    })),
  { ssr: false },
)

export default function ResumePreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template") || "modern"
  const initialTab = searchParams.get("tab") || "customize"

  const { toast } = useToast()
  const resumeRef = useRef(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false)
  const [isGeneratingText, setIsGeneratingText] = useState(false)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  // Resume data from localStorage
  const [resumeData, setResumeData] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(templateId)

  // Resume customization state
  const [customization, setCustomization] = useState({
    colorTheme: getDefaultColorTheme(templateId),
    fontFamily: "font-sans",
    fontSize: 1, // Scale factor
    spacing: "standard",
    sections: {
      contact: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: false,
      certifications: false,
      languages: false,
    },
  })

  // Get default color theme based on template
  function getDefaultColorTheme(templateId) {
    switch (templateId) {
      case "modern":
        return "#2563eb" // Blue
      case "creative":
        return "#7c3aed" // Purple
      case "professional":
        return "#475569" // Slate
      case "minimal":
        return "#111827" // Nearly black
      case "executive":
        return "#9f1239" // Maroon
      case "tech":
        return "#0891b2" // Cyan
      case "finance":
        return "#065f46" // Emerald
      case "design":
        return "#be185d" // Pink
      case "education":
        return "#1d4ed8" // Indigo
      default:
        return "#2563eb" // Default blue
    }
  }

  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Load resume data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("resumeData")
      if (savedData) {
        setResumeData(JSON.parse(savedData))
      }

      // Save the last used template
      localStorage.setItem("lastUsedTemplate", templateId)
    }
  }, [templateId])

  // Update color theme when template changes
  useEffect(() => {
    setCustomization((prev) => ({
      ...prev,
      colorTheme: getDefaultColorTheme(selectedTemplate),
    }))
  }, [selectedTemplate])

  // Update URL when tab changes
  const handleTabChange = (value) => {
    setActiveTab(value)

    // Update URL with the new tab
    const params = new URLSearchParams(searchParams)
    params.set("tab", value)
    router.replace(`/resume/preview?${params.toString()}`, { scroll: false })
  }

  // Handle section toggle
  const toggleSection = (section) => {
    setCustomization((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section],
      },
    }))
  }

  // Handle PDF download
  const handlePdfDownload = async () => {
    if (!isBrowser) return

    setIsGeneratingPdf(true)
    toast({
      title: "Preparing PDF",
      description: "Your resume is being prepared for download.",
    })

    try {
      // Get the resume element
      const element = document.getElementById("resume-for-download")

      if (!element) {
        throw new Error("Resume element not found")
      }

      // Import html2pdf dynamically
      const html2pdf = await html2pdfModule.default

      // Configure html2pdf options
      const opt = {
        margin: 0,
        filename: `${resumeData?.personal?.fullName || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }

      // Generate PDF
      const pdf = await html2pdf().set(opt).from(element).outputPdf()

      // Import saveAs dynamically
      const { saveAs } = await saveAsModule

      // Create a blob and download it
      const blob = new Blob([pdf], { type: "application/pdf" })
      saveAs(blob, `${resumeData?.personal?.fullName || "Resume"}.pdf`)

      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded as PDF.",
      })
    } catch (error) {
      console.error("PDF generation failed:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Handle Word download
  const handleWordDownload = async () => {
    if (!isBrowser) return

    setIsGeneratingDocx(true)
    toast({
      title: "Preparing Word Document",
      description: "Your resume is being prepared for download.",
    })

    try {
      // Import docx dynamically
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await docxModule

      // Create a new document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [
                  new TextRun({
                    text: resumeData?.personal?.fullName || "Your Name",
                    bold: true,
                    size: 36,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData?.personal?.jobTitle || "Your Job Title",
                    size: 28,
                  }),
                ],
              }),
              // Contact information
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${resumeData?.personal?.email || ""} | ${resumeData?.personal?.phone || ""}`,
                    size: 24,
                  }),
                ],
              }),
              // Summary
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [
                  new TextRun({
                    text: "Professional Summary",
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData?.summary || "",
                    size: 24,
                  }),
                ],
              }),
              // Experience
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [
                  new TextRun({
                    text: "Experience",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: {
                  before: 400,
                },
              }),
              ...(resumeData?.experience || []).flatMap((exp) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: exp.jobTitle || "Job Title",
                      bold: true,
                      size: 26,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${exp.company || "Company"} (${exp.startDate || ""} - ${exp.endDate || "Present"})`,
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: exp.description || "",
                      size: 24,
                    }),
                  ],
                }),
              ]),
              // Education
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [
                  new TextRun({
                    text: "Education",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: {
                  before: 400,
                },
              }),
              ...(resumeData?.education || []).flatMap((edu) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: edu.degree || "Degree",
                      bold: true,
                      size: 26,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${edu.school || "School"} (${edu.startDate || ""} - ${edu.endDate || ""})`,
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: edu.description || "",
                      size: 24,
                    }),
                  ],
                }),
              ]),
              // Skills
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [
                  new TextRun({
                    text: "Skills",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: {
                  before: 400,
                },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: (resumeData?.skills || []).join(", "),
                    size: 24,
                  }),
                ],
              }),
            ],
          },
        ],
      })

      // Import saveAs dynamically
      const { saveAs } = await saveAsModule

      // Generate the document
      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${resumeData?.personal?.fullName || "Resume"}.docx`)

      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded as Word document.",
      })
    } catch (error) {
      console.error("Word document generation failed:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating your Word document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDocx(false)
    }
  }

  // Handle text download
  const handleTextDownload = async () => {
    if (!isBrowser) return

    setIsGeneratingText(true)
    toast({
      title: "Preparing Text File",
      description: "Your resume is being prepared for download.",
    })

    try {
      // Create a simple text version of the resume
      let textContent = `${resumeData?.personal?.fullName || "Your Name"}\n`
      textContent += `${resumeData?.personal?.jobTitle || "Your Job Title"}\n`
      textContent += `${resumeData?.personal?.email || ""} | ${resumeData?.personal?.phone || ""}\n\n`

      textContent += `PROFESSIONAL SUMMARY\n`
      textContent += `${resumeData?.summary || ""}\n\n`

      textContent += `EXPERIENCE\n`
      resumeData?.experience?.forEach((exp) => {
        textContent += `${exp.jobTitle || "Job Title"} at ${exp.company || "Company"}\n`
        textContent += `${exp.startDate || ""} - ${exp.endDate || "Present"}\n`
        textContent += `${exp.description || ""}\n\n`
      })

      textContent += `EDUCATION\n`
      resumeData?.education?.forEach((edu) => {
        textContent += `${edu.degree || "Degree"} - ${edu.school || "School"}\n`
        textContent += `${edu.startDate || ""} - ${edu.endDate || ""}\n`
        textContent += `${edu.description || ""}\n\n`
      })

      textContent += `SKILLS\n`
      textContent += resumeData?.skills?.join(", ") || ""

      // Import saveAs dynamically
      const { saveAs } = await saveAsModule

      // Create a blob and download it
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" })
      saveAs(blob, `${resumeData?.personal?.fullName || "Resume"}.txt`)

      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded as text file.",
      })
    } catch (error) {
      console.error("Text file generation failed:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating your text file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingText(false)
    }
  }

  // If resume data is not loaded yet, show loading state
  if (!isBrowser || !resumeData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8 pb-24">
        <div className="container px-4 md:px-6">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Link href="/resume/form" className="inline-flex items-center mr-4">
                  <ArrowLeft className="mr-1 h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Back to Edit</span>
                </Link>
                <h1 className="text-3xl font-bold">Preview Your Resume</h1>
              </div>
              <p className="text-gray-500">Customize, analyze, and download your professional resume.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setIsAiModalOpen(true)} className="flex items-center gap-2" variant="outline">
                <Sparkles className="h-4 w-4" />
                Get AI Suggestions
              </Button>
            </div>
          </div>

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-8 w-full md:w-auto">
              <TabsTrigger value="customize">
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </TabsTrigger>
              <TabsTrigger value="analyze">
                <Brain className="h-4 w-4 mr-2" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="jobs">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Matches
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customize">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Resume Preview - Left side */}
                <div className="lg:col-span-8 order-2 lg:order-1">
                  <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <div id="resume-for-download" ref={resumeRef}>
                      <ResumePreview
                        templateId={selectedTemplate}
                        resumeData={resumeData}
                        customization={customization}
                      />
                    </div>
                  </div>
                </div>

                {/* Customization Panel - Right side */}
                <div className="lg:col-span-4 order-1 lg:order-2">
                  <div className="bg-white border rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
                    <h2 className="text-xl font-semibold mb-6">Customize Your Resume</h2>

                    {/* Template Selection */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Template Style
                      </h3>
                      <TemplateSelector currentTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />
                    </div>

                    {/* Color Theme */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Color Theme
                      </h3>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { name: "Blue", color: "#2563eb" },
                          { name: "Gray", color: "#475569" },
                          { name: "Black", color: "#111827" },
                          { name: "Maroon", color: "#9f1239" },
                          { name: "Green", color: "#16a34a" },
                          { name: "Purple", color: "#7c3aed" },
                          { name: "Cyan", color: "#0891b2" },
                          { name: "Pink", color: "#be185d" },
                          { name: "Orange", color: "#ea580c" },
                          { name: "Teal", color: "#0d9488" },
                        ].map((theme) => (
                          <button
                            key={theme.color}
                            className="w-full aspect-square rounded-full border relative"
                            style={{ backgroundColor: theme.color }}
                            aria-label={`Select ${theme.name} color theme`}
                            onClick={() => setCustomization({ ...customization, colorTheme: theme.color })}
                          >
                            {theme.color === customization.colorTheme && (
                              <div className="absolute inset-0 flex items-center justify-center text-white">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Style */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Font Style
                      </h3>
                      <RadioGroup
                        value={customization.fontFamily}
                        onValueChange={(value) => setCustomization({ ...customization, fontFamily: value })}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="font-sans" id="font-sans" />
                          <Label htmlFor="font-sans" className="font-sans">
                            Sans-serif
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="font-serif" id="font-serif" />
                          <Label htmlFor="font-serif" className="font-serif">
                            Serif
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="font-mono" id="font-mono" />
                          <Label htmlFor="font-mono" className="font-mono">
                            Monospace
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Font Size */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Font Size
                        </h3>
                        <span className="text-xs text-gray-500">
                          {customization.fontSize === 0.9 ? "Small" : customization.fontSize === 1 ? "Medium" : "Large"}
                        </span>
                      </div>
                      <Slider
                        value={[customization.fontSize * 10]}
                        min={9}
                        max={11}
                        step={1}
                        onValueChange={(value) => setCustomization({ ...customization, fontSize: value[0] / 10 })}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Small</span>
                        <span>Medium</span>
                        <span>Large</span>
                      </div>
                    </div>

                    {/* Spacing */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        Spacing
                      </h3>
                      <RadioGroup
                        value={customization.spacing}
                        onValueChange={(value) => setCustomization({ ...customization, spacing: value })}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="compact" id="spacing-compact" />
                          <Label htmlFor="spacing-compact">Compact</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="spacing-standard" />
                          <Label htmlFor="spacing-standard">Standard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="relaxed" id="spacing-relaxed" />
                          <Label htmlFor="spacing-relaxed">Relaxed</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Sections Toggle */}
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Show/Hide Sections
                      </h3>
                      <div className="space-y-3">
                        {[
                          { id: "contact", label: "Contact Information" },
                          { id: "summary", label: "Professional Summary" },
                          { id: "experience", label: "Work Experience" },
                          { id: "education", label: "Education" },
                          { id: "skills", label: "Skills" },
                        ].map((section) => (
                          <div key={section.id} className="flex items-center justify-between">
                            <Label htmlFor={`toggle-${section.id}`} className="cursor-pointer">
                              {section.label}
                            </Label>
                            <Switch
                              id={`toggle-${section.id}`}
                              checked={customization.sections[section.id]}
                              onCheckedChange={() => toggleSection(section.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analyze">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Resume Preview - Left side */}
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <div>
                      <ResumePreview
                        templateId={selectedTemplate}
                        resumeData={resumeData}
                        customization={customization}
                      />
                    </div>
                  </div>
                </div>

                {/* AI Analysis - Right side */}
                <div className="lg:col-span-5 order-1 lg:order-2">
                  <AIResumeReview resumeData={resumeData} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jobs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Resume Preview - Left side */}
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <div>
                      <ResumePreview
                        templateId={selectedTemplate}
                        resumeData={resumeData}
                        customization={customization}
                      />
                    </div>
                  </div>
                </div>

                {/* Job Recommendations - Right side */}
                <div className="lg:col-span-5 order-1 lg:order-2">
                  <JobRecommendations resumeData={resumeData} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Fixed Download Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md py-3 z-10">
        <div className="container px-4 md:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2 hidden md:inline">Ready to download?</span>
            <span className="text-xs text-gray-500 hidden md:inline">
              Your resume is ready for download in multiple formats.
            </span>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
            <Button className="flex items-center gap-2" onClick={handlePdfDownload} disabled={isGeneratingPdf}>
              {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleWordDownload}
              disabled={isGeneratingDocx}
            >
              {isGeneratingDocx ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Download Word
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleTextDownload}
              disabled={isGeneratingText}
            >
              {isGeneratingText ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Save as Text
            </Button>
          </div>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      {isBrowser && (
        <AISuggestionsModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} resumeData={resumeData} />
      )}
    </div>
  )
}
