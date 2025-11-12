import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function Watch() {
  const { id } = useParams()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/videos/${id}`)
        const data = await res.json()
        setVideo(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!video) return <div className="p-6">Not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-xl font-extrabold text-red-600">VibeTube</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="aspect-video bg-black rounded overflow-hidden">
            <video className="w-full h-full" src={`${baseUrl}/stream/${video.filename}`} controls autoPlay />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
          {video.description && <p className="text-gray-700">{video.description}</p>}
          <p className="text-sm text-gray-500">{(video.views||0).toLocaleString()} views</p>
        </div>
        <div className="space-y-3">
          <div className="bg-white border rounded p-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-gray-600">Tags: {video.tags && video.tags.length ? video.tags.join(', ') : '—'}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
