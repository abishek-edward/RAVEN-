import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRaven } from '../../context/RavenContext';
import TrustBadge from '../common/TrustBadge';
import { MapPin, AlertCircle, ArrowRight, Filter } from 'lucide-react';

// Custom SVG icon generator for Leaflet markers
const createCustomIcon = (category, priorityScore) => {
  const isHighPriority = priorityScore >= 80;
  const bgColor = isHighPriority ? '#e11d48' : '#2563eb';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        border: 2px solid white;
      ">
        ${priorityScore}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

export default function CivicLeafletMap({ onSelectCluster }) {
  const { civicClusters } = useRaven();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const categories = ['All', 'Street Infrastructure', 'Roads', 'Waste', 'Drainage', 'Water'];
  const districts = ['All', 'Chennai'];

  const filteredClusters = civicClusters.filter(cluster => {
    const matchesCategory = selectedCategory === 'All' || cluster.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || cluster.district === selectedDistrict;
    return matchesCategory && matchesDistrict;
  });

  // Default center around Chennai
  const defaultCenter = [13.0450, 80.2350];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-[650px]">
      {/* Map Filter Controls Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700">Filter Map Clusters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs p-1.5 border border-slate-300 rounded bg-white font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs p-1.5 border border-slate-300 rounded bg-white font-medium"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Showing {filteredClusters.length} issue pins
          </span>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredClusters.map((cluster) => {
            const aiScore = cluster.aiPriorityData?.score || 75;
            const icon = createCustomIcon(cluster.category, aiScore);

            return (
              <Marker
                key={cluster.id}
                position={cluster.coordinates || [13.0827, 80.2707]}
                icon={icon}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-2 text-xs font-sans max-w-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                        {cluster.id}
                      </span>
                      <TrustBadge type="ANALYSIS" size="xs" />
                    </div>

                    <div className="font-bold text-slate-900 leading-snug">
                      {cluster.title}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{cluster.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 py-1.5 border-y border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400">Reports:</span> <strong className="text-slate-800">{cluster.reportsCount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Support:</span> <strong className="text-slate-800">{cluster.publicSupportScore}/100</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">AI Priority:</span> <strong className="text-purple-700">{aiScore}/100</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span> <strong className="text-slate-800">{cluster.status}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectCluster && onSelectCluster(cluster.id)}
                      className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 px-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white transition"
                    >
                      <span>View Cluster & Confirm</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">Priority Legend:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            <span>High Priority (Score &ge; 80)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span>Standard Priority (Score &lt; 80)</span>
          </div>
        </div>
        <span className="text-slate-400">Map tiles via OpenStreetMap</span>
      </div>
    </div>
  );
}
