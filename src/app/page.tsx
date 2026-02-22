"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Sparkles, Droplets, ArrowRight, PenTool, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import MolecularAnimation from "@/components/MolecularAnimation";

type AppPhase = "hero" | "inventory" | "context" | "synthesizing" | "recipe";
type EntryMode = "upload" | "manual";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("hero");
  const [entryMode, setEntryMode] = useState<EntryMode>("upload");
  const [images, setImages] = useState<File[]>([]);

  // Manual Entry State
  const [manualPerfumes, setManualPerfumes] = useState("");
  const [homeIngredients, setHomeIngredients] = useState("");

  const [occasion, setOccasion] = useState("");
  const [climate, setClimate] = useState("");
  const [outfitColor, setOutfitColor] = useState("");
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");

  const synthesisRef = useRef<HTMLDivElement>(null);

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

      formData.append("entryMode", entryMode);

      if (entryMode === "upload") {
        images.forEach((img) => formData.append("images", img));
      } else {
        formData.append("manualPerfumes", manualPerfumes);
        formData.append("homeIngredients", homeIngredients);
      }

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

  const getStarted = () => {
    setPhase("inventory");
    setTimeout(() => {
      synthesisRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    <main className="flex-grow flex flex-col min-h-screen relative w-full overflow-x-hidden">

      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-[0.3em] backdrop-blur-sm mb-4">
            L'Oréal Luxe Olfactory Engine
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-primary font-medium tracking-wide drop-shadow-sm">
            Synthesize
          </h1>
          <p className="font-sans text-foreground/80 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Elevate your personal fragrance wardrobe. Our Master Perfumer AI analyzes your collection to architect the perfect layering protocol for any occasion.
          </p>

          <div className="pt-8">
            <button
              onClick={getStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-widest py-4 px-10 rounded-sm transition-all duration-300 shadow-[0_4px_20px_rgba(200,161,101,0.2)] hover:shadow-[0_4px_30px_rgba(200,161,101,0.4)] flex items-center justify-center space-x-3 mx-auto"
            >
              <span>Begin Synthesis</span>
              <Sparkles size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="w-full bg-background/50 backdrop-blur-xl border-y border-primary/10 py-20 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">The Protocol</h2>
            <div className="h-px w-24 bg-primary mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-heading">1</div>
              <h3 className="font-bold text-lg text-foreground uppercase tracking-widest">Inventory</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Submit your current fragrances either via a quick photograph or by typing out your collection.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-heading">2</div>
              <h3 className="font-bold text-lg text-foreground uppercase tracking-widest">Context</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Provide the canvas. Tell us the climate, occasion, and your dominant outfit color.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-heading">3</div>
              <h3 className="font-bold text-lg text-foreground uppercase tracking-widest">Synthesis</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Receive a bespoke Master Perfumer layering recipe and a L'Oréal product recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Section */}
      <section ref={synthesisRef} className="w-full py-24 px-4 flex justify-center relative z-10 min-h-[80vh]">
        {phase !== "hero" && (
          <div className="w-full max-w-2xl bg-card/80 border border-primary/20 backdrop-blur-2xl rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
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
                    <h2 className="font-heading text-2xl md:text-3xl text-foreground">Your Fragrance Wardrobe</h2>
                    <p className="text-muted-foreground text-sm font-light">
                      How would you like to provide your current inventory?
                    </p>
                  </div>

                  {/* Segmented Control */}
                  <div className="flex p-1 bg-muted rounded-lg w-full max-w-md">
                    <button
                      onClick={() => setEntryMode("upload")}
                      className={`flex-1 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-all flex items-center justify-center space-x-2 ${entryMode === 'upload' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <ImageIcon size={16} />
                      <span>Upload Image</span>
                    </button>
                    <button
                      onClick={() => setEntryMode("manual")}
                      className={`flex-1 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-all flex items-center justify-center space-x-2 ${entryMode === 'manual' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <PenTool size={16} />
                      <span>Manual Entry</span>
                    </button>
                  </div>

                  {entryMode === "upload" ? (
                    <div
                      {...getRootProps()}
                      className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4
                        ${isDragActive ? "border-primary bg-primary/5" : "border-primary/20 bg-background/50 hover:border-primary/50 hover:bg-background"}
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="p-4 rounded-full bg-primary/10 text-primary">
                        <UploadCloud size={32} />
                      </div>
                      {images.length > 0 ? (
                        <div className="text-center">
                          <p className="text-primary font-medium">{images.length} file(s) selected.</p>
                          <p className="text-xs text-muted-foreground mt-2 truncate max-w-xs">{images[0].name}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center">
                          Drag & drop an image here, or <span className="text-primary font-medium hover:underline">click to select</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs text-foreground uppercase tracking-widest font-semibold">Which perfumes do you currently own?</label>
                        <textarea
                          placeholder="e.g. YSL Libre, Dior Sauvage, Tom Ford Black Orchid..."
                          value={manualPerfumes}
                          onChange={(e) => setManualPerfumes(e.target.value)}
                          className="w-full bg-background border border-primary/20 text-foreground rounded-md p-4 min-h-[100px] focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-foreground uppercase tracking-widest font-semibold flex items-center">
                          Bonus Ingredients
                          <span className="ml-2 text-[10px] text-muted-foreground lowercase tracking-normal font-normal bg-muted px-2 py-0.5 rounded-full">(Optional)</span>
                        </label>
                        <textarea
                          placeholder="What do you have at home to make a perfume list? (e.g. Essential oils, vanilla extract, rose water...)"
                          value={homeIngredients}
                          onChange={(e) => setHomeIngredients(e.target.value)}
                          className="w-full bg-background border border-primary/20 text-foreground rounded-md p-4 min-h-[80px] focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setPhase("context")}
                    disabled={entryMode === "upload" ? images.length === 0 : manualPerfumes.trim().length === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider py-4 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(200,161,101,0.2)]"
                  >
                    <span>Continue to Context</span>
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
                    <h2 className="font-heading text-2xl md:text-3xl text-foreground">The Canvas</h2>
                    <p className="text-muted-foreground text-sm font-light">
                      Provide context to architect your perfect layering protocol.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-md text-sm text-center">
                      <p className="font-semibold mb-1">Configuration Error</p>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm text-foreground uppercase tracking-widest font-semibold">Occasion</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-background border border-primary/20 text-foreground rounded-md p-3 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary appearance-none"
                      >
                        <option value="" disabled>Select Occasion</option>
                        <option value="Black Tie Event">Black Tie Event</option>
                        <option value="Intimate Dinner">Intimate Dinner</option>
                        <option value="Boardroom Meeting">Boardroom Meeting</option>
                        <option value="Weekend Escape">Weekend Escape</option>
                        <option value="Everyday Signature">Everyday Signature</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-foreground uppercase tracking-widest font-semibold">Climate</label>
                      <select
                        value={climate}
                        onChange={(e) => setClimate(e.target.value)}
                        className="w-full bg-background border border-primary/20 text-foreground rounded-md p-3 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary appearance-none"
                      >
                        <option value="" disabled>Select Climate</option>
                        <option value="Crisp Autumn">Crisp Autumn</option>
                        <option value="Harsh Winter">Harsh Winter</option>
                        <option value="Humid Summer">Humid Summer</option>
                        <option value="Mild Spring">Mild Spring</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-foreground uppercase tracking-widest font-semibold">Dominant Outfit Color</label>
                      <input
                        type="text"
                        placeholder="e.g., Midnight Blue, Emerald, Crimson..."
                        value={outfitColor}
                        onChange={(e) => setOutfitColor(e.target.value)}
                        className="w-full bg-background border border-primary/20 text-foreground rounded-md p-3 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setPhase("inventory")}
                      className="w-1/3 border border-border text-foreground hover:bg-muted font-medium uppercase tracking-wider py-4 px-6 rounded-md transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSynthesize}
                      className="w-2/3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider py-4 px-6 rounded-md transition-all flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(200,161,101,0.2)]"
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
                  className="py-8"
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
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2 shadow-inner">
                      <Droplets size={28} />
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl text-foreground tracking-tight">
                      Your Signature Blend
                    </h2>
                  </div>

                  <div className="prose prose-sm md:prose-base max-w-none 
                    prose-p:text-muted-foreground prose-p:leading-relaxed 
                    prose-headings:text-foreground prose-headings:font-heading prose-headings:font-medium
                    prose-strong:text-primary prose-strong:font-semibold
                    prose-ul:text-muted-foreground prose-li:marker:text-primary
                    prose-a:text-primary">
                    <ReactMarkdown>{recipe}</ReactMarkdown>
                  </div>

                  <div className="border-t border-border pt-8 flex flex-col space-y-6">
                    <div className="bg-muted p-6 rounded-lg text-center border border-border/50">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Beauty Tech Initiative</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        By maximizing your current inventory, Synthesize reduces fragrance waste by 30%.
                        <br /><br />
                        <em className="text-foreground font-medium italic">Protecting the integrity of luxury ingredients that dupes cannot replicate.</em>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setImages([]);
                        setManualPerfumes("");
                        setHomeIngredients("");
                        setPhase("inventory");
                      }}
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold uppercase tracking-widest py-4 px-6 rounded-md transition-all duration-300"
                    >
                      Synthesize Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="w-full bg-background border-t border-border py-8 text-center relative z-10 mt-auto">
        <p className="font-heading text-xl text-primary mb-2 tracking-wider">Synthesize</p>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-light">
          L'Oréal Luxe Olfactory Engine &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
