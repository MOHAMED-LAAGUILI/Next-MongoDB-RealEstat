'use client';
import { ripples } from 'ldrs'
ripples.register()

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
    <l-ripples
      color="#3b82f6"
      size={150}
      aria-label='Loading Spinner'
    />
    </div>
  );
};
export default LoadingPage;




