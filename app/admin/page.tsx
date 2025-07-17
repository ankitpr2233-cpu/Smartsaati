"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, Plus, Edit, Trash2, Eye, Settings, Upload, Film, Star, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient" // यह नई फाइल है जो हमने अभी बनाई है

interface Movie {
  id: string
  title: string
  thumbnail: string
  url: string
  genre: string
  year: string
  rating: string
  duration: string
  quality: string
  description: string
  views: string
  cast: string
  director: string
  trailer: string
  language: string
  size: string
  isFeatured: boolean
  isTrending: boolean
  category: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [adminPassword, setAdminPassword] = useState("admin123")
  const [movies, setMovies] = useState<Movie[]>([])
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [newMovie, setNewMovie] = useState<Omit<Movie, "id">>({
    title: "",
    thumbnail: "",
    url: "",
    genre: "",
    year: "",
    rating: "",
    duration: "",
    quality: "HD",
    description: "",
    views: "0",
    cast: "",
    director: "",
    trailer: "",
    language: "Hindi",
    size: "",
    isFeatured: false,
    isTrending: false,
    category: "Bollywood",
  })

  useEffect(() => {
    const savedPassword = localStorage.getItem("smartsaathi-admin-password")
    if (savedPassword) {
      setAdminPassword(savedPassword)
    }
    // Supabase से movies fetch करें
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    const { data, error } = await supabase.from("movies").select("*")
    if (error) {
      console.error("Error fetching movies:", error)
      showAlert("error", "Failed to fetch movies!")
    } else {
      setMovies(data as Movie[])
    }
  }

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAuthenticated(true)
      showAlert("success", "Successfully logged in!")
    } else {
      showAlert("error", "Invalid password!")
    }
  }

  const handlePasswordChange = () => {
    if (password.length >= 6) {
      setAdminPassword(password)
      localStorage.setItem("smartsaathi-admin-password", password)
      showAlert("success", "Password updated successfully!")
      setPassword("")
    } else {
      showAlert("error", "Password must be at least 6 characters!")
    }
  }

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.thumbnail || !newMovie.url) {
      showAlert("error", "Please fill all required fields!")
      return
    }

    const movieToAdd = {
      ...newMovie,
      views: "0", // Supabase में views को string के रूप में store करें
    }

    const { data, error } = await supabase.from("movies").insert([movieToAdd]).select()

    if (error) {
      console.error("Error adding movie:", error)
      showAlert("error", "Failed to add movie!")
    } else {
      setMovies((prev) => [...prev, data[0]])
      setNewMovie({
        title: "",
        thumbnail: "",
        url: "",
        genre: "",
        year: "",
        rating: "",
        duration: "",
        quality: "HD",
        description: "",
        views: "0",
        cast: "",
        director: "",
        trailer: "",
        language: "Hindi",
        size: "",
        isFeatured: false,
        isTrending: false,
        category: "Bollywood",
      })
      showAlert("success", "Movie added successfully!")
    }
  }

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie)
  }

  const handleUpdateMovie = async () => {
    if (!editingMovie) return

    const { data, error } = await supabase.from("movies").update(editingMovie).eq("id", editingMovie.id).select()

    if (error) {
      console.error("Error updating movie:", error)
      showAlert("error", "Failed to update movie!")
    } else {
      setMovies((prev) => prev.map((movie) => (movie.id === editingMovie.id ? data[0] : movie)))
      setEditingMovie(null)
      showAlert("success", "Movie updated successfully!")
    }
  }

  const handleDeleteMovie = async (id: string) => {
    const { error } = await supabase.from("movies").delete().eq("id", id)

    if (error) {
      console.error("Error deleting movie:", error)
      showAlert("error", "Failed to delete movie!")
    } else {
      setMovies((prev) => prev.filter((movie) => movie.id !== id))
      showAlert("success", "Movie deleted successfully!")
    }
  }

  const toggleFeatured = async (id: string) => {
    const movieToUpdate = movies.find((movie) => movie.id === id)
    if (!movieToUpdate) return

    const { data, error } = await supabase
      .from("movies")
      .update({ isFeatured: !movieToUpdate.isFeatured })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error toggling featured status:", error)
      showAlert("error", "Failed to update featured status!")
    } else {
      setMovies((prev) => prev.map((movie) => (movie.id === id ? data[0] : movie)))
      showAlert("success", "Movie featured status updated!")
    }
  }

  const toggleTrending = async (id: string) => {
    const movieToUpdate = movies.find((movie) => movie.id === id)
    if (!movieToUpdate) return

    const { data, error } = await supabase
      .from("movies")
      .update({ isTrending: !movieToUpdate.isTrending })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error toggling trending status:", error)
      showAlert("error", "Failed to update trending status!")
    } else {
      setMovies((prev) => prev.map((movie) => (movie.id === id ? data[0] : movie)))
      showAlert("success", "Movie trending status updated!")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-white">SmartSaathi Admin</CardTitle>
            <CardDescription className="text-gray-400">Enter password to access admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alert && (
              <Alert
                className={alert.type === "error" ? "border-red-500 bg-red-500/10" : "border-green-500 bg-green-500/10"}
              >
                <AlertDescription className={alert.type === "error" ? "text-red-400" : "text-green-400"}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-red-500 hover:bg-red-600">
              Login to Admin Panel
            </Button>
            <div className="text-center">
              <Link href="/" className="text-red-400 hover:text-red-300 text-sm">
                ← Back to Website
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const featuredMovies = movies.filter((movie) => movie.isFeatured)
  const trendingMovies = movies.filter((movie) => movie.isTrending)
  const totalViews = movies.reduce((acc, movie) => acc + Number.parseInt(movie.views.replace(/[^\d]/g, "") || "0"), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
              SmartSaathi Admin Panel
            </h1>
            <p className="text-gray-400">Manage your movie website with advanced controls</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View Website
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              className="border-red-500/30 text-red-400"
            >
              Logout
            </Button>
          </div>
        </div>

        {alert && (
          <Alert
            className={`mb-6 ${alert.type === "error" ? "border-red-500 bg-red-500/10" : "border-green-500 bg-green-500/10"}`}
          >
            <AlertDescription className={alert.type === "error" ? "text-red-400" : "text-green-400"}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Movies</p>
                  <p className="text-3xl font-bold text-white">{movies.length}</p>
                </div>
                <Film className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Featured Movies</p>
                  <p className="text-3xl font-bold text-white">{featuredMovies.length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Trending Movies</p>
                  <p className="text-3xl font-bold text-white">{trendingMovies.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-3xl font-bold text-white">{totalViews}K</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="movies" className="data-[state=active]:bg-red-500">
              <Film className="h-4 w-4 mr-2" />
              All Movies
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-red-500">
              <Star className="h-4 w-4 mr-2" />
              Banner Control
            </TabsTrigger>
            <TabsTrigger value="add-movie" className="data-[state=active]:bg-red-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Movie
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-red-500">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* All Movies Management */}
          <TabsContent value="movies">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Manage All Movies ({movies.length})
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View, edit, and delete movies from your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {movies.map((movie) => (
                    <div key={movie.id} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                      <img
                        src={movie.thumbnail || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{movie.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {movie.genre} • {movie.year} • {movie.language}
                        </p>
                        <p className="text-gray-500 text-xs">Director: {movie.director}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {movie.quality}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            ⭐ {movie.rating}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {movie.category}
                          </Badge>
                          {movie.isFeatured && <Badge className="bg-yellow-500 text-black text-xs">Featured</Badge>}
                          {movie.isTrending && <Badge className="bg-orange-500 text-white text-xs">Trending</Badge>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleFeatured(movie.id)}
                            className={
                              movie.isFeatured ? "border-yellow-500 text-yellow-400" : "border-gray-600 text-gray-400"
                            }
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleTrending(movie.id)}
                            className={
                              movie.isTrending ? "border-orange-500 text-orange-400" : "border-gray-600 text-gray-400"
                            }
                          >
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMovie(movie)}
                            className="border-blue-500/30 text-blue-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="border-red-500/30 text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banner Control */}
          <TabsContent value="featured">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Banner Slider Control ({featuredMovies.length}/5)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage movies that appear in the main banner slider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {featuredMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                    >
                      <img
                        src={movie.thumbnail || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold">{movie.title}</h3>
                          <Badge className="bg-yellow-500 text-black text-xs">Featured</Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">
                          {movie.genre} • {movie.year} • ⭐ {movie.rating}
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFeatured(movie.id)}
                        className="border-yellow-500/30 text-yellow-400"
                      >
                        Remove from Banner
                      </Button>
                    </div>
                  ))}
                  {featuredMovies.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No featured movies. Add movies to featured to show them in banner slider.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Movie */}
          <TabsContent value="add-movie">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Add New Movie
                </CardTitle>
                <CardDescription className="text-gray-400">Upload a new movie with complete details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Movie Title *</Label>
                      <Input
                        placeholder="Enter movie title"
                        value={newMovie.title}
                        onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Thumbnail URL *</Label>
                      <Input
                        placeholder="Enter thumbnail image URL"
                        value={newMovie.thumbnail}
                        onChange={(e) => setNewMovie({ ...newMovie, thumbnail: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Movie URL *</Label>
                    <Input
                      placeholder="Enter movie streaming/download URL"
                      value={newMovie.url}
                      onChange={(e) => setNewMovie({ ...newMovie, url: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Trailer URL</Label>
                    <Input
                      placeholder="Enter YouTube trailer URL"
                      value={newMovie.trailer}
                      onChange={(e) => setNewMovie({ ...newMovie, trailer: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Movie Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Movie Details</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Genre</Label>
                      <Input
                        placeholder="Action, Drama, Comedy"
                        value={newMovie.genre}
                        onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Year</Label>
                      <Input
                        placeholder="2024"
                        value={newMovie.year}
                        onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Rating</Label>
                      <Input
                        placeholder="8.5"
                        value={newMovie.rating}
                        onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Duration</Label>
                      <Input
                        placeholder="120 min"
                        value={newMovie.duration}
                        onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Quality</Label>
                      <Select
                        value={newMovie.quality}
                        onValueChange={(value) => setNewMovie({ ...newMovie, quality: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="4K UHD">4K UHD</SelectItem>
                          <SelectItem value="HD">HD</SelectItem>
                          <SelectItem value="HDRip">HDRip</SelectItem>
                          <SelectItem value="CAM">CAM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Language</Label>
                      <Input
                        placeholder="Hindi, English"
                        value={newMovie.language}
                        onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">File Size</Label>
                      <Input
                        placeholder="1.2 GB"
                        value={newMovie.size}
                        onChange={(e) => setNewMovie({ ...newMovie, size: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Cast</Label>
                      <Input
                        placeholder="Actor 1, Actor 2, Actor 3"
                        value={newMovie.cast}
                        onChange={(e) => setNewMovie({ ...newMovie, cast: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Director</Label>
                      <Input
                        placeholder="Director Name"
                        value={newMovie.director}
                        onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Category</Label>
                    <Select
                      value={newMovie.category}
                      onValueChange={(value) => setNewMovie({ ...newMovie, category: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Bollywood">Bollywood</SelectItem>
                        <SelectItem value="Hollywood">Hollywood</SelectItem>
                        <SelectItem value="South Indian">South Indian</SelectItem>
                        <SelectItem value="Web Series">Web Series</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-white">Description</Label>
                  <Textarea
                    placeholder="Enter movie description/plot"
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                  />
                </div>

                {/* Special Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Special Options</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <Label className="text-white font-medium">Add to Banner Slider</Label>
                      <p className="text-gray-400 text-sm">Show this movie in the main banner slider</p>
                    </div>
                    <Switch
                      checked={newMovie.isFeatured}
                      onCheckedChange={(checked) => setNewMovie({ ...newMovie, isFeatured: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <Label className="text-white font-medium">Mark as Trending</Label>
                      <p className="text-gray-400 text-sm">Show this movie in trending section</p>
                    </div>
                    <Switch
                      checked={newMovie.isTrending}
                      onCheckedChange={(checked) => setNewMovie({ ...newMovie, isTrending: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleAddMovie} className="w-full bg-red-500 hover:bg-red-600 text-lg py-6">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Movie to Website
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">Manage your admin panel settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Change Admin Password</h3>
                    <div className="space-y-2">
                      <Label className="text-white">New Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter new password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Button onClick={handlePasswordChange} className="bg-blue-500 hover:bg-blue-600">
                      Update Password
                    </Button>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Website Statistics</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-500">{movies.length}</div>
                        <div className="text-gray-400">Total Movies</div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500">{featuredMovies.length}</div>
                        <div className="text-gray-400">Featured Movies</div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">{trendingMovies.length}</div>
                        <div className="text-gray-400">Trending Movies</div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{totalViews}K</div>
                        <div className="text-gray-400">Total Views</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button variant="outline" className="border-yellow-500/30 text-yellow-400 bg-transparent">
                        Clear All Featured
                      </Button>
                      <Button variant="outline" className="border-orange-500/30 text-orange-400 bg-transparent">
                        Clear All Trending
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Movie Modal */}
        {editingMovie && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white">Edit Movie: {editingMovie.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Movie Title</Label>
                    <Input
                      value={editingMovie.title}
                      onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Thumbnail URL</Label>
                    <Input
                      value={editingMovie.thumbnail}
                      onChange={(e) => setEditingMovie({ ...editingMovie, thumbnail: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Movie URL</Label>
                  <Input
                    value={editingMovie.url}
                    onChange={(e) => setEditingMovie({ ...editingMovie, url: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Genre</Label>
                    <Input
                      value={editingMovie.genre}
                      onChange={(e) => setEditingMovie({ ...editingMovie, genre: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Year</Label>
                    <Input
                      value={editingMovie.year}
                      onChange={(e) => setEditingMovie({ ...editingMovie, year: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Rating</Label>
                    <Input
                      value={editingMovie.rating}
                      onChange={(e) => setEditingMovie({ ...editingMovie, rating: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Cast</Label>
                    <Input
                      value={editingMovie.cast}
                      onChange={(e) => setEditingMovie({ ...editingMovie, cast: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Director</Label>
                    <Input
                      value={editingMovie.director}
                      onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={editingMovie.description}
                    onChange={(e) => setEditingMovie({ ...editingMovie, description: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <Label className="text-white font-medium">Featured in Banner</Label>
                    <p className="text-gray-400 text-sm">Show in main banner slider</p>
                  </div>
                  <Switch
                    checked={editingMovie.isFeatured}
                    onCheckedChange={(checked) => setEditingMovie({ ...editingMovie, isFeatured: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <Label className="text-white font-medium">Trending Movie</Label>
                    <p className="text-gray-400 text-sm">Show in trending section</p>
                  </div>
                  <Switch
                    checked={editingMovie.isTrending}
                    onCheckedChange={(checked) => setEditingMovie({ ...editingMovie, isTrending: checked })}
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleUpdateMovie} className="flex-1 bg-green-500 hover:bg-green-600">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Movie
                  </Button>
                  <Button
                    onClick={() => setEditingMovie(null)}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
