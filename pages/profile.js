import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Profile({ profile }) {
  // console.log(profile)

  return (
    <div>
      <p>My profile</p>
      
      <p>Username: {profile.username}</p>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      
      <br />
      <Link href={'/'}>Ke halaman utama</Link> <br />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // if not logged in, redirect to homepage
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const fetchProfile = await axios.get('http://localhost:8080/api/v1/secret', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const profile = fetchProfile.data.user;

  return {
    props: {
      session,
      profile,
    },
  };
}
