// components/Envelope.tsx

import { motion } from "framer-motion";

interface EnvelopeProps {
  flapOpen?: boolean; // controls whether the flap is open
  alreadyOpen?: boolean; //should we even do the animation?
}

export function EnvelopeFlap({ flapOpen = false, alreadyOpen = false }: EnvelopeProps) {
  return (

      <div className="relative w-72 h-48">

      {/* Top flap (triangle that can animate open) */}
      <motion.div
        className="absolute bottom-[100%] left-2 w-68 h-24 bg-[rgba(114,119,100,1)] rounded-md rotate-180 [clip-path:polygon(50%_0,100%_100%,0_100%)]"
        style={{ transformOrigin: "bottom center", transformStyle: "preserve-3d"}}
        initial={{ rotateX: alreadyOpen ? 180 : 0, }}
        animate={{ rotateX: flapOpen ? 180 : 0}} // flip to open
        transition={{ duration: 1, ease: "easeInOut" }}
        />
    </div>
  );
}

export function EnvelopeBase() {
  return (

      <div className="relative w-72 h-48">
        {/* Envelope base */}
<div
  className="absolute inset-0 bg-[rgb(114,119,93)] rounded-md"
  style={{
    clipPath: "polygon(0% 0%, 50% 52%, 100% 0%, 100% 100%, 0% 100%)",
  }}
/>

    </div>
  );
}