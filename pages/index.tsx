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

type CardProps = {
  img: string;
};
function Card({ img }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardFront}>
        <Image src={img} fill alt="Card Front" />
        <div className={cx(styles.cardShine, styles.stellar)} />
      </div>
    </div>
  );
}
