export default function EducationTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#1d4ed8", // Default indigo
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
      {/* Header with academic styling */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
        <p className="text-xl mb-3" style={{ color: options.colorTheme }}>
          {resumeData.personal.jobTitle || "Your Job Title"}
        </p>

        {options.sections.contact && (
          <div
            className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm border-t border-b py-2"
            style={{ borderColor: `${options.colorTheme}40` }}
          >
            {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
            {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
            {resumeData.personal.address && <span>{resumeData.personal.address}</span>}
            {resumeData.personal.linkedin && <span>{resumeData.personal.linkedin}</span>}
            {resumeData.personal.website && <span>{resumeData.personal.website}</span>}
          </div>
        )}
      </div>

      {/* Main content with academic styling */}
      <div className={options.spacing}>
        {options.sections.education && resumeData.education.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: options.colorTheme }}
            >
              EDUCATION
            </h2>
            <div className="space-y-5">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: options.colorTheme }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg">{edu.degree || "Degree"}</h3>
                    <p className="text-sm">
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

        {options.sections.summary && resumeData.summary && (
          <div className="mb-8">
            <h2
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: options.colorTheme }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: options.colorTheme }}
            >
              TEACHING & PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{exp.jobTitle || "Job Title"}</h3>
                    <p className="text-sm">
                      {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  <p className="font-medium mb-2" style={{ color: options.colorTheme }}>
                    {exp.company || "Institution Name"}
                  </p>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {options.sections.skills && (
          <div>
            <h2
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: options.colorTheme, borderColor: options.colorTheme }}
            >
              SKILLS & QUALIFICATIONS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
              {resumeData.skills.map((skill) => (
                <div key={skill} className="flex items-center">
                  <div className="w-2 h-2 mr-2" style={{ backgroundColor: options.colorTheme }}></div>
                  <span className="text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
