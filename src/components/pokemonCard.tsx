// src/components/pokemonCard.tsx
import React from 'react';
import { PokemonData } from './pokemonData'; // Ajuste conforme necessário

interface PokemonCardProps {
  pokemon: PokemonData;
  onClick: (pokemon: PokemonData) => void; // Certifique-se de que onClick está definido
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  return (
    <div onClick={() => onClick(pokemon)} className="cursor-pointer border rounded-lg p-4 shadow-md hover:scale-105 transition-transform">
      <h3 className="text-xl">{pokemon.name}</h3>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32"/>
    </div>
  );
};

export default PokemonCard;
