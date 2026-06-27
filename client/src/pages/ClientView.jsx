import { useParams } from "react-router"
import { useEffect, useState } from "react"
import ProjectDashboard from "../components/ProjectDashboard"

const ClientView = () => {
  const { projectId } = useParams() // URL se ID uthayi
  const [currentClientProject, setCurrentClientProject] = useState(null)
  const [loading, setLoading] = useState(true) // Loading state zaruri hai

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        // Backend se specific project mangwa rahe hain
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}`)
        const result = await res.json()
        
        if (result.success) {
          setCurrentClientProject(result.data)
        }
      } catch (err) {
        console.error("Project fetch nahi hua:", err)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) fetchProject()
  }, [projectId])


  let totalTasks = 0
  let completedTasks = 0

  if (currentClientProject) {
    currentClientProject.phases.forEach((phase) => {
      totalTasks += phase.tasks.length

      phase.tasks.forEach((task) => {
        if (task.status === "completed") {
          completedTasks++
        }
      })
    })
  }
  console.log("All Tasks: ", totalTasks)
  console.log("All completed Tasks: ", completedTasks)

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (!currentClientProject) {
    return <div className="h-screen w-screen flex items-center justify-center font-bold text-red-500">404: Invalid Project Link! ❌</div>
  }


  return (
    <>
      <div className='flex flex-col h-screen w-screen bg-gray-50'>
        <div className="w-[90%] max-w-5xl mx-auto mt-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">

            {/* Top Metrics: Labels aur Percentage */}
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Overall Progress</p>
                <h3 className="text-2xl font-black text-gray-800 mt-0.5">
                  {completedTasks} <span className="text-sm font-medium text-gray-400">/ {totalTasks} Tasks Done</span>
                </h3>
              </div>

              {/* Dynamic Percentage Badge with Glassmorphism */}
              <span className={`text-sm font-black px-3 py-1 rounded-full border shadow-sm transition-all duration-500
            ${percentage < 25 ? 'bg-red-50 border-red-200 text-red-600' : ''}
            ${percentage >= 25 && percentage < 50 ? 'bg-amber-50 border-amber-200 text-amber-600' : ''}
            ${percentage >= 50 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : ''}
        `}>
                {percentage}% Complete
              </span>
            </div>

            {/* The Outer Track (Premium Shadow & Rounded) */}
            <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-gray-200/50 shadow-inner">

              {/* The Inner Fill (Dynamic Rang-Badlu with Smooth Glow) */}
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,0,0,0.05)]
                ${percentage < 25 ? 'bg-linear-to-r from-red-400 to-red-500' : ''}
                ${percentage >= 25 && percentage < 50 ? 'bg-linear-to-r from-amber-400 to-amber-500' : ''}
                ${percentage >= 50 ? 'bg-linear-to-r from-emerald-400 to-emerald-500' : ''}
            `}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        <ProjectDashboard project={currentClientProject} isAdmin={false} />

      </div>

    </>
  )
}

export default ClientView
