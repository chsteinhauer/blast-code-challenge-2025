import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { MatchData, MatchRound, ParseFile } from "./components/parser";
import { Table } from "./components/table";
import { Accordion } from "@/pages/components/accordion";
import { useRouter } from "next/router";


export default function Home() {
  const [ matchData, setMatchData ] = useState<MatchData>();

  const router = useRouter();

  useEffect(() => {
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
      router.replace("/blast-code-challenge-2025/");
    }

    async function fetchMatchData() {
      const data = await ParseFile("csgo.txt")
      setMatchData(data);
    }

    fetchMatchData()
  }, [])


  const getAverageRoundTime = (rounds?: MatchRound[]) => {
    if (!rounds) return;

    const time = rounds.map(r => r.end.getTime() - r.start.getTime()).reduce((a,b) => a+b);

    return new Date(time / rounds.length).toISOString().substr(11, 8);
  }

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
            
            <div className={styles.avg_time}>
              Avg. round time: {getAverageRoundTime(matchData?.rounds)}
            </div>
            
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
