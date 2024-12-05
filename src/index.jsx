import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Laptop from './laptop';
import React from 'react';

const root = ReactDOM.createRoot(document.querySelector('#uday'))

root.render(
    <>
    <div className="big-text">
        <b>LET'S GOOO</b>
    </div>
    <Canvas
        camera={{
            fov: 70,
            near: 0.1,
            far: 1000,
            position: [200.491992199684493, 10.16000573689278, 50.00482302323433],
        }}
    >
        <Laptop />
    </Canvas>
</>
)
//Camera position: x=-0.9951805206368735, y=10.373826458712488, z=5.271481678552349 
