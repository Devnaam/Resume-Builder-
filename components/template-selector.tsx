"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"

export function TemplateSelector({ currentTemplate, onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate)

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId)
    onSelectTemplate(templateId)
  }

  const templates = [
    { id: "modern", name: "Modern" },
    { id: "modern-plus", name: "Modern Plus" },
    { id: "creative", name: "Creative" },
    { id: "professional", name: "Professional" },
    { id: "minimal", name: "Minimal" },
    { id: "minimalist", name: "Minimalist" },
    { id: "executive", name: "Executive" },
    { id: "tech", name: "Tech" },
    { id: "finance", name: "Finance" },
    { id: "design", name: "Design" },
    { id: "education", name: "Education" },
    { id: "elegant", name: "Elegant" },
  ]

  return (
    <ScrollArea className="h-[220px] pr-4">
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant="outline"
            className={`h-auto p-0 relative overflow-hidden ${
              selectedTemplate === template.id ? "ring-2 ring-blue-600" : ""
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
              <div className="text-xs text-gray-500">{template.name}</div>
            </div>
            {selectedTemplate === template.id && (
              <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
