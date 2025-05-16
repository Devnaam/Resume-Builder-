import Link from "next/link"
import { FileText, Heart, Mail, Phone, MapPin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <FileText className="h-6 w-6" />
              <span>ResumeBuilder</span>
            </div>
            <p className="text-sm text-gray-500">
              Create professional resumes in minutes with our easy-to-use builder. Get AI-powered suggestions and stand
              out from the crowd.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-gray-600 hover:text-blue-600">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/resume/form" className="text-sm text-gray-600 hover:text-blue-600">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/resume/preview" className="text-sm text-gray-600 hover:text-blue-600">
                  Preview Resume
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-blue-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>support@resumebuilder.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>123 Resume St, Builder City</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Github className="h-4 w-4" />
                <a href="https://github.com/resumebuilder" className="hover:text-blue-600">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by ResumeBuilder Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
