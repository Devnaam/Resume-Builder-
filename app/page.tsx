import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Sparkles, Download, Sliders } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileText className="h-6 w-6" />
            <span>ResumeBuilder</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="/templates" className="text-sm font-medium hover:underline underline-offset-4">
              Templates
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
          </nav>
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
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Build Your Resume in Minutes
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Create a professional resume that stands out with our easy-to-use builder and AI-powered suggestions.
              </p>
              <Link href="/templates">
                <Button size="lg" className="mt-4">
                  Choose a Resume Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12 md:text-3xl">
              Everything You Need to Create the Perfect Resume
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-blue-600" />}
                title="Professional Templates"
                description="Choose from a variety of professionally designed templates to match your style and industry."
              />
              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-blue-600" />}
                title="AI Suggestions"
                description="Get intelligent suggestions for your resume content based on your experience and skills."
              />
              <FeatureCard
                icon={<Download className="h-10 w-10 text-blue-600" />}
                title="PDF Export"
                description="Download your resume in multiple formats including PDF, Word, and plain text."
              />
              <FeatureCard
                icon={<Sliders className="h-10 w-10 text-blue-600" />}
                title="Customization"
                description="Personalize your resume with custom colors, fonts, and layout options."
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatCard number="1M+" label="Resumes Created" />
              <StatCard number="85%" label="Success Rate" />
              <StatCard number="24/7" label="Support" />
              <StatCard number="4.9/5" label="User Rating" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12 md:text-3xl">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="I landed my dream job thanks to the professional resume I created with this tool. The AI suggestions were incredibly helpful!"
                author="Sarah J."
                role="Marketing Manager"
              />
              <TestimonialCard
                quote="As a recent graduate, I was struggling with my resume. This builder made it so easy to create a professional resume that highlighted my skills."
                author="Michael T."
                role="Software Engineer"
              />
              <TestimonialCard
                quote="The customization options are amazing. I was able to create a unique resume that perfectly matched my personal brand."
                author="Emily R."
                role="Graphic Designer"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-blue-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold mb-4 md:text-3xl">Ready to Build Your Professional Resume?</h2>
            <p className="max-w-[600px] mx-auto mb-8 text-blue-100">
              Join thousands of job seekers who have successfully landed their dream jobs with our resume builder.
            </p>
            <Link href="/templates">
              <Button size="lg" variant="secondary">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Resume Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Career Advice
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-gray-900">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <p>© 2025 ResumeBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold text-blue-600">{number}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <p className="italic mb-4 text-gray-600">"{quote}"</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  )
}
