const Select = (props) => {
    return (
        <div className="w-full relative">
            {
                props.label &&
                <p>{props.label}</p>
            }
            <select name={props.name} onChange={props.onChange} value={props.value} className={`w-full p-2 border rounded-md ${props.className}`}>
                {props.options.map((item, index) => {
                    return (
                        <option value={item.value} key={index} >{item.label}</option>
                    )
                })}
            </select>
        </div>
    )
}

export default Select;