import React, { useState, useEffect } from "react";
import { User, RefreshCw, Pause, Play, Eye, FileWarning, MessageSquare, AlertTriangle, ShieldAlert, UserSearch } from "lucide-react";
import { useGlobalAnimationSpeed, AnimationSpeedControl } from "./animation-speed-store";

export function ProblemStatementAnimation() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed] = useGlobalAnimationSpeed();
  const maxSteps = 5;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, 5000 / speed);
    return () => clearInterval(timer);
  }, [isPaused, speed]);

  useEffect(() => {
    const handleNext = (e: Event) => {
      if (step < maxSteps - 1) {
        e.preventDefault();
        setStep((prev) => prev + 1);
        setIsPaused(true);
      }
    };

    const handlePrev = (e: Event) => {
      if (step > 0) {
        e.preventDefault();
        setStep((prev) => prev - 1);
        setIsPaused(true);
      }
    };

    window.addEventListener('slide-next', handleNext);
    window.addEventListener('slide-prev', handlePrev);

    return () => {
      window.removeEventListener('slide-next', handleNext);
      window.removeEventListener('slide-prev', handlePrev);
    };
  }, [step]);

  const reset = () => setStep(0);
  const togglePause = () => {
    if (isPaused) {
      setStep((prev) => (prev + 1) % maxSteps);
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gray-50 rounded-xl border border-gray-200 my-8 shadow-sm">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-800 m-0 pt-1">The Dangers of Insecure Channels</h3>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={togglePause}
              className="flex-1 flex justify-center items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <button 
              onClick={reset}
              className="flex-1 flex justify-center items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-md border shadow-sm cursor-pointer"
            >
              <RefreshCw size={14} className={step === 4 && !isPaused ? "animate-spin" : ""} />
              Restart
            </button>
          </div>
          <AnimationSpeedControl baseTimeMs={5000} />
        </div>
      </div>

      <div className="relative flex justify-between items-start pt-6 h-72">
        {/* Connection Line */}
        <div className="absolute top-[4rem] left-12 right-12 h-1 bg-gray-300 border-t border-b border-gray-400 border-dashed z-0" />
        <div className="absolute top-[2rem] left-1/2 -translate-x-1/2 text-gray-400 font-mono text-sm tracking-widest z-0">PUBLIC INTERNET</div>

        {/* Sender (Alice) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center w-28">
            <p className="font-bold text-gray-800">You</p>
          </div>
        </div>

        {/* Message Flow Animation */}
        <div className="absolute top-[4rem] left-0 right-0 h-20 -translate-y-1/2 z-40 pointer-events-none">
          <style>
            {`
              @keyframes slideAliceToMid {
                0% { left: 15%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%); }
                90% { opacity: 1; transform: translate(-50%, -50%); }
                100% { left: 90%; opacity: 0; transform: translate(-50%, -50%); }
              }
              @keyframes slideMidToBob {
                0% { left: 50%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%); }
                90% { opacity: 1; transform: translate(-50%, -50%); }
                100% { left: 85%; opacity: 0; transform: translate(-50%, -50%); }
              }
              @keyframes slideMidToAlice {
                0% { left: 50%; opacity: 0; transform: translate(-50%, -50%); }
                10% { opacity: 1; transform: translate(-50%, -50%); }
                90% { opacity: 1; transform: translate(-50%, -50%); }
                100% { left: 15%; opacity: 0; transform: translate(-50%, -50%); }
              }
              .animate-slide-a-m { animation: slideAliceToMid ${10 / speed}s ease-in-out forwards; }
              .animate-slide-m-a { animation: slideMidToAlice ${5 / speed}s ease-in-out forwards; }
            `}
          </style>

          {(step === 1 || step === 2) && (
            <div className="absolute top-1/2 animate-slide-a-m bg-white p-2 rounded border border-gray-300 shadow-md flex items-center gap-2 whitespace-nowrap">
              <MessageSquare size={16} className="text-blue-500" />
              <span className="text-sm font-mono text-gray-700">"Hi, the secret is 42"</span>
            </div>
          )}

          {step === 3 && (
            <div className="absolute top-1/2 animate-slide-m-a bg-red-50 p-2 rounded border border-red-400 shadow-md flex items-center gap-2 whitespace-nowrap">
              <FileWarning size={16} className="text-red-600" />
              <span className="text-sm font-mono text-red-800">"Send money! - your friend"</span>
            </div>
          )}
        </div>

        {/* Attacker (Middle) */}
        <div className="relative z-10 flex flex-col items-center gap-2 mt-15">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <UserSearch size={36} className="text-red-600" />
            </div>
          <div className="text-center min-w-[150px]">
            <p className="font-bold text-red-800 text-base">Attacker</p>
            {step === 2 && (
              <div className="mt-2 flex flex-col items-center gap-1 text-xs font-bold text-red-700 animate-fade-in bg-red-100 px-2 py-1 rounded border border-red-300 shadow-sm">
                <Eye size={14} /> Reading everything!
              </div>
            )}
            {step === 3 && (
               <div className="mt-2 flex flex-col items-center gap-1 text-xs font-bold text-red-700 animate-fade-in bg-red-100 px-2 py-1 rounded border border-red-300 shadow-sm">
               <FileWarning size={14} /> Forging messages!
             </div>
            )}
          </div>
        </div>

        {/* Receiver (Bob) */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={36} className="text-green-600" />
          </div>
          <div className="text-center w-28">
            <p className="font-bold text-gray-800">Your friend</p>
          </div>
        </div>
      </div>

      {/* State explanations */}
      <div className="mt-8 bg-white p-4 rounded-lg border text-sm text-gray-600 text-center min-h-[4rem] flex items-center justify-center shadow-sm relative z-20">
        {step === 0 && <p> The Internet is an open network. You and your friend want to communicate, but attackers can easily listen</p>}
        {step === 1 && <p> When you send a plain text message, it travels over the public internet infrastructure.</p>}
        {step === 2 && <p className="text-red-700"> Anyone on the internet (the Attacker) can easily read the message as it passes by.</p>}
        {step === 3 && <p className="text-red-700"> An active Attacker can also inject a forged message into the network, pretending to be your friend.</p>}
        {step === 4 && <p className="text-red-700"> Upon receiving the fake message, you fully believe it is from your friend, because there is no way to verify the sender's identity!</p>}
      </div>

      {/* Progress Steps (Tiles) */}
      <div className="mt-4 w-full flex gap-2">
        {Array.from({ length: 5 }).map((_, s) => (
          <button
            aria-label={`Go to step ${s + 1}`}
            key={s}
            onClick={() => {
              setStep(s);
              setIsPaused(true);
            }}
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              step === s
                ? "bg-gray-600 shadow-sm"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
