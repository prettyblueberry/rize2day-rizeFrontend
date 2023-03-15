import { useSpring, animated } from "react-spring";
import { useRef } from "react";

function Card({ children }) {
  const [props, set] = useSpring({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  });
  const cardRef = useRef();
  const calc = (x, y) => {
    return [
      -(y - window.innerHeight / 2) / 20,
      (x - window.innerWidth / 2) / 20,
      1.05,
    ];
  };
  const trans = (x, y, s) =>
    `perspective(700px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  return (
    <animated.div
      ref={cardRef}
      className="threeD-card"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: props.xys.interpolate(trans) }}
    >
      {children}
    </animated.div>
  );
}

export default Card;
