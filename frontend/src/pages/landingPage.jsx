import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className='relative bg-[#242424] text-white'>
            <Header />
            <div className='flex flex-col items-center justify-center min-h-screen min-w-screen'>
                <h1 className='text-[#fee362] text-5xl font-bold mb-4'>Make history with your comeback!!</h1>
                <p className='text-sm mb-8'> Step into a journey where every streak, every effort, and every win builds the foundation of your greatest comeback.</p>
                <button className='mt-5 text-2xl font-medium p-3 bg-white text-gray-800 rounded-4xl px-5 hover:border-amber-200 border-3 hover:text-gray-800' onClick={()=>navigate("/login")}>Get Started</button>
            </div>
            <Footer />
        </div>
    );
}

export default LandingPage;
