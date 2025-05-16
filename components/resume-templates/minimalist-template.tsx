export default function MinimalistTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#000000", // Default black
    fontFamily: "font-sans",
    fontSize: "text-base",
    spacing: "space-y-6",
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
    <div className={`h-full p-10 ${options.fontFamily} ${options.fontSize} bg-white`}>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light tracking-tight mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
        <p className="text-xl font-light mb-6">{resumeData.personal.jobTitle || "Your Job Title"}</p>

        {options.sections.contact && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
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
          <div className="mb-8">
            <h2 className="text-base uppercase tracking-widest mb-4 font-normal">About</h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base uppercase tracking-widest mb-6 font-normal">Experience</h2>
            <div className="space-y-8">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-lg">{exp.jobTitle || "Job Title"}</h3>
                    <p className="text-sm text-gray-500">
                      {exp.startDate || "Start Date"} — {exp.endDate || "Present"}
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
          <div className="mb-8">
            <h2 className="text-base uppercase tracking-widest mb-6 font-normal">Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium">{edu.degree || "Degree"}</h3>
                    <p className="text-sm text-gray-500">
                      {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
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
            <h2 className="text-base uppercase tracking-widest mb-4 font-normal">Skills</h2>
            <div className="flex flex-wrap gap-x-1 gap-y-2">
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
