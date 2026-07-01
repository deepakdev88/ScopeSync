import { useParams } from "react-router"
import { useEffect, useState, useCallback } from "react"
import ProjectDashboard from "../components/ProjectDashboard"
import toast from 'react-hot-toast'

const ClientView = () => {
  const { projectId } = useParams() 
  const [currentClientProject, setCurrentClientProject] = useState(null)
  const [loading, setLoading] = useState(true) 
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchProjectNodeData = useCallback(async (showToast = false) => {
    try {
      if (showToast) setIsSyncing(true);
      
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`,{
        method: 'GET',
        credentials: 'include'
      })
      const result = await res.json()
      
      if (result.success) {
        setCurrentClientProject(result.data)
        if (showToast) {
          toast.success("Synchronized with master database pipeline! ⚡", {
            style: { background: '#0d0e14', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }
          });
        }
      }
    } catch (err) {
      console.error("Project node stream fetch failure:", err)
      if (showToast) toast.error("Database connection failure.");
    } finally {
      setLoading(false)
      setIsSyncing(false)
    }
  }, [projectId])

  useEffect(() => {
    if (projectId) fetchProjectNodeData(false)
  }, [projectId, fetchProjectNodeData])

  // Core Metrics Compilation
  let totalTasks = 0
  let completedTasks = 0
  let inProgressTasks = 0

  if (currentClientProject) {
    currentClientProject.phases.forEach((phase) => {
      totalTasks += phase.tasks.length
      phase.tasks.forEach((task) => {
        if (task.status === "completed") completedTasks++;
        if (task.status === "progress") inProgressTasks++;
      })
    })
  }

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // 🔥 DYNAMIC HEALTH ENGINE FUNCTION
  const getProjectHealth = () => {
    if (totalTasks === 0) {
      return {
        label: "INITIALIZING",
        color: "text-gray-400 bg-gray-500/10 border-white/[0.04]",
        desc: "Workspace structure deployed. Awaiting core timeline mapping."
      };
    }
    if (percentage === 100) {
      return {
        label: "DELIVERED",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        desc: "All code modules completed and validated by core repo."
      };
    }
    if (percentage >= 50) {
      return {
        label: "HEALTH OPTIMAL",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        desc: "Velocity is stable. More than half of deliverables are secured."
      };
    }
    if (inProgressTasks > 0 || completedTasks > 0) {
      return {
        label: "ACTIVE RUNTIME",
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20 animate-pulse",
        desc: "Tasks are actively processing in engineering pipelines."
      };
    }
    return {
      label: "STAGED / PENDING",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      desc: "Execution branches mapped. Waiting for development sprint kickoff."
    };
  };

  const health = getProjectHealth();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#090a0f] flex flex-col gap-4 items-center justify-center font-mono text-xs text-gray-500">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
        <span>Establishing Secure Client Data Link Node...</span>
      </div>
    )
  }

  if (!currentClientProject) {
    return (
      <div className="w-full min-h-screen bg-[#090a0f] flex flex-col gap-3 items-center justify-center font-mono text-xs text-gray-500 px-4 text-center">
        <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-sm font-bold mb-2">!</div>
        <h3 className="text-gray-300 font-bold text-sm">404: Cryptographic Token Invalid</h3>
        <p className="max-w-xs text-gray-600 leading-normal">The tracking reference hash is missing from core database registries.</p>
      </div>
    )
  }

  return (
    <>
      <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex flex-col relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>
        
        <div className='absolute top-[-15%] left-[50%] -translate-x-1/2 w-150 h-75 bg-emerald-500/3 blur-[120px] rounded-full pointer-events-none'></div>
        
        <div className="w-[90%] max-w-6xl mx-auto mt-10 p-6 bg-[#0d0e14]/50 border border-white/6 backdrop-blur-xl rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative z-10 animate-fade-in flex flex-col gap-5">

            {/* FIX 1: Title badal kar professional "Project Status Stream" kar diya */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/3 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase font-mono">Real-time Stream Engine</p>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                </div>
                <h2 className="text-lg font-extrabold text-white tracking-tight">Project Status Stream</h2>
              </div>

              <button
                onClick={() => fetchProjectNodeData(true)}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/6 bg-white/1 hover:bg-white/4 text-xs font-mono text-gray-400 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <svg className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                </svg>
                {isSyncing ? 'Fetching Registry...' : 'Sync Live Feed'}
              </button>
            </div>

            {/* Metrics Layout Split */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              
              <div className="md:col-span-3 space-y-3">
                <div className="flex justify-between items-end">
                  <h3 className="text-base font-bold text-gray-200 tracking-tight">
                    {completedTasks} <span className="text-xs font-mono font-normal text-gray-500">/ {totalTasks} Engineering Tasks Verified</span>
                  </h3>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border select-none
                    ${percentage < 25 ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                    ${percentage >= 25 && percentage < 75 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                    ${percentage >= 75 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                  `}>
                    {percentage}% Deployed
                  </span>
                </div>

                <div className="w-full bg-[#14161e] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/4 shadow-inner relative">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out
                      ${percentage < 25 ? 'bg-linear-to-r from-red-500 to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
                      ${percentage >= 25 && percentage < 75 ? 'bg-linear-to-r from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}
                      ${percentage >= 75 ? 'bg-linear-to-r from-emerald-500 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}
                    `}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* FIX 2: NOW TOTALLY DYNAMIC HEALTH MODULE */}
              <div className="w-full p-3 rounded-xl bg-white/1 border border-white/4 flex flex-col gap-1 text-left font-mono min-h-21.25 justify-center">
                <span className="text-[9px] text-gray-600 uppercase tracking-widest">Environment Status</span>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${health.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-currentColor"></span>
                  {health.label}
                </span>
                <span className="text-[9px] text-gray-500 font-sans mt-0.5 leading-tight">{health.desc}</span>
              </div>

            </div>
            
            <div className="flex justify-between items-center text-[9px] font-mono text-gray-600 pt-1">
              <span>pipeline_gateway: active_sync_node</span>
              <span>Security Encrypted AES-256</span>
            </div>
        </div>

        <div className="grow">
          <ProjectDashboard project={currentClientProject} isAdmin={false} />
        </div>

      </div>
    </>
  )
}

export default ClientView