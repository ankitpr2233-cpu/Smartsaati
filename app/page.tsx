"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Play,
  Star,
  Calendar,
  Clock,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient" // Supabase client import करें

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

// Safely get the first part of a comma-separated string
const firstPart = (value?: string, delimiter = ",") => (value ?? "").split(delimiter)[0] || "N/A"

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedQuality, setSelectedQuality] = useState("all")
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      const { data, error } = await supabase.from("movies").select("*")
      if (error) {
        console.error("Error fetching movies:", error)
      } else {
        setMovies(data as Movie[])
        setFeaturedMovies(data.filter((movie: Movie) => movie.isFeatured))
      }
    }
    fetchMovies()
  }, [])

  useEffect(() => {
    // Load AdSense ads
    try {
      if (window && (window as any).adsbygoogle) {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (e) {
      console.error("AdSense error:", e)
    }
  }, [])

  useEffect(() => {
    let filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.genre ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.cast ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (selectedGenre !== "all") {
      filtered = filtered.filter((movie) => movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()))
    }

    if (selectedQuality !== "all") {
      filtered = filtered.filter((movie) => movie.quality === selectedQuality)
    }

    setFilteredMovies(filtered)
  }, [movies, searchTerm, selectedGenre, selectedQuality])

  // Auto-slide for banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredMovies.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
  }

  const genres = ["all", "action", "drama", "comedy", "thriller", "horror", "romance", "sci-fi"]
  const qualities = ["all", "HD", "4K UHD", "CAM", "HDRip"]

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 no-scroll-x">
      {/* Header */}
      <header className="w-full bg-black/80 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-white">
                <span className="text-red-500">Smart</span>
                <span className="text-orange-500">Saathi</span>
              </h1>
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                HD Movies
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500/30 text-green-400 hidden md:flex">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent btn-glow"
                >
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Slider */}
      {featuredMovies.length > 0 && (
        <section className="relative w-full h-[70vh] overflow-hidden">
          <div className="relative w-full h-full">
            {featuredMovies.map((movie, index) => (
              <div
                key={movie.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>
                <Image src={movie.thumbnail || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="max-w-2xl">
                      <Badge className="mb-4 bg-red-500 text-white">Featured Movie</Badge>
                      <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">{movie.title}</h2>
                      <div className="flex items-center gap-4 mb-4 text-white/80">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 text-yellow-500" />
                          {movie.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-5 w-5" />
                          {movie.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-5 w-5" />
                          {movie.duration}
                        </div>
                        <Badge variant="outline" className="border-white/30 text-white">
                          {movie.quality}
                        </Badge>
                      </div>
                      <p className="text-lg text-white/90 mb-6 line-clamp-3">{movie.description}</p>
                      <div className="flex gap-4">
                        <Button size="lg" className="bg-red-500 hover:bg-red-600 btn-glow">
                          <Play className="h-5 w-5 mr-2" />
                          Watch Now
                        </Button>
                        <a
                          href={movie.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/30 text-white bg-white/10 backdrop-blur h-11 px-8"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-red-500" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* AdSense Ad Unit */}
      <section className="w-full px-4 py-8">
        <div className="w-full max-w-7xl mx-auto text-center">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-center">
            {/* यह आपका AdSense Ad Unit है */}
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-8125604352764499"
              data-ad-slot="9876543210" // **यह आपकी Ad Slot ID है**
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="w-full px-4 py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              Trending Now
            </h3>
            <Badge variant="outline" className="border-orange-500/30 text-orange-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              Hot
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {movies
              .filter((movie) => movie.isTrending)
              .slice(0, 6)
              .map((movie) => (
                <Card
                  key={movie.id}
                  className="bg-gray-800/50 border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group overflow-hidden movie-card"
                >
                  <div className="relative">
                    <Image
                      src={movie.thumbnail || "/placeholder.svg"}
                      alt={movie.title}
                      width={300}
                      height={400}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">Trending</Badge>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{movie.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{movie.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {movie.rating}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="w-full py-8 px-4 bg-black/30">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search movies, actors, directors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre} className="text-white hover:bg-gray-700">
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {qualities.map((quality) => (
                    <SelectItem key={quality} value={quality} className="text-white hover:bg-gray-700">
                      {quality === "all" ? "All Quality" : quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* All Movies */}
      <section className="w-full px-4 pb-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white flex items-center gap-2">
              <Play className="h-8 w-8 text-red-500" />
              All Movies
            </h3>
            <Badge variant="outline" className="border-red-500/30 text-red-400">
              {filteredMovies.length} Movies
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <Card
                key={movie.id}
                className="bg-gray-800/50 border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group overflow-hidden movie-card"
              >
                <div className="relative">
                  <Image
                    src={movie.thumbnail || "/placeholder.svg"}
                    alt={movie.title}
                    width={400}
                    height={600}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                        <Play className="h-4 w-4 mr-1" />
                        Watch
                      </Button>
                      <a
                        href={movie.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/30 text-white bg-white/10 h-9 px-3"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-red-500 text-white text-xs">{movie.quality}</Badge>
                    {movie.isTrending && <Badge className="bg-orange-500 text-white text-xs">Trending</Badge>}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="outline" className="border-white/30 text-white bg-black/50 text-xs">
                      {movie.size}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-2 line-clamp-1">{movie.title}</h4>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {movie.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {movie.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {movie.duration}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{movie.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-gray-400">
                      <span className="text-white">Cast:</span>{" "}
                      {firstPart(movie.cast, ",") + (movie.cast?.includes(",") ? ", …" : "")}
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="text-white">Director:</span> {movie.director}
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="text-white">Language:</span> {movie.language}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {firstPart(movie.genre)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="h-3 w-3" />
                      {movie.views}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-red-500 hover:bg-red-600 btn-glow">
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                    <a
                      href={movie.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-600 text-gray-300 bg-transparent h-9 px-3"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-400 text-xl mb-4">No movies found matching your search.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedGenre("all")
                  setSelectedQuality("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black/90 border-t border-red-500/20 py-12">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-red-500">Smart</span>
                <span className="text-orange-500">Saathi</span>
              </h3>
              <p className="text-gray-400 mb-4">Your ultimate destination for HD movies and entertainment.</p>
              <div className="flex gap-4">
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Bollywood Movies</li>
                <li>Hollywood Movies</li>
                <li>South Indian Movies</li>
                <li>Web Series</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quality</h4>
              <ul className="space-y-2 text-gray-400">
                <li>4K UHD Movies</li>
                <li>HD Movies</li>
                <li>HDRip Movies</li>
                <li>CAM Movies</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Request Movie</li>
                <li>Report Issue</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">Made in India by Kashyap</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
