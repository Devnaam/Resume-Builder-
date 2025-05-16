export default function MinimalTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#111827", // Default nearly black
    fontFamily: "font-sans",
    fontSize: "text-base",
    spacing: "space-y-5",
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
    <div className={`h-full p-10 ${options.fontFamily} ${options.fontSize}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-1" style={{ color: options.colorTheme }}>
          {resumeData.personal.fullName || "Your Name"}
        </h1>
        <p className="text-lg font-light mb-4">{resumeData.personal.jobTitle || "Your Job Title"}</p>

        {options.sections.contact && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
            {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
            {resumeData.personal.address && <span>{resumeData.personal.address}</span>}
            {resumeData.personal.linkedin && <span>{resumeData.personal.linkedin}</span>}
            {resumeData.personal.website && <span>{resumeData.personal.website}</span>}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={options.spacing}>
        {options.sections.summary && resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-base font-medium mb-3" style={{ color: options.colorTheme }}>
              ABOUT
            </h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-medium mb-4" style={{ color: options.colorTheme }}>
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium">{exp.jobTitle || "Job Title"}</h3>
                    <p className="text-sm text-gray-500">
                      {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  <p className="text-sm mb-2">{exp.company || "Company Name"}</p>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {options.sections.education && resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-medium mb-4" style={{ color: options.colorTheme }}>
              EDUCATION
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium">{edu.degree || "Degree"}</h3>
                    <p className="text-sm text-gray-500">
                      {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                    </p>
                  </div>
                  <p className="text-sm mb-1">{edu.school || "School Name"}</p>
                  {edu.description && <p className="text-sm text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {options.sections.skills && (
          <div>
            <h2 className="text-base font-medium mb-3" style={{ color: options.colorTheme }}>
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {resumeData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 border rounded-full text-sm"
                  style={{ borderColor: `${options.colorTheme}40` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
