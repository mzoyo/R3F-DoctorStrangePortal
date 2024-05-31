import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Portal from "./components/Portal";

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 75 }}
      style={{ background: "black" }}
    >
      <Portal
        texture={"textures/bernabeu360.jpg"}
        floor={-10}
        position={[0, 0, 0]}
      />
      <OrbitControls />
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}
