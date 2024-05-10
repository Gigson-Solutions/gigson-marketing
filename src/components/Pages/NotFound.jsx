import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="content-in-progress">
        <h1>Error 404 | NotFound</h1>
        <Link to='/' style={{color: 'blue', fontSize: '1.3rem'}}>VOLVER A LA HOME</Link>
    </div>
  )
}

export default NotFound