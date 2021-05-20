import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link'
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../utils/stringUtils';
import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';


type Episode = {
  id: string,
  title: string,
  members: string,
  published_at: Date,
  publishedAt: string,
  thumbnail: string,
  description: string,
  durationAsString: string
  duration: number;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home(props: HomeProps) {

  const playerContext = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {props.latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                <div className={styles.episodeDetails}>
                  <Link href={`episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <p>{episode.publishedAt}</p>
                  <span>{episode.durationAsString}</span>
                </div>
                <button>
                  <img onClick={() => playerContext.play(episode)} src="/play-green.svg" alt="Tocar Episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {

    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });


  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      published_at: episode.published_at,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      thumbnail: episode.thumbnail,
      description: episode.description,
      url: episode.file.url,
      durationAsString: convertDurationToTimeString(Number(episode.file.duration))
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
