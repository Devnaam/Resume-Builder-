export default function ModernPlusTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#3b82f6", // Default blue-500
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
    <div className={`h-full ${options.fontFamily} ${options.fontSize}`}>
      {/* Header with accent color bar */}
      <div className="h-3 w-full" style={{ backgroundColor: options.colorTheme }}></div>

      <div className="p-8">
        {/* Name and title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
            <p className="text-xl" style={{ color: options.colorTheme }}>
              {resumeData.personal.jobTitle || "Your Job Title"}
            </p>
          </div>

          {options.sections.contact && (
            <div className="mt-4 md:mt-0 text-right">
              <div className="flex flex-col items-end gap-1 text-sm">
                {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                {resumeData.personal.address && <span>{resumeData.personal.address}</span>}
                {resumeData.personal.linkedin && <span>{resumeData.personal.linkedin}</span>}
                {resumeData.personal.website && <span>{resumeData.personal.website}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className={options.spacing}>
          {options.sections.summary && resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700">{resumeData.summary}</p>
            </div>
          )}

          {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                EXPERIENCE
              </h2>
              <div className="space-y-5">
                {resumeData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-4 border-l-2"
                    style={{ borderColor: `${options.colorTheme}40` }}
                  >
                    <div
                      className="absolute w-3 h-3 rounded-full -left-[7px] top-1"
                      style={{ backgroundColor: options.colorTheme }}
                    ></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{exp.jobTitle || "Job Title"}</h3>
                        <p className="font-medium" style={{ color: options.colorTheme }}>
                          {exp.company || "Company Name"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-nowrap">
                        {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {options.sections.education && resumeData.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{edu.degree || "Degree"}</h3>
                          <p className="font-medium" style={{ color: options.colorTheme }}>
                            {edu.school || "School Name"}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-nowrap">
                          {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                        </p>
                      </div>
                      {edu.description && <p className="mt-1 text-sm text-gray-700">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {options.sections.skills && (
              <div>
                <h2 className="text-lg font-bold mb-4 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                  SKILLS
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {resumeData.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: options.colorTheme }}></div>
                      <span className="text-sm">{skill}</span>
                    </div>
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
