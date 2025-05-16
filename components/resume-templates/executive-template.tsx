export default function ExecutiveTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#9f1239", // Default maroon
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
      {/* Header with elegant border */}
      <div className="mb-8 pb-4 border-b-2" style={{ borderColor: options.colorTheme }}>
        <h1 className="text-4xl font-bold text-center mb-2">{resumeData.personal.fullName || "Your Name"}</h1>
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

      {/* Main content with elegant styling */}
      <div className={options.spacing}>
        {options.sections.summary && resumeData.summary && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-3 uppercase tracking-wide text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: `${options.colorTheme}40` }}
            >
              Executive Summary
            </h2>
            <p className="text-gray-700 text-center italic">{resumeData.summary}</p>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-4 uppercase tracking-wide text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: `${options.colorTheme}40` }}
            >
              Professional Experience
            </h2>
            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
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

        {options.sections.education && resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-4 uppercase tracking-wide text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: `${options.colorTheme}40` }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{edu.degree || "Degree"}</h3>
                    <p className="text-sm font-medium">
                      {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                    </p>
                  </div>
                  <p className="font-medium mb-1" style={{ color: options.colorTheme }}>
                    {edu.school || "School Name"}
                  </p>
                  {edu.description && <p className="text-sm text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {options.sections.skills && (
          <div>
            <h2
              className="text-lg font-bold mb-3 uppercase tracking-wide text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: `${options.colorTheme}40` }}
            >
              Core Competencies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center">
              {resumeData.skills.map((skill) => (
                <div key={skill} className="py-1 text-sm border-b" style={{ borderColor: `${options.colorTheme}20` }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
