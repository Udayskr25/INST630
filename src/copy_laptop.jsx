import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import React from "react";
import { SpotLight } from "@react-three/drei"; // Import helper for SpotLight visualization
import "./style.css";
import { useFrame, useThree } from "@react-three/fiber";

export default function Laptop() {
    const laptop = useGLTF("/computerset/computerset.gltf"); // Ensure the path is correct.
    const [hovered, setHovered] = useState(false);

    const { camera } = useThree(); // Access the camera object
    function animateCameraToPosition(targetPosition, duration = 1500) {
        const { camera, controls } = window; // Ensure your camera and controls are accessible in the global context
        const startPosition = camera.position.clone();
        const startTarget = controls.target.clone();
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing function (cubic ease in-out)
            const easedProgress = progress < 0.5
                ? 4 * progress ** 3
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Interpolate camera position
            camera.position.lerpVectors(startPosition, targetPosition, easedProgress);

            // Update orbit controls
            controls.target.lerpVectors(startTarget, targetPosition, easedProgress);
            controls.update();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        // Start the animation
        requestAnimationFrame(update);
    }
    useFrame(() => {
        console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
    });
    return (
        <>
            {/* Add environment */}
            <Environment preset="warehouse" />

            {/* Add the model */}
            <primitive object={laptop.scene} position-y={-1.2}>
                <Html
                    wrapperClass="laptop"
                    position={[0.06, 10.5, -0.9]}
                    transform
                    distanceFactor={1.16}
                    rotation-x={-0.15}
                >
                    <iframe src="https://www.uxdayshankar.com/" />
                </Html>
            </primitive>

            {/* Add Spotlights */}
            <SpotLight
                color={0x87CEEB}
                intensity={10}
                distance={500}
                angle={Math.PI}
                penumbra={1}
                position={[-10, 20, 20]}
                castShadow
                shadow-bias={-0.0001}
            />

            {/* Spot Light Desk Lamp */}
            <SpotLight
                color={0xFFBF00}
                intensity={30}
                distance={1000}
                angle={0.5}
                penumbra={0}
                position={[-5, 14, 4]}
                castShadow
                shadow-bias={-0.0001}
            />

            {/* Spot Light Floating Lamp */}
            <SpotLight
                color={0xFFB347}
                intensity={40}
                distance={200}
                angle={1}
                penumbra={0.7}
                position={[0, 19, 2]}
                castShadow
                shadow-bias={-0.0001}
            />

            {/* Add OrbitControls */}
        </>
    );
}
// on hover: Camera position: x=-13.848615968212323, y=18.65239665169006, z=20.11283118792812
// on click: Camera position: x=0.10159048282035377, y=7.166040762893987, z=5.328266828150769