export default function TechTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#0891b2", // Default cyan
    fontFamily: "font-mono",
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
    <div className={`h-full p-8 ${options.fontFamily} ${options.fontSize} bg-gray-50`}>
      {/* Header with tech-inspired design */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="h-16 w-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: options.colorTheme }}
          >
            {resumeData.personal.fullName.charAt(0) || "A"}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: options.colorTheme }}>
              {resumeData.personal.fullName || "Your Name"}
            </h1>
            <p className="text-lg text-gray-700">{resumeData.personal.jobTitle || "Your Job Title"}</p>
          </div>
        </div>

        {options.sections.contact && (
          <div
            className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 border-t border-b py-2"
            style={{ borderColor: `${options.colorTheme}40` }}
          >
            {resumeData.personal.email && (
              <span className="flex items-center">
                <span className="mr-1" style={{ color: options.colorTheme }}>
                  //{" "}
                </span>
                {resumeData.personal.email}
              </span>
            )}
            {resumeData.personal.phone && (
              <span className="flex items-center">
                <span className="mr-1" style={{ color: options.colorTheme }}>
                  //{" "}
                </span>
                {resumeData.personal.phone}
              </span>
            )}
            {resumeData.personal.address && (
              <span className="flex items-center">
                <span className="mr-1" style={{ color: options.colorTheme }}>
                  //{" "}
                </span>
                {resumeData.personal.address}
              </span>
            )}
            {resumeData.personal.linkedin && (
              <span className="flex items-center">
                <span className="mr-1" style={{ color: options.colorTheme }}>
                  //{" "}
                </span>
                {resumeData.personal.linkedin}
              </span>
            )}
            {resumeData.personal.website && (
              <span className="flex items-center">
                <span className="mr-1" style={{ color: options.colorTheme }}>
                  //{" "}
                </span>
                {resumeData.personal.website}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main content with tech-inspired styling */}
      <div className={options.spacing}>
        {options.sections.summary && resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center" style={{ color: options.colorTheme }}>
              <span className="mr-2">{"<"}</span>
              ABOUT
              <span className="ml-2">{"/>"}</span>
            </h2>
            <div className="bg-white p-4 rounded-lg border" style={{ borderColor: `${options.colorTheme}40` }}>
              <p className="text-gray-700">{resumeData.summary}</p>
            </div>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center" style={{ color: options.colorTheme }}>
              <span className="mr-2">{"<"}</span>
              EXPERIENCE
              <span className="ml-2">{"/>"}</span>
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border"
                  style={{ borderColor: `${options.colorTheme}40` }}
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-lg">{exp.jobTitle || "Job Title"}</h3>
                    <p className="text-sm font-mono" style={{ color: options.colorTheme }}>
                      {exp.startDate || "Start Date"} → {exp.endDate || "Present"}
                    </p>
                  </div>
                  <p className="font-medium mb-2">{exp.company || "Company Name"}</p>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.sections.education && resumeData.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center" style={{ color: options.colorTheme }}>
                <span className="mr-2">{"<"}</span>
                EDUCATION
                <span className="ml-2">{"/>"}</span>
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border"
                    style={{ borderColor: `${options.colorTheme}40` }}
                  >
                    <h3 className="font-bold">{edu.degree || "Degree"}</h3>
                    <p className="text-sm font-medium" style={{ color: options.colorTheme }}>
                      {edu.school || "School Name"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.startDate || "Start Date"} → {edu.endDate || "End Date"}
                    </p>
                    {edu.description && <p className="text-sm text-gray-700 mt-2">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.sections.skills && (
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center" style={{ color: options.colorTheme }}>
                <span className="mr-2">{"<"}</span>
                SKILLS
                <span className="ml-2">{"/>"}</span>
              </h2>
              <div className="bg-white p-4 rounded-lg border" style={{ borderColor: `${options.colorTheme}40` }}>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 rounded text-sm"
                      style={{
                        backgroundColor: `${options.colorTheme}15`,
                        color: options.colorTheme,
                        border: `1px solid ${options.colorTheme}30`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
