import { ReactNode, useRef, useState } from "react";
import styles from "@/styles/Accordion.module.css";
import { MatchRound } from "./parser";

export function Accordion(props: { round: MatchRound, children: ReactNode | ReactNode[] }) {
    const [active, setActive] = useState(false);
    const [height, setHeight] = useState("0px");

    const content = useRef<HTMLDivElement>(null);

    function toggleAccordion() {
      setActive(!active);
      setHeight(active ? "0px" : `${content.current?.scrollHeight}px`);
    }
  
    return (
      <div className={styles.accordion_wrapper}>
        <div
          className={`${styles.accordion} ${active ? "active" : ""}`}
          onClick={toggleAccordion}
        >
          <p className={styles.accordion_title}>{"Round " + props.round.round}</p>
          <p className={styles.accordion_teams}>
            {"CT: "} <span className={styles.accordion_team}>{props.round.ct}</span>
            {"Terrorist: "} <span className={styles.accordion_team}>{props.round.terrorist}</span>
          </p>
          <p className={styles.accordion_time}>
            {new Date((props.round.end.getTime() - props.round.start.getTime())).toISOString().substr(11, 8)}
          </p>
          <span className={styles.accordion_button} style={{ marginLeft: "20px" }}>{active ? "-" : "+"}</span>
        </div>
        <div
          ref={content}
          style={{ maxHeight: `${height}` }}
          className={styles.accordion_content}
        >
          { props.children }
        </div>
      </div>
    );
  }