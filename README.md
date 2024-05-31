# R3F - Doctor Strange Portal

This repository contains the code for creating a dynamic, animated particle portal effect using React and Three.js. The effect is inspired by Dr. Strange's portals and is designed to be used in 3D scenes.

[![Dr. Strange Portal](/dr-strange-portal.gif)](https://codesandbox.io/p/sandbox/r3f-doctor-strange-portal-nvjpx2)

## Description

The `Portal` component creates a portal with animated particles using the following libraries:

- [Three.js](https://threejs.org/): A JavaScript library for 3D graphics.
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber): A React renderer for Three.js.
- [Drei](https://github.com/pmndrs/drei): A collection of useful helpers for React Three Fiber.

## Features

- Animated particles that form a portal effect.
- Customizable particle properties like colors, sizes, and lifetimes.
- Integration with textures to enhance the visual effect.

## Installation

To install the dependencies, run:

```bash
npm install
```

```bash
npm start
```

or

```bash
yarn
```

```bash
yarn start
```

## Usage

Here's an example of how to use the `Portal` component:

```jsx
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
        texture={"path/to/your/texture.jpg"}
        floor={-10}
        position={[0, 0, 0]}
      />
      <OrbitControls />
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}
```

## Inspiration

This project is based on a video tutorial I watched on how to create a similar effect in Blender. You can watch the tutorial [here](https://youtu.be/BSwhX-NDQ8o?si=OPdlMdOejvJSDhLu).

## CodeSandBox Example

You can see a live example of this effect [here](https://codesandbox.io/p/sandbox/r3f-doctor-strange-portal-nvjpx2).

## Contributing

I'm open to improvements and modifications. If you have any suggestions or would like to contribute, feel free to open an issue or submit a pull request.

## Credits

If you use this code in your projects, I would appreciate it if you could give me credit.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- Special thanks to the creators of Three.js, React Three Fiber, and Drei for their amazing libraries.
- Thanks to [Wawa Sensei](https://www.youtube.com/@WawaSensei) for the inspiration and guidance.
- Thanks to [Default Cube](https://www.youtube.com/@DefaultCube) for the Blender tutorial.

---

Feel free to modify the code and use it in your projects. Happy coding!
