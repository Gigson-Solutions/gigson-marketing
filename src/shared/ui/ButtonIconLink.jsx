import {Link} from "react-router-dom";

const PrimarySvg = () => {
    return <svg width="19" height="18" viewBox="0 0 19 18" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9H12.001M12.001 1L17.7634 9L12.001 17"
                      stroke="white"
                      strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
}

const OutlinedSvg = ({ color }) => {
    return (
        <svg width="42" height="40" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="40" height="38" rx="19" stroke={color} strokeWidth="2"/>
            <path d="M13 20L29 20M29 20L23 14M29 20L23 26" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

const ButtonIconLink = ({ href, outlined, outlinedColor }) => {

    const icon = outlined ? <OutlinedSvg color={outlinedColor} /> : <PrimarySvg />;

    const boxClass = outlined ? '' : 'bg-purple-accents';

    return (
        <Link to={href} className={`${boxClass} rounded-full p-3 hover:opacity-80`}>
            {icon}
        </Link>
    )
}


export default ButtonIconLink
