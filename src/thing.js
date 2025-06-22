import React, { useState, useEffect } from 'react';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        let url = 'https://rickandmortyapi.com/api/character';
        
        // Only add search parameters if search term exists
        if (debouncedSearchTerm) {
          url += `/?name=${encodeURIComponent(debouncedSearchTerm)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          // If no results found, API returns 404
          if (response.status === 404) {
            setCharacters([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCharacters(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [debouncedSearchTerm]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rick and Morty Characters</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search characters by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        <small>Note: The API only supports searching by character name</small>
      </div>

      {loading ? (
        <div>Loading characters...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : characters.length === 0 ? (
        <div>No characters found matching your search.</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {characters.map((character) => (
            <div 
              key={character.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                borderRadius: '5px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <img 
                src={character.image} 
                alt={character.name} 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <h3 style={{ margin: '0 0 10px 0' }}>{character.name}</h3>
              <p><strong>Status:</strong> {character.status}</p>
              <p><strong>Species:</strong> {character.species}</p>
              <p><strong>Gender:</strong> {character.gender}</p>
              <p><strong>Origin:</strong> {character.origin.name}</p>
              <p><strong>Location:</strong> {character.location.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterList;