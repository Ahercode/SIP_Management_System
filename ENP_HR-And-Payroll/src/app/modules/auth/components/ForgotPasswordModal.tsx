import { Button, Modal, message } from "antd"
import { useState } from "react"
import { set, useForm } from "react-hook-form"
import { Api_Endpoint, fetchDocument } from "../../../services/ApiCalls"
import axios from "axios"
import { useQuery } from "react-query"
import OtpInputWithValidation from "./ValidateOTP"

const ForgotPasswordModal = () => {
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false)
    const [isPassModalOpen, setIsPassModalOpen] = useState(false)
    const { register, reset, handleSubmit } = useForm()
    const tenantId = localStorage.getItem('tenant')

    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/omnigroup`), { cacheTime: 100000 })
    const [employee, setEmployee] = useState<any>(null)
      const showModal = () => {
        setIsModalOpen(true)
      }

      const handleCancel = () => {
        reset()
        setIsModalOpen(false)
        setIsOTPModalOpen(false)
        setIsPassModalOpen(false)
      }

    const OnSUbmit = handleSubmit(async (values) => {
        setLoading(true)
        // find the user with the email
        const user = allEmployees?.data?.find((user:any) => user.email?.toLowerCase()?.trim() === values.email?.toLowerCase()?.trim() 
          && user.username?.toLowerCase()?.trim() === values.username?.toLowerCase()?.trim())

        setEmployee(user)
        if(values.email===""||values.email===undefined){
            message.warning("Enter a email")
            return
        }

        if(!user){
          message.warning(`Employee does not exist! 😩`)
          return
        }

        const link = `${Api_Endpoint}/CustomOTP`
        const data ={
          email: values.email,
          employeeName: user.username,
          employeeId: user.id
        }

        console.log('data', data);
        
        try {
            const response = axios.post(link, data)
            message.success(`A link has been sent to your email ${data.email}`)
            setIsOTPModalOpen(true)
            
        } catch (error) {
            message.error("Error changing password")
        }
      })

    const VerifyOTP = handleSubmit(async (values) => {

      console.log('values', values);  
        const link = `${Api_Endpoint}/CustomOTP/verify`
        const data ={
          otpValue: values.otpValue,
          employeeId: employee?.id
        }

        console.log('data', data);
        
        try {
            const response = axios.post(link, data).then((res:any) => {
              console.log('res', res);
              message.success("OTP verified successfully")
              setLoading(false)
              setIsOTPModalOpen(false)
              setIsPassModalOpen(true)
            }).catch((err:any) => {
              console.log('err', err);
              message.error("Invalid OTP code")
              setLoading(false)
            })
            
        } catch (error) {
            message.error("Error could not verify OTP")
        }
      })

      const uRL = `${Api_Endpoint}/Employees/${employee?.id}`

      const ChangePassword = handleSubmit(async (values) => {
    
        const formData: any = new FormData();
        formData.append('id', parseInt(employee?.id))
        formData.append('employeeId', employee?.employeeId  == null ? "": employee?.employeeId)
        formData.append('firstName', employee?.firstName  == null ? "": employee?.firstName)
        formData.append('surname', employee?.surname  == null ? "": employee?.surname)
        formData.append('otherName', employee?.otherName  == null ? "":employee?.otherName)
        formData.append('dob', employee?.dob  == null ? "": employee?.dob)
        formData.append('gender', employee?.gender  == null ? "": employee?.gender)
        formData.append('maritalStatus', employee?.maritalStatus  == null ? "": employee?.maritalStatus)
        formData.append('annualBaseSalary', employee?.annualBaseSalary  == null ? "": employee?.annualBaseSalary)
        formData.append('phone', employee?.phone  == null ? "": employee?.phone)
        formData.append('alternativePhone', employee?.alternativePhone  == null ? "": employee?.alternativePhone )
        formData.append('address', employee?.address  == null ? "": employee?.address)
        formData.append('residentialAddress', employee?.residentialAddress  == null ? "": employee?.residentialAddress)
        formData.append('email', employee?.email  == null ? "": employee?.email)
        formData.append('personalEmail', employee?.personalEmail  == null ? "": employee?.personalEmail)
        formData.append('jobRole', employee?.jobRole  == null ? "": employee?.jobRole)
        formData.append('paygroupId', employee?.paygroupId  == null ? "": employee?.paygroupId)
        formData.append('categoryId', employee?.categoryId  == null ? "": employee?.categoryId)
        formData.append('departmentId', employee?.departmentId  == null ? "": employee?.departmentId)
        formData.append('jobTitleId', employee?.jobTitleId == null ? "": employee?.jobTitleId)
        formData.append('employmentDate', employee?.employmentDate  == null ? "": employee?.employmentDate)
        formData.append('lineManagerId', employee?.lineManagerId  == null ? "": employee?.lineManagerId)
        formData.append('currentLevel', employee?.currentLevel  == null ? "": employee?.currentLevel)
        formData.append('password', values?.password)
        formData.append('username', employee?.username == null ? "": employee?.username)
        formData.append('status', employee?.status == null ? "": employee?.status)
        formData.append('isAdmin', employee?.isAdmin == null ? "": employee?.isAdmin)
        formData.append('imageFile',  "")
        formData.append('tenantId', employee?.tenantId == null ? "": employee?.tenantId)
    
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
    
        console.log(Object.fromEntries(formData))

        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(values.password);
        const hasUpperCase = /[A-Z]/.test(values.password);
        const hasNumber = /\d/.test(values.password);
    
        if(values.password !== values.confirmPass){
          message.error("Passwords do not match")
          return
        }else if(values.password === "" || values.confirmPass === ""){
          message.error("Enter a password")
          return
        }
        else if(values.password.length < 8 || values.confirmPass.length < 8){
          message.error("Password must be at least 8 characters")
          return
        }
        else if(!hasSpecialChar){
          message.error("Password must contain at least one special character")
          return
        }
        else if(!hasUpperCase){
          message.error("Password must contain at least one uppercase letter")
          return
        }
        else if(!hasNumber){
          message.error("Password must contain at least one number")
          return
        }

        else {
            try {
            const response = await axios.put(uRL, formData, config).then((res:any) => {
              console.log('res', res);
              message.success("Password changed successfully")
              setLoading(false)
              setIsPassModalOpen(false)
              setIsModalOpen(false)
              reset()

            }).catch((err:any) => {
              console.log('err', err);
              message.error("Error changing password")
              setLoading(false)
            }
            )
          } catch (error: any) {
            return error.statusText
          }
        }
        
      })
      
    return (

        <>
            <a onClick={showModal} style={{cursor:"pointer"}} className='menu-link px-5'>
                Forgot Password?
            </a>
        <Modal
            title={isOTPModalOpen? 'Verify your eamil': isPassModalOpen? "Create New Password" : "Request password reset"}
            open={isModalOpen}
            onCancel={handleCancel}
            closable={true}
            footer={[
                <Button key='back' onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button
                key='submit'
                type='primary'
                htmlType='submit'
                onClick={isOTPModalOpen? VerifyOTP : isPassModalOpen? ChangePassword : OnSUbmit}
                >
                Submit
                </Button>,
            ]}
          >
            <form
              onSubmit={isOTPModalOpen? VerifyOTP : isPassModalOpen? ChangePassword  : OnSUbmit}
            >
              {
                isOTPModalOpen === true?
                <>
                  <hr></hr>
                  <div style={{ padding: "20px 20px 20px 20px" }} >
                    <div className=' mb-7'>
                      <label htmlFor="otpValue" className="form-label">Enter the OTP Code sent to {employee?.email}</label>
                      <input type="text" {...register("otpValue")} 
                      className="form-control form-control-solid" />
                    </div>
                    
                  </div>
                </>:
                isPassModalOpen === true?
                <>
                   {/* <p>Enter your new password</p> */}
                  <hr></hr>
                  <ul>
                    <li>must be 8 characters long</li>
                    <li>must contain at least one upper case letter</li>
                    <li>must contain at least one special character </li>
                    <li>must contain at least one number</li>
                  </ul>
                  <div style={{ padding: "20px 20px 20px 20px" }} >
                    <div className=' mb-7'>
                      <label htmlFor="password" className="form-label">New Password</label>
                      <input type="password" {...register("password")} 
                      className="form-control form-control-solid" />
                    </div>
                    <div className=' mb-7'>
                      <label htmlFor="confirmPass" className="form-label">Confirm Password</label>
                      <input type="password" {...register("confirmPass")} 
                      className="form-control form-control-solid" />
                    </div>
                  </div>
                </>:
                <>
                   {/* <p>Enter your email to reset your password</p> */}
                  <hr></hr>
                  <div style={{ padding: "20px 20px 20px 20px" }} >
                    <div className=' mb-7'>
                      <label htmlFor="username" className="form-label">Username</label>
                      <input placeholder="your username is the same us your first name" type="text" {...register("username")} 
                      className="form-control form-control-solid" />
                    </div>
                    <div className=' mb-7'>
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" {...register("email")} className="form-control form-control-solid" />
                    </div>
                    
                  </div>
                </>
              }
               
            </form>
          </Modal>
          {/* <Modal
              title="New Password"
              open={isPassModalOpen}
              onCancel={handleCancel}
              closable={true}
              footer={[
                  <Button key='back' onClick={handleCancel}>
                  Cancel
                  </Button>,
                  <Button
                  key='submit'
                  type='primary'
                  htmlType='submit'
                  onClick={ChangePassword}
                  >
                  Submit
                  </Button>,
              ]}
            >
              <form
                onSubmit={ChangePassword}
              >

                <hr></hr>
                <div style={{ padding: "20px 20px 20px 20px" }} >
                  <div className=' mb-7'>
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input type="text" {...register("password")} 
                    className="form-control form-control-solid" />
                  </div>
                  <div className=' mb-7'>
                    <label htmlFor="confirmPass" className="form-label">Confirm Password</label>
                    <input type="text" {...register("confirmPass")} 
                    className="form-control form-control-solid" />
                  </div>
                </div>
              </form>
            </Modal> */}
        </>
    )
}

export default ForgotPasswordModal