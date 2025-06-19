import React, { useState } from 'react';
import './App.css';

const API_URL = 'https://www.omdbapi.com/?apikey=';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [filmes, setFilmes] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [buscou, setBuscou] = useState(false);
  const [loading, setLoading] = useState(false);

  const buscarFilmes = async (titulo) => {
    if (!titulo.trim()) {
      setFilmes([]);
      setBuscou(true);
      setLoading(false);
      return;
    }

    setBuscou(false);
    setLoading(true);  // começa a busca, mostra loading
    setFilmes([]);     // limpa resultados antigos

    try {
      const response = await fetch(`${API_URL}${API_KEY}&s=${titulo}`);
      const data = await response.json();

      if (data.Search) {
        setFilmes(data.Search);
      } else {
        setFilmes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setFilmes([]);
    } finally {
      setLoading(false);  // busca terminou
      setBuscou(true);
    }
  };

  return (
    <div className="app">
      <h1>CineBusca</h1>

      <div className="search">
        <input
          placeholder="Digite o nome de um filme"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscarFilmes(termoBusca)}
        />
        <button onClick={() => buscarFilmes(termoBusca)}>
          Buscar
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <h2>Buscando filmes...</h2>
        </div>
      ) : filmes.length > 0 ? (
        <div className="container">
          {filmes.map((filme) => (
            <div className="movie" key={filme.imdbID}>
              <div>
                <p>{filme.Year}</p>
              </div>
              <div>
                <img
                  src={filme.Poster !== 'N/A' ? filme.Poster : 'https://via.placeholder.com/400'}
                  alt={filme.Title}
                />
              </div>
              <div>
                <span>{filme.Type}</span>
                <h3>{filme.Title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : buscou ? (
        <div className="empty">
          <h2>Nenhum filme encontrado.</h2>
        </div>
      ) : null}
    </div>
  );
};

export default App;
