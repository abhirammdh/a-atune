"use client"

import * as React from "react"
import { Plus, Music, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { NormalizedSong } from "@/components/player/player-context"

type Playlist = {
  id: string
  name: string
  songs: NormalizedSong[]
  createdAt: number
}

export default function UserPlaylists() {
  const [playlists, setPlaylists] = React.useState<Playlist[]>([])
  const [newName, setNewName] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  // Load playlists from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("user:playlists")
    if (saved) {
      try {
        setPlaylists(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load playlists:", e)
      }
    }
  }, [])

  // Save playlists to localStorage
  React.useEffect(() => {
    localStorage.setItem("user:playlists", JSON.stringify(playlists))
  }, [playlists])

  const createPlaylist = () => {
    if (!newName.trim()) return
    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newName.trim(),
      songs: [],
      createdAt: Date.now(),
    }
    setPlaylists([...playlists, playlist])
    setNewName("")
    setIsCreating(false)
  }

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Playlists</h2>
        <Button
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Playlist
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4">
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Playlist name..."
              onKeyDown={(e) => e.key === "Enter" && createPlaylist()}
              autoFocus
            />
            <Button onClick={createPlaylist}>Create</Button>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground">{playlist.songs.length} songs</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => deletePlaylist(playlist.id)} className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {playlists.length === 0 && !isCreating && (
        <p className="text-center text-sm text-muted-foreground py-8">No playlists yet. Create your first playlist!</p>
      )}
    </div>
  )
}
