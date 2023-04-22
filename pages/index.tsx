import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Root = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className='mb-auto mt-auto text-center text-2xl font-semibold'>
      Redirecting
    </div>
  );
};

export default Root;
