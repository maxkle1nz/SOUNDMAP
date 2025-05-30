import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { territoryService } from '../services/supabase-integration';

// Substitua por sua chave de API Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic291bmRtYXAiLCJhIjoiY2xqMnRhMmxpMDFrcTNkbXB5Z2N1emh0ZiJ9.zBMGAg6T7vX8iyR1uKM4tQ';

interface MappaInterattivaProps {
  filters?: any;
  onEntityClick?: (entity: any) => void;
}

const MappaInterattiva: React.FC<MappaInterattivaProps> = ({ filters, onEntityClick }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<mapboxgl.Marker[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o mapa
  useEffect(() => {
    if (map.current) return; // Inicializa apenas uma vez
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [12.4964, 41.9028], // Roma como centro inicial
        zoom: 5
      });

      // Adicionar controles de navegação
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Carregar entidades iniciais quando o mapa estiver pronto
      map.current.on('load', () => {
        loadEntities();
      });
    }
  }, []);

  // Atualizar entidades quando os filtros mudarem
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      loadEntities();
    }
  }, [filters]);

  // Função para carregar entidades com base nos filtros
  const loadEntities = async () => {
    if (!map.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Limpar marcadores existentes
      clearMarkers();
      
      // Preparar tipos de entidades para filtro
      const types = [];
      if (!filters || filters.tipi?.artisti !== false) types.push('artista');
      if (!filters || filters.tipi?.professionisti !== false) types.push('professionista');
      if (!filters || filters.tipi?.locali !== false) types.push('locale');
      if (!filters || filters.tipi?.scene !== false) types.push('scena');
      
      // Determinar centro e raio para busca
      let lat = 41.9028; // Roma como padrão
      let lng = 12.4964;
      let radius = filters?.raggio || 100;
      
      // Se houver posição nos filtros, usar ela
      if (filters?.posizione) {
        lat = filters.posizione.lat;
        lng = filters.posizione.lng;
        
        // Centralizar mapa na posição selecionada
        map.current.flyTo({
          center: [lng, lat],
          zoom: 10
        });
      }
      
      // Buscar entidades próximas
      const { entities: fetchedEntities, error } = await territoryService.findNearbyEntities(
        lat,
        lng,
        radius,
        types
      );
      
      if (error) throw error;
      
      // Filtrar por cidade se especificada
      let filteredEntities = fetchedEntities;
      if (filters?.citta) {
        filteredEntities = fetchedEntities.filter(entity => 
          entity.dettagli?.citta?.toLowerCase().includes(filters.citta.toLowerCase())
        );
      }
      
      // Filtrar por gênero se especificado
      if (filters?.genere) {
        filteredEntities = filteredEntities.filter(entity => {
          const generi = entity.dettagli?.generi || entity.dettagli?.generi_predominanti || [];
          return Array.isArray(generi) && generi.includes(filters.genere);
        });
      }
      
      setEntities(filteredEntities);
      
      // Adicionar marcadores ao mapa
      addMarkers(filteredEntities);
      
    } catch (error) {
      console.error('Erro ao carregar entidades:', error);
      setError('Errore nel caricamento delle entità sulla mappa');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para limpar todos os marcadores
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  // Função para adicionar marcadores ao mapa
  const addMarkers = (entities: any[]) => {
    if (!map.current) return;
    
    entities.forEach(entity => {
      // Verificar se a entidade tem coordenadas
      if (!entity.posizione && (!entity.latitudine || !entity.longitudine)) {
        return;
      }
      
      // Obter coordenadas
      let lng, lat;
      if (entity.posizione) {
        // Extrair de objeto Geography do PostGIS
        const match = entity.posizione.match(/POINT\(([^ ]*) ([^)]*)\)/);
        if (match) {
          lng = parseFloat(match[1]);
          lat = parseFloat(match[2]);
        }
      } else {
        lng = entity.longitudine;
        lat = entity.latitudine;
      }
      
      if (!lng || !lat) return;
      
      // Criar elemento para o marcador
      const el = document.createElement('div');
      el.className = `marker marker-${entity.tipo_entita}`;
      
      // Estilizar marcador com base no tipo
      switch (entity.tipo_entita) {
        case 'artista':
          el.style.backgroundColor = '#FF5722';
          break;
        case 'professionista':
          el.style.backgroundColor = '#2196F3';
          break;
        case 'locale':
          el.style.backgroundColor = '#4CAF50';
          break;
        case 'scena':
          el.style.backgroundColor = '#9C27B0';
          break;
        default:
          el.style.backgroundColor = '#757575';
      }
      
      // Criar popup com informações
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="entity-popup">
            <h3>${entity.nome}</h3>
            <p class="entity-type">${entity.tipo_entita}</p>
            ${entity.dettagli?.citta ? `<p class="entity-city">${entity.dettagli.citta}</p>` : ''}
            ${entity.dettagli?.genere ? `<p class="entity-genre">${entity.dettagli.genere}</p>` : ''}
            ${entity.dettagli?.specializzazione ? `<p class="entity-spec">${entity.dettagli.specializzazione}</p>` : ''}
            ${entity.dettagli?.tipo_locale ? `<p class="entity-venue-type">${entity.dettagli.tipo_locale}</p>` : ''}
          </div>
        `);
      
      // Criar e adicionar marcador
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Adicionar evento de clique
      el.addEventListener('click', () => {
        if (onEntityClick) {
          onEntityClick(entity);
        }
      });
      
      // Armazenar referência ao marcador
      markers.current.push(marker);
    });
    
    // Ajustar visualização para incluir todos os marcadores se houver mais de um
    if (markers.current.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      
      markers.current.forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  };

  return (
    <div className="mappa-interattiva-container">
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: '100%', height: '600px', borderRadius: '8px' }}
      />
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Caricamento entità...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="map-legend">
        <h4>Legenda</h4>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: '#FF5722' }}></span>
          <span>Artisti</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: '#2196F3' }}></span>
          <span>Professionisti</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: '#4CAF50' }}></span>
          <span>Locali</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: '#9C27B0' }}></span>
          <span>Scene Musicali</span>
        </div>
      </div>
    </div>
  );
};

export default MappaInterattiva;
