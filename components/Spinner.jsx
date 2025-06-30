'use client';
import dynamic from 'next/dynamic';

const Spinner = dynamic(
  () => import('ldrs').then((mod) => {
    const { ripples } = mod;
    ripples.register();
    return function RippleSpinner() {
      return (
        <l-ripples
          color="#3b82f6"
          size="150"
          aria-label="Loading Spinner"
        />
      );
    };
  }),
  { ssr: false, loading: () => <div className="h-[150px] w-[150px]"></div> }
);

export default Spinner;
