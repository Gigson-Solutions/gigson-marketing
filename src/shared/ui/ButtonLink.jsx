import {Link} from "react-router-dom";

const ButtonLink = ({text, link}) => {
    return (
        <Link to={link} className="text-button text-purple-accents border border-purple-accents rounded-full py-3 px-6 hover:opacity-80">
            {text}
        </Link>
    )
}

export default ButtonLink
