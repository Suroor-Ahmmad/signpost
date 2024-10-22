import React, { useState ,useRef, useEffect} from 'react';
import { Canvas,useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Text } from '@react-three/drei';

function Arm({ length, rotationY, color, positionY, text }) {
  const armRef = useRef();

  useFrame(() => {
    if (armRef.current) {
      const currentRotation = armRef.current.rotation.y;
      const delta = rotationY - currentRotation;
      armRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <group ref={armRef} position={[0, positionY, 0]}>
      <mesh position={[length / 2, 0, 0]}>
        <boxGeometry args={[length, 20, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <Text
        position={[30, 0, 1]}
        fontSize={8}
        fontWeight={600}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {text} 🡺
      </Text>

      <Text
        position={[30, 0, -1]}
        fontSize={8}
        fontWeight={600}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]} 
      >
        🡸 {text}
      </Text>
    </group>
  );
}


const fetchData = () => {
 
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: 'A'+Math.floor(Math.random() * (10 - 0 + 1) + 0),
        direction: Math.random() * 360 
      });
    }, 5000); 
  });
};

function App() {
  const [text, setText] = useState('');
  const [direction, setDirection] = useState(0);
  const [queueIndex, setQueueIndex] = useState(0);

  const [arrows, setArrows] = useState([
    { text: '', direction: 0 },
    { text: '', direction: 0 },
    { text: '', direction: 0 }
  ]);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };


  // useEffect(() => {
  //   // Simulate API data fetching and update
  //   const fetchDataAndUpdate = async () => {
  //     try {
  //       const data = await fetchData();
  //       setArrows((prevArrows) => {
  //         const newArrows = [...prevArrows];
  //         newArrows[queueIndex] = data;
  //         return newArrows;
  //       });
  //       setQueueIndex((prevIndex) => (prevIndex + 1) % 3);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   // Fetch data initially and set an interval for periodic updates
  //   fetchDataAndUpdate();
  //   const interval = setInterval(fetchDataAndUpdate, 5000); // Update every 5 seconds

  //   return () => clearInterval(interval); // Clean up interval on component unmount
  // }, [queueIndex]);

  const handleDirectionChange = (event) => {
    setDirection(parseFloat(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setArrows((prevArrows) => {
      const newArrows = [...prevArrows];
      newArrows[queueIndex] = { text, direction };
      return newArrows;
    });

    setQueueIndex((prevIndex) => (prevIndex + 1) % 3);

    setText('');
    setDirection(0);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', backgroundImage: 'url(https://assets.architecturaldigest.in/photos/60083a72274aca243711c18d/master/w_1000,c_limit/Hamad-International-Airport-Doha-Qatar-HOK-21.jpg)', }}>
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 100, 300], fov: 60 }}>
          <ambientLight />
          <directionalLight position={[10, 10, 5]} />
          <mesh position={[0, -20, 0]}>
            <boxGeometry args={[5, 190, 5]} />
            <meshStandardMaterial color="#333" />
          </mesh>

          <Arm length={50}
            rotationY={arrows[2].direction * (Math.PI / 180)}
            color="#1e245e"
            positionY={65}
            text={arrows[2].text}
          />
          <Arm
            length={50}
            rotationY={arrows[1].direction * (Math.PI / 180)}
            color="#c11f51"
            positionY={40}
            text={arrows[1].text}
          />
          <Arm
            length={50}
            rotationY={arrows[0].direction * (Math.PI / 180)}
            color="#1e245e"
            positionY={15}
            text={arrows[0].text}
          />
          <OrbitControls />
        </Canvas>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="text"
          placeholder="Text"
          value={text}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Direction (degrees)"
          value={direction}
          onChange={handleDirectionChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
