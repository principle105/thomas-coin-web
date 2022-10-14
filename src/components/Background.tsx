import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import star from "../assets/star.png";
import { TextureLoader, BufferAttribute, Euler } from "three";
import { Suspense, useMemo, useRef, useState } from "react";

const Points = () => {
    const starImg = useLoader(TextureLoader, star);

    const bufferRef = useRef<BufferAttribute>(null!);
    const [rotation, setRotation] = useState<number>(0);

    const count = 6000;

    useFrame(() => {
        if (!bufferRef.current) return;

        bufferRef;

        for (let i = 0; i < count; i++) {
            let y = bufferRef.current.getY(i) - 0.8;

            if (y < -200) y = 200;

            bufferRef.current.setY(i, y);
        }

        setRotation((prev) => prev + 0.003);

        bufferRef.current.needsUpdate = true;
    });

    let positions = useMemo(() => {
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
        <points rotation={new Euler(0, rotation, 0)}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    ref={bufferRef}
                    attach="attributes-position"
                    array={positions}
                    count={positions.length / 3}
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
