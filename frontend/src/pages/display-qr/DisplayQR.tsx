import { useEffect, useState, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "react-router";
import { motion } from "framer-motion";

export default function DisplayQR() {
  const key: string = useLocation().state.key;
  const [value, setValue] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  const generateQRCode = useMemo(() => {
    return (key: string) => {
      const LABEL = "LEBRON";
      const URI: string[] = [];

      URI.push("otpauth://totp/");
      URI.push(LABEL);
      URI.push("?secret=");
      URI.push(key);
      URI.push("&issuer=Life360");
      const finalURI = URI.join("");

      setValue(finalURI);
      setShow(true);
    };
  }, []);

  useEffect(() => {
    generateQRCode(key);
  }, [generateQRCode, key]);

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Header */}
      <motion.div 
        className="text-center mb-8 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-white font-bold text-4xl md:text-5xl mb-4">
          Scan this with Duo!
        </h1>

      </motion.div>

      {/* QR Code with Pulsating Effect */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {show && (
          <div className="relative">
            {/* Static White Shadow */}
            <div
              className="absolute inset-0 bg-white rounded-2xl"
              style={{
                filter: "blur(20px)",
                opacity: 0.3,
                transform: "translateZ(0)", // Hardware acceleration
              }}
            />
            
            {/* QR Code with Row-by-Row Animation */}
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl overflow-hidden">
              <motion.div
                className="relative"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <QRCodeSVG 
                  value={value} 
                  size={400}
                  className="drop-shadow-lg"
                />
              </motion.div>
              
              {/* Scanning line effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
                initial={{ y: -400 }}
                animate={{ y: 400 }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                style={{
                  height: "2px",
                  width: "100%",
                  top: 0,
                }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </div>
  );
}
