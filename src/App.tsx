import React, { useState, useEffect } from 'react';
import PokemonCard from './components/pokemonCard';
import { PokemonData } from './components/pokemonData';
import { Pokemon } from './components/pokemon';
import 'tailwindcss/tailwind.css';
import './App.css';

const ITEMS_PER_PAGE = 10;

function App() {
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<PokemonData | null>(null);
  const [, setSelectedPokemon] = useState<PokemonData | null>(null);

  const fetchPokemonList = async (): Promise<Pokemon[]> => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Erro ao buscar lista de Pokémons:', error);
      return [];
    }
  };

  const fetchPokemon = async (url: string): Promise<PokemonData | null> => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do Pokémon:', error);
      return null;
    }
  };

  const fetchPokemonData = async () => {
    try {
      const pokemonList = await fetchPokemonList();
      const pokemonDataPromises = pokemonList.map(async (pokemon) => {
        return fetchPokemon(pokemon.url);
      });

      const pokemonData = await Promise.all(pokemonDataPromises);
      setPokemonData(pokemonData.filter(Boolean) as PokemonData[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        setSearchResult(null);
      }
    }
  };

  const handleCardClick = async (pokemon: PokemonData) => {
    setSelectedPokemon(pokemon);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error('Erro ao buscar dados do Pokémon:', error);
    }
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = pokemonData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (endIndex < pokemonData.length) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (

    <div className="relative min-h-screen flex">

      <div className="fixed top-0 left-0 w-1/12 h-full bg-red-600 z-10"></div>

      <div className="fixed top-0 right-0 w-1/12 h-full bg-red-600 z-10"></div>

      <div className="flex flex-col items-center container mx-auto gap-5">
        <h1 className="font-mono text-4xl mt-5">Pokedex | Desafio ResTic36</h1>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2 border-b border-gray-300 pb-4 mb-4">
            <input
              type="text"
              placeholder="Digite o nome do Pokemon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-800"
              onClick={handleSearch}
            >
              Buscar Pokemon
            </button>
          </div>
          {searchResult ? (
            <div className="mt-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 p-4 bg-white">
              <h2 className="text-2xl font-semibold mb-2">{searchResult.name}</h2>
              <img
                src={searchResult.sprites.front_default}
                alt={searchResult.name}
                className="w-48 h-48 mb-2 mx-auto border border-gray-200 rounded-lg shadow-md"
              />
              <p className="mt-2 font-semibold">Descrição:</p>
              <p>{searchResult.species?.name}</p>
              <p className="mt-2 font-semibold">Tipos:</p>
              <p>{searchResult.types.map(type => type.type.name).join(', ')}</p>
              <p className="mt-2 font-semibold">Habilidades:</p>
              <p>{searchResult.abilities.map(ability => ability.ability.name).join(', ')}</p>
              <p className="mt-2 font-semibold">Estatísticas:</p>
              <ul className="list-disc list-inside">
                {searchResult.stats.map(stat => (
                  <li key={stat.stat.name}>
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          ) : searchQuery && (
            <p className="mt-4 text-red-600">Pokémon não encontrado</p>
          )}
        </div>

        <h1 className="font-mono text-4xl mt-5">Lista de Pokemons</h1>
        <div className="flex flex-col justify-center flex-wrap md:flex-row gap-4 mt-4 pb-8 font-mono">
          {paginatedData.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={handleCardClick} />
          ))}
        </div>

        <div className="flex flex-row gap-4 mt-4">
          <button
            className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-800"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Back
          </button>
          <button
            className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-800"
            onClick={handleNextPage}
            disabled={endIndex >= pokemonData.length}
          >
            Next
          </button>
        </div>

        <footer className="w-full border-t border-gray-300 py-4 mt-4">
          <div className="text-center text-gray-600">
            <p>Pokedex | Desafio ResTic36 </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
