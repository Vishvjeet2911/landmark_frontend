import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();
    localStorage.removeItem("lm_token");
    localStorage.removeItem("lm_bundle");
    navigate('/', { replace: true });

    return <></>;
}