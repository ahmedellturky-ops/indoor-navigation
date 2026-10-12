
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MAP_WIDTH = 1250;
const MAP_HEIGHT = 1350;

const METERS_PER_UNIT = 0.01;
const METERS_PER_MILE = 1609.344;

const svgMap = `
<svg xmlns="http://www.w3.org/2000/svg" width="1250" height="1350" viewBox="0 0 1250 1350">
  <rect width="1250" height="1350" fill="#f1f5f9"/>

  <!-- Main corridor -->
  <path d="M79 80 H430 V1166 H64 V993 H41 V560 H60 V300 H73 V190 H79 Z"
        fill="#fff" stroke="#475569" stroke-width="6"/>

  <line x1="79" y1="80" x2="430" y2="80"
        stroke="#475569" stroke-width="6"/>

  <line x1="79" y1="80" x2="79" y2="190"
        stroke="#38bdf8" stroke-width="3"
        stroke-dasharray="6 6"/>

  <line x1="28" y1="135" x2="115" y2="135"
        stroke="#0284c7" stroke-width="4"/>

  <rect x="122" y="118" width="138" height="34"
        rx="7" fill="#0f172a"/>

  <text x="191" y="139" fill="#38bdf8"
        font-size="11" font-family="Arial"
        font-weight="bold" text-anchor="middle">
    MAIN ENTRANCE
  </text>

  <path d="M73 190 V300 H60 V560 H41 V993 H64 V1166 H430"
        fill="none" stroke="#475569" stroke-width="6"/>

  <!-- Lab 227 -->
  <path d="M430 60 H490 V80 H720 V100 H853 V80 H1073 V60
    H1137 V123 H1157 V440 H1133 V553 H1157 V600 H1132
    V614 H922 V600 H896 V614 H686 V600 H450 V580 H430 Z"
    fill="#cbd5e1" stroke="#475569" stroke-width="5"/>

  <!-- Lab 226 -->
  <path d="M430 580 H450 V600 H686 V614 H896 V600 H922
    V614 H1132 V600 H1157 V750 H1135 V860 H1157 V1140
    H1091 V1166 H871 V1131 H741 V1166 H706 V1146 H430 Z"
    fill="#cbd5e1" stroke="#475569" stroke-width="5"/>

  <!-- Doors -->
  <rect x="424" y="460" width="12" height="120"
        rx="4" fill="#22c55e" opacity=".3"/>

  <path d="M430 580 L495 515"
        stroke="#3b82f6" stroke-width="4"/>

  <rect x="424" y="989" width="12" height="120"
        rx="4" fill="#22c55e" opacity=".3"/>

  <path d="M430 1109 L495 1044"
        stroke="#3b82f6" stroke-width="4"/>

  <line x1="430" y1="80" x2="430" y2="464"
        stroke="#475569" stroke-width="6"/>

  <line x1="430" y1="580" x2="430" y2="993"
        stroke="#475569" stroke-width="6"/>

  <line x1="430" y1="1109" x2="430" y2="1166"
        stroke="#475569" stroke-width="6"/>

  <!-- Furniture in Lab 227 -->
  <rect x="490" y="110" width="160" height="140"
        rx="6" fill="#94a3b8" opacity=".45"/>

  <rect x="710" y="120" width="170" height="90"
        rx="6" fill="#fef08a" opacity=".8"/>

  <rect x="920" y="110" width="180" height="140"
        rx="6" fill="#94a3b8" opacity=".45"/>

  <rect x="710" y="350" width="260" height="160"
        rx="6" fill="#94a3b8" opacity=".3"/>

  <!-- Furniture in Lab 226 -->
  <rect x="490" y="660" width="160" height="160"
        rx="6" fill="#94a3b8" opacity=".45"/>

  <rect x="720" y="660" width="180" height="120"
        rx="6" fill="#fef08a" opacity=".8"/>

  <rect x="720" y="930" width="280" height="180"
        rx="6" fill="#94a3b8" opacity=".35"/>

  <!-- Room labels -->
  <text x="250" y="650" fill="#64748b"
        font-size="22" font-family="Arial"
        font-weight="bold" text-anchor="middle"
        transform="rotate(-90 250 650)">
    CORRIDOR
  </text>

  <text x="790" y="300" fill="#1e293b"
        font-size="30" font-family="Arial"
        font-weight="bold" text-anchor="middle">
    Lab 227
  </text>

  <text x="790" y="870" fill="#1e293b"
        font-size="30" font-family="Arial"
        font-weight="bold" text-anchor="middle">
    Lab 226
  </text>
</svg>
`;

const WAYPOINTS = [
    { x: 50, y: 135, name: 'Main Entrance' },
    { x: 180, y: 140, name: 'Main Corridor' },
    { x: 250, y: 300, name: 'Main Corridor' },
    { x: 250, y: 520, name: 'Outside Lab 227' },
    { x: 420, y: 520, name: 'Lab 227 Entrance', door: true },
    { x: 470, y: 520, name: 'Inside Lab 227', door: true },
    { x: 600, y: 460, name: 'Inside Lab 227' },
    { x: 750, y: 380, name: 'Inside Lab 227' },
    { x: 860, y: 220, name: 'Inside Lab 227' },
    { x: 750, y: 380, name: 'Inside Lab 227' },
    { x: 470, y: 520, name: 'Lab 227 Exit', door: true },
    { x: 420, y: 520, name: 'Back to Corridor', door: true },
    { x: 250, y: 520, name: 'Main Corridor' },
    { x: 250, y: 800, name: 'Outside Lab 226' },
    { x: 250, y: 1050, name: 'Outside Lab 226' },
    { x: 420, y: 1050, name: 'Lab 226 Entrance', door: true },
    { x: 470, y: 1050, name: 'Inside Lab 226', door: true },
    { x: 600, y: 1000, name: 'Inside Lab 226' },
    { x: 750, y: 930, name: 'Inside Lab 226' },
    { x: 860, y: 800, name: 'Inside Lab 226' },
    { x: 750, y: 930, name: 'Inside Lab 226' },
    { x: 470, y: 1050, name: 'Lab 226 Exit', door: true },
    { x: 420, y: 1050, name: 'Back to Corridor', door: true },
    { x: 250, y: 1050, name: 'Main Corridor' },
    { x: 250, y: 1140, name: 'End of Corridor' },
    { x: 250, y: 1050, name: 'Return Corridor' },
    { x: 250, y: 800, name: 'Main Corridor' },
    { x: 250, y: 520, name: 'Main Corridor' },
    { x: 250, y: 300, name: 'Main Corridor' },
    { x: 180, y: 140, name: 'Entrance Corridor' },
    { x: 50, y: 135, name: 'Main Entrance' }
];

function IndoorMap({ onStatusChange }) {
    const mapElementRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const mapElement = mapElementRef.current;

        if (!mapElement || mapInstanceRef.current) {
            return;
        }

        let disposed = false;
        let animationFrameId = null;
        let waypointIndex = 0;
        let progress = 0;
        let previousPosition = null;
        let totalDistanceMeters = 0;
        let lastStatusUpdate = 0;
        let walkedPath = [];
        let currentRoom = null;

        const map = L.map(mapElement, {
            crs: L.CRS.Simple,
            minZoom: -4,
            maxZoom: 3,
            zoomSnap: 0.05,
            zoomDelta: 0.1,
            zoomControl: false,
            attributionControl: false,
            dragging: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
            boxZoom: false,
            keyboard: false
        });

        mapInstanceRef.current = map;

        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        const fullBounds = [
            [0, 0],
            [MAP_HEIGHT, MAP_WIDTH]
        ];

        const svgUrl =
            'data:image/svg+xml;charset=utf-8,' +
            encodeURIComponent(svgMap);

        L.imageOverlay(svgUrl, fullBounds).addTo(map);

        map.fitBounds(fullBounds, {
            paddingTopLeft: [20, 20],
            paddingBottomRight: [20, 110],
            animate: false
        });

        const roomBounds = {
            'Lab 227': [
                [MAP_HEIGHT - 614, 430],
                [MAP_HEIGHT - 60, 1157]
            ],
            'Lab 226': [
                [MAP_HEIGHT - 1166, 430],
                [MAP_HEIGHT - 580, 1157]
            ]
        };

        // Zoom into a room when entered.
        // Zoom out to the complete floor plan when leaving it.
        function updateMapFocus(room) {
            if (room === currentRoom) {
                return;
            }

            currentRoom = room;

            const targetBounds = room
                ? roomBounds[room]
                : fullBounds;

            map.stop();

            map.fitBounds(targetBounds, {
                paddingTopLeft: room ? [30, 90] : [20, 20],
                paddingBottomRight: room ? [30, 135] : [20, 110],
                animate: true,
                duration: 0.8,
                easeLinearity: 0.25
            });
        }

        const traceLine = L.polyline([], {
            color: '#2563eb',
            weight: 4,
            lineCap: 'round',
            lineJoin: 'round',
            opacity: 0.95,
            interactive: false
        }).addTo(map);

        const halo = L.circleMarker([0, 0], {
            radius: 15,
            color: '#60a5fa',
            fillColor: '#93c5fd',
            fillOpacity: 0.35,
            weight: 2,
            interactive: false
        }).addTo(map);

        const marker = L.circleMarker([0, 0], {
            radius: 7,
            color: '#ffffff',
            fillColor: '#ef4444',
            fillOpacity: 1,
            weight: 3,
            interactive: false
        }).addTo(map);

        function getRoom(x, y) {
            if (x <= 430) {
                return null;
            }

            if (y >= 60 && y <= 600) {
                return 'Lab 227';
            }

            if (y >= 580 && y <= 1166) {
                return 'Lab 226';
            }

            return null;
        }

        function animateMotion(timestamp) {
            if (disposed) {
                return;
            }

            const start = WAYPOINTS[waypointIndex];
            const nextIndex =
                (waypointIndex + 1) % WAYPOINTS.length;
            const end = WAYPOINTS[nextIndex];

            const svgX = start.x + (end.x - start.x) * progress;
            const svgY = start.y + (end.y - start.y) * progress;

            const mapPosition = [MAP_HEIGHT - svgY, svgX];

            if (previousPosition !== null) {
                const stepUnits = Math.hypot(
                    svgX - previousPosition.x,
                    svgY - previousPosition.y
                );

                totalDistanceMeters += stepUnits * METERS_PER_UNIT;
            }

            previousPosition = {
                x: svgX,
                y: svgY
            };

            marker.setLatLng(mapPosition);
            halo.setLatLng(mapPosition);

            walkedPath.push(mapPosition);

            if (walkedPath.length > 1200) {
                walkedPath.shift();
            }

            traceLine.setLatLngs(walkedPath);

            const room = getRoom(svgX, svgY);

            // Run only when the detected room changes,
            // not on every animation frame.
            updateMapFocus(room);

            if (
                typeof onStatusChange === 'function' &&
                timestamp - lastStatusUpdate >= 80
            ) {
                lastStatusUpdate = timestamp;

                const distanceMiles =
                    totalDistanceMeters / METERS_PER_MILE;

                onStatusChange({
                    location: room ? 'Inside ' + room : start.name,
                    distance: distanceMiles.toFixed(6) + ' mi',
                    isInRoom: Boolean(room)
                });
            }

            const speed =
                start.door && end.door ? 0.0034 : 0.0018;

            progress += speed;

            if (progress >= 1) {
                progress = 0;
                waypointIndex = nextIndex;
            }

            animationFrameId =
                requestAnimationFrame(animateMotion);
        }

        animationFrameId =
            requestAnimationFrame(animateMotion);

        return () => {
            disposed = true;

            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

            map.remove();
            mapInstanceRef.current = null;
        };
    }, [onStatusChange]);

    return (
        <div
            ref={mapElementRef}
            className="indoor-map"
        />
    );
}

export default IndoorMap;
