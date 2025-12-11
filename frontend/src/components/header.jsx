import Logo from "./logo";
import Profile from "./profile";

const Header = () => {
    return (
        <div className="flex justify-between sticky top-0 px-13 sm:px-18 pb-2 pt-3 w-full border-b-2 bg-[#242424] border-gray-300">
            <Logo />
            <Profile />
        </div>
    );
}
export default Header;
