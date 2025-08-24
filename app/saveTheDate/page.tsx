"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Envelope from "components/Envelope/envelope";

export default function InvitationPage() {
  const [open, setOpen] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const [cardZ, setCardZ] = useState(0); // initial card z-index

    useEffect(() => {
    if (open) {
        // After the flap opens (1s animation), bring the card above
        const timer = setTimeout(() => setCardZ(20), 1200);
        return () => clearTimeout(timer);
    }
    }, [open]);

  useEffect(() => {
    // Open the flap after 1 second
    const flapTimer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(flapTimer);
  }, []);

  useEffect(() => {
    if (open) {
      // Slide the envelope off screen 1 second after flap opens
      const slideTimer = setTimeout(() => setSlideOut(true), 1000);
      return () => clearTimeout(slideTimer);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-96 h-96">
        {/* Invitation card behind */}
        <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: cardZ }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        >
        <img
            src="save-the-date.svg"
            alt="Save the Date"
            className="w-80 h-auto"
        />
        </motion.div>

        {/* Envelope on top */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1, scale: 0.9, y: 0 }}
          animate={{
            scale: 1,
            y: slideOut ? "200%" : 0, // slide off the bottom
            }}
          transition={{ 
            scale: { duration: 0.8 },
            y: { duration: 2, ease: "easeInOut" },
          }}
            >
          <Envelope flapOpen={open} />
        </motion.div>
      </div>
    </div>
  );
}
