"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CheckCircle, Info, Briefcase, ArrowRight, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AISuggestionsModal({ isOpen, onClose, resumeData }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("analysis")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [jobSuggestions, setJobSuggestions] = useState(null)

  const getResumeAnalysis = async () => {
    if (analysis) return // Don't fetch again if we already have results

    setIsLoading(true)
    toast({
      title: "Analyzing Resume",
      description: "Our AI is analyzing your resume content...",
    })

    try {
      const response = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeData }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze resume")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing resume:", error)
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getJobSuggestions = async () => {
    if (jobSuggestions) return // Don't fetch again if we already have results

    setIsLoading(true)
    toast({
      title: "Finding Job Matches",
      description: "Our AI is finding the best job matches for your profile...",
    })

    try {
      const response = await fetch("/api/ai/suggest-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeData }),
      })

      if (!response.ok) {
        throw new Error("Failed to get job suggestions")
      }

      const data = await response.json()
      setJobSuggestions(data.suggestions)
      toast({
        title: "Job Matching Complete",
        description: "We've found job roles that match your profile.",
      })
    } catch (error) {
      console.error("Error getting job suggestions:", error)
      toast({
        title: "Job Matching Failed",
        description: "There was an error finding job matches. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when tab changes
  const handleTabChange = (value) => {
    setActiveTab(value)
    if (value === "analysis" && !analysis) {
      getResumeAnalysis()
    } else if (value === "jobs" && !jobSuggestions) {
      getJobSuggestions()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
            AI Resume Insights
          </DialogTitle>
          <DialogDescription>
            Powered by Google Gemini 2.0 Flash, our AI provides personalized feedback and job recommendations.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="analysis" value={activeTab} onValueChange={handleTabChange} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="analysis" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Resume Analysis
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Job Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {isLoading && activeTab === "analysis" ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-center text-gray-500">Analyzing your resume with AI...</p>
                <p className="text-center text-gray-400 text-sm mt-2">This may take a few moments</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Overall Impression */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Overall Impression</h3>
                  <p>{analysis.overallImpression}</p>
                </div>

                {/* Content Quality */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Content Quality</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.contentQuality && (
                      <>
                        {analysis.contentQuality.summary && (
                          <div className="border rounded-lg p-3">
                            <h4 className="font-medium mb-1">Summary</h4>
                            <p className="text-sm">{analysis.contentQuality.summary}</p>
                          </div>
                        )}
                        {analysis.contentQuality.experience && (
                          <div className="border rounded-lg p-3">
                            <h4 className="font-medium mb-1">Experience</h4>
                            <p className="text-sm">{analysis.contentQuality.experience}</p>
                          </div>
                        )}
                        {analysis.contentQuality.education && (
                          <div className="border rounded-lg p-3">
                            <h4 className="font-medium mb-1">Education</h4>
                            <p className="text-sm">{analysis.contentQuality.education}</p>
                          </div>
                        )}
                        {analysis.contentQuality.skills && (
                          <div className="border rounded-lg p-3">
                            <h4 className="font-medium mb-1">Skills</h4>
                            <p className="text-sm">{analysis.contentQuality.skills}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Keywords and Formatting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.keywordOptimization && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Keyword Optimization</h3>
                      <p>{analysis.keywordOptimization}</p>
                    </div>
                  )}
                  {analysis.formattingStructure && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Formatting & Structure</h3>
                      <p>{analysis.formattingStructure}</p>
                    </div>
                  )}
                </div>

                {/* Action Items */}
                {analysis.actionItems && analysis.actionItems.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Action Items</h3>
                    <div className="space-y-2">
                      {analysis.actionItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 rounded-md bg-gray-50">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Response Fallback */}
                {analysis.rawResponse && !analysis.overallImpression && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">AI Analysis</h3>
                    <p className="whitespace-pre-line">{analysis.rawResponse}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Get AI Analysis</h3>
                <p className="text-gray-500 mb-4">
                  Our AI will analyze your resume and provide personalized feedback to help you improve it.
                </p>
                <Button onClick={getResumeAnalysis}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze My Resume
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {isLoading && activeTab === "jobs" ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-center text-gray-500">Finding job matches with AI...</p>
                <p className="text-center text-gray-400 text-sm mt-2">This may take a few moments</p>
              </div>
            ) : jobSuggestions ? (
              <div className="space-y-6">
                {/* Job Roles */}
                {jobSuggestions.jobRoles && jobSuggestions.jobRoles.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Recommended Job Roles</h3>
                    <div className="space-y-4">
                      {jobSuggestions.jobRoles.map((job, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-lg">{job.title}</h4>
                            {job.matchPercentage && (
                              <Badge
                                variant={job.matchPercentage >= 85 ? "default" : "outline"}
                                className={job.matchPercentage >= 85 ? "bg-green-500" : ""}
                              >
                                {job.matchPercentage}% Match
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2">{job.fitReason}</p>
                          {job.requiredSkills && job.requiredSkills.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-1">Key Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {job.requiredSkills.map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Paths */}
                {jobSuggestions.careerPaths && jobSuggestions.careerPaths.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Potential Career Paths</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {jobSuggestions.careerPaths.map((path, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <p>{path}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Skill Gaps */}
                {jobSuggestions.skillGaps && jobSuggestions.skillGaps.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Skills to Develop</h3>
                    <div className="border rounded-lg p-4">
                      <ul className="space-y-2">
                        {jobSuggestions.skillGaps.map((skill, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                            <p>{skill}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Additional Advice */}
                {jobSuggestions.additionalAdvice && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Additional Career Advice</h3>
                    <p>{jobSuggestions.additionalAdvice}</p>
                  </div>
                )}

                {/* Raw Response Fallback */}
                {jobSuggestions.rawResponse && !jobSuggestions.jobRoles && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">AI Job Recommendations</h3>
                    <p className="whitespace-pre-line">{jobSuggestions.rawResponse}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Get Job Recommendations</h3>
                <p className="text-gray-500 mb-4">
                  Our AI will analyze your resume and suggest job roles that match your skills and experience.
                </p>
                <Button onClick={getJobSuggestions}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Find Matching Jobs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
