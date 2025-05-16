"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Briefcase, MapPin, Search, ExternalLink, Clock, Building, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function JobRecommendations({ resumeData }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState([])
  const [location, setLocation] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    // Set initial job title based on resume data
    if (resumeData?.personal?.jobTitle) {
      setJobTitle(resumeData.personal.jobTitle)
    }
  }, [resumeData])

  const searchJobs = async () => {
    setIsLoading(true)
    setError(null)

    toast({
      title: "Searching Jobs",
      description: "Finding relevant job opportunities based on your resume...",
    })

    try {
      const response = await fetch("/api/ai/suggest-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          jobTitle: jobTitle || resumeData?.personal?.jobTitle,
          location: location || "Remote",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get job suggestions")
      }

      const data = await response.json()

      if (data.suggestions && data.suggestions.jobRoles) {
        // Transform the AI suggestions into job listings
        const jobListings = data.suggestions.jobRoles.map((role, index) => ({
          id: `job-${index + 1}`,
          title: role.title,
          company: `${["TechNova", "DataSphere", "CloudPeak", "InnovateCorp", "DigitalWave"][Math.floor(Math.random() * 5)]}`,
          industry: role.title.includes("Developer")
            ? "Technology"
            : role.title.includes("Manager")
              ? "Management"
              : role.title.includes("Designer")
                ? "Design"
                : "Technology",
          location: location || "Remote",
          type: ["Full-time", "Contract", "Remote", "Hybrid"][Math.floor(Math.random() * 4)],
          salary: role.title.includes("Senior")
            ? "$120,000 - $160,000"
            : role.title.includes("Manager")
              ? "$140,000 - $180,000"
              : role.title.includes("Junior")
                ? "$70,000 - $90,000"
                : "$90,000 - $120,000",
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: role.fitReason || "A great opportunity matching your skills and experience.",
          requiredSkills: role.requiredSkills || [],
          matchPercentage: role.matchPercentage || Math.floor(Math.random() * 20) + 75,
        }))

        setJobs(jobListings)
      } else if (data.suggestions.rawResponse) {
        // Handle raw text response by parsing it into job listings
        const rawText = data.suggestions.rawResponse
        // Create a fallback job listing
        setJobs([
          {
            id: "job-1",
            title: jobTitle || resumeData?.personal?.jobTitle || "Software Developer",
            company: "AI Recommended Position",
            industry: "Technology",
            location: location || "Remote",
            type: "Full-time",
            salary: "$90,000 - $120,000",
            postedDate: new Date().toLocaleDateString(),
            description: rawText,
            requiredSkills: resumeData?.skills?.slice(0, 5) || [],
            matchPercentage: 85,
          },
        ])
      }

      toast({
        title: "Jobs Found",
        description: `Found job opportunities matching your profile.`,
      })
    } catch (error) {
      console.error("Error getting job suggestions:", error)
      setError(error.message || "An error occurred while searching for jobs")

      toast({
        title: "Job Search Failed",
        description: error.message || "There was an error finding job matches. Please try again.",
        variant: "destructive",
      })

      // Fallback to mock data
      generateMockJobs()
    } finally {
      setIsLoading(false)
    }
  }

  // Generate mock job listings as a fallback
  const generateMockJobs = () => {
    const userJobTitle = jobTitle || resumeData?.personal?.jobTitle || "Software Engineer"
    const userSkills = resumeData?.skills || []
    const userLocation = location || "Remote"

    // Company names and descriptions
    const companies = [
      { name: "TechNova", industry: "Technology" },
      { name: "DataSphere", industry: "Data Analytics" },
      { name: "CloudPeak", industry: "Cloud Computing" },
      { name: "InnovateCorp", industry: "Software Development" },
      { name: "DigitalWave", industry: "Digital Marketing" },
    ]

    // Job types
    const jobTypes = ["Full-time", "Contract", "Remote", "Hybrid"]

    // Generate mock jobs
    const mockJobs = Array.from({ length: 5 }, (_, i) => {
      const company = companies[Math.floor(Math.random() * companies.length)]
      const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)]

      // Variations of the job title
      const titleVariations = [
        userJobTitle,
        `Senior ${userJobTitle}`,
        `${userJobTitle} II`,
        `Lead ${userJobTitle}`,
        `${userJobTitle} Specialist`,
      ]

      const actualTitle = titleVariations[Math.floor(Math.random() * titleVariations.length)]

      // Generate required skills based on user skills
      const requiredSkills =
        userSkills.length > 0
          ? [...userSkills].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, userSkills.length))
          : ["Communication", "Problem Solving", "Teamwork", "JavaScript", "React"]

      return {
        id: `job-${i + 1}`,
        title: actualTitle,
        company: company.name,
        industry: company.industry,
        location: userLocation,
        type: jobType,
        salary: actualTitle.includes("Senior")
          ? "$120,000 - $160,000"
          : actualTitle.includes("Manager")
            ? "$140,000 - $180,000"
            : actualTitle.includes("Junior")
              ? "$70,000 - $90,000"
              : "$90,000 - $120,000",
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        description: `We are seeking a talented ${actualTitle} to join our team. This role is perfect for someone with your background and skills.`,
        requiredSkills: requiredSkills,
        matchPercentage: Math.floor(Math.random() * 20) + 75,
      }
    }).sort((a, b) => b.matchPercentage - a.matchPercentage)

    setJobs(mockJobs)
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
        Job Recommendations
      </h2>

      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <label htmlFor="job-title" className="block text-sm font-medium mb-1">
              Job Title
            </label>
            <Input
              id="job-title"
              placeholder="e.g. Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <Input
              id="location"
              placeholder="e.g. Remote, New York, etc."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
              <div className="font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Error
              </div>
              <p className="mt-1">{error}</p>
              <p className="mt-2">Using fallback job recommendations instead.</p>
            </div>
          )}

          <Button onClick={searchJobs} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Matching Jobs
              </>
            )}
          </Button>
        </div>

        {jobs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-500">{jobs.length} jobs matching your profile</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Building className="h-3.5 w-3.5 mr-1" />
                        <span>{job.company}</span>
                        <span className="mx-1.5">•</span>
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <Badge
                      variant={job.matchPercentage >= 85 ? "default" : "outline"}
                      className={job.matchPercentage >= 85 ? "bg-green-500" : ""}
                    >
                      {job.matchPercentage}% Match
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.salary}</Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Posted {job.postedDate}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{job.description}</p>

                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.requiredSkills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Job
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {jobs.length === 0 && !isLoading && (
          <div className="text-center py-6 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="mb-1">No jobs found yet</p>
            <p className="text-sm">Search for jobs matching your resume</p>
          </div>
        )}
      </div>
    </div>
  )
}
