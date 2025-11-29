import logo from '../assets/up.svg';
import { useNavigate } from 'react-router-dom';
const Logo = () => {
    const navigate = useNavigate();
    return (
        <div className='flex'>
            <span className='text-3xl font-extrabold cursor-pointer' onClick={() => navigate("/")}>Levelup</span>
            <img src={logo} width="55px" className='relative top-2 right-3' />
        </div>
    );
};
export default Logo;