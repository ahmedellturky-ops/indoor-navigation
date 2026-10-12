
import { useCallback, useState } from 'react';
import IndoorMap from './components/IndoorMap';
import './styles/App.scss';

const apps = [
  {
    id: 'indoor-map',
    name: 'Indoor Map',
    color: 'linear-gradient(145deg, #44c5f5, #2878eb)'
  },
  {
    id: 'camera',
    name: 'Camera',
    color: 'linear-gradient(145deg, #64748b, #263449)'
  },
  {
    id: 'gallery',
    name: 'Photos',
    color: 'linear-gradient(145deg, #fb7185, #f59e0b)'
  },
  {
    id: 'settings',
    name: 'Settings',
    color: 'linear-gradient(145deg, #9caec4, #53657d)'
  },
  {
    id: 'files',
    name: 'Files',
    color: 'linear-gradient(145deg, #fbbf24, #e58b18)'
  },
  {
    id: 'notes',
    name: 'Notes',
    color: 'linear-gradient(145deg, #fff7c2, #f4d96b)'
  },
  {
    id: 'music',
    name: 'Music',
    color: 'linear-gradient(145deg, #fa6498, #b52f80)'
  },
  {
    id: 'browser',
    name: 'Browser',
    color: 'linear-gradient(145deg, #67e8d0, #1687a5)'
  }
];

function AppGlyph({ id }) {
  let drawing;

  switch (id) {
    case 'indoor-map':
      drawing = (
        <>
          <path d="M3 6.5 8.5 4l7 2.5L21 4.5v13L15.5 20l-7-2.5L3 20z" />
          <path d="M8.5 4v13.5M15.5 6.5V20" />
          <circle cx="12" cy="10" r="2" />
        </>
      );
      break;

    case 'camera':
      drawing = (
        <>
          <rect x="3" y="6" width="18" height="14" rx="3" />
          <path d="m8 6 1.5-2h5L16 6" />
          <circle cx="12" cy="13" r="4" />
          <circle cx="18" cy="9" r=".8" fill="currentColor" stroke="none" />
        </>
      );
      break;

    case 'gallery':
      drawing = (
        <>
          <rect x="3" y="4" width="18" height="16" rx="4" />
          <circle cx="9" cy="9" r="1.5" />
          <path d="m4 17 5-5 3.5 3L16 10l5 7" />
        </>
      );
      break;

    case 'settings':
      drawing = (
        <>
          <circle cx="12" cy="12" r="3.2" />
          <path d="m19.4 15 .1.1 1.2 1-1.5 2.6-1.5-.6a7.9 7.9 0 0 1-2 .9l-.3 1.6h-3l-.3-1.6a7.9 7.9 0 0 1-2-.9l-1.5.6-1.5-2.6 1.2-1a7.8 7.8 0 0 1 0-2.1l-1.2-1 1.5-2.6 1.5.6a7.9 7.9 0 0 1 2-.9l.3-1.6h3l.3 1.6a7.9 7.9 0 0 1 2 .9l1.5-.6 1.5 2.6-1.2 1a7.8 7.8 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)" />
        </>
      );
      break;

    case 'files':
      drawing = (
        <>
          <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M3 10h18" />
        </>
      );
      break;

    case 'notes':
      drawing = (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </>
      );
      break;

    case 'music':
      drawing = (
        <>
          <path d="M10 18V5l10-2v13" />
          <path d="m10 8 10-2" />
          <ellipse cx="7" cy="18" rx="3" ry="2" />
          <ellipse cx="17" cy="16" rx="3" ry="2" />
        </>
      );
      break;

    case 'browser':
      drawing = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </>
      );
      break;

    default:
      drawing = <circle cx="12" cy="12" r="8" />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="27"
      height="27"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {drawing}
    </svg>
  );
}

function App() {
  const [activeApp, setActiveApp] = useState(null);

  const [movement, setMovement] = useState({
    location: 'Main Entrance',
    distance: '0.000000 mi',
    isInRoom: false
  });

  const handleStatusChange = useCallback((status) => {
    setMovement(status);
  }, []);

  const openApp = (appId) => {
    setActiveApp(appId);
  };

  const goHome = () => {
    setActiveApp(null);
  };

  const selectedApp = apps.find((app) => app.id === activeApp);

  return (
    <main className="app">
      <section className="phone-frame">
        <div className="phone-notch">
          <span className="notch-camera" />
        </div>

        {!activeApp && (
          <div className="home-screen">
            <div className="home-content">
              <div className="phone-status-bar">
                <span className="phone-time">9:41</span>

                <div className="phone-system-icons">
                  <svg viewBox="0 0 20 16" width="18" height="14" fill="currentColor">
                    <path d="M1 14h3V10H1zm5 0h3V7H6zm5 0h3V4h-3zm5 0h3V1h-3z" />
                  </svg>

                  <svg viewBox="0 0 20 16" width="17" height="14" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M2 5a12 12 0 0 1 16 0M5 8a7.5 7.5 0 0 1 10 0m-7 3a3.4 3.4 0 0 1 4 0" strokeLinecap="round" />
                    <circle cx="10" cy="14" r=".8" fill="currentColor" />
                  </svg>

                  <span className="battery-icon">
                    <span />
                  </span>
                </div>
              </div>

              <header className="home-heading">
                <span className="home-date">MONDAY, OCTOBER 12</span>
                <h1>
                  Hello دكتور جمال الشيخ
                </h1>

                <p className="home-greeting-secondary">
                  Hello بشمهندسه ألفت
                </p>

                <p>Your space, beautifully connected.</p>
                
              </header>

              <div className="home-search">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 5 5" strokeLinecap="round" />
                </svg>
                <span>Search your apps</span>
                <span className="search-dots">•••</span>
              </div>

              <div className="apps-heading">
                <span>YOUR APPS</span>
                <span>8 applications</span>
              </div>

              <div className="home-app-grid">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    className="home-app-button"
                    onClick={() => openApp(app.id)}
                    aria-label={`Open ${app.name}`}
                  >
                    <span
                      className={`home-app-icon home-app-icon--${app.id}`}
                      style={{ '--app-gradient': app.color }}
                    >
                      <AppGlyph id={app.id} />

                      {app.id === 'indoor-map' && (
                        <span className="app-live-dot" />
                      )}
                    </span>

                    <span className="home-app-label">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="home-spacer" />

              <button
                type="button"
                className="home-widget"
                onClick={() => openApp('indoor-map')}
              >
                <span className="widget-icon">
                  <AppGlyph id="indoor-map" />
                </span>

                <span className="widget-copy">
                  <strong>Indoor Navigation</strong>
                  <span>Explore your building with ease.</span>
                </span>

                <span className="widget-arrow">↗</span>
              </button>

              <div className="home-dock">
                {['indoor-map', 'gallery', 'music', 'settings'].map((id) => {
                  const app = apps.find((item) => item.id === id);

                  return (
                    <button
                      key={id}
                      type="button"
                      className={`dock-icon dock-icon--${id}`}
                      style={{ '--app-gradient': app.color }}
                      onClick={() => openApp(id)}
                      aria-label={`Open ${app.name}`}
                    >
                      <AppGlyph id={id} />
                    </button>
                  );
                })}
              </div>

              <div className="home-indicator" />
            </div>
          </div>
        )}

        {activeApp === 'indoor-map' && (
          <div className="map-screen screen-enter">
            <IndoorMap onStatusChange={handleStatusChange} />

            <div className="map-topbar">
              <button
                type="button"
                className="map-back-button"
                onClick={goHome}
              >
                <span className="back-chevron">‹</span>
                Home
              </button>

              <div className="map-app-title">
                <span className="map-title-dot" />
                Indoor Navigation
              </div>
            </div>

            <div
              className={
                movement.isInRoom
                  ? 'status-card status-card--in-room'
                  : 'status-card'
              }
            >
              <div className="status-card__location">
                <span className="status-card__icon">⌖</span>

                <div>
                  <span className="status-card__label">
                    Current Location
                  </span>
                  <strong>{movement.location}</strong>
                </div>
              </div>

              <div className="status-card__distance">
                <span className="status-card__label">
                  Distance Traveled
                </span>
                <strong>{movement.distance}</strong>
                <span className="status-card__arrow">↑</span>
              </div>
            </div>
          </div>
        )}

        {activeApp && activeApp !== 'indoor-map' && selectedApp && (
          <div className="app-preview screen-enter">
            <div className="preview-status-bar">
              <span>9:41</span>
              <span>▂▄▆　◔　▰</span>
            </div>

            <button
              type="button"
              className="preview-home-button"
              onClick={goHome}
            >
              <span>‹</span> Home
            </button>

            <div className="preview-content">
              <span
                className={`preview-app-icon home-app-icon--${selectedApp.id}`}
                style={{ '--app-gradient': selectedApp.color }}
              >
                <AppGlyph id={selectedApp.id} />
              </span>

              <h1>{selectedApp.name}</h1>

              <p>
                This app is a preview.
                <br />
                More features coming soon.
              </p>

              <button
                type="button"
                className="preview-return-button"
                onClick={goHome}
              >
                Back to Home
              </button>
            </div>

            <div className="home-indicator preview-indicator" />
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
