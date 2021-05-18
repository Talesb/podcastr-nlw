import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../../utils/stringUtils';
import Link from 'next/link';
import Image from 'next/image';

import styles from './episode.module.scss';

type Episode = {
    id: string,
    title: string,
    members: string,
    published_at: Date,
    publishedAt: string,
    thumbnail: string,
    description: string,
    durationAsString: string
}

type EpisodeProps = {
    episode: Episode
}


export default function Episode(props: EpisodeProps) {
    const router = useRouter();

    return (
        <div className={styles.episode}>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={props.episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button">
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{props.episode.title}</h1>
                <span>{props.episode.members}</span>
                <span>{props.episode.publishedAt}</span>
                <span>{props.episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: props.episode.description }}
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { page } = ctx.params;
    const { data } = await api.get(`episodes/${page}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        published_at: data.published_at,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        thumbnail: data.thumbnail,
        description: data.description,
        url: data.file.url,
        durationAsString: convertDurationToTimeString(Number(data.file.duration))
    }


    return {
        props: { episode, },
        revalidate: 60 * 60 * 24,//24 hours
    }
}

