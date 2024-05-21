const Input = (props) => {
    return (
        <div className="w-full">
            {
                props.label &&
                <label className="text-[14px]">{props.label}</label>
            }
            <input
                type={props.type ? props.type : 'text'}
                onChange={props.onChange}
                placeholder={props.placeholder}
                value={props.value}
                disabled={props.disabled}
                name={props.name}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-teal-400 text-[12px]"
            />
        </div>
    )
}

export default Input;