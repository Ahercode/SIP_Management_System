import { useForm } from "react-hook-form"

const Processes = () => {
    const { register, reset, handleSubmit } = useForm()
    const yearsList = [
        '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'
    ]

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '5px',
            boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            margin: '10px'
        }}>
            <div className="d-flex flex-direction-row row">
                <form>
                    <div className='col-3 mb-7'>
                        {/* <label htmlFor="exampleFormControlInput1" className=" form-label">Year</label>
                        <select className="form-select form-select-solid" aria-label="Select example">
                            <option value="select year">select year</option>
                            {yearsList.map((item: any) => (
                                <option value={item}>{item}</option>
                            ))}
                        </select> */}
                    </div>
                </form>

            </div>

        </div>
    )
}

export { Processes }