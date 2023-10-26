import { message } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchDocument, postItem, updateItem } from "../../../../../services/ApiCalls";

const AppraisalObjective = ({ referenceId }: any) => {

    const [objValue, setObjValue] = useState<any>('');
    const [textareaHeight, setTextareaHeight] = useState('auto');
    const { data: allObjectives } = useQuery('appraisalperfobjectives', () => fetchDocument(`appraisalperfobjectives/tenant/test`), { cacheTime: 5000 })
    const { reset, register, handleSubmit } = useForm()
    const queryClient = useQueryClient()
    const [currentObjective, setCurrentObjective] = useState<any>([])
    const [objectiveData, setObjectiveData] = useState<any>([])
    const tenantId = localStorage.getItem('tenant')

    const handleChange = (event: any) => {
        event.preventDefault()
        setObjValue(event.target.value);
        const { name, value } = event.target;
        setObjectiveData(
            (prevState: any) => ({
                ...prevState,
                [name]: value
            }));
        adjustTextareaHeight();
    };


    const adjustTextareaHeight = () => {
        const textarea: any = document.getElementById('resizable-textarea');
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        // Limit height to 10 lines
        if (textarea.scrollHeight > 10 * parseFloat(getComputedStyle(textarea).lineHeight)) {
            textarea.style.overflowY = 'scroll';
            textarea.style.height = `${10 * parseFloat(getComputedStyle(textarea).lineHeight)}px`;
        } else {
            textarea.style.overflowY = 'hidden';
        }

        setTextareaHeight(`${textarea.style.height}`);
    };

    const loadData = async () => {
        try {
            const response = allObjectives?.data?.filter((item: any) => {
                return item.referenceId === referenceId
            })
            setObjectiveData(response[0])

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    }, [
        allObjectives?.data, referenceId
    ])




    const handleObjectiveSave = handleSubmit(async (values) => {
        if (objValue === '') {
            message.error('Please enter objective description')
            return
        }
        // check if current objective exist allObjectives using referenceId
        const currentObjective = allObjectives?.data.find((item: any) => item.referenceId === referenceId)
        if (currentObjective) {
            const item = {
                data: objectiveData,
                url: 'appraisalperfobjectives'
            }
            console.log('objItem: ', item)
            updateData(item)
            return
        } else {
            const item = {
                data: {
                    description: values.description,
                    tenantId: tenantId,
                    referenceId: referenceId,
                },
                url: 'appraisalperfobjectives',
            }
            console.log('objItem: ', item)
            postData(item)
        }
    })

    const { mutate: postData } = useMutation(postItem, {
        onSuccess: () => {
            reset()
            queryClient.invalidateQueries('appraisalperfobjectives')
            loadData()
            message.success('Appraisal objective saved successfully')

        },
        onError: (error: any) => {
            console.log('post error: ', error)
        }
    })


    const { mutate: updateData } = useMutation(updateItem, {
        onSuccess: () => {
            reset()
            loadData()
            queryClient.invalidateQueries('appraisalperfobjectives')
            message.success('Appraisal objective updated successfully')
        },
        onError: (error) => {
            console.log('error: ', error)
        }
    })

    return (
        <>
        <div style={{padding:" 10px 20px 0 0"}}>
            <form onSubmit={handleObjectiveSave}>
                <span className='form-label' >Objectives</span>
                <textarea
                    {...register("description")}
                    id="resizable-textarea"
                    className="form-control mb-0 mt-2"
                    defaultValue={objectiveData ? objectiveData?.description : ''}
                    onChange={handleChange}
                    style={{ height: textareaHeight }}
                />
                <div style={{display: "flex", justifyContent:"flex-end", marginTop:"20px"}}>

                    <a className='btn btn-light-primary btn-sm' onClick={() => handleObjectiveSave()}>Save Objective</a>
                </div>
            </form>
        </div>
           
        </>
    )
}

export { AppraisalObjective };
