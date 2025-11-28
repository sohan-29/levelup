import { useNavigate } from 'react-router-dom';
import logo from '../assets/up.svg';
const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className='relative bg-gray-800 text-white'>
            <header className="absolute top-0 px-20 pb-1 pt-5 w-full border-b-2 border-gray-300">
                <div className='flex'>
                    <span className='text-3xl font-extrabold cursor-pointer' onClick={()=>navigate("/")}>Levelup</span>
                    <img src={logo} width="55px" className='relative top-2 right-3' />
                </div>
            </header>
            <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
                <h1 className='text-[#fee362] text-5xl font-bold mb-4'>Make history with your comeback!!</h1>
                <p className='text-sm mb-8'> Step into a journey where every streak, every effort, and every win builds the foundation of your greatest comeback.</p>
                <button className='mt-5 text-2xl font-medium p-3 bg-white text-gray-800 rounded-4xl px-5 hover:border-amber-200 border-3 hover:text-gray-800'>Get Started</button>
            </div>
        </div>
    );
}

export default LandingPage;
