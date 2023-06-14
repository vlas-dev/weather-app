import React from 'react';
import Weather from './components/Weather';

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-[500px] bg-gray-400 rounded-lg shadow p-8 max-w-2xl w-full">
        <Weather />
      </div>
    </div>
  );
};

export default App;
