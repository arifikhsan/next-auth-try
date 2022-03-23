import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home({ csrfToken }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (!session)
    return (
      <div>
        Not signed in <br />
        <form method='post' action='/api/auth/callback/credentials'>
          <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
          <label>
            Username
            <input name='username' type='text' defaultValue={'farmer'} />
          </label>
          <label>
            Password
            <input name='password' type='password' defaultValue={'123456'} />
          </label>
          <button type='submit'>Sign in</button>
          <br />
          <Link href={'/profile'}>
            Ke halaman profil (harusnya protected)
          </Link>{' '}
          <br />
        </form>
      </div>
    );

  return (
    <div>
      <div>
        <>
          Signed in as {session.user.name} <br />
          <Link href={'/profile'}>Ke halaman profil</Link> <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return { props: { csrfToken: await getCsrfToken(context) } };
}
