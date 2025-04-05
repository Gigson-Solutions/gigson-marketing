import {Link} from "react-router-dom";

const ButtonLink = ({ text, link, outlined }) => {

    const boxClass = outlined ? 'text-purple-accents border border-purple-accents transition duration-200 ease-linear hover:bg-[#e3e1ee] hover:text-purple-accents' : 'text-white bg-purple-accents';

    return (
        <Link to={link} className={`${boxClass} text-button rounded-full py-3 px-6 hover:opacity-80`}>
            {text}
        </Link>
    )
}

export default ButtonLink
