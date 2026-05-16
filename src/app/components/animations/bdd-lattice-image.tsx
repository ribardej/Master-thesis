import React from "react";
import bddLatticeImg from "../../data/images/bdd_lattice.svg";

export function BDDLatticeImage() {
  return (
    <div className="flex flex-col items-center my-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <img 
        src={bddLatticeImg} 
        alt="BDD on a q-ary lattice: the observation b (red) is close to the lattice point y = As mod q (black), within distance α" 
        className="max-w-full h-auto" 
        style={{ maxHeight: '60vh', objectFit: 'contain' }} 
      />
    </div>
  );
}
