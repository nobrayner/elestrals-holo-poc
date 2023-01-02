import * as React from "react";

import Head from "next/head";
import Image from "next/image";

import cx from "classnames";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Elestrals Holo PoC</title>
        <meta name="description" content="Elestrals Holo PoC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <Card img="/SD05HydrakeStellar01.png" />
      </main>
    </>
  );
}

const ANIMATION_DURATION_MS = 3000;
const ANIMATION_FRAMES = {
  [(ANIMATION_DURATION_MS / 100) * 0]: {
    mx: 0,
    my: 0,
    o: 0,
  },
  [(ANIMATION_DURATION_MS / 100) * 20]: {
    mx: 20,
    my: 20,
    o: 1,
  },
  [(ANIMATION_DURATION_MS / 100) * 50]: {
    mx: 80,
    my: 80,
    o: 1,
  },
  [(ANIMATION_DURATION_MS / 100) * 80]: {
    mx: 80,
    my: 80,
    o: 0,
  },
};
const ANIMATION_FRAME_TIMESTAMPS = Object.keys(ANIMATION_FRAMES).map(
  (k, i, a) => {
    const t = Number(k);
    const pt = Number(a[i + 1]);
    return {
      timestamp: t,
      duration: i === a.length - 1 ? ANIMATION_DURATION_MS - t : pt - t,
    };
  }
);
console.log(ANIMATION_FRAME_TIMESTAMPS);

type CardProps = {
  img: string;
};
function Card({ img }: CardProps) {
  const cardRef = React.createRef<HTMLDivElement>();
  const animationFrameRef = React.useRef(0);
  const frameStartTimeRef = React.useRef<number>();
  const previousTimeRef = React.useRef(Date.now());

  const animationCallback = (time: DOMHighResTimeStamp) => {
    if (!frameStartTimeRef.current) {
      frameStartTimeRef.current = time;
    }

    const frameStartTime = frameStartTimeRef.current;
    const previousTime = previousTimeRef.current;
    const elapsed = time - frameStartTime;
    const delta = time - previousTime;

    if (elapsed >= ANIMATION_DURATION_MS) {
      frameStartTimeRef.current = time;
    }

    if (delta === 0) {
      window.requestAnimationFrame(animationCallback);
      return;
    }

    previousTimeRef.current = time;

    let currentFrame = animationFrameRef.current;

    if (elapsed >= ANIMATION_FRAME_TIMESTAMPS[currentFrame].duration) {
      currentFrame = animationFrameRef.current =
        currentFrame + 1 >= ANIMATION_FRAME_TIMESTAMPS.length
          ? 0
          : currentFrame + 1;

      frameStartTimeRef.current = time;
    }

    let nextFrame =
      currentFrame + 1 >= ANIMATION_FRAME_TIMESTAMPS.length
        ? 0
        : currentFrame + 1;

    let frameDuration = ANIMATION_FRAME_TIMESTAMPS[currentFrame].duration;

    const currentFrameData =
      ANIMATION_FRAMES[ANIMATION_FRAME_TIMESTAMPS[currentFrame].timestamp];
    const nextFrameData =
      ANIMATION_FRAMES[ANIMATION_FRAME_TIMESTAMPS[nextFrame].timestamp];

    const card = cardRef.current;

    if (!card) {
      window.requestAnimationFrame(animationCallback);
      return;
    }

    const cardStyle = getComputedStyle(card);

    const mx = Number(
      cardStyle.getPropertyValue("--mx").replace("%", "").trim()
    );
    const mxDiff = nextFrameData.mx - currentFrameData.mx;
    const stepMx = (mxDiff / frameDuration) * delta;
    const newMx = clamp(mx + stepMx, currentFrameData.mx, nextFrameData.mx);
    card.style.setProperty("--mx", `${newMx}%`);

    const my = Number(
      cardStyle.getPropertyValue("--my").replace("%", "").trim()
    );
    const myDiff = nextFrameData.my - currentFrameData.my;
    const stepMy = (myDiff / frameDuration) * delta;
    card.style.setProperty("--my", `${clamp(my + stepMy, 0, 100)}%`);

    const o = Number(cardStyle.getPropertyValue("--o"));
    const oDiff = nextFrameData.o - currentFrameData.o;
    const stepO = (oDiff / frameDuration) * delta;
    card.style.setProperty("--o", `${clamp(o + stepO, 0, 1)}`);

    window.requestAnimationFrame(animationCallback);
  };

  React.useEffect(() => {
    // Only remove the static holo pattern if there is no
    // request animation frame
    if (window.requestAnimationFrame) {
      cardRef.current?.style.setProperty("--mx", "0%");
      cardRef.current?.style.setProperty("--my", "0%");
      cardRef.current?.style.setProperty("--o", "0");

      window.requestAnimationFrame(animationCallback);
    }
  }, []);

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.cardFront}>
        <Image src={img} fill alt="Card Front" />
        <div className={cx(styles.cardShine, styles.stellar)} />
      </div>
    </div>
  );
}

function clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}
