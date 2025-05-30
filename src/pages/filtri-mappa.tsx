import React, { useState, useEffect } from 'react';
import { territoryService } from '../services/supabase-integration';
import TerritorySelector from '../components/TerritorySelector';

interface FiltriMappaProps {
  onFiltersChange?: (filters: any) => void;
}

const FiltriMappa: React.FC<FiltriMappaProps> = ({ onFiltersChange }) => {
  // Estados para os filtros
  const [mostraArtisti, setMostraArtisti] = useState<boolean>(true);
  const [mostraProfessionisti, setMostraProfessionisti] = useState<boolean>(true);
  const [mostraLocali, setMostraLocali] = useState<boolean>(true);
  const [mostraScene, setMostraScene] = useState<boolean>(true);
  const [genere, setGenere] = useState<string>('');
  const [citta, setCitta] = useState<string>('');
  const [raggioKm, setRaggioKm] = useState<number>(10);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredEntities, setFilteredEntities] = useState<any[]>([]);

  // Efeito para aplicar filtros quando mudam
  useEffect(() => {
    if (onFiltersChange) {
      const filters = {
        tipi: {
          artisti: mostraArtisti,
          professionisti: mostraProfessionisti,
          locali: mostraLocali,
          scene: mostraScene
        },
        genere,
        citta,
        raggio: raggioKm,
        posizione: latitude && longitude ? { lat: latitude, lng: longitude } : null
      };
      
      onFiltersChange(filters);
    }
  }, [mostraArtisti, mostraProfessionisti, mostraLocali, mostraScene, genere, citta, raggioKm, latitude, longitude, onFiltersChange]);

  // Função para lidar com a seleção de localização no mapa
  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  // Função para buscar entidades próximas
  const searchNearbyEntities = async () => {
    if (!latitude || !longitude) return;
    
    setIsLoading(true);
    
    try {
      const types = [];
      if (mostraArtisti) types.push('artista');
      if (mostraProfessionisti) types.push('professionista');
      if (mostraLocali) types.push('locale');
      if (mostraScene) types.push('scena');
      
      const { entities, error } = await territoryService.findNearbyEntities(
        latitude,
        longitude,
        raggioKm,
        types
      );
      
      if (error) throw error;
      
      setFilteredEntities(entities);
      
    } catch (error) {
      console.error('Erro ao buscar entidades próximas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para resetar filtros
  const resetFilters = () => {
    setMostraArtisti(true);
    setMostraProfessionisti(true);
    setMostraLocali(true);
    setMostraScene(true);
    setGenere('');
    setCitta('');
    setRaggioKm(10);
    setLatitude(null);
    setLongitude(null);
    setShowMap(false);
  };

  return (
    <div className="filtri-mappa-container">
      <h2>Filtri Mappa</h2>
      
      <div className="filter-section">
        <h3>Tipo di Entità</h3>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="mostra_artisti"
              checked={mostraArtisti}
              onChange={(e) => setMostraArtisti(e.target.checked)}
            />
            <label htmlFor="mostra_artisti">Artisti</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="mostra_professionisti"
              checked={mostraProfessionisti}
              onChange={(e) => setMostraProfessionisti(e.target.checked)}
            />
            <label htmlFor="mostra_professionisti">Professionisti</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="mostra_locali"
              checked={mostraLocali}
              onChange={(e) => setMostraLocali(e.target.checked)}
            />
            <label htmlFor="mostra_locali">Locali</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="mostra_scene"
              checked={mostraScene}
              onChange={(e) => setMostraScene(e.target.checked)}
            />
            <label htmlFor="mostra_scene">Scene Musicali</label>
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Genere Musicale</h3>
        <select
          value={genere}
          onChange={(e) => setGenere(e.target.value)}
          className="filter-select"
        >
          <option value="">Tutti i generi</option>
          <option value="Rock">Rock</option>
          <option value="Pop">Pop</option>
          <option value="Hip Hop">Hip Hop</option>
          <option value="Elettronica">Elettronica</option>
          <option value="Jazz">Jazz</option>
          <option value="Classica">Classica</option>
          <option value="Folk">Folk</option>
          <option value="Metal">Metal</option>
          <option value="R&B">R&B</option>
          <option value="Indie">Indie</option>
        </select>
      </div>
      
      <div className="filter-section">
        <h3>Località</h3>
        <input
          type="text"
          placeholder="Città"
          value={citta}
          onChange={(e) => setCitta(e.target.value)}
          className="filter-input"
        />
      </div>
      
      <div className="filter-section">
        <h3>Raggio di Ricerca</h3>
        <div className="range-container">
          <input
            type="range"
            min="1"
            max="100"
            value={raggioKm}
            onChange={(e) => setRaggioKm(parseInt(e.target.value))}
            className="range-input"
          />
          <span className="range-value">{raggioKm} km</span>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Posizione sulla Mappa</h3>
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="toggle-map-button"
        >
          {showMap ? 'Nascondi Mappa' : 'Mostra Mappa'}
        </button>
        
        {showMap && (
          <div className="map-container">
            <TerritorySelector
              onLocationSelect={handleLocationSelect}
              height="250px"
            />
            {latitude && longitude && (
              <div className="selected-location">
                Posizione selezionata: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="filter-actions">
        <button
          type="button"
          onClick={searchNearbyEntities}
          className="apply-filters-button"
          disabled={isLoading || (!latitude && !longitude && !citta)}
        >
          {isLoading ? 'Ricerca in corso...' : 'Applica Filtri'}
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="reset-filters-button"
        >
          Reimposta Filtri
        </button>
      </div>
      
      {filteredEntities.length > 0 && (
        <div className="filtered-results">
          <h3>Risultati ({filteredEntities.length})</h3>
          <ul className="entity-list">
            {filteredEntities.map((entity, index) => (
              <li key={index} className={`entity-item ${entity.tipo_entita}`}>
                <div className="entity-name">{entity.nome}</div>
                <div className="entity-type">{entity.tipo_entita}</div>
                {entity.dettagli?.citta && (
                  <div className="entity-city">{entity.dettagli.citta}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FiltriMappa;
