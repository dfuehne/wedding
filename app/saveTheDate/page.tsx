"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EnvelopeBase, EnvelopeFlap } from "components/Envelope/envelope";

export default function InvitationPage() {
  const [open, setOpen] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const [switchOrder, setSwitchOrder] = useState(false);
  const [enlargeCard, setEnlargeCard] = useState(false);


  useEffect(() => {
    // Open the flap after 1 second
    const flapTimer = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(flapTimer);
  }, []);

    useEffect(() => {
    // Open the flap after 1 second
    const flapTimer = setTimeout(() => setEnlargeCard(true), 3200);
    return () => clearTimeout(flapTimer);
    }, []);

    useEffect(() => {
    // Open the flap after 1 second
    const flapTimer = setTimeout(() => setSwitchOrder(true), 2200);
    return () => clearTimeout(flapTimer);
  }, []);

  useEffect(() => {
    if (open) {
      // Slide the envelope off screen 1 second after flap opens
      const slideTimer = setTimeout(() => setSlideOut(true), 1200);
      return () => clearTimeout(slideTimer);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (

    <div className="flex items-center justify-center min-h-screen">
      {!switchOrder && (<div className="relative w-72 h-48">
        {/* Invitation card behind */}
        <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{scale: 0.25 }}
        animate={{scale: 0.5, }}
        transition={{ scale: { duration: 1, ease: "easeInOut" }, }}
        >
        <img
            src="save-the-date.svg"
            alt="Save the Date"
            className="w-auto h-96"
        />
        </motion.div>

        {/* Envelope on top */}
        <motion.div 
            className="absolute inset-0"
            initial={{scale: 0.5 }}
            animate={{scale: 1.0, }}
            transition={{ scale: { duration: 1, ease: "easeInOut" }, }}
            >
            <div className="absolute inset-0">
            <EnvelopeFlap flapOpen={open} />
            </div>
            <div className="absolute inset-0">
                <EnvelopeBase/>
            </div>
        </motion.div>
      </div>)}
    {switchOrder && (<div className="relative w-72 h-48">
        {/* Invitation card behind */}
        <motion.div
          className="absolute inset-0"
          initial={{y: 0 }}
          animate={{
            y: slideOut ? "1000%" : 0, // slide off the bottom
            }}
          transition={{ 
            y: { duration: 3, ease: "easeInOut" },
          }}
            >
            <div className="absolute inset-0">
            <EnvelopeFlap flapOpen={true} alreadyOpen={true} />
            </div>
        </motion.div>
        <motion.div className="absolute inset-0 flex items-center justify-center" 
        initial={{scale: 0.5 }}
        animate={{scale: enlargeCard ? 1 : 0.5, }}
        transition={{ scale: { duration: 1, ease: "easeInOut" }, }}
        >
        <img
            src="save-the-date.svg"
            alt="Save the Date"
            className="w-auto h-96"
        />
        </motion.div>

        {/* Envelope on top */}
        <motion.div
          className="absolute inset-0"
          initial={{ y: 0 }}
          animate={{
            y: slideOut ? "1000%" : 0, // slide off the bottom
            }}
          transition={{ 
            y: { duration: 3, ease: "easeInOut" },
          }}
            >
            <div className="absolute inset-0">
                <EnvelopeBase/>
            </div>
        </motion.div>
      </div>)}
    </div>
  );
}
