"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Plus, Sparkles, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ResumePreview } from "@/components/resume-preview"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ResumeFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template") || "modern"
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [showPreview, setShowPreview] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  // Resume data state
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    education: [
      {
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    experience: [
      {
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML/CSS"],
  })

  const handlePersonalChange = (e) => {
    const { name, value } = e.target
    setResumeData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value,
      },
    }))
  }

  const handleSummaryChange = (e) => {
    setResumeData((prev) => ({
      ...prev,
      summary: e.target.value,
    }))
  }

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target
    setResumeData((prev) => {
      const newEducation = [...prev.education]
      newEducation[index] = {
        ...newEducation[index],
        [name]: value,
      }
      return {
        ...prev,
        education: newEducation,
      }
    })
  }

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  const removeEducation = (index) => {
    setResumeData((prev) => {
      const newEducation = [...prev.education]
      newEducation.splice(index, 1)
      return {
        ...prev,
        education: newEducation,
      }
    })
  }

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target
    setResumeData((prev) => {
      const newExperience = [...prev.experience]
      newExperience[index] = {
        ...newExperience[index],
        [name]: value,
      }
      return {
        ...prev,
        experience: newExperience,
      }
    })
  }

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          jobTitle: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (index) => {
    setResumeData((prev) => {
      const newExperience = [...prev.experience]
      newExperience.splice(index, 1)
      return {
        ...prev,
        experience: newExperience,
      }
    })
  }

  const handleSkillChange = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault()
      const newSkill = e.target.value.trim()
      if (!resumeData.skills.includes(newSkill)) {
        setResumeData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }))
        e.target.value = ""
      }
    }
  }

  const addSkill = (e) => {
    e.preventDefault()
    const input = document.getElementById("skill-input")
    const newSkill = input.value.trim()
    if (newSkill !== "" && !resumeData.skills.includes(newSkill)) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }))
      input.value = ""
    }
    input.focus()
  }

  const removeSkill = (skill) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleAiSummary = async () => {
    setIsLoadingAI(true)
    toast({
      title: "AI Suggestion",
      description: "Generating a professional summary...",
    })

    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeData }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()

      if (data.summary) {
        setResumeData((prev) => ({
          ...prev,
          summary: data.summary,
        }))

        toast({
          title: "AI Summary Generated",
          description: "Your professional summary has been created.",
        })
      } else {
        throw new Error("No summary returned from API")
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleAiExperience = async (index) => {
    setIsLoadingAI(true)
    toast({
      title: "AI Suggestion",
      description: "Generating job responsibilities and achievements...",
    })

    try {
      const experience = resumeData.experience[index]
      const response = await fetch("/api/ai/generate-experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: experience.jobTitle,
          company: experience.company,
          industry: "", // Could add an industry field to the form in the future
          existingDescription: experience.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate experience description")
      }

      const data = await response.json()

      if (data.description) {
        const newExperience = [...resumeData.experience]
        newExperience[index].description = data.description

        setResumeData((prev) => ({
          ...prev,
          experience: newExperience,
        }))

        toast({
          title: "AI Description Generated",
          description: "Your job responsibilities and achievements have been created.",
        })
      } else {
        throw new Error("No description returned from API")
      }
    } catch (error) {
      console.error("Error generating experience:", error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your job description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleAiSkills = async () => {
    setIsLoadingAI(true)
    toast({
      title: "AI Suggestion",
      description: "Generating relevant skills based on your profile...",
    })

    try {
      const response = await fetch("/api/ai/generate-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeData }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate skills")
      }

      const data = await response.json()

      if (data.skills && data.skills.length > 0) {
        // Combine existing skills with new ones, removing duplicates
        const allSkills = [...new Set([...resumeData.skills, ...data.skills])]

        setResumeData((prev) => ({
          ...prev,
          skills: allSkills,
        }))

        toast({
          title: "AI Skills Generated",
          description: `${data.skills.length} relevant skills have been added to your resume.`,
        })
      } else {
        throw new Error("No skills returned from API")
      }
    } catch (error) {
      console.error("Error generating skills:", error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating skills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleNext = () => {
    if (activeTab === "personal") setActiveTab("summary")
    else if (activeTab === "summary") setActiveTab("education")
    else if (activeTab === "education") setActiveTab("experience")
    else if (activeTab === "experience") setActiveTab("skills")
    else if (activeTab === "skills") {
      // Save data to localStorage before navigating
      localStorage.setItem("resumeData", JSON.stringify(resumeData))
      router.push(`/resume/preview?template=${templateId}`)
    }
  }

  const handleBack = () => {
    if (activeTab === "summary") setActiveTab("personal")
    else if (activeTab === "education") setActiveTab("summary")
    else if (activeTab === "experience") setActiveTab("education")
    else if (activeTab === "skills") setActiveTab("experience")
  }

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData")
    if (savedData) {
      setResumeData(JSON.parse(savedData))
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
  }, [resumeData])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <Link
              href="/templates"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Templates
            </Link>
            <h1 className="text-3xl font-bold mb-2">Build Your Resume</h1>
            <p className="text-gray-500">Fill in your details to create your professional resume.</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">
                {activeTab === "personal"
                  ? "1"
                  : activeTab === "summary"
                    ? "2"
                    : activeTab === "education"
                      ? "3"
                      : activeTab === "experience"
                        ? "4"
                        : "5"}
                /5
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{
                  width:
                    activeTab === "personal"
                      ? "20%"
                      : activeTab === "summary"
                        ? "40%"
                        : activeTab === "education"
                          ? "60%"
                          : activeTab === "experience"
                            ? "80%"
                            : "100%",
                }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className={showPreview ? "lg:col-span-7" : "lg:col-span-12"}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid grid-cols-5 mb-8">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <Input
                          name="fullName"
                          placeholder="John Doe"
                          value={resumeData.personal.fullName}
                          onChange={handlePersonalChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Job Title</label>
                        <Input
                          name="jobTitle"
                          placeholder="Software Engineer"
                          value={resumeData.personal.jobTitle}
                          onChange={handlePersonalChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="john.doe@example.com"
                          value={resumeData.personal.email}
                          onChange={handlePersonalChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <Input
                          name="phone"
                          placeholder="(123) 456-7890"
                          value={resumeData.personal.phone}
                          onChange={handlePersonalChange}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <Input
                          name="address"
                          placeholder="123 Main St, City, State, ZIP"
                          value={resumeData.personal.address}
                          onChange={handlePersonalChange}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">LinkedIn (Optional)</label>
                        <Input
                          name="linkedin"
                          placeholder="linkedin.com/in/johndoe"
                          value={resumeData.personal.linkedin}
                          onChange={handlePersonalChange}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Website (Optional)</label>
                        <Input
                          name="website"
                          placeholder="johndoe.com"
                          value={resumeData.personal.website}
                          onChange={handlePersonalChange}
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="summary">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Professional Summary</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAiSummary}
                        className="flex items-center gap-1"
                        disabled={isLoadingAI}
                      >
                        {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        AI Suggestion
                      </Button>
                    </div>
                    <div className="mb-4">
                      <Textarea
                        placeholder="Write a brief summary of your professional background and key strengths..."
                        className="min-h-[150px]"
                        value={resumeData.summary}
                        onChange={handleSummaryChange}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        A good summary highlights your key skills and experience in 3-5 sentences.
                      </p>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="education">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Education</h2>

                    <div className="space-y-6 mb-6">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between mb-4">
                            <h3 className="font-medium">Education #{index + 1}</h3>
                            {resumeData.education.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => removeEducation(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">School/University</label>
                              <Input
                                name="school"
                                placeholder="University of Example"
                                value={edu.school}
                                onChange={(e) => handleEducationChange(index, e)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Degree</label>
                              <Input
                                name="degree"
                                placeholder="Bachelor of Science in Computer Science"
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, e)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Start Date</label>
                              <Input
                                type="month"
                                name="startDate"
                                placeholder="2016-09"
                                value={edu.startDate}
                                onChange={(e) => handleEducationChange(index, e)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">End Date</label>
                              <Input
                                type="month"
                                name="endDate"
                                placeholder="2020-05"
                                value={edu.endDate}
                                onChange={(e) => handleEducationChange(index, e)}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                              <Textarea
                                name="description"
                                placeholder="Relevant coursework, achievements, or activities..."
                                value={edu.description}
                                onChange={(e) => handleEducationChange(index, e)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-1"
                      onClick={addEducation}
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Education
                    </Button>
                  </Card>
                </TabsContent>

                <TabsContent value="experience">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Work Experience</h2>

                    <div className="space-y-6 mb-6">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between mb-4">
                            <h3 className="font-medium">Experience #{index + 1}</h3>
                            {resumeData.experience.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => removeExperience(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Company</label>
                              <Input
                                name="company"
                                placeholder="Acme Inc."
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, e)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Job Title</label>
                              <Input
                                name="jobTitle"
                                placeholder="Software Engineer"
                                value={exp.jobTitle}
                                onChange={(e) => handleExperienceChange(index, e)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Start Date</label>
                              <Input
                                type="month"
                                name="startDate"
                                placeholder="2020-06"
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(index, e)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">End Date</label>
                              <Input
                                type="month"
                                name="endDate"
                                placeholder="Present"
                                value={exp.endDate}
                                onChange={(e) => handleExperienceChange(index, e)}
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium">Responsibilities & Achievements</label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAiExperience(index)}
                                className="flex items-center gap-1"
                                disabled={isLoadingAI || !exp.jobTitle || !exp.company}
                              >
                                {isLoadingAI ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Sparkles className="h-4 w-4" />
                                )}
                                AI Suggestion
                              </Button>
                            </div>
                            <Textarea
                              name="description"
                              placeholder="• Developed and maintained web applications using React and Node.js
• Improved application performance by 30% through code optimization
• Collaborated with cross-functional teams to deliver projects on schedule"
                              className="min-h-[150px]"
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(index, e)}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Use bullet points (•) to list your responsibilities and achievements.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-1"
                      onClick={addExperience}
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Experience
                    </Button>
                  </Card>
                </TabsContent>

                <TabsContent value="skills">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Skills</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAiSkills}
                        className="flex items-center gap-1"
                        disabled={isLoadingAI}
                      >
                        {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        AI Suggestion
                      </Button>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Add Your Skills</label>
                      <div className="flex flex-wrap gap-2 mb-4 p-4 border rounded-lg min-h-[100px]">
                        {resumeData.skills.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              className="ml-2 text-blue-600 hover:text-blue-800"
                              onClick={() => removeSkill(skill)}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Remove {skill}</span>
                            </button>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={addSkill} className="flex gap-2">
                        <Input
                          id="skill-input"
                          placeholder="Add a skill (e.g., Project Management)"
                          className="flex-1"
                          onKeyDown={handleSkillChange}
                        />
                        <Button type="submit" variant="outline">
                          Add
                        </Button>
                      </form>
                      <p className="text-xs text-gray-500 mt-2">
                        Add both technical and soft skills relevant to the job you're applying for.
                      </p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                {activeTab !== "personal" ? (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                <Button onClick={handleNext}>
                  {activeTab === "skills" ? "Preview Resume" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="lg:col-span-5">
                <div className="sticky top-8">
                  <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
                  <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
                    <ResumePreview templateId={templateId} resumeData={resumeData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
