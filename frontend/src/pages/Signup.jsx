import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to user signup
    navigate('/user/signup', { replace: true });
  }, [navigate]);

  return null;
}
