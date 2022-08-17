import { Location, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/store';

export interface LocationWithState extends Location {
  state: { from: { pathname: string } } | null;
}

interface RequireRegisteredProps {
  children: JSX.Element;
}

export const RequireRegistered = ({ children }: RequireRegisteredProps) => {
  const registered = useAppSelector((state) => state.app.registered);
  const location = useLocation();

  if (!registered) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
