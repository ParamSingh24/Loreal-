"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Sparkles, Droplets, ArrowRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import MolecularAnimation from "@/components/MolecularAnimation";

type AppPhase = "inventory" | "context" | "synthesizing" | "recipe";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("inventory");
  const [images, setImages] = useState<File[]>([]);
  const [occasion, setOccasion] = useState("");
  const [climate, setClimate] = useState("");
  const [outfitColor, setOutfitColor] = useState("");
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleSynthesize = async () => {
    if (!occasion || !climate || !outfitColor) {
      setError("Please select all contextual details before synthesizing.");
      return;
    }

    setError("");
    setPhase("synthesizing");

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      formData.append("occasion", occasion);
      formData.append("climate", climate);
      formData.append("outfitColor", outfitColor);

      const response = await fetch("/api/synthesize", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to synthesize recipe");
      }

      setRecipe(data.result);
      setPhase("recipe");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setPhase("context");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  return (
    <main className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-6xl text-primary font-medium tracking-wide drop-shadow-[0_0_10px_rgba(200,161,101,0.3)] mb-4">
          Synthesize
        </h1>
        <p className="font-sans text-muted-foreground tracking-[0.2em] uppercase text-xs md:text-sm">
          L'Oréal Luxe Olfactory Engine
        </p>
      </div>

      <div className="w-full max-w-2xl bg-black/40 border border-primary/20 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          {/* Phase 1: Inventory */}
          {phase === "inventory" && (
            <motion.div
              key="inventory"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex flex-col items-center space-y-8"
            >
              <div className="text-center space-y-3">
                <h2 className="font-heading text-2xl md:text-3xl text-white">Your Fragrance Wardrobe</h2>
                <p className="text-muted-foreground text-sm font-light">
                  Upload an image of the perfumes currently in your collection to begin the synthesis.
                </p>
              </div>

              <div
                {...getRootProps()}
                className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4
                  ${isDragActive ? "border-primary bg-primary/10" : "border-primary/30 bg-black/40 hover:border-primary/60 hover:bg-black/60"}
                `}
              >
                <input {...getInputProps()} />
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <UploadCloud size={32} />
                </div>
                {images.length > 0 ? (
                  <p className="text-primary font-medium">{images.length} file(s) selected.</p>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Drag & drop an image here, or <span className="text-primary hover:underline">click to select</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => setPhase("context")}
                disabled={images.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-black font-semibold uppercase tracking-wider py-4 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(200,161,101,0.3)]"
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Phase 2: Context */}
          {phase === "context" && (
            <motion.div
              key="context"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex flex-col space-y-8"
            >
              <div className="text-center space-y-3">
                <h2 className="font-heading text-2xl md:text-3xl text-white">The Canvas</h2>
                <p className="text-muted-foreground text-sm font-light">
                  Provide context to architect your perfect layering protocol.
                </p>
              </div>

              {error && (
                <div className="bg-destructive/20 text-destructive border border-destructive/50 p-3 rounded-md text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-primary uppercase tracking-widest font-medium">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-black/60 border border-primary/30 text-white rounded-md p-3 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="" disabled>Select Occasion</option>
                    <option value="Black Tie Event">Black Tie Event</option>
                    <option value="Intimate Dinner">Intimate Dinner</option>
                    <option value="Boardroom Meeting">Boardroom Meeting</option>
                    <option value="Weekend Escape">Weekend Escape</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-primary uppercase tracking-widest font-medium">Climate</label>
                  <select
                    value={climate}
                    onChange={(e) => setClimate(e.target.value)}
                    className="w-full bg-black/60 border border-primary/30 text-white rounded-md p-3 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="" disabled>Select Climate</option>
                    <option value="Crisp Autumn">Crisp Autumn</option>
                    <option value="Harsh Winter">Harsh Winter</option>
                    <option value="Humid Summer">Humid Summer</option>
                    <option value="Mild Spring">Mild Spring</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-primary uppercase tracking-widest font-medium">Dominant Outfit Color</label>
                  <input
                    type="text"
                    placeholder="e.g., Midnight Blue, Emerald, Crimson..."
                    value={outfitColor}
                    onChange={(e) => setOutfitColor(e.target.value)}
                    className="w-full bg-black/60 border border-primary/30 text-white rounded-md p-3 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setPhase("inventory")}
                  className="w-1/3 border border-primary/50 text-primary hover:bg-primary/10 font-medium uppercase tracking-wider py-4 px-6 rounded-md transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSynthesize}
                  className="w-2/3 bg-primary hover:bg-primary/90 text-black font-semibold uppercase tracking-wider py-4 px-6 rounded-md transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(200,161,101,0.3)]"
                >
                  <Sparkles size={18} />
                  <span>Synthesize</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Synthesizing */}
          {phase === "synthesizing" && (
            <motion.div
              key="synthesizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="py-12"
            >
              <MolecularAnimation />
            </motion.div>
          )}

          {/* Phase 4: Recipe */}
          {phase === "recipe" && (
            <motion.div
              key="recipe"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex flex-col space-y-10"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <Droplets size={28} />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl text-white tracking-tight">
                  Your Signature Blend
                </h2>
              </div>

              <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-headings:font-heading prose-a:text-primary max-w-none">
                <ReactMarkdown>{recipe}</ReactMarkdown>
              </div>

              <div className="border-t border-primary/20 pt-8 flex flex-col space-y-6">
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Beauty Tech Initiative</p>
                  <p className="text-sm text-gray-400">
                    By maximizing your current inventory, Synthesize reduces fragrance waste by 30%.
                    <br /><br />
                    <em className="text-gray-300">Protecting the integrity of luxury ingredients that dupes cannot replicate.</em>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setImages([]);
                    setPhase("inventory");
                  }}
                  className="w-full border border-primary text-primary hover:bg-primary hover:text-black font-medium uppercase tracking-wider py-4 px-6 rounded-md transition-all duration-300"
                >
                  Synthesize Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
