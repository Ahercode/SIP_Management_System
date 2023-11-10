import { ErrorBoundary } from "@ant-design/pro-components"
import { fetchDocument } from "../../../../services/ApiCalls";
import { useQuery } from "react-query";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

interface ObjectiveProps {
    Component: React.ComponentType<any>;
    // Component: any;
    employeeId?: any;
    objectiveData: any;
}

const ObjectiveMaster: React.FC<ObjectiveProps> = ({ objectiveData, Component: Component, employeeId }) => {

    const navigate = useNavigate();
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })
    
    const convertToArray = checkActive?.referenceId.split("-")
    
    const appraisalId = convertToArray?.[1]

    return (
        <div
            style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
            <div 
            // style={{display: "flex"}}
            className="d-flex flex-direction-row align-items-center justify-content-start align-content-center"
            >

            <Button
                onClick={() => navigate(-1)}
                className="btn btn-light-primary me-4"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
                type="primary" shape="circle" icon={<ArrowLeftOutlined rev={''} />} size={'large'}
              />
              
                <span className=" text-gray-600 fw-bold d-block fs-2">Go back</span>
            </div>
            {
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
            }
        </div>
        
    )
}

export { ObjectiveMaster }