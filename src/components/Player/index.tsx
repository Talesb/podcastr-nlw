import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/stringUtils';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null,);
    const [progress, setProgress] = useState(0);


    const playerContext = useContext(PlayerContext);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (playerContext.isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [playerContext.isPlaying])

    const episode = playerContext.episodeList[playerContext.currentEpisodeIndex]


    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }


    function handleEpisodeEnded() {
        if (playerContext.hasNext) {
            playerContext.playNext();
        } else {
            playerContext.clearPlayerState();
        }
    }

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
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider} >

                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>


                {episode && (
                    <audio ref={audioRef} src={episode.url}
                        autoPlay
                        loop={playerContext.isLooping}
                        onPlay={() => playerContext.setPlayingState(true)}
                        onPause={() => playerContext.setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpisodeEnded}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || playerContext.episodeList.length === 1} className={playerContext.isShuffling ? styles.isActive : ''} onClick={playerContext.toggleShuffle}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode || !playerContext.hasPrevious} onClick={playerContext.playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar Anterior" />
                    </button>

                    <button type="button" disabled={!episode} className={styles.playButton} onClick={playerContext.togglePlay}>

                        {playerContext.isPlaying
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>

                    <button type="button" disabled={!episode || !playerContext.hasNext} onClick={playerContext.playNext}>
                        <img src="/play-next.svg" alt="Tocar Proxima" />
                    </button>

                    <button type="button" disabled={!episode} className={playerContext.isLooping ? styles.isActive : ''} onClick={playerContext.toggleLoop}>
                        <img src="/repeat.svg" alt="Repeat" />
                    </button>
                </div>
            </footer>

        </div >
    )
}