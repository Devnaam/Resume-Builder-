export default function ModernTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#2563eb", // Default blue
    fontFamily: "font-sans",
    fontSize: "text-base",
    spacing: "space-y-4",
    sections: {
      contact: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
  }

  // Merge defaults with any provided customization
  const options = customization
    ? {
        ...defaults,
        ...customization,
        sections: { ...defaults.sections, ...customization.sections },
      }
    : defaults

  return (
    <div className={`h-full flex ${options.fontFamily} ${options.fontSize}`}>
      {/* Left sidebar */}
      <div className="w-1/3 h-full p-6 text-white" style={{ backgroundColor: options.colorTheme }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
          <p className="text-lg opacity-90">{resumeData.personal.jobTitle || "Your Job Title"}</p>
        </div>

        {options.sections.contact && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 border-b border-white/30 pb-1">Contact</h2>
            <div className="space-y-2 text-sm">
              {resumeData.personal.email && <p>{resumeData.personal.email}</p>}
              {resumeData.personal.phone && <p>{resumeData.personal.phone}</p>}
              {resumeData.personal.address && <p>{resumeData.personal.address}</p>}
              {resumeData.personal.linkedin && <p>{resumeData.personal.linkedin}</p>}
              {resumeData.personal.website && <p>{resumeData.personal.website}</p>}
            </div>
          </div>
        )}

        {options.sections.skills && (
          <div>
            <h2 className="text-lg font-semibold mb-3 border-b border-white/30 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <span key={skill} className="bg-white/20 px-2 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`w-2/3 h-full p-6 ${options.spacing}`}>
        {options.sections.summary && resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 pb-1 border-b" style={{ borderColor: options.colorTheme }}>
              Professional Summary
            </h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 pb-1 border-b" style={{ borderColor: options.colorTheme }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exp.jobTitle || "Job Title"}</h3>
                      <p className="text-sm font-medium" style={{ color: options.colorTheme }}>
                        {exp.company || "Company Name"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {options.sections.education && resumeData.education.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-1 border-b" style={{ borderColor: options.colorTheme }}>
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{edu.degree || "Degree"}</h3>
                      <p className="text-sm font-medium" style={{ color: options.colorTheme }}>
                        {edu.school || "School Name"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                    </p>
                  </div>
                  {edu.description && <p className="mt-2 text-sm text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
