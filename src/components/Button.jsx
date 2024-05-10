import './Button.css'

const Button = ({name, classStyle}) => {
  return (
     <button className={`${classStyle} button-main `}>{name}</button>
  )
}

export default Button