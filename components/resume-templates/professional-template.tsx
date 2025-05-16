export default function ProfessionalTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#475569", // Default slate
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
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b" style={{ borderColor: options.colorTheme }}>
        <h1 className="text-3xl font-bold mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
        <p className="text-xl mb-3" style={{ color: options.colorTheme }}>
          {resumeData.personal.jobTitle || "Your Job Title"}
        </p>

        {options.sections.contact && (
          <div className="flex justify-center flex-wrap gap-x-4 text-sm">
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
            <h2 className="text-lg font-semibold mb-2 uppercase tracking-wider" style={{ color: options.colorTheme }}>
              Professional Summary
            </h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider" style={{ color: options.colorTheme }}>
              Professional Experience
            </h2>
            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg">{exp.jobTitle || "Job Title"}</h3>
                    <p className="text-sm">
                      {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  <p className="font-medium mb-2">{exp.company || "Company Name"}</p>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {options.sections.education && resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider" style={{ color: options.colorTheme }}>
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{edu.degree || "Degree"}</h3>
                    <p className="text-sm">
                      {edu.startDate || "Start Date"} - {edu.endDate || "End Date"}
                    </p>
                  </div>
                  <p className="font-medium mb-1">{edu.school || "School Name"}</p>
                  {edu.description && <p className="text-sm text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {options.sections.skills && (
          <div>
            <h2 className="text-lg font-semibold mb-3 uppercase tracking-wider" style={{ color: options.colorTheme }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {resumeData.skills.map((skill, index) => (
                <span key={skill} className="text-sm">
                  {skill}
                  {index < resumeData.skills.length - 1 ? " • " : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
