const Button = (props) => {
    return (
        <button
            disabled={props.disabled || props.loading}
            onClick={props.onClick}
            className={`w-full bg-teal-300 text-white py-2 rounded-md hover:bg-opacity-80 focus:outline-none ${props.className}`}
        >
            {props.loading ? 'Loading ...' : props.children}
        </button>
    )
}

export default Button;