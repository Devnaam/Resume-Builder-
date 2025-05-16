export default function ElegantTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#4b5563", // Default gray-600
    fontFamily: "font-serif",
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
    <div className={`h-full p-8 ${options.fontFamily} ${options.fontSize}`}>
      {/* Header with elegant styling */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-1" style={{ color: options.colorTheme }}>
          {resumeData.personal.fullName || "Your Name"}
        </h1>
        <div className="w-24 h-0.5 mx-auto my-3" style={{ backgroundColor: options.colorTheme }}></div>
        <p className="text-lg italic">{resumeData.personal.jobTitle || "Your Job Title"}</p>

        {options.sections.contact && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-sm text-gray-600">
            {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
            {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
            {resumeData.personal.address && <span>{resumeData.personal.address}</span>}
            {resumeData.personal.linkedin && <span>{resumeData.personal.linkedin}</span>}
            {resumeData.personal.website && <span>{resumeData.personal.website}</span>}
          </div>
        )}
      </div>

      {/* Main content with elegant styling */}
      <div className={options.spacing}>
        {options.sections.summary && resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-normal mb-3 text-center italic" style={{ color: options.colorTheme }}>
              Profile
            </h2>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-700">{resumeData.summary}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-normal mb-4 text-center italic" style={{ color: options.colorTheme }}>
                Experience
              </h2>
              <div className="space-y-5">
                {resumeData.experience.map((exp, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-lg">{exp.jobTitle || "Job Title"}</h3>
                    <p className="italic" style={{ color: options.colorTheme }}>
                      {exp.company || "Company Name"}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                    </p>
                    <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-8">
            {options.sections.education && resumeData.education.length > 0 && (
              <div>
                <h2 className="text-lg font-normal mb-4 text-center italic" style={{ color: options.colorTheme }}>
                  Education
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-medium">{edu.degree || "Degree"}</h3>
                      <p className="italic" style={{ color: options.colorTheme }}>
                        {edu.school || "School Name"}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                      </p>
                      {edu.description && <p className="text-sm text-gray-700">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {options.sections.skills && (
              <div>
                <h2 className="text-lg font-normal mb-4 text-center italic" style={{ color: options.colorTheme }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm border rounded-full"
                      style={{ borderColor: `${options.colorTheme}40`, color: options.colorTheme }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
