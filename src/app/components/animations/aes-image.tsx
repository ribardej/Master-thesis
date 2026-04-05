import React from "react";
import { ExternalLink } from 'lucide-react';
import aesImg from "../../data/images/aes.png";

export function AESImage() {
  return (
    <div className="flex flex-col items-center my-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <img 
        src={aesImg} 
        alt="AES Architecture Diagram" 
        className="max-w-full h-auto" 
        style={{ maxHeight: '66vh', objectFit: 'contain' }} 
      />
      <div className="mt-3 text-xs text-gray-500 w-full text-right px-4">
        <a href="https://www.researchgate.net/figure/Block-diagram-for-AES-encryption-and-decryption_fig1_324796235" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:underline transition-colors">
          Source <ExternalLink size={12}/> 
        </a>
      </div>
    </div>
  );
}