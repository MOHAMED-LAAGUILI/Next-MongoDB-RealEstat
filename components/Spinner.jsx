'use client';
import { ripples } from 'ldrs'
ripples.register()


const Spinner = ({ loading }) => {
  return (
    loading && (
    <l-ripples
      color="#3b82f6"
      loading={loading}
        size={150}
      aria-label='Loading Spinner'
    />
  )
  );
};
export default Spinner;
