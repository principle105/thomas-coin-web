import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, BufferAttribute } from "three";

import star from "../assets/star.png";

const Points = () => {
    const count = 5500;
    const rotationAmount = 0.003;
    let speed = 8;

    const starImg = useLoader(TextureLoader, star);

    const bufferRef = useRef<BufferAttribute>(null!);
    const pointRef = useRef<THREE.Points>(null!);

    useFrame(() => {
        if (!bufferRef.current) return;

        for (let i = 0; i < count; i++) {
            let y = bufferRef.current.getY(i) - speed;

            if (y < -300) y = 200;

            bufferRef.current.setY(i, y);
        }

        pointRef.current.rotation.y += rotationAmount;

        if (pointRef.current.rotation.y > 0.25) speed = 0.8;

        bufferRef.current.needsUpdate = true;
    });

    let starPositions = useMemo(() => {
        let positions = [];

        for (let i = 0; i < count; i++) {
            positions.push(
                Math.random() * 600 - 300,
                Math.random() * 600 - 300,
                Math.random() * 600 - 300
            );
        }

        return new Float32Array(positions);
    }, []);

    return (
        <points ref={pointRef}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    ref={bufferRef}
                    attach="attributes-position"
                    array={starPositions}
                    count={starPositions.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>

            <pointsMaterial
                attach="material"
                map={starImg}
                size={0.5}
                transparent={false}
                alphaTest={0.5}
                opacity={1.0}
            />
        </points>
    );
};

const Background = () => {
    return (
        <div className="h-screen w-screen absolute -z-50">
            <Canvas
                camera={{
                    rotation: [Math.PI / 2, 0, 0],
                    position: [0, 0, 1],
                }}
            >
                <Suspense fallback={null}>
                    <Points />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Background;
