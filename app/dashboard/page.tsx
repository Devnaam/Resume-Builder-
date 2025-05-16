"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Download, Edit, Trash2, Clock, Eye, LogOut, User, ChevronRight, BarChart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [resumes, setResumes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    // Get user data
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)

    // Get resume data from localStorage
    const resumeData = localStorage.getItem("resumeData")

    // Generate mock resumes
    const mockResumes = [
      {
        id: "resume-1",
        title: "Software Developer Resume",
        template: "modern",
        lastEdited: new Date().toISOString(),
        downloads: 5,
        views: 12,
      },
    ]

    // Add the current resume if it exists
    if (resumeData) {
      const parsedData = JSON.parse(resumeData)
      mockResumes.unshift({
        id: "current-resume",
        title: parsedData.personal?.jobTitle || "My Resume",
        template: localStorage.getItem("lastUsedTemplate") || "modern",
        lastEdited: new Date().toISOString(),
        downloads: 0,
        views: 0,
      })
    }

    setResumes(mockResumes)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    router.push("/")
  }

  const handleDeleteResume = (id) => {
    setResumes((prev) => prev.filter((resume) => resume.id !== id))

    toast({
      title: "Resume deleted",
      description: "Your resume has been deleted successfully.",
    })
  }

  if (isLoading) {
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
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileText className="h-6 w-6" />
            <span>ResumeBuilder</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              {user?.name || "Account"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-500">Manage your resumes and track their performance</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/templates">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Resume
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Resumes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{resumes.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{resumes.reduce((acc, resume) => acc + resume.downloads, 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{resumes.reduce((acc, resume) => acc + resume.views, 0)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="resumes" className="mb-8">
            <TabsList>
              <TabsTrigger value="resumes">My Resumes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="resumes" className="mt-6">
              {resumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((resume) => (
                    <Card key={resume.id}>
                      <CardHeader>
                        <CardTitle>{resume.title}</CardTitle>
                        <CardDescription className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          Last edited: {new Date(resume.lastEdited).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Download className="mr-1 h-3.5 w-3.5" />
                            {resume.downloads} downloads
                          </span>
                          <span className="flex items-center">
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            {resume.views} views
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/resume/form?template=${resume.template}`}>
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/resume/preview?template=${resume.template}`}>
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              Preview
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteResume(resume.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
                  <p className="text-gray-500 mb-4">Create your first resume to get started</p>
                  <Link href="/templates">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Resume
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Performance</CardTitle>
                  <CardDescription>Track how your resumes are performing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">Analytics data will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h3 className="font-medium">Personal Information</h3>
                      <p className="text-sm text-gray-500">Update your name and contact details</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-gray-500">Change your password</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h3 className="font-medium">Notifications</h3>
                      <p className="text-sm text-gray-500">Configure email notifications</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-gray-500">Permanently delete your account</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6 text-center text-sm text-gray-500">
          <p>© 2025 ResumeBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
