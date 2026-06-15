import { useEffect, useState } from 'react'
import './App.css'

interface GitHubProfile {
  login: string
  name: string | null
  bio: string | null
  avatarUrl: string
  followers?: { totalCount: number }
  repositories?: { totalCount: number }
}

export default function App() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)

  useEffect(() => {
    fetch('/gh-data.json')
      .then((res) => res.json())
      .then((data) => setProfile(data as GitHubProfile))
      .catch(() => console.warn("Waiting for icommit telemetry node to populate..."))
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-6 overflow-hidden select-none">
  
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        
        <div className="flex items-center space-x-2 border border-zinc-900 bg-zinc-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full opacity-75 ${!profile ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex h-2 w-2 ${!profile ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span>autocrafts-io - {!profile ? 'Syncing...' : 'Test page'}</span>
        </div>

        {profile?.avatarUrl && (
          <img 
            src={profile.avatarUrl} 
            alt="Profile Avatar" 
            className="w-20 h-20 border border-zinc-800 object-cover grayscale"
          />
        )}

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f4f4f5]">
          {profile?.name || profile?.login || "Let the code speak"}<span className="text-[#10b981]">.</span>
        </h1>

        <p className="text-zinc-400 text-sm md:text-base max-w-xl tracking-normal">
          {profile?.bio || "A native profile automation workflow built for Committed Developers."}
        </p>

        {profile?.repositories && profile?.followers && (
          <div className="flex items-center space-x-6 font-mono text-xs text-zinc-500 tracking-wider uppercase border border-zinc-900 bg-zinc-950/50 px-4 py-2">
            <span>Repos: {profile.repositories?.totalCount ?? 0}</span>
            <span className="w-1 h-1 bg-zinc-800"></span>
            <span>Followers: {profile.followers?.totalCount ?? 0}</span>
          </div>
        )}

        <div className="pt-4">
          <a 
            href="https://github.com/riteshraj-shetage/autocrafts-io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-emerald-900/60 bg-emerald-950/10 px-6 py-3 font-mono text-xs md:text-sm text-emerald-400 tracking-wider hover:bg-emerald-950/20 hover:border-emerald-500/40 transition-colors duration-200 rounded-none"
          >
            @riteshraj-shetage/autocrafts-io
          </a>
        </div>

      </div>
    </div>
  )
}