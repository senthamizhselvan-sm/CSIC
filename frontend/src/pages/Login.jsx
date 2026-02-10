import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to user login
    navigate('/user/login', { replace: true });
  }, [navigate]);

  return null;
}
