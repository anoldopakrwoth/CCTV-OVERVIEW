import React from 'react';
import SensorCard from './SensorCard';

const CameraGrid = ({ cameras }) => {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {cameras.map((camera) => (
        <SensorCard key={camera.id} camera={camera} />
      ))}
    </section>
  );
};

export default CameraGrid;
