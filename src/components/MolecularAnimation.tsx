"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NOBLE_NOTES = [
    "Bergamot", "Oud", "Jasmine", "Rose", "Vanilla",
    "Sandalwood", "Patchouli", "Vetiver", "Iris", "Amber"
];

export default function MolecularAnimation() {
    const [activeNotes, setActiveNotes] = useState<string[]>([]);

    useEffect(() => {
        // Randomly select 4-6 notes to display
        const shuffled = [...NOBLE_NOTES].sort(() => 0.5 - Math.random());
        setActiveNotes(shuffled.slice(0, 5));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] w-full relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                {activeNotes.map((note, index) => {
                    const randomX = Math.random() * 200 - 100;
                    const randomY = Math.random() * 200 - 100;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: randomX * 2, y: randomY * 2, scale: 0.5 }}
                            animate={{
                                opacity: [0, 1, 0.8, 0],
                                x: [randomX * 2, randomX, 0],
                                y: [randomY * 2, randomY, 0],
                                scale: [0.5, 1.2, 0.8, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: index * 0.5,
                                ease: "easeInOut"
                            }}
                            className="absolute text-primary font-heading italic text-xl md:text-3xl font-light tracking-wide text-center drop-shadow-[0_0_15px_rgba(200,161,101,0.5)]"
                        >
                            {note}
                        </motion.div>
                    );
                })}
            </div>

            {/* Central "Synthesizing" Orb */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                    boxShadow: [
                        "0 0 20px rgba(200,161,101,0.2)",
                        "0 0 60px rgba(200,161,101,0.6)",
                        "0 0 20px rgba(200,161,101,0.2)",
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="z-10 w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md flex items-center justify-center"
            >
                <span className="font-sans uppercase tracking-[0.3em] text-xs md:text-sm text-primary/80">
                    Synthesizing
                </span>
            </motion.div>
        </div>
    );
}
