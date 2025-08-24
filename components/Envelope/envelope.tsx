// components/Envelope.tsx

import { motion } from "framer-motion";

interface EnvelopeProps {
  flapOpen?: boolean; // controls whether the flap is open
}

export default function Envelope({ flapOpen = false }: EnvelopeProps) {
  return (

      <div className="relative w-96 h-96">
        {/* Envelope base */}
        <div className="absolute inset-0 bg-[rgb(114,119,93)] rounded-md rotate-90" 
            style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 41% 50%)', zIndex: 30,
        }}/>

      {/* Top flap (triangle that can animate open) */}
      <motion.div
        className="absolute bottom-[100%] left-2 w-92 h-38 bg-[rgba(114,119,100,1)] rounded-md rotate-180 [clip-path:polygon(50%_0,100%_100%,0_100%)]"
        style={{ transformOrigin: "bottom center", transformStyle: "preserve-3d", zIndex: 10}}
        initial={{ rotateX: 0}}
        animate={{ rotateX: flapOpen ? 180 : 0}} // flip to open
        transition={{ duration: 1, ease: "easeInOut" }}
        />
    </div>
  );
}