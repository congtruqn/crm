import React from 'react';
import { useLoading } from '../../store/LoadingContext';
import classes from "./LoadingSpinner.module.scss";
const GlobalLoader: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className={classes.spinner__wrapper}>
      <div className={classes.spinner}></div>
    </div>
  );
};

export default GlobalLoader;