export default function FinanceTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#065f46", // Default emerald
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
      {/* Header with conservative finance-inspired design */}
      <div className="mb-8 border-b-2 pb-4" style={{ borderColor: options.colorTheme }}>
        <h1 className="text-3xl font-bold text-center mb-2">{resumeData.personal.fullName || "Your Name"}</h1>
        <p className="text-xl text-center mb-4" style={{ color: options.colorTheme }}>
          {resumeData.personal.jobTitle || "Your Job Title"}
        </p>

        {options.sections.contact && (
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm">
            {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
            {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
            {resumeData.personal.address && <span>{resumeData.personal.address}</span>}
            {resumeData.personal.linkedin && <span>{resumeData.personal.linkedin}</span>}
            {resumeData.personal.website && <span>{resumeData.personal.website}</span>}
          </div>
        )}
      </div>

      {/* Main content with conservative styling */}
      <div className={options.spacing}>
        {options.sections.summary && resumeData.summary && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-3 uppercase tracking-wide text-center"
              style={{ color: options.colorTheme }}
            >
              Professional Summary
            </h2>
            <div className="border-l-4 pl-4" style={{ borderColor: options.colorTheme }}>
              <p className="text-gray-700 italic">{resumeData.summary}</p>
            </div>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-4 uppercase tracking-wide text-center"
              style={{ color: options.colorTheme }}
            >
              Professional Experience
            </h2>
            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border-b pb-4" style={{ borderColor: `${options.colorTheme}30` }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg">{exp.jobTitle || "Job Title"}</h3>
                    <p className="text-sm font-medium">
                      {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  <p className="font-medium mb-2" style={{ color: options.colorTheme }}>
                    {exp.company || "Company Name"}
                  </p>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.sections.education && resumeData.education.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold mb-4 uppercase tracking-wide text-center"
                style={{ color: options.colorTheme }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 pl-4" style={{ borderColor: `${options.colorTheme}50` }}>
                    <h3 className="font-bold">{edu.degree || "Degree"}</h3>
                    <p className="font-medium" style={{ color: options.colorTheme }}>
                      {edu.school || "School Name"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                    </p>
                    {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.sections.skills && (
            <div>
              <h2
                className="text-lg font-bold mb-4 uppercase tracking-wide text-center"
                style={{ color: options.colorTheme }}
              >
                Professional Skills
              </h2>
              <div className="border p-4" style={{ borderColor: `${options.colorTheme}30` }}>
                <div className="grid grid-cols-2 gap-2">
                  {resumeData.skills.map((skill) => (
                    <div key={skill} className="flex items-center">
                      <div className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: options.colorTheme }}></div>
                      <span className="text-sm">{skill}</span>
                    </div>
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
