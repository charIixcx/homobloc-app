import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Clock, MapPin, List, Star, Navigation, Info, AlertCircle, Menu, X, ChevronRight, Eye, EyeOff, Droplets, 
HeartPulse, Bell, BellOff } from 'lucide-react';

// --- DATA ---
// Digitized from the provided "Order of the Day" image
// We normalize times to a 24h+ format for easier sorting (e.g., 01:00 -> 25:00)
const RAW_ACTS = [
  // DEPOT
  { id: 'd1', artist: 'Patrick Mason', stage: 'Depot', time: '01:00', sortTime: 25.0 },
  { id: 'd2', artist: 'The Blessed Madonna', stage: 'Depot', time: '23:30', sortTime: 23.5 },
  { id: 'd3', artist: 'Sugababes', stage: 'Depot', time: '22:40', sortTime: 22.66 },
  { id: 'd4', artist: 'Slayyyter', stage: 'Depot', time: '21:45', sortTime: 21.75 },
  { id: 'd5', artist: 'Mix-Stress', stage: 'Depot', time: '21:30', sortTime: 21.5 },
  { id: 'd6', artist: 'Fat Tony', stage: 'Depot', time: '20:30', sortTime: 20.5 },
  { id: 'd7', artist: 'Ana Matronic', stage: 'Depot', time: '19:30', sortTime: 19.5 },
  { id: 'd8', artist: 'HARRSPN ft House Gospel Choir', stage: 'Depot', time: '18:30', sortTime: 18.5 },
  { id: 'd9', artist: 'Forbid', stage: 'Depot', time: '17:30', sortTime: 17.5 },

  // CONCOURSE
  { id: 'c1', artist: 'Honey Dijon', stage: 'Concourse', time: '02:00', sortTime: 26.0 },
  { id: 'c2', artist: 'Todd Edwards', stage: 'Concourse', time: '01:00', sortTime: 25.0 },
  { id: 'c3', artist: 'Roi Perez', stage: 'Concourse', time: '00:00', sortTime: 24.0 },
  { id: 'c4', artist: 'Sally C b2b I. Jordan', stage: 'Concourse', time: '22:30', sortTime: 22.5 },
  { id: 'c5', artist: 'Grace Sands', stage: 'Concourse', time: '21:30', sortTime: 21.5 },
  { id: 'c6', artist: 'S-Candalo', stage: 'Concourse', time: '20:30', sortTime: 20.5 },
  { id: 'c7', artist: 'Gina Breeze', stage: 'Concourse', time: '19:30', sortTime: 19.5 },
  { id: 'c8', artist: 'Kim Lana', stage: 'Concourse', time: '18:30', sortTime: 18.5 },
  { id: 'c9', artist: 'Mr Mulatto', stage: 'Concourse', time: '17:30', sortTime: 17.5 },

  // ARCHIVE
  { id: 'a1', artist: 'Sarah Sommers Live', stage: 'Archive', time: '02:20', sortTime: 26.33 },
  { id: 'a2', artist: 'Bashkka', stage: 'Archive', time: '01:10', sortTime: 25.16 },
  { id: 'a3', artist: 'Peaches b2b Erol Alkan', stage: 'Archive', time: '23:50', sortTime: 23.83 },
  { id: 'a4', artist: 'Beth Ditto Live', stage: 'Archive', time: '23:10', sortTime: 23.16 },
  { id: 'a5', artist: 'Hercules & Love Affair Live', stage: 'Archive', time: '22:20', sortTime: 22.33 },
  { id: 'a6', artist: 'Ghetto Fabulous', stage: 'Archive', time: '21:45', sortTime: 21.75 },
  { id: 'a7', artist: 'Taahliah Live', stage: 'Archive', time: '21:10', sortTime: 21.16 },
  { id: 'a8', artist: 'Babymorocco', stage: 'Archive', time: '20:35', sortTime: 20.58 },
  { id: 'a9', artist: 'House of Spice', stage: 'Archive', time: '19:00', sortTime: 19.0 },
  { id: 'a10', artist: 'Red Rodeo Club', stage: 'Archive', time: '18:15', sortTime: 18.25 },
  { id: 'a11', artist: 'Wink', stage: 'Archive', time: '17:30', sortTime: 17.5 },

  // THE STAR (Part of Pub)
  { id: 's1', artist: 'Mollie Rush', stage: 'The Star', time: '02:00', sortTime: 26.0 },
  { id: 's2', artist: 'Rojak', stage: 'The Star', time: '01:00', sortTime: 25.0 },
  { id: 's3', artist: 'Stacey Bee b2b Jade Jaxon', stage: 'The Star', time: '00:10', sortTime: 24.16 },
  { id: 's4', artist: 'Only Fire', stage: 'The Star', time: '23:10', sortTime: 23.16 },
  { id: 's5', artist: 'Debasement', stage: 'The Star', time: '22:20', sortTime: 22.33 },
  { id: 's6', artist: 'Sue Veneers', stage: 'The Star', time: '21:45', sortTime: 21.75 },
  { id: 's7', artist: 'Lionstorm', stage: 'The Star', time: '21:05', sortTime: 21.08 },
  { id: 's8', artist: 'Paige Kennedy', stage: 'The Star', time: '20:20', sortTime: 20.33 },
  { id: 's9', artist: 'The Darklings', stage: 'The Star', time: '19:30', sortTime: 19.5 },
  { id: 's10', artist: 'Third Kulture', stage: 'The Star', time: '18:45', sortTime: 18.75 },
  { id: 's11', artist: 'Ashtylr', stage: 'The Star', time: '18:00', sortTime: 18.0 },

  // THE GARTER (Part of Pub)
  { id: 'g1', artist: 'Jamie Bull', stage: 'The Garter', time: '01:30', sortTime: 25.5 },
  { id: 'g2', artist: 'Kath McDermott', stage: 'The Garter', time: '00:00', sortTime: 24.0 },
  { id: 'g3', artist: 'Butch Revival', stage: 'The Garter', time: '23:00', sortTime: 23.0 },
  { id: 'g4', artist: 'The Fat Britney', stage: 'The Garter', time: '22:00', sortTime: 22.0 },
  { id: 'g5', artist: 'Chipped Polish', stage: 'The Garter', time: '21:00', sortTime: 21.0 },
  { id: 'g6', artist: 'Bollibubbles', stage: 'The Garter', time: '20:00', sortTime: 20.0 },
  { id: 'g7', artist: 'Lil Miss Jackie', stage: 'The Garter', time: '19:00', sortTime: 19.0 },
  { id: 'g8', artist: 'T4T', stage: 'The Garter', time: '18:00', sortTime: 18.0 },

  // ROOFTOP
  { id: 'r1', artist: 'Eliza Rose', stage: 'The Rooftop', time: '22:00', sortTime: 22.0 },
  { id: 'r2', artist: 'Gabrielle Kwarteng', stage: 'The Rooftop', time: '21:00', sortTime: 21.0 },
  { id: 'r3', artist: 'Joshua James', stage: 'The Rooftop', time: '20:00', sortTime: 20.0 },
  { id: 'r4', artist: 'Julie Desire', stage: 'The Rooftop', time: '19:00', sortTime: 19.0 },
  { id: 'r5', artist: 'Aiden Francis', stage: 'The Rooftop', time: '18:00', sortTime: 18.0 },

  // PLANT ROOM
  { id: 'p1', artist: 'Jay Jay Revlon', stage: 'Plant Room', time: '21:30', sortTime: 21.5 },
  { id: 'p2', artist: 'Che3kz', stage: 'Plant Room', time: '20:45', sortTime: 20.75 },
  { id: 'p3', artist: 'Pxssy Palace DJs', stage: 'Plant Room', time: '20:00', sortTime: 20.0 },
  { id: 'p4', artist: 'UNIIQU3', stage: 'Plant Room', time: '19:00', sortTime: 19.0 },
  { id: 'p5', artist: 'Meme Gold', stage: 'Plant Room', time: '18:00', sortTime: 18.0 },
];

// Re-mapped to match the provided site map images
// Coordinate system 1000x800 for more detail
const LOCATIONS = {
  // Main Stages
  'Depot': { x: 300, y: 400, color: '#3182ce' }, // Blueish Teal
  'Concourse': { x: 800, y: 500, color: '#48bb78' }, // Green
  'Archive': { x: 600, y: 600, color: '#e53e3e' }, // Red wedge
  
  // Smaller areas
  'The Star': { x: 550, y: 200, color: '#ecc94b' }, // Top Middle
  'The Garter': { x: 600, y: 200, color: '#d69e2e' }, // Next to Star
  'The Rooftop': { x: 500, y: 150, color: '#d53f8c' }, // Pink
  'Plant Room': { x: 800, y: 700, color: '#2f855a' }, // Bottom of Concourse
  
  // Facilities
  'Entrance': { x: 750, y: 300, color: '#ffffff' }, // New Entrance Arrow
  'Toilets': { x: 500, y: 500, color: '#a0aec0' }, // Between Depot/Archive
  'Bar': { x: 200, y: 600, color: '#cbd5e0' },
  'Medical': { x: 100, y: 200, color: '#fc8181' }, // Top left of Depot
  'Water': { x: 450, y: 600, color: '#63b3ed' },
};

// Simplified adjacency for pathfinding on the new map
const PATHS = [
  ['Medical', 'Depot'],
  ['Depot', 'Bar'],
  ['Depot', 'Toilets'],
  ['Depot', 'Archive'],
  ['Archive', 'Toilets'],
  ['Archive', 'Water'],
  ['Archive', 'Entrance'],
  ['Entrance', 'Concourse'],
  ['Concourse', 'Plant Room'],
  ['Concourse', 'The Star'],
  ['The Star', 'The Garter'],
  ['The Star', 'The Rooftop'],
  ['The Star', 'Entrance'], // Cross over
];

const STAGE_COLORS = {
  'Depot': 'bg-blue-600',
  'Concourse': 'bg-green-500',
  'Archive': 'bg-red-600',
  'The Star': 'bg-yellow-400 text-black',
  'The Garter': 'bg-yellow-600',
  'The Rooftop': 'bg-pink-500',
  'Plant Room': 'bg-green-800',
};

const Header = ({ activeTab, setActiveTab, focusMode, setFocusMode, notificationPermission, requestNotificationPermission 
}) => (
  <div className={`bg-black text-white p-4 sticky top-0 z-50 shadow-md border-b border-gray-800 transition-all 
duration-300 ${focusMode ? 'py-6' : 'p-4'}`}>
    <div className="flex justify-between items-center mb-4">
      <h1 className={`font-black tracking-widest uppercase transition-all ${focusMode ? 'text-4xl text-yellow-400' : 
'text-2xl'}`} style={{ fontFamily: 'Impact, sans-serif' }}>
        HOMOBLOC
      </h1>
      <div className="flex items-center space-x-2">
        {/* Notification Button */}
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className={`flex items-center space-x-2 rounded-full border border-gray-700 bg-gray-800 text-gray-400 
hover:text-white px-3 py-1`}
          >
            <Bell size={16} />
          </button>
        )}
        
        {/* Focus Mode Toggle */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`flex items-center space-x-2 rounded-full border transition-all ${
            focusMode
              ? 'bg-yellow-400 text-black px-6 py-2 border-yellow-400'
              : 'bg-gray-800 text-gray-400 px-3 py-1 border-gray-700'
          }`}
        >
          {focusMode ? <Eye size={24} /> : <EyeOff size={16} />}
          <span className={`font-bold uppercase ${focusMode ? 'text-lg' : 'text-xs'}`}>
            {focusMode ? 'Focus' : 'Focus'}
          </span>
        </button>
      </div>
    </div>
    <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg">
      {['lineup', 'plan', 'map'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 font-bold uppercase rounded-md transition-colors ${
            focusMode ? 'py-4 text-xl' : 'py-2 text-sm'
          } ${
            activeTab === tab
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

// --- LINEUP COMPONENT ---
const Lineup = ({ acts, savedActs, toggleSave, focusMode }) => {
  const [filter, setFilter] = useState('All');
  const stages = ['All', ...new Set(acts.map(a => a.stage))];

  const filteredActs = acts.filter(act => filter === 'All' || act.stage === filter);

  return (
    <div className="pb-20 bg-black min-h-screen text-white">
      <div className={`overflow-x-auto whitespace-nowrap border-b border-gray-800 scrollbar-hide ${focusMode ? 'p-6' : 
'p-4'}`}>
        {stages.map(stage => (
          <button
            key={stage}
            onClick={() => setFilter(stage)}
            className={`mr-3 rounded-full font-bold uppercase border transition-all ${
              focusMode
                ? 'px-6 py-3 text-lg border-2'
                : 'px-4 py-1 text-xs border'
            } ${
              filter === stage
                ? 'bg-white text-black border-white'
                : 'text-gray-400 border-gray-700'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      <div className="p-2">
        {filteredActs.map(act => {
          const isSaved = savedActs.includes(act.id);
          return (
            <div
              key={act.id}
              onClick={() => focusMode && toggleSave(act.id)} // Make whole card clickable in focus mode
              className={`mb-2 rounded-lg border border-gray-800 bg-gray-900 flex justify-between items-center 
transition-all
                ${isSaved ? 'ring-2 ring-yellow-400 bg-gray-800' : ''}
                ${focusMode ? 'p-6 mb-4 active:scale-95' : 'p-3'}
              `}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`rounded font-bold uppercase ${STAGE_COLORS[act.stage] || 'bg-gray-600'} ${focusMode ? 
'text-sm px-3 py-1' : 'text-[10px] px-2 py-0.5'}`}>
                    {act.stage}
                  </span>
                  <span className={`font-mono text-yellow-400 ${focusMode ? 'text-xl' : 'text-xs'}`}>{act.time}</span>
                </div>
                <h3 className={`font-bold leading-tight ${focusMode ? 'text-3xl mt-2' : 'text-lg'}`}>{act.artist}</h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(act.id);
                }}
                className={`rounded-full transition-all ${
                  focusMode ? 'p-5' : 'p-3'
                } ${
                  isSaved ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                }`}
              >
                <Star size={focusMode ? 32 : 20} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MY PLAN COMPONENT ---
const MyPlan = ({ acts, savedActs, toggleSave, setActiveTab, setNavigationTarget, focusMode }) => {
  const myActs = acts
    .filter(act => savedActs.includes(act.id))
    .sort((a, b) => a.sortTime - b.sortTime);

  if (myActs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 p-8 text-center bg-black">
        <List size={focusMode ? 80 : 48} className="mb-4 opacity-50" />
        <h2 className={`${focusMode ? 'text-3xl' : 'text-xl'} font-bold mb-2`}>Your schedule is empty</h2>
        <p className="mb-6">Go to the Lineup and star the acts you don't want to miss!</p>
        <button
          onClick={() => setActiveTab('lineup')}
          className={`bg-white text-black rounded-full font-bold uppercase hover:bg-gray-200 ${focusMode ? 'px-8 py-4 
text-xl' : 'px-6 py-2'}`}
        >
          Browse Lineup
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-20 p-4">
      <div className="flex items-center space-x-2 mb-6 text-yellow-400">
        <Clock size={focusMode ? 32 : 20} />
        <h2 className={`${focusMode ? 'text-3xl' : 'text-xl'} font-bold uppercase`}>Your Itinerary</h2>
      </div>

      <div className={`relative ${focusMode ? 'space-y-6' : 'border-l-2 border-gray-800 ml-3 space-y-8'}`}>
        {myActs.map((act, idx) => (
          <div key={act.id} className={`relative ${focusMode ? '' : 'pl-8'}`}>
            {/* Timeline Dot (Hidden in Focus Mode for cleaner look) */}
            {!focusMode && (
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-yellow-400 border-4 border-black 
box-content"></div>
            )}

            <div className={`bg-gray-900 rounded-lg border border-gray-800 shadow-sm transition-all
              ${focusMode ? 'p-6 border-l-8 border-l-yellow-400' : 'p-4'}
            `}>
              <div className="flex justify-between items-start mb-2">
                <span className={`font-mono font-bold text-white ${focusMode ? 'text-4xl' : 
'text-2xl'}`}>{act.time}</span>
                <button
                  onClick={() => toggleSave(act.id)}
                  className={`text-gray-600 hover:text-red-500 ${focusMode ? 'p-2' : ''}`}
                >
                  <X size={focusMode ? 32 : 16} />
                </button>
              </div>

              <h3 className={`font-bold text-white mb-1 ${focusMode ? 'text-3xl my-3' : 'text-xl'}`}>{act.artist}</h3>
              <div className="flex justify-between items-end mt-4">
                <span className={`rounded font-bold uppercase ${STAGE_COLORS[act.stage]} ${focusMode ? 'text-lg px-4 
py-2' : 'text-xs px-2 py-1'}`}>
                  {act.stage}
                </span>
                <button
                  onClick={() => {
                    setNavigationTarget(act.stage);
                    setActiveTab('map');
                  }}
                  className={`flex items-center space-x-1 text-gray-300 hover:text-white bg-gray-800 rounded-full 
${focusMode ? 'px-6 py-3 text-lg' : 'px-3 py-1.5 text-xs'}`}
                >
                  <Navigation size={focusMode ? 20 : 12} />
                  <span>Directions</span>
                </button>
              </div>
            </div>

             {/* Gap indicator (Hidden in focus mode) */}
            {!focusMode && idx < myActs.length - 1 && (
               <div className="mt-4 ml-2 text-xs text-gray-600 font-mono">▼</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAP COMPONENT ---
const MapView = ({ navigationTarget, setNavigationTarget, focusMode }) => {
  const [currentLocation, setCurrentLocation] = useState('Entrance');
  const [showPath, setShowPath] = useState(false);

  // Helper to get coordinates
  const getCoords = (locName) => LOCATIONS[locName] || { x: 500, y: 400 };

  useEffect(() => {
    if (navigationTarget) {
      setShowPath(true);
    }
  }, [navigationTarget]);

  const renderPath = () => {
    if (!showPath || !navigationTarget || currentLocation === navigationTarget) return null;

    const start = getCoords(currentLocation);
    const end = getCoords(navigationTarget);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    return (
      <g>
        <path
          d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
          fill="none"
          stroke="#FCD34D"
          strokeWidth={focusMode ? "10" : "4"}
          strokeDasharray={focusMode ? "none" : "10 5"}
          className="animate-pulse"
        />
        <circle cx={end.x} cy={end.y} r={focusMode ? "15" : "8"} fill="#FCD34D" className="animate-ping" />
      </g>
    );
  };

  return (
    <div className="bg-gray-900 h-full min-h-screen flex flex-col relative">
      {/* Navigation Controls */}
      <div className={`bg-gray-800 border-b border-gray-700 z-10 ${focusMode ? 'p-6 space-y-6' : 'p-4 space-y-3'}`}>
        <div className={`flex items-center ${focusMode ? 'flex-col items-stretch space-y-2' : 'space-x-2'}`}>
           <div className={`flex items-center ${focusMode ? 'justify-center mb-1' : ''}`}>
             <MapPin className="text-green-400" size={focusMode ? 24 : 16} />
             <span className={`text-gray-400 uppercase font-bold ${focusMode ? 'text-lg ml-2' : 'text-xs 
w-12'}`}>From:</span>
           </div>
           <select
             value={currentLocation}
             onChange={(e) => setCurrentLocation(e.target.value)}
             className={`bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:border-yellow-400 
${
               focusMode ? 'text-2xl py-4 px-4 h-16' : 'text-sm px-2 py-1 flex-1'
             }`}
           >
             {Object.keys(LOCATIONS).map(loc => (
               <option key={loc} value={loc}>{loc}</option>
             ))}
           </select>
        </div>
        
        <div className={`flex items-center ${focusMode ? 'flex-col items-stretch space-y-2' : 'space-x-2'}`}>
           <div className={`flex items-center ${focusMode ? 'justify-center mb-1' : ''}`}>
             <Navigation className="text-yellow-400" size={focusMode ? 24 : 16} />
             <span className={`text-gray-400 uppercase font-bold ${focusMode ? 'text-lg ml-2' : 'text-xs 
w-12'}`}>To:</span>
           </div>
           <select
             value={navigationTarget || ''}
             onChange={(e) => {
               setNavigationTarget(e.target.value);
               setShowPath(true);
             }}
             className={`bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:border-yellow-400 
${
               focusMode ? 'text-2xl py-4 px-4 h-16' : 'text-sm px-2 py-1 flex-1'
             }`}
           >
             <option value="">Select Destination...</option>
             {Object.keys(LOCATIONS).map(loc => (
               <option key={loc} value={loc}>{loc}</option>
             ))}
           </select>
        </div>

        {/* Safety Buttons (Only in Focus Mode) */}
        {focusMode && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
            <button 
              onClick={() => { setNavigationTarget('Water'); setShowPath(true); }}
              className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl flex flex-col items-center 
justify-center space-y-2"
            >
              <Droplets size={32} />
              <span className="font-bold text-xl uppercase">Water</span>
            </button>
            <button 
              onClick={() => { setNavigationTarget('Medical'); setShowPath(true); }}
              className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-xl flex flex-col items-center justify-center 
space-y-2"
            >
              <HeartPulse size={32} />
              <span className="font-bold text-xl uppercase">Medical</span>
            </button>
          </div>
        )}
      </div>

      {/* Map Viz */}
      <div className="flex-1 relative overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="relative w-full aspect-square max-w-2xl bg-black rounded-lg shadow-2xl overflow-hidden border-2 
border-gray-700 m-4">

          {/* Detailed SVG Map based on Uploaded Images */}
          <svg viewBox="0 0 1000 800" className="w-full h-full absolute inset-0">
             
             {/* Streets / Background Context */}
             <text x="500" y="50" textAnchor="middle" fill="#4a5568" fontSize="20" fontWeight="bold" transform="rotate(-5 
500 50)">TEMPERANCE STREET</text>
             <text x="50" y="400" textAnchor="middle" fill="#4a5568" fontSize="20" fontWeight="bold" 
transform="rotate(-70 50 400)">BARING STREET</text>

             {/* DEPOT (Left Side - Blue) */}
             <path d="M 50,200 L 500,180 L 500,500 L 400,600 L 50,600 Z" fill="#2b6cb0" stroke="#4299e1" strokeWidth="2" 
opacity="0.9" />
             <text x="250" y="400" fill="white" fontSize="40" fontWeight="bold" textAnchor="middle" 
opacity="0.5">DEPOT</text>
             
             {/* MEDICAL (Top Left of Depot) */}
             <rect x="50" y="150" width="150" height="60" fill="#c53030" />
             <text x="125" y="190" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">MEDICAL</text>

             {/* ARCHIVE (Wedge Bottom Right - Red) */}
             <path d="M 510,250 L 750,350 L 720,750 L 510,650 Z" fill="#c53030" stroke="#fc8181" strokeWidth="2" 
opacity="0.9" />
             <text x="620" y="500" fill="white" fontSize="40" fontWeight="bold" textAnchor="middle" transform="rotate(10 
620 500)" opacity="0.5">ARCHIVE</text>

             {/* CONCOURSE (Right Side - Green) */}
             <rect x="750" y="350" width="220" height="350" fill="#2f855a" stroke="#48bb78" strokeWidth="2" />
             <text x="860" y="525" fill="white" fontSize="30" fontWeight="bold" textAnchor="middle" transform="rotate(90 
860 525)" opacity="0.5">CONCOURSE</text>
             
             {/* PLANT ROOM (Bottom of Concourse - Dark Green) */}
             <rect x="750" y="700" width="220" height="80" fill="#22543d" stroke="#48bb78" strokeWidth="2" />
             <text x="860" y="750" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">PLANT ROOM</text>

             {/* STAR & GARTER / ROOFTOP (Top Area - Yellow/Pink) */}
             {/* Star & Garter Area */}
             <path d="M 520,180 L 700,180 L 700,280 L 520,280 Z" fill="#d69e2e" stroke="#ecc94b" strokeWidth="2" />
             <text x="610" y="240" fill="black" fontSize="20" fontWeight="bold" textAnchor="middle">STAR & GARTER</text>
             
             {/* Rooftop Indicator */}
             <path d="M 500,120 L 650,120 L 650,160 L 500,160 Z" fill="#b83280" />
             <text x="575" y="150" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">ROOFTOP</text>

             {/* NEW ENTRANCE (Arrow Area) */}
             <path d="M 760,280 L 800,280 L 780,320 Z" fill="white" />
             <text x="780" y="260" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">ENTRANCE</text>

             {/* PATHS (Dotted Lines) */}
             {PATHS.map(([startName, endName], idx) => {
               const s = getCoords(startName);
               const e = getCoords(endName);
               return <line key={idx} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="#4a5568" strokeWidth="1" 
strokeDasharray="5 5" opacity="0.5" />;
             })}

             {/* Active Path */}
             {renderPath()}

             {/* Location Pins */}
             {Object.entries(LOCATIONS).map(([name, coords]) => (
               <g key={name} onClick={() => setNavigationTarget(name)} className="cursor-pointer group">
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={navigationTarget === name ? (focusMode ? 15 : 10) : (focusMode ? 10 : 6)}
                    fill={coords.color}
                    className="transition-all duration-300"
                    stroke="white"
                    strokeWidth="1"
                  />
                  {/* Hide labels in focus mode unless selected/critical */}
                  {(!focusMode || navigationTarget === name || name === 'Medical' || name === 'Water') && (
                    <text
                      x={coords.x}
                      y={coords.y - (navigationTarget === name ? 15 : 10)}
                      textAnchor="middle"
                      fill="white"
                      fontSize={focusMode ? "24" : "14"}
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-md uppercase tracking-wider"
                      style={{ textShadow: '0px 2px 4px black' }}
                    >
                      {name}
                    </text>
                  )}
               </g>
             ))}

             {/* User Indicator */}
             <g transform={`translate(${getCoords(currentLocation).x}, ${getCoords(currentLocation).y})`}>
                <circle r={focusMode ? "15" : "8"} fill="#48bb78" className="animate-ping opacity-75" />
                <circle r={focusMode ? "10" : "6"} fill="#48bb78" stroke="white" strokeWidth="2" />
             </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- SIMULATION CONTROL & NOTIFICATIONS ---
const TimeControl = ({ currentTime, setCurrentTime, myActs, setShowNotification, focusMode, isLiveMode, setIsLiveMode }) 
=> {
  // Check for upcoming acts
  useEffect(() => {
    // Only fire notifications for things within 15 mins (0.25 hours)
    const upcoming = myActs.find(act => {
      const diff = act.sortTime - currentTime;
      return diff > 0 && diff <= 0.25;
    });

    if (upcoming) {
      setShowNotification(upcoming);
      
      // FIRE SYSTEM NOTIFICATION if permissions granted
      if (Notification.permission === "granted") {
        new Notification(`Starting Soon: ${upcoming.artist}`, {
          body: `${upcoming.time} at ${upcoming.stage}`,
          icon: "/icon.png" // Placeholder, would need real asset
        });
      }

      // prevent notification spamming would need more complex logic in real app (e.g. tracking 'notified' state ids)
      // simplified here by long timeout
      const timer = setTimeout(() => setShowNotification(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [currentTime, myActs, setShowNotification]);

  // Live Mode Timer
  useEffect(() => {
    if (!isLiveMode) return;

    const tick = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes();
      
      // Festival Logic: 00:00 - 06:00 is technically "next day" but for sorting we want 24+
      if (hours < 6) hours += 24;
      
      const floatTime = hours + (mins / 60);
      setCurrentTime(floatTime);
    };

    tick(); // initial call
    const interval = setInterval(tick, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [isLiveMode, setCurrentTime]);

  const formatTime = (time) => {
    const hours = Math.floor(time);
    const mins = Math.floor((time - hours) * 60);
    const displayHour = hours >= 24 ? hours - 24 : hours;
    return `${displayHour.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 ${focusMode ? 'p-6 pb-10' : 
'p-4 pb-8'}`}>
       <div className="flex items-center justify-between mb-2">
         <div className="flex items-center space-x-2">
           <button 
             onClick={() => setIsLiveMode(!isLiveMode)}
             className={`px-3 py-1 rounded text-xs font-bold uppercase ${isLiveMode ? 'bg-red-600 text-white 
animate-pulse' : 'bg-gray-700 text-gray-300'}`}
           >
             {isLiveMode ? '● LIVE NOW' : '○ SIMULATOR'}
           </button>
         </div>
         <span className={`font-mono font-bold text-yellow-400 ${focusMode ? 'text-3xl' : 
'text-xl'}`}>{formatTime(currentTime)}</span>
       </div>
       
       {!isLiveMode && (
         <input
           type="range"
           min="17"
           max="27"
           step="0.10"
           value={currentTime}
           onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
           className={`w-full bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400 ${focusMode ? 'h-6' 
: 'h-2'}`}
         />
       )}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('lineup');
  const [savedActs, setSavedActs] = useState([]);
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [currentTime, setCurrentTime] = useState(17.0); 
  const [notification, setNotification] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false); // Default to simulation for demo
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    const saved = localStorage.getItem('homobloc_schedule');
    if (saved) setSavedActs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('homobloc_schedule', JSON.stringify(savedActs));
  }, [savedActs]);

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      new Notification("Notifications Enabled", { body: "You will be alerted 15 mins before your acts start!" });
    }
  };

  const toggleSave = (id) => {
    setSavedActs(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const myActs = useMemo(() => RAW_ACTS.filter(a => savedActs.includes(a.id)), [savedActs]);

  return (
    <div className="bg-black text-white min-h-screen font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        focusMode={focusMode} 
        setFocusMode={setFocusMode} 
        notificationPermission={notificationPermission}
        requestNotificationPermission={requestNotificationPermission}
      />

      <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
        {activeTab === 'lineup' && (
          <Lineup acts={RAW_ACTS} savedActs={savedActs} toggleSave={toggleSave} focusMode={focusMode} />
        )}
        {activeTab === 'plan' && (
          <MyPlan
            acts={RAW_ACTS}
            savedActs={savedActs}
            toggleSave={toggleSave}
            setActiveTab={setActiveTab}
            setNavigationTarget={setNavigationTarget}
            focusMode={focusMode}
          />
        )}
        {activeTab === 'map' && (
          <MapView
            navigationTarget={navigationTarget}
            setNavigationTarget={setNavigationTarget}
            focusMode={focusMode}
          />
        )}
      </div>

      {notification && (
        <div className={`absolute left-4 right-4 bg-yellow-400 text-black rounded-lg shadow-xl z-50 flex items-start 
animate-bounce ${
          focusMode ? 'top-32 p-6 flex-col space-y-4' : 'top-20 p-4 space-x-3'
        }`}>
          <AlertCircle className={`${focusMode ? 'w-12 h-12' : 'mt-1 flex-shrink-0'}`} />
          <div>
            <h4 className={`font-bold uppercase ${focusMode ? 'text-3xl' : 'text-lg'}`}>Starting Soon!</h4>
            <p className={`leading-tight ${focusMode ? 'text-xl mt-2' : ''}`}>
              <strong>{notification.artist}</strong> is on at <span className="font-mono">{notification.time}</span> at 
the <strong>{notification.stage}</strong>.
            </p>
            <button
               onClick={() => {
                 setNavigationTarget(notification.stage);
                 setActiveTab('map');
                 setNotification(null);
               }}
               className={`mt-2 bg-black text-white rounded-full uppercase font-bold ${focusMode ? 'px-6 py-3 text-lg 
w-full mt-4' : 'text-xs px-3 py-1'}`}
            >
              Get Directions
            </button>
          </div>
        </div>
      )}

      <TimeControl
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        myActs={myActs}
        setShowNotification={setNotification}
        focusMode={focusMode}
        isLiveMode={isLiveMode}
        setIsLiveMode={setIsLiveMode}
      />
    </div>
  );
}
