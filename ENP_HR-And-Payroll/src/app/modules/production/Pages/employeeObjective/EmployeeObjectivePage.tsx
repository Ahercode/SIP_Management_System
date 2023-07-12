import { Table } from "antd"
import { useState } from "react"
import { employeeObjectiveColumns } from "../../components/columns/EmployeeObjectiveColumn"
import { EmployeeObjectiveHeaders } from "../../components/headers/EmployeeObjectveHeader"



const EmployeeObjectivePage = () =>{


    return (
        <div className='card border border-gray-400 '
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
            <EmployeeObjectiveHeaders/>
            <Table columns={employeeObjectiveColumns}/>
        </div>
    )
}

export {EmployeeObjectivePage}