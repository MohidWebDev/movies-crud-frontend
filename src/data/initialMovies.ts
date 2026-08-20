import { Movie } from "../types";

export const INITIAL_MOVIES: Movie[] = [
  {
    id: "neon-dreams",
    title: "Neon Dreams",
    director: "Ridley Scott",
    year: "2049",
    genre: "Sci-Fi, Thriller",
    genres: ["SCI-FI", "THRILLER"],
    rating: 9.2,
    duration: "2h 44m",
    description:
      "In a neon-drenched dystopian metropolis, an enigmatic synth-detective unravels a multi-layered cybernetic conspiracy that threatens the fragile boundary between synthetic and human consciousness.",
    posterUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    cast: ["Ryan Gosling", "Ana de Armas", "Harrison Ford", "Sylvia Hoeks"],
    createdAt: Date.now() - 400000,
  },
  {
    id: "midnight-echoes",
    title: "Midnight Echoes",
    director: "David Fincher",
    year: "2021",
    genre: "Drama, Crime",
    genres: ["DRAMA", "CRIME"],
    rating: 8.8,
    duration: "2h 18m",
    description:
      "A nocturnal investigative journalist obsessed with untangled audio recordings stumbles upon covert wiretaps that link high-society political elites to an unsolved string of downtown disappearances.",
    posterUrl:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    cast: ["Jake Gyllenhaal", "Rooney Mara", "Mark Ruffalo", "Mahershala Ali"],
    createdAt: Date.now() - 300000,
  },
  {
    id: "the-silent-horizon",
    title: "The Silent Horizon",
    director: "Denis Villeneuve",
    year: "2024",
    genre: "Action, Adventure",
    genres: ["ACTION", "ADVENTURE"],
    rating: 8.5,
    duration: "2h 35m",
    description:
      "Spanning desolate alien plateaus and deep space terraforming colonies, an isolated expedition must decide the fate of humanity after awakening an ancient subterranean intelligence.",
    posterUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    cast: ["Timothée Chalamet", "Zendaya", "Oscar Isaac", "Rebecca Ferguson"],
    createdAt: Date.now() - 200000,
  },
  {
    id: "velocity",
    title: "Velocity",
    director: "George Miller",
    year: "2019",
    genre: "Action",
    genres: ["ACTION"],
    rating: 7.9,
    duration: "2h 00m",
    description:
      "A ferocious, non-stop desert pursuit where armored hot-rods and customized interceptors tear across scorched canyon highways in a daring escape from a ruthless warlord’s armada.",
    posterUrl:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    cast: [
      "Tom Hardy",
      "Charlize Theron",
      "Nicholas Hoult",
      "Hugh Keays-Byrne",
    ],
    createdAt: Date.now() - 100000,
  },
];
