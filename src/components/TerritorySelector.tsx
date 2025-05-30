import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { territoryService } from '../services/supabase-integration';

// Substitua por sua chave de API Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic291bmRtYXAiLCJhIjoiY2xqMnRhMmxpMDFrcTNkbXB5Z2N1emh0ZiJ9.zBMGAg6T7vX8iyR1uKM4tQ';

interface TerritorySelectorProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationSelect: (latitude: number, longitude: number) => void;
  height?: string;
  width?: string;
  zoom?: number;
  showSearchBar?: boolean;
}

const TerritorySelector: React.FC<TerritorySelectorProps> = ({
  initialLatitude = 41.9028,
  initialLongitude = 12.4964,
  onLocationSelect,
  height = '400px',
  width = '100%',
  zoom = 5,
  showSearchBar = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [address, setAddress] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Inicializar o mapa
  useEffect(() => {
    if (map.current) return; // Inicializa apenas uma vez
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [initialLongitude, initialLatitude],
        zoom: zoom
      });

      // Adicionar controles de navegação
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Adicionar marcador inicial
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([initialLongitude, initialLatitude])
        .addTo(map.current);

      // Evento de fim de arrasto do marcador
      marker.current.on('dragend', () => {
        const lngLat = marker.current?.getLngLat();
        if (lngLat) {
          onLocationSelect(lngLat.lat, lngLat.lng);
        }
      });

      // Evento de clique no mapa
      map.current.on('click', (e) => {
        marker.current?.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        onLocationSelect(e.lngLat.lat, e.lngLat.lng);
      });
    }
  }, [initialLatitude, initialLongitude, zoom, onLocationSelect]);

  // Função para buscar endereço
  const searchAddress = async () => {
    if (!address.trim()) {
      setSearchError('Por favor, insira um endereço');
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    try {
      const { coordinates, error } = await territoryService.geocodeAddress(address);
      
      if (error || !coordinates) {
        setSearchError('Endereço não encontrado');
        return;
      }

      // Atualizar marcador e mapa
      if (map.current && marker.current) {
        marker.current.setLngLat([coordinates.longitude, coordinates.latitude]);
        map.current.flyTo({
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 14
        });
        onLocationSelect(coordinates.latitude, coordinates.longitude);
      }
    } catch (error) {
      console.error('Erro na busca de endereço:', error);
      setSearchError('Erro ao buscar endereço');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="territory-selector">
      {showSearchBar && (
        <div className="search-container" style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Digite um endereço para buscar"
            className="search-input"
            style={{
              padding: '8px 12px',
              width: 'calc(100% - 100px)',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
          />
          <button
            onClick={searchAddress}
            disabled={isLoading}
            className="search-button"
            style={{
              padding: '8px 12px',
              marginLeft: '8px',
              borderRadius: '4px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      )}
      
      {searchError && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
          {searchError}
        </div>
      )}
      
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height, width, borderRadius: '8px', overflow: 'hidden' }}
      />
      
      <div className="instructions" style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Clique no mapa ou arraste o marcador para selecionar seu território
      </div>
    </div>
  );
};

export default TerritorySelector;
