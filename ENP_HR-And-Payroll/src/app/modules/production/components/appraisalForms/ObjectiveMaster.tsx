import { ErrorBoundary } from "@ant-design/pro-components"

interface ObjectiveProps {
    Component: React.ComponentType<any>;
    employeeId?: any;
    objectiveData: any;
}

const ObjectiveMaster: React.FC<ObjectiveProps> = ({ objectiveData, Component: Component, employeeId }) => {
    return (
        objectiveData?.map((item: any) => (
            <div className="align-items-start mt-7" >
                <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center">
                    <span className=' fs-2 fw-bold '>{item?.name}</span>
                    <div className="bullet bg-danger ms-4"></div>
                    <span className=' fs-2 ms-4 fw-bold'>{`(${item?.weight}%)`}</span>
                </div>
                <ErrorBoundary>
                    <Component objectiveId={item?.id} employeeId ={employeeId?.toString()} />
                </ErrorBoundary>
            </div>
        ))
    )
}

export { ObjectiveMaster }