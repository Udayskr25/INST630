import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import React, { useState, useRef, useEffect } from "react";
import { SpotLight } from "@react-three/drei";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import "./style.css";
import { useThree } from "@react-three/fiber";

export default function Laptop() {
    const laptop = useGLTF("/computerset/computerset.gltf");
    const controlsRef = useRef(); // Ref for OrbitControls
    const { camera } = useThree();

    // Store the initial camera position, FOV, and target
    const initialCameraPosition = camera.position.clone();
    const initialFov = camera.fov;
    const initialTarget = controlsRef.current?.target.clone() ?? { x: 4, y: 10, z: 0 };

    // Initialize RectAreaLightUniformsLib to use RectAreaLight in the scene
    useEffect(() => {
        RectAreaLightUniformsLib.init();
    }, []);

    // Function to animate the camera to a target position, FOV, and target point
    function animateCameraToPosition(targetPosition, duration, targetFov, targetPoint) {
        const startPosition = camera.position.clone();
        const startFov = camera.fov; // Store the current FOV
        const startTarget = controlsRef.current.target.clone(); // Store the current target
        const startTime = performance.now();

        function animate() {
            const elapsedTime = (performance.now() - startTime) / duration;

            if (elapsedTime < 1) {
                // Interpolate the camera position
                camera.position.lerpVectors(startPosition, targetPosition, elapsedTime);

                // Interpolate the FOV
                camera.fov = startFov + (targetFov - startFov) * elapsedTime;

                // Interpolate the camera target
                controlsRef.current.target.lerpVectors(startTarget, targetPoint, elapsedTime);

                // Update the camera and controls
                camera.updateProjectionMatrix();
                controlsRef.current.update();

                requestAnimationFrame(animate);
            } else {
                // Ensure the camera reaches the target position, FOV, and target point exactly
                camera.position.copy(targetPosition);
                camera.fov = targetFov;
                controlsRef.current.target.copy(targetPoint);

                // Update the camera and controls
                camera.updateProjectionMatrix();
                controlsRef.current.update();
            }
        }

        // Start the animation
        requestAnimationFrame(animate);
    }

    return (
        <>
            <Environment preset="warehouse" />
            <primitive
                object={laptop.scene}
                position-y={-1.2}
                onClick={() =>
                    animateCameraToPosition(
                        { x: -0.1, y: 10.373826458712488, z: 3.271481678552349 }, // Target position
                        1500,  // Duration in milliseconds
                        50,    // Target FOV
                        { x: 0, y: 10, z: 0 } // Target point for OrbitControls
                    )
                }
                onPointerOut={() =>
                    animateCameraToPosition(
                        initialCameraPosition, // Original camera position
                        1500, // Duration in milliseconds
                        initialFov, // Original FOV
                        initialTarget // Original target point
                    )
                }
            >
                <Html
                    wrapperClass="laptop"
                    position={[0.03, 10.5, -0.9]}
                    transform
                    distanceFactor={1.16}
                    rotation-x={-0.15}
                >
                    <iframe src="https://www.uxdayshankar.com/" />
                </Html>
            </primitive>

            {/* Spotlights */}
            <SpotLight
                color={0x618fa4}
                intensity={5}
                distance={100}
                angle={1}
                penumbra={2}
                position={[-10, 10, 3]}
                castShadow
            />
            <SpotLight
                color={0xffbf00}
                intensity={1}
                distance={30}
                angle={2}
                penumbra={1}
                position={[-4, 11, 0]}
                castShadow
                shadow-bias={-0.0001}
            />
            <SpotLight
                color={0x0B3D91}
                intensity={1}
                distance={30}
                angle={5}
                penumbra={1}
                position={[1.8, 15.4, 3]}
                castShadow
                shadow-bias={-0.0001}
            />

            {/* RectAreaLight */}
            <rectAreaLight
                color={0x0B3D91}
                intensity={5}
                width={10}
                height={10}
                position={[5, 10, 7]}
                rotation={[0, Math.PI / 4, 0]}
            />

            {/* OrbitControls */}
            <OrbitControls
                ref={controlsRef}
                enableRotate={false}
                enableZoom={false}
                enableDamping={true} // Enable smooth damping
                enablePan={false} // Disable panning
                minDistance={10} // Minimum zoom distance (prevents getting too close)
                maxDistance={30} // Maximum zoom distance (prevents zooming out too far)
                minPolarAngle={0.5} // Limit vertical rotation angle (up/down)
                maxPolarAngle={1.5}
                minAzimuthAngle={-1} // Limit horizontal rotation angle (left/right)
                maxAzimuthAngle={1}
                target={[2.5, 8, 0]} // Target point for the controls
            />
        </>
    );
}
