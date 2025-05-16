import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { MatchData, ParseFile } from "./components/parser";
import { Table } from "./components/table";
import { Accordion } from "@/pages/components/accordion";


export default function Home() {
  const [ matchData, setMatchData ] = useState<MatchData>();

  useEffect(() => {
    const isProd = process.env.NODE_ENV === 'production';

    async function fetchMatchData() {
      const data = await ParseFile((isProd ? "/blast-code-challenge-2025/" : "") + "/data/csgo.txt")
      setMatchData(data);
    }

    fetchMatchData()
  }, [])

  return (
    <>
      <Head>
        <title>Blast Code Challenge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`${styles.page}`}
      >
        <main className={styles.main}>
        <div className={styles.main_title}>Counter-Strike Match</div>
          <div className={styles.main_sub_title}>{matchData?.teamA.name + " vs " + matchData?.teamB.name}</div>
          <div className={styles.accordion_group}>
            {/* <Table data={matchData} /> */}
            
            { matchData && matchData.rounds?.map((r) => (
              <Accordion key={r.round} round={r}> 
                <Table round={r} players={matchData.players} />
              </Accordion>
            ))}

          </div>
        </main>
      </div>
    </>
  );
}
