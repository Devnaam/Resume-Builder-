export default function DesignTemplate({ resumeData, customization = null }) {
  // Default customization values
  const defaults = {
    colorTheme: "#be185d", // Default pink
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
      {/* Creative header with diagonal design */}
      <div className="h-[180px] relative mb-16" style={{ backgroundColor: options.colorTheme }}>
        <div className="absolute -bottom-16 left-8 right-8 bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
          <p className="text-xl mb-3" style={{ color: options.colorTheme }}>
            {resumeData.personal.jobTitle || "Your Job Title"}
          </p>

          {options.sections.contact && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
              {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
              {resumeData.personal.address && <span>{resumeData.personal.address}</span>}
              {resumeData.personal.linkedin && <span>{resumeData.personal.linkedin}</span>}
              {resumeData.personal.website && <span>{resumeData.personal.website}</span>}
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div
          className="absolute -bottom-4 right-24 w-8 h-8 rounded-full"
          style={{ backgroundColor: options.colorTheme }}
        ></div>
        <div
          className="absolute -bottom-8 right-16 w-4 h-4 rounded-full"
          style={{ backgroundColor: options.colorTheme }}
        ></div>
      </div>

      {/* Main content with creative styling */}
      <div className={`px-8 ${options.spacing}`}>
        {options.sections.summary && resumeData.summary && (
          <div className="mb-8">
            <h2
              className="text-lg font-bold mb-3 inline-block pb-1 border-b-2"
              style={{ borderColor: options.colorTheme, color: options.colorTheme }}
            >
              About Me
            </h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            {options.sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
              <div className="mb-8">
                <h2
                  className="text-lg font-bold mb-4 inline-block pb-1 border-b-2"
                  style={{ borderColor: options.colorTheme, color: options.colorTheme }}
                >
                  Experience
                </h2>
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6">
                      <div
                        className="absolute left-0 top-1.5 w-3 h-3 rounded-full"
                        style={{ backgroundColor: options.colorTheme }}
                      ></div>
                      <h3 className="font-bold text-lg">{exp.jobTitle || "Job Title"}</h3>
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
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-4">
            {options.sections.skills && (
              <div className="mb-8">
                <h2
                  className="text-lg font-bold mb-4 inline-block pb-1 border-b-2"
                  style={{ borderColor: options.colorTheme, color: options.colorTheme }}
                >
                  Skills
                </h2>
                <div className="space-y-2">
                  {resumeData.skills.map((skill) => (
                    <div key={skill} className="flex items-center">
                      <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: options.colorTheme,
                            width: `${Math.floor(Math.random() * 30) + 70}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm min-w-[80px]">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {options.sections.education && resumeData.education.length > 0 && (
              <div>
                <h2
                  className="text-lg font-bold mb-4 inline-block pb-1 border-b-2"
                  style={{ borderColor: options.colorTheme, color: options.colorTheme }}
                >
                  Education
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold">{edu.degree || "Degree"}</h3>
                      <p className="text-sm font-medium" style={{ color: options.colorTheme }}>
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
          </div>
        </div>
      </div>
    </div>
  )
}
