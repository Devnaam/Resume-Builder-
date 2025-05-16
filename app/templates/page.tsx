import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"

export default function TemplatesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span>ResumeBuilder</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-4">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Choose a Resume Template</h1>
            <p className="text-gray-500">Select a template that best fits your style and industry.</p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
              <TabsTrigger value="minimalist">Minimalist</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="professional" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates
                  .filter((template) => template.category === "Professional")
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="creative" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates
                  .filter((template) => template.category === "Creative")
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="minimalist" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates
                  .filter((template) => template.category === "Minimalist")
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
              </div>
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

function TemplateCard({ template }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[3/4] bg-gray-100">
        <img src={template.image || "/placeholder.svg"} alt={template.title} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{template.title}</h3>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{template.category}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{template.description}</p>
        <Link href={`/resume/form?template=${template.id}`}>
          <Button className="w-full">Select Template</Button>
        </Link>
      </div>
    </div>
  )
}

const templates = [
  {
    id: "modern",
    title: "Modern",
    category: "Professional",
    description: "Left sidebar layout with bold headings and colored section separators.",
    image: "/placeholder.svg?height=400&width=300&text=Modern",
  },
  {
    id: "creative",
    title: "Creative",
    category: "Creative",
    description: "Top banner for name, two-column body layout, modern fonts.",
    image: "/placeholder.svg?height=400&width=300&text=Creative",
  },
  {
    id: "professional",
    title: "Professional",
    category: "Professional",
    description: "Classic single-column, serif fonts, neutral colors.",
    image: "/placeholder.svg?height=400&width=300&text=Professional",
  },
  {
    id: "minimal",
    title: "Minimal",
    category: "Minimalist",
    description: "Clean, spacious layout with minimal decorative elements.",
    image: "/placeholder.svg?height=400&width=300&text=Minimal",
  },
  {
    id: "executive",
    title: "Executive",
    category: "Professional",
    description: "Sophisticated design with elegant typography for senior roles.",
    image: "/placeholder.svg?height=400&width=300&text=Executive",
  },
  {
    id: "bold",
    title: "Bold",
    category: "Creative",
    description: "Strong visual impact with bold colors and distinctive sections.",
    image: "/placeholder.svg?height=400&width=300&text=Bold",
  },
  {
    id: "simple",
    title: "Simple",
    category: "Minimalist",
    description: "Straightforward layout focusing on content clarity.",
    image: "/placeholder.svg?height=400&width=300&text=Simple",
  },
  {
    id: "corporate",
    title: "Corporate",
    category: "Professional",
    description: "Traditional format ideal for corporate environments.",
    image: "/placeholder.svg?height=400&width=300&text=Corporate",
  },
  {
    id: "artistic",
    title: "Artistic",
    category: "Creative",
    description: "Unique design with creative elements for artistic fields.",
    image: "/placeholder.svg?height=400&width=300&text=Artistic",
  },
]
