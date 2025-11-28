import logo from '../assets/up.svg';
const LandingPage = () => {
    return (
        <>
            <header className="fixed top-0 px-20 py-4 w-full">
                <div className='flex'>
                    <span className='text-3xl font-extrabold'>Levelup</span>
                    <img src={logo} width="55px" className='relative top-2 right-3' />
                </div>
            </header>
            <div className='flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-800 text-white'>
                <h1 className='text-[#fee362] text-5xl font-bold mb-4'>Make history with your comeback!!</h1>
                <p className='text-sm mb-8'> Step into a journey where every streak, every effort, and every win builds the foundation of your greatest comeback.</p>
                <button className='text-2xl font-medium'>Get Started</button>
            </div>
        </>
    );
}

export default LandingPage;
