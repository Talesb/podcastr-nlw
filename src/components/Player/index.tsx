import Image from 'next/image';
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export function Player() {

    const playerContext = useContext(PlayerContext);

    const episode = playerContext.episodeList[playerContext.currentEpisodeIndex]
    // Parei em 46
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="tocando agora" />
                <strong>Tocando agora  </strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )
            }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider} >

                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                </div>

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar Anterior" />
                    </button>

                    <button type="button" disabled={!episode} className={styles.playButton}>
                        <img src="/play.svg" alt="Tocar" />
                    </button>

                    <button type="button" disabled={!episode} >
                        <img src="/play-next.svg" alt="Tocar Proxima" />
                    </button>

                    <button type="button" disabled={!episode} >
                        <img src="/repeat.svg" alt="Repeat" />
                    </button>
                </div>
            </footer>

        </div >
    )
}