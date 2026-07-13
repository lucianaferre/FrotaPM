import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export default function Rastreamento(){
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (!mapRef.current){
      mapRef.current = L.map('map').setView([-26.9196, -49.0710], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    const socket = io(SOCKET_URL);
    socket.on('connect', () => console.log('socket connected'));
    socket.on('vehiclePosition', (p) => {
      setPositions(prev => {
        const next = [...prev.filter(x => x.vehicleId !== p.vehicleId), p];
        return next;
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    positions.forEach(p => {
      const key = `v${p.vehicleId}`;
      if (markersRef.current[key]){
        markersRef.current[key].setLatLng([p.lat, p.lng]);
      } else {
        const marker = L.marker([p.lat, p.lng]).addTo(map).bindPopup(`<b>${p.number}</b><br/>Vel: ${p.speed} km/h`);
        markersRef.current[key] = marker;
      }
    });
  }, [positions]);

  return (
    <div style={{height: '100vh', display:'flex'}}>
      <div id="map" style={{flex:1}}></div>
      <div style={{width: 350, padding: 12, boxShadow: '0 0 6px rgba(0,0,0,0.1)', background:'#fff'}}>
        <h3>Viaturas (tempo real)</h3>
        <ul>
          {positions.map(p => (
            <li key={p.vehicleId}>{p.number} — {p.speed} km/h — {new Date(p.updatedAt).toLocaleTimeString()}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
