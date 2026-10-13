import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// These dimensions match the supplied updated HTML floor plan.
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 1500;

// Simulation scale: each SVG unit represents 1 cm (0.01 meters).
const METERS_PER_UNIT = 0.01;

const svgMap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="1000" height="1500">
            <defs>
                <marker id="door-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
                </marker>
                <marker id="entrance-arrow" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <path d="M 1 2 L 10 6 L 1 10 z" fill="#0284c7" />
                </marker>
            </defs>

            <rect width="1000" height="1500" fill="#f8fafc"/>

            <!-- ================= 1. الأرضيات ================= -->
            <path d="
                M 660,165 
                L 950,165 
                L 950,420 
                L 965,420 
                L 965,900 
                L 950,900 
                L 950,1110 
                L 925,1110 
                L 925,1230 
                L 940,1230 
                L 940,1245 
                L 940,1400 
                L 660,1400 
                Z" 
                fill="#ffffff"/>

            <polygon points="60,165 660,165 660,760 60,760" fill="#f1f5f9"/>
            <polygon points="60,772 660,772 660,1350 60,1350" fill="#f1f5f9"/>

            <!-- ================= 2. المستطيلات والطاولات ================= -->
            <!-- أثاث Lab 227 -->
            <g id="furniture-lab227">
                <!-- طاولة الحائط العلوي -->
                <rect x="180" y="195" width="370" height="45" rx="5" fill="#94a3b8" opacity="0.65"/>
                
                <!-- طاولة الحائط الأيسر -->
                <rect x="80" y="270" width="45" height="380" rx="5" fill="#94a3b8" opacity="0.65"/>

                <!-- طاولة الحائط السفلي -->
                <rect x="180" y="685" width="370" height="45" rx="5" fill="#94a3b8" opacity="0.65"/>

                <!-- طاولة الحائط الأيمن أسفل الباب (مكان الخط الأحمر) -->
                <rect x="605" y="400" width="45" height="260" rx="5" fill="#94a3b8" opacity="0.65"/>

                <!-- المستطيل الأصفر الأوسط بعد تطويله -->
                <rect x="260" y="445" width="210" height="65" rx="8" fill="#f59e0b" opacity="0.85"/>

                <!-- اسم المعمل بارز في أعلى المنتصف -->
                <rect x="300" y="255" width="130" height="36" rx="8" fill="#1e293b" opacity="0.9"/>
                <text x="365" y="280" fill="#ffffff" font-size="20" font-family="Arial" font-weight="bold" text-anchor="middle">Lab 227</text>
            </g>

            <!-- أثاث Lab 226 -->
            <g id="furniture-lab226">
                <!-- طاولة الحائط العلوي -->
                <rect x="180" y="800" width="370" height="45" rx="5" fill="#94a3b8" opacity="0.65"/>
                
                <!-- طاولة الحائط الأيسر -->
                <rect x="80" y="875" width="45" height="380" rx="5" fill="#94a3b8" opacity="0.65"/>

                <!-- طاولة الحائط السفلي -->
                <rect x="180" y="1280" width="370" height="45" rx="5" fill="#94a3b8" opacity="0.65"/>

                <!-- طاولة الحائط الأيمن أسفل الباب (مكان الخط الأحمر في الصورة) -->
                <rect x="605" y="1070" width="45" height="260" rx="5" fill="#94a3b8" opacity="0.65"/>

                <!-- المستطيل الأصفر الأوسط بعد تطويله -->
                <rect x="260" y="1035" width="210" height="65" rx="8" fill="#f59e0b" opacity="0.85"/>

                <!-- اسم المعمل بارز في أعلى المنتصف -->
                <rect x="300" y="860" width="130" height="36" rx="8" fill="#1e293b" opacity="0.9"/>
                <text x="365" y="885" fill="#ffffff" font-size="20" font-family="Arial" font-weight="bold" text-anchor="middle">Lab 226</text>
            </g>

            <!-- ================= 3. الحوائط والكسرات المعمارية ================= -->
            <g fill="none" stroke="#000000" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter">
                
                <line x1="660" y1="165" x2="950" y2="165" />

                <!-- جدار الطرقة الأيمن مع الكسرة والسنة البارزة والفتحة -->
                <line x1="950" y1="165" x2="950" y2="420" />
                <line x1="950" y1="420" x2="965" y2="420" />
                <line x1="965" y1="420" x2="965" y2="900" />
                <line x1="965" y1="900" x2="950" y2="900" />
                
                <path d="
                    M 950,900 
                    L 950,1110 
                    L 925,1110 
                    L 925,1230 
                    L 940,1230" />
                
                <line x1="950" y1="1310" x2="950" y2="1400" />
                <line x1="660" y1="1400" x2="950" y2="1400" />

                <!-- حوائط Lab 227 -->
                <path d="M 60,165 L 250,165 L 250,145 L 450,145 L 450,165 L 660,165" />
                <path d="
                    M 60,165 
                    L 60,240 
                    L 45,240 
                    L 45,430 
                    L 60,430 
                    L 60,580 
                    L 45,580 
                    L 45,690 
                    L 60,690 
                    L 60,760" />

                <!-- الجدار الفاصل بين الغرفتين -->
                <path d="
                    M 60,760 
                    L 230,760 
                    L 230,745 
                    L 260,745 
                    L 260,760 
                    L 430,760 
                    L 430,745 
                    L 460,745 
                    L 460,760 
                    L 660,760" />
                <path d="M 60,772 L 660,772" />

                <!-- حوائط Lab 226 -->
                <path d="
                    M 60,772 
                    L 60,880 
                    L 45,880 
                    L 45,1080 
                    L 60,1080 
                    L 60,1230 
                    L 45,1230 
                    L 45,1330 
                    L 60,1330 
                    L 60,1350 
                    L 250,1350 
                    L 250,1365 
                    L 350,1365 
                    L 350,1350 
                    L 540,1350 
                    L 540,1365 
                    L 630,1365 
                    L 630,1350 
                    L 660,1350" />

                <!-- جدار الطرقة الداخلي مع الباب العلوي لـ Lab 227 -->
                <path d="M 660,165 L 660,220 L 640,220 L 640,240 L 660,240" />
                <path d="M 660,360 L 660,760" />
                <path d="M 660,772 L 660,900 L 640,900 L 640,920 L 660,920" />
                <line x1="660" y1="1040" x2="660" y2="1400" />
            </g>

            <!-- مؤشر فتحة الدخول للطرقة -->
            <line x1="995" y1="1270" x2="905" y2="1270" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" marker-end="url(#entrance-arrow)"/>
            <rect x="910" y="1320" width="85" height="26" rx="5" fill="#0f172a" opacity="0.85"/>
            <text x="952" y="1337" fill="#38bdf8" font-size="10" font-family="Arial" font-weight="bold" text-anchor="middle">ENTRANCE</text>

            <!-- باب Lab 227 -->
            <path d="M 660,360 A 120 120 0 0 1 540,240" fill="none" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4,4"/>
            <line x1="660" y1="360" x2="575" y2="275" stroke="#3b82f6" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="720" y1="300" x2="620" y2="300" stroke="#10b981" stroke-width="2.5" marker-end="url(#door-arrow)"/>
            <rect x="575" y="215" width="60" height="20" rx="4" fill="#0f172a" opacity="0.8"/>
            <text x="605" y="229" fill="#38bdf8" font-size="10" font-family="Arial" font-weight="bold" text-anchor="middle">DOOR باب</text>

            <!-- باب Lab 226 -->
            <path d="M 660,1040 A 120 120 0 0 1 540,920" fill="none" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4,4"/>
            <line x1="660" y1="1040" x2="575" y2="955" stroke="#3b82f6" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="720" y1="980" x2="620" y2="980" stroke="#10b981" stroke-width="2.5" marker-end="url(#door-arrow)"/>
            <rect x="575" y="895" width="60" height="20" rx="4" fill="#0f172a" opacity="0.8"/>
            <text x="605" y="909" fill="#38bdf8" font-size="10" font-family="Arial" font-weight="bold" text-anchor="middle">DOOR باب</text>

            <!-- مسمى الطرقة -->
            <text x="800" y="780" fill="#64748b" font-size="26" font-family="Arial" font-weight="bold" text-anchor="middle" transform="rotate(90 800 780)">CORRIDOR (الطرقة)</text>
        </svg>`;

// Coordinates are expressed in the SVG's coordinate system (x, y).
// The final waypoints return to the entrance through the corridor,
// preventing a diagonal shortcut through the floor plan.
const WAYPOINTS = [
    { x: 990, y: 1270, name: 'Outside Main Entrance' },
    { x: 910, y: 1270, name: 'Main Entrance Threshold', door: true },
    { x: 790, y: 1270, name: 'Main Corridor' },
    { x: 790, y: 980, name: 'Corridor - Outside Lab 226' },

    // Enter and navigate Lab 226.
    { x: 670, y: 980, name: 'Lab 226 Doorway', door: true },
    { x: 520, y: 980, name: 'Inside Lab 226', door: true },
    { x: 200, y: 940, name: 'Lab 226 - Upper Area' },
    { x: 200, y: 1180, name: 'Lab 226 - Lower Area' },
    // Go below and around the yellow table before heading back to the door.
    { x: 200, y: 1120, name: 'Lab 226 - Clear of Central Table' },
    { x: 500, y: 1120, name: 'Lab 226 - Passing Central Table' },
    { x: 520, y: 980, name: 'Lab 226 - Returning to Exit', door: true },
    { x: 670, y: 980, name: 'Lab 226 Exit', door: true },
    { x: 790, y: 980, name: 'Back in Main Corridor' },

    // Follow the corridor toward Lab 227.
    { x: 790, y: 500, name: 'Corridor - Toward Lab 227' },
    { x: 790, y: 300, name: 'Corridor - Outside Lab 227' },

    // Enter and navigate Lab 227.
    { x: 670, y: 300, name: 'Lab 227 Doorway', door: true },
    { x: 520, y: 300, name: 'Inside Lab 227', door: true },
    { x: 200, y: 360, name: 'Lab 227 - Upper Area' },
    { x: 200, y: 600, name: 'Lab 227 - Lower Area' },
    // Move below and around the yellow table rather than through it.
    { x: 200, y: 530, name: 'Lab 227 - Clear of Central Table' },
    { x: 500, y: 530, name: 'Lab 227 - Passing Central Table' },
    { x: 520, y: 300, name: 'Lab 227 - Returning to Exit', door: true },
    { x: 670, y: 300, name: 'Lab 227 Exit', door: true },
    { x: 790, y: 300, name: 'Back in Main Corridor' },
    { x: 790, y: 200, name: 'Upper Corridor' },

    // Complete the loop by returning down the corridor to the entrance.
    { x: 790, y: 500, name: 'Main Corridor' },
    { x: 790, y: 980, name: 'Main Corridor' },
    { x: 790, y: 1270, name: 'Main Corridor - Near Entrance' },
    { x: 910, y: 1270, name: 'Main Entrance Threshold', door: true },
    { x: 990, y: 1270, name: 'Outside Main Entrance' },
];

function IndoorMap({ onStatusChange }) {
    const mapElementRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const statusCallbackRef = useRef(onStatusChange);

    // Keep the latest callback without rebuilding the Leaflet map on every render.
    useEffect(() => {
        statusCallbackRef.current = onStatusChange;
    }, [onStatusChange]);

    useEffect(() => {
        const mapElement = mapElementRef.current;

        if (!mapElement || mapInstanceRef.current) return undefined;

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
            minZoom: -3,
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
            keyboard: false,
        });

        mapInstanceRef.current = map;

        L.control.zoom({ position: 'topright' }).addTo(map);

        const fullBounds = [
            [0, 0],
            [MAP_HEIGHT, MAP_WIDTH],
        ];

        const svgUrl =
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMap);

        L.imageOverlay(svgUrl, fullBounds).addTo(map);

        map.fitBounds(fullBounds, {
            paddingTopLeft: [45, 25],
            paddingBottomRight: [45, 95],
            animate: false,
        });

        // These bounds match the locations of the two labs in the new SVG.
        const roomBounds = {
            'Lab 227': [
                [MAP_HEIGHT - 755, 45],
                [MAP_HEIGHT - 145, 660],
            ],
            'Lab 226': [
                [MAP_HEIGHT - 1365, 45],
                [MAP_HEIGHT - 772, 660],
            ],
        };

        function updateMapFocus(room) {
            if (room === currentRoom) return;

            currentRoom = room;
            const targetBounds = room ? roomBounds[room] : fullBounds;

            map.stop();
            map.fitBounds(targetBounds, {
                paddingTopLeft: room ? [25, 50] : [45, 25],
                paddingBottomRight: room ? [25, 70] : [45, 95],
                animate: true,
                duration: 0.8,
                easeLinearity: 0.25,
            });
        }

        const traceLine = L.polyline([], {
            color: '#2563eb',
            weight: 5,
            lineCap: 'round',
            lineJoin: 'round',
            opacity: 0.95,
            interactive: false,
        }).addTo(map);

        const halo = L.circleMarker([0, 0], {
            radius: 15,
            color: '#60a5fa',
            fillColor: '#93c5fd',
            fillOpacity: 0.35,
            weight: 2,
            interactive: false,
        }).addTo(map);

        const marker = L.circleMarker([0, 0], {
            radius: 8,
            color: '#ffffff',
            fillColor: '#ef4444',
            fillOpacity: 1,
            weight: 3,
            interactive: false,
        }).addTo(map);

        // In the updated drawing, both labs are to the left of x=660.
        function getRoom(x, y) {
            if (x > 660) return null;
            if (y >= 165 && y <= 760) return 'Lab 227';
            if (y >= 772 && y <= 1365) return 'Lab 226';
            return null;
        }

        function animateMotion(timestamp) {
            if (disposed) return;

            const start = WAYPOINTS[waypointIndex];
            const nextIndex = (waypointIndex + 1) % WAYPOINTS.length;
            const end = WAYPOINTS[nextIndex];

            const svgX = start.x + (end.x - start.x) * progress;
            const svgY = start.y + (end.y - start.y) * progress;
            const mapPosition = [MAP_HEIGHT - svgY, svgX];

            if (previousPosition !== null) {
                const stepUnits = Math.hypot(
                    svgX - previousPosition.x,
                    svgY - previousPosition.y,
                );
                totalDistanceMeters += stepUnits * METERS_PER_UNIT;
            }

            previousPosition = { x: svgX, y: svgY };

            marker.setLatLng(mapPosition);
            halo.setLatLng(mapPosition);

            walkedPath.push(mapPosition);
            if (walkedPath.length > 1200) walkedPath.shift();
            traceLine.setLatLngs(walkedPath);

            const room = getRoom(svgX, svgY);
            updateMapFocus(room);

            if (
                typeof statusCallbackRef.current === 'function' &&
                timestamp - lastStatusUpdate >= 80
            ) {
                lastStatusUpdate = timestamp;
                statusCallbackRef.current({
                    location: room ? `داخل ${room}` : start.name,
                    distance: `${totalDistanceMeters.toFixed(1)} m`,
                    isInRoom: Boolean(room),
                });
            }

            const isCrossingDoor = Boolean(start.door && end.door);
            progress += isCrossingDoor ? 0.0034 : 0.0018;

            if (progress >= 1) {
                progress = 0;
                waypointIndex = nextIndex;
            }

            animationFrameId = requestAnimationFrame(animateMotion);
        }

        animationFrameId = requestAnimationFrame(animateMotion);

        return () => {
            disposed = true;
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    return <div ref={mapElementRef} className="indoor-map" />;
}

export default IndoorMap;
