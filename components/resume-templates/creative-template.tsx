export default function CreativeTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#7c3aed", // Default purple
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
      {/* Header banner */}
      <div className="h-[120px] w-full p-6 flex items-center" style={{ backgroundColor: options.colorTheme }}>
        <div className="text-white">
          <h1 className="text-3xl font-bold">{resumeData.personal.fullName || "Your Name"}</h1>
          <p className="text-xl opacity-90">{resumeData.personal.jobTitle || "Your Job Title"}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex h-[calc(100%-120px)]">
        {/* Left column */}
        <div className="w-1/3 p-6 bg-gray-50">
          {options.sections.contact && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                Contact
              </h2>
              <div className="space-y-2 text-sm">
                {resumeData.personal.email && (
                  <p>
                    <span className="font-medium">Email: </span>
                    {resumeData.personal.email}
                  </p>
                )}
                {resumeData.personal.phone && (
                  <p>
                    <span className="font-medium">Phone: </span>
                    {resumeData.personal.phone}
                  </p>
                )}
                {resumeData.personal.address && (
                  <p>
                    <span className="font-medium">Location: </span>
                    {resumeData.personal.address}
                  </p>
                )}
                {resumeData.personal.linkedin && (
                  <p>
                    <span className="font-medium">LinkedIn: </span>
                    {resumeData.personal.linkedin}
                  </p>
                )}
                {resumeData.personal.website && (
                  <p>
                    <span className="font-medium">Website: </span>
                    {resumeData.personal.website}
                  </p>
                )}
              </div>
            </div>
          )}

          {options.sections.education && resumeData.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{edu.degree || "Degree"}</h3>
                    <p className="text-sm font-medium" style={{ color: options.colorTheme }}>
                      {edu.school || "School Name"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                    </p>
                    {edu.description && <p className="mt-1 text-sm text-gray-700">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {options.sections.skills && (
            <div>
              <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: options.colorTheme }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className={`w-2/3 p-6 ${options.spacing}`}>
          {options.sections.summary && resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                Professional Summary
              </h2>
              <p className="text-gray-700">{resumeData.summary}</p>
            </div>
          )}

          {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 pb-1 border-b-2" style={{ borderColor: options.colorTheme }}>
                Work Experience
              </h2>
              <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2" style={{ borderColor: options.colorTheme }}>
                    <div
                      className="absolute w-3 h-3 rounded-full -left-[7px] top-1"
                      style={{ backgroundColor: options.colorTheme }}
                    ></div>
                    <div>
                      <h3 className="font-medium text-lg">{exp.jobTitle || "Job Title"}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium" style={{ color: options.colorTheme }}>
                          {exp.company || "Company Name"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
