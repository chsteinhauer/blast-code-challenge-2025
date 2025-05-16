import { useEffect, useState } from "react";
import { Attack, MatchRound, Player } from "./parser";
import styles from "@/styles/Table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";


type PlayerKills = {
    player: Player,
    kills: Attack[];
}

export function Table(props: {round: MatchRound, players: Player[]}) {
    const [ data, setData ] = useState<PlayerKills[]>();

    useEffect(() => {
        // map user -> kills

        const playerkills: PlayerKills[] = props.players?.map(p => {
            return { player: p, kills: props.round?.kills.filter(k => k.attacker === p.name)}
        }).filter(pk => pk.kills.length > 0).sort((a, b) => b.kills.length - a.kills.length);

        setData(playerkills);

    }, [props.players, props.round.kills]);

    return (
        <div className={styles.table_wrapper}>
            <table className={styles.table}>
                <tbody>
                    { data?.map(pk => (
                        <tr key={pk.player.name}>
                            <td className={styles.table_user}>
                                 <FontAwesomeIcon icon={"fa-solid fa-user" as IconProp} /> {pk.player.name}
                            </td>
                            <td className={styles.table_team}>
                                {"<" + pk.kills[0].attackerTeam + ">"}
                            </td>
                            <td className={styles.table_kills}>
                                <FontAwesomeIcon icon={"fa-solid fa-skull" as IconProp} /> {pk.kills.length} 
                            </td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    );
}
