import { useContext } from 'react';
import logo from '../assets/up.svg';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
const Logo = () => {
    const {authenticated} = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <div className='flex'>
            <span className='text-2xl md:text-3xl lg:text-3xl font-extrabold cursor-pointer' onClick={() => authenticated ? navigate("/dashboard") : navigate("/")}>Levelup</span>
            <img src={logo} className='relative top-2 right-3 w-10 sm:w-12' />
        </div>
    );
};
export default Logo;