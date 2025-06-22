import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [charData, setCharData] = useState([]);
  const [info, setInfo] = useState({});
  
const buildUrl = async () => {
  let url = `https://rickandmortyapi.com/api/character/`;
  if (searchTerm) {
    url += `?name=${searchTerm}`;
  }
  return url;
}

const fetchCharacters = async (url) => {
  const apiUrl = url || await buildUrl();
  const response = await fetch(apiUrl);
  const data = await response.json();
  setCharData(data.results || []);
  setInfo(data.info || {});
};

  useEffect(() => {
    document.title = "R&M API"
    fetchCharacters();
  }, [searchTerm]);

  return (
    <div class='layout'>
      <div class='header'>
        <h3 class='header-text'>Rick And Morty SPA</h3>
        <div class='search-bar'>
        <input
          type='text'
          placeholder='Search by name'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          
        />
        </div>
        <div class='button-bar'>
        <button
          onClick={() => fetchCharacters(info.prev)}
          disabled={!info.prev}
        >
          Prev
        </button>

        <button
          onClick={() => fetchCharacters(info.next)}
          disabled={!info.next}
        >
          Next
        </button>
        </div>
      </div>
      
        <div class='body'>
        {charData.map((character) => (
          <div class='char-card' key={character.id}>
            <img class='img'
              src={character.image} 
              alt={character.name} 
            />
            <h2>{character.name}</h2>
            <p><strong>Status:</strong> {character.status}</p>
            <p><strong>Species:</strong> {character.species}</p>
            <p><strong>Gender:</strong> {character.gender}</p>
            <p><strong>Origin:</strong> {character.origin.name}</p>
            <p><strong>Location:</strong> {character.location.name}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;