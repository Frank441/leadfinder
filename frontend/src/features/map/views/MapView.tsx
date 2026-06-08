import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { Lead, Representante } from '@leadfinder/shared/types/leads';
import { useAuth } from '../../../context/AuthContext';
import { leadsService } from '../../leads/services/leadsService';
import { representantesService } from '../../leads/services/representantesService';
import { buildLeadIcon } from '../components/leadMarkerIcon';
import { buildClusterIcon } from '../components/clusterIcon';
import { LeadMarkerPopup } from '../components/LeadMarkerPopup';

// Centro aproximado de Argentina
const ARG_CENTER: [number, number] = [-38.4161, -63.6167];
const INITIAL_ZOOM = 5;

const SELECT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '9px',
  color: '#f0f4f8',
  padding: '7px 13px',
  fontSize: '12px',
  outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
  minWidth: '180px',
  cursor: 'pointer',
};

const OPTION_STYLE: React.CSSProperties = {
  background: '#172840',
  color: '#f0f4f8',
};

/**
 * Indica si el lead tiene coordenadas validas para mapearlo.
 * Filtra leads sin georreferencia (lat=0, lng=0 o null) para que no rompan el render.
 */
const hasValidCoords = (lead: Lead): boolean => {
  return typeof lead.lat === 'number'
      && typeof lead.lng === 'number'
      && !Number.isNaN(lead.lat)
      && !Number.isNaN(lead.lng)
      && (lead.lat !== 0 || lead.lng !== 0);
};

export const MapView = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [repFilter, setRepFilter] = useState<string>(''); // '' = todos
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([
      leadsService.getAll(),
      // Solo el supervisor necesita la lista de reps para el filtro
      user?.role === 'supervisor' ? representantesService.getAll() : Promise.resolve([] as Representante[]),
    ]).then(([leadsData, repsData]) => {
      if (cancelled) return;
      setLeads(leadsData);
      setRepresentantes(repsData);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Error cargando datos del mapa:', err);
      if (!cancelled) setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  // Aplica el filtro por representante (solo si supervisor + selecciono uno)
  const visibleLeads = useMemo(() => {
    const withCoords = leads.filter(hasValidCoords);
    if (user?.role !== 'supervisor' || !repFilter) return withCoords;
    return withCoords.filter((l) => l.representanteId === repFilter);
  }, [leads, repFilter, user]);

  const isSupervisor = user?.role === 'supervisor';

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Subtitulo + filtro */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '14px', gap: '12px', flexWrap: 'wrap',
      }}>
        <p style={{ fontSize: '12px', color: '#7a9bbf', margin: 0 }}>
          {isLoading
            ? 'Cargando leads...'
            : `${visibleLeads.length} ${visibleLeads.length === 1 ? 'lead' : 'leads'} con geolocalizacion`}
        </p>

        {isSupervisor && (
          <select
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
            style={SELECT_STYLE}
          >
            <option value="" style={OPTION_STYLE}>Todos los representantes</option>
            {representantes.map((rep) => (
              <option key={rep.id} value={rep.id} style={OPTION_STYLE}>
                {rep.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Mapa */}
      <div style={{
        height: 'calc(100vh - 160px)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#172840',
      }}>
        <MapContainer
          center={ARG_CENTER}
          zoom={INITIAL_ZOOM}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* MarkerClusterGroup agrupa marcadores cercanos en un solo circulo.
              Al hacer zoom se separan automaticamente. */}
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={buildClusterIcon}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom
            maxClusterRadius={60}
          >
            {visibleLeads.map((lead) => (
              <Marker
                key={lead.id}
                position={[lead.lat, lead.lng]}
                icon={buildLeadIcon(lead.status)}
              >
                <Popup>
                  <LeadMarkerPopup lead={lead} />
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};
