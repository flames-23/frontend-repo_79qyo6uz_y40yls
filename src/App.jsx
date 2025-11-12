import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchVideos = async (search = '') => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/videos${search ? `?q=${encodeURIComponent(search)}` : ''}`)
      const data = await res.json()
      setVideos(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchVideos(query)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please choose a video file to upload')
      return
    }
    setUploading(true)
    setMessage('')
    const form = new FormData()
    form.append('file', file)
    if (title) form.append('title', title)
    if (description) form.append('description', description)
    if (tags) form.append('tags', tags)

    try {
      const res = await fetch(`${baseUrl}/api/videos`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setMessage('✅ Upload successful')
      setFile(null)
      setTitle('')
      setDescription('')
      setTags('')
      await fetchVideos()
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-xl font-extrabold text-red-600">VibeTube</Link>
          <form onSubmit={handleSearch} className="flex-1 flex">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
              placeholder="Search"
            />
            <button className="bg-gray-100 border border-l-0 rounded-r px-4">Search</button>
          </form>
          <Link to="/test" className="text-sm text-gray-600 hover:text-gray-900">Backend Test</Link>
        </div>
      </header>

      {/* Upload Section */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Upload a video</h2>
          <form onSubmit={handleUpload} className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
              <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2" />
              <input value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
            </div>
            <div className="space-y-2">
              <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full border rounded px-3 py-2" />
              <div className="flex items-center gap-3">
                <button disabled={uploading} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {message && <span className="text-sm text-gray-600">{message}</span>}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Feed */}
      <main className="mx-auto max-w-6xl px-4 pb-10">
        <h3 className="font-semibold text-gray-800 mb-4">Latest uploads</h3>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {videos.map((v) => (
              <Link key={v.id} to={`/watch/${v.id}`} className="group">
                <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                  <video src={`${baseUrl}/stream/${v.filename}`} className="w-full h-full object-cover" muted preload="metadata" />
                </div>
                <div className="mt-2">
                  <h4 className="font-semibold text-gray-900 group-hover:underline line-clamp-2">{v.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{v.description}</p>
                </div>
              </Link>
            ))}
            {videos.length === 0 && (
              <p className="text-gray-600">No videos yet. Upload one above to get started.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
