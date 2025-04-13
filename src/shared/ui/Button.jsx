import { Link } from "react-router-dom";

const getBoxClass = (outlined) => {
    return outlined
        ? 'text-purple-accents border border-purple-accents transition duration-200 ease-linear hover:bg-[#e3e1ee] hover:text-purple-accents'
        : 'text-white bg-purple-accents';
};

const ButtonLink = ({ text, link, outlined, className }) => {
    const boxClass = getBoxClass(outlined);

    return (
        <Link to={link} className={`${boxClass} text-button rounded-full py-3 px-6 hover:opacity-80 ${className}`}>
            {text}
        </Link>
    );
};

const Button = ({ text, onClick, outlined, className }) => {
    const boxClass = getBoxClass(outlined);

    return (
        <span role="button" onClick={onClick} className={`${boxClass} cursor-pointer text-button rounded-full py-3 px-6 hover:opacity-80 ${className}`}>
            {text}
        </span>
    );
};

export { ButtonLink, Button };
