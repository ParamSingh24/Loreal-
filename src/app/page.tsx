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

  const pageTransition: any = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  return (
    <main className="flex-grow flex flex-col min-h-screen relative w-full overflow-x-hidden">

      {/* Sticky CTA Bar - visible only on hero phase while scrolling */}
      {phase === "hero" && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
            className="pointer-events-auto"
          >
            <button
              onClick={getStarted}
              className="bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-[0.2em] py-4 px-10 rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(16,185,129,0.45)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 flex items-center space-x-3 backdrop-blur-md border border-primary/40 text-sm md:text-base"
            >
              <Sparkles size={16} />
              <span>Begin Synthesis</span>
              <Sparkles size={16} />
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-10"
        >
          <div className="inline-block px-5 py-2 rounded-full border border-primary/40 bg-zinc-950/60 text-primary text-xs md:text-sm font-semibold uppercase tracking-[0.3em] backdrop-blur-md shadow-sm mb-4">
            L'Oréal Luxe Olfactory Engine
          </div>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-white font-medium tracking-wide drop-shadow-sm">
            Synthesize
          </h1>
          <p className="font-sans text-zinc-300 text-lg md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
            Elevate your personal fragrance wardrobe. Our Master Perfumer AI analyzes your collection to architect the perfect layering protocol for any occasion.
          </p>

          <div className="pt-10">
            <button
              onClick={getStarted}
              className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.2em] py-5 px-12 rounded-lg transition-all duration-300 shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 flex items-center justify-center space-x-4 mx-auto"
            >
              <span>Begin Synthesis</span>
              <Sparkles size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="w-full bg-black/60 backdrop-blur-xl border-y border-zinc-800 py-24 relative z-10 shadow-sm overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-white font-medium">The Protocol</h2>
            <div className="h-0.5 w-24 bg-primary mx-auto mt-8 opacity-70"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-heading shadow-[0_0_20px_rgba(16,185,129,0.15)] border border-primary/30">1</div>
              <h3 className="font-bold text-xl text-white uppercase tracking-widest">Inventory</h3>
              <p className="text-zinc-300 text-base leading-relaxed max-w-xs mx-auto">Submit your current fragrances via a quick photograph or by typing out your collection.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-heading shadow-[0_0_20px_rgba(16,185,129,0.15)] border border-primary/30">2</div>
              <h3 className="font-bold text-xl text-white uppercase tracking-widest">Context</h3>
              <p className="text-zinc-300 text-base leading-relaxed max-w-xs mx-auto">Provide the canvas. Tell us the climate, occasion, and your dominant outfit color.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-heading shadow-[0_0_20px_rgba(16,185,129,0.15)] border border-primary/30">3</div>
              <h3 className="font-bold text-xl text-white uppercase tracking-widest">Synthesis</h3>
              <p className="text-zinc-300 text-base leading-relaxed max-w-xs mx-auto">Receive a bespoke Master Perfumer layering recipe and a L'Oréal product recommendation.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main App Section */}
      {phase !== "hero" && (
        <section ref={synthesisRef} className="w-full py-24 px-4 flex justify-center relative z-10 min-h-[80vh]">
          <div className="w-full max-w-2xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-3xl rounded-3xl p-8 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
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
                    <p className="text-zinc-400 text-sm font-light">
                      How would you like to provide your current inventory?
                    </p>
                  </div>

                  {/* Segmented Control */}
                  <div className="flex p-1 bg-zinc-900 rounded-lg w-full max-w-md border border-zinc-800">
                    <button
                      onClick={() => setEntryMode("upload")}
                      className={`flex-1 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-all flex items-center justify-center space-x-2 ${entryMode === 'upload' ? 'bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <ImageIcon size={16} />
                      <span>Upload Image</span>
                    </button>
                    <button
                      onClick={() => setEntryMode("manual")}
                      className={`flex-1 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-all flex items-center justify-center space-x-2 ${entryMode === 'manual' ? 'bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <PenTool size={16} />
                      <span>Manual Entry</span>
                    </button>
                  </div>

                  {entryMode === "upload" ? (
                    <div
                      {...getRootProps()}
                      className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4
                        ${isDragActive ? "border-primary bg-primary/10" : "border-primary/30 bg-black/40 hover:border-primary/60 hover:bg-black/80"}
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="p-4 rounded-full bg-primary/10 text-primary">
                        <UploadCloud size={32} />
                      </div>
                      {images.length > 0 ? (
                        <div className="text-center">
                          <p className="text-primary font-medium">{images.length} file(s) selected.</p>
                          <p className="text-xs text-zinc-400 mt-2 truncate max-w-xs">{images[0].name}</p>
                        </div>
                      ) : (
                        <p className="text-zinc-400 text-center">
                          Drag & drop an image here, or <span className="text-primary font-medium hover:underline">click to select</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-300 uppercase tracking-widest font-semibold flex items-center justify-between">
                          <span>Which perfumes do you currently own?</span>
                        </label>
                        <textarea
                          placeholder="e.g. YSL Libre, Dior Sauvage, Tom Ford Black Orchid..."
                          value={manualPerfumes}
                          onChange={(e) => setManualPerfumes(e.target.value)}
                          className="w-full bg-black/50 border border-zinc-800 text-white rounded-md p-4 min-h-[100px] focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-300 uppercase tracking-widest font-semibold flex items-center">
                          Bonus Ingredients
                          <span className="ml-2 text-[10px] text-zinc-500 lowercase tracking-normal font-normal bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">(Optional)</span>
                        </label>
                        <textarea
                          placeholder="What do you have at home to make a perfume list? (e.g. Essential oils, vanilla extract, rose water...)"
                          value={homeIngredients}
                          onChange={(e) => setHomeIngredients(e.target.value)}
                          className="w-full bg-black/50 border border-zinc-800 text-white rounded-md p-4 min-h-[80px] focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setPhase("context")}
                    disabled={entryMode === "upload" ? images.length === 0 : manualPerfumes.trim().length === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider py-4 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
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
                    <h2 className="font-heading text-2xl md:text-3xl text-white">The Canvas</h2>
                    <p className="text-zinc-400 text-sm font-light">
                      Provide context to architect your perfect layering protocol.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg text-sm text-center shadow-sm">
                      <p className="font-bold mb-1">Configuration Error</p>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm text-white uppercase tracking-widest font-bold">Occasion</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-black/50 border border-zinc-800 text-white rounded-lg p-4 font-medium focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-zinc-500">Select Occasion</option>
                        <option value="Black Tie Event" className="text-slate-900">Black Tie Event</option>
                        <option value="Intimate Dinner" className="text-slate-900">Intimate Dinner</option>
                        <option value="Boardroom Meeting" className="text-slate-900">Boardroom Meeting</option>
                        <option value="Weekend Escape" className="text-slate-900">Weekend Escape</option>
                        <option value="Everyday Signature" className="text-slate-900">Everyday Signature</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm text-white uppercase tracking-widest font-bold">Climate</label>
                      <select
                        value={climate}
                        onChange={(e) => setClimate(e.target.value)}
                        className="w-full bg-black/50 border border-zinc-800 text-white rounded-lg p-4 font-medium focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-zinc-500">Select Climate</option>
                        <option value="Crisp Autumn" className="text-slate-900">Crisp Autumn</option>
                        <option value="Harsh Winter" className="text-slate-900">Harsh Winter</option>
                        <option value="Humid Summer" className="text-slate-900">Humid Summer</option>
                        <option value="Mild Spring" className="text-slate-900">Mild Spring</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm text-white uppercase tracking-widest font-bold">Dominant Outfit Color</label>
                      <input
                        type="text"
                        placeholder="e.g., Midnight Blue, Emerald, Crimson..."
                        value={outfitColor}
                        onChange={(e) => setOutfitColor(e.target.value)}
                        className="w-full bg-black/50 border border-zinc-800 text-white rounded-lg p-4 font-medium focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-6 pt-4">
                    <button
                      onClick={() => setPhase("inventory")}
                      className="w-1/3 border-2 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white font-bold uppercase tracking-wider py-4 px-6 rounded-lg transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSynthesize}
                      className="w-2/3 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest py-4 px-6 rounded-lg transition-all flex items-center justify-center space-x-3 shadow-[0_10px_25px_rgba(16,185,129,0.25)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.4)]"
                    >
                      <Sparkles size={20} />
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
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2 shadow-inner border border-primary/20">
                      <Droplets size={28} />
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl text-white tracking-tight">
                      Your Signature Blend
                    </h2>
                  </div>

                  <div className="prose prose-sm md:prose-base max-w-none
                    prose-p:text-zinc-300 prose-p:leading-relaxed
                    prose-headings:text-white prose-headings:font-heading prose-headings:font-medium
                    prose-h1:text-2xl prose-h1:text-primary prose-h1:border-b prose-h1:border-primary/30 prose-h1:pb-3 prose-h1:mb-6
                    prose-h2:text-lg prose-h2:text-emerald-400 prose-h2:uppercase prose-h2:tracking-widest prose-h2:font-bold prose-h2:mt-8
                    prose-h3:text-base prose-h3:text-white prose-h3:font-bold
                    prose-strong:text-primary prose-strong:font-semibold
                    prose-ul:text-zinc-300 prose-li:marker:text-primary
                    prose-ol:text-zinc-300 prose-ol:list-decimal
                    prose-blockquote:border-l-primary prose-blockquote:text-zinc-400 prose-blockquote:italic
                    prose-a:text-primary prose-hr:border-zinc-800
                    [&>*:first-child]:mt-0"
                  >
                    <ReactMarkdown>{recipe}</ReactMarkdown>
                  </div>

                  <div className="border-t border-zinc-800 pt-8 flex flex-col space-y-6">
                    <div className="bg-zinc-900 p-6 rounded-lg text-center border border-zinc-800 shadow-inner">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Beauty Tech Initiative</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        By maximizing your current inventory, Synthesize reduces fragrance waste by 30%.
                        <br /><br />
                        <em className="text-zinc-300 font-medium italic">Protecting the integrity of luxury ingredients that dupes cannot replicate.</em>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setImages([]);
                        setManualPerfumes("");
                        setHomeIngredients("");
                        setPhase("inventory");
                      }}
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold uppercase tracking-widest py-4 px-6 rounded-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      Synthesize Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full bg-black border-t border-zinc-900 py-8 text-center relative z-10 mt-auto">
        <p className="font-heading text-xl text-primary mb-2 tracking-wider">Synthesize</p>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-light">
          L'Oréal Luxe Olfactory Engine &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
