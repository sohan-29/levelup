import Logo from "./logo";

const Header = () => {
    return (
        <div className="absolute top-0 px-13 sm:px-20 pb-1 pt-5 w-full border-b-2 border-gray-300">
            <Logo />
        </div>
    );
}
export default Header;
