import { useRouter } from 'next/router';

export default function Episode() {
    const router = useRouter();

    return (
        <h1>{router.query.page}</h1>
    )
}