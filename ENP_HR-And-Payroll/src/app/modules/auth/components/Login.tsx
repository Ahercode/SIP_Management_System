/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useQuery } from 'react-query'

import {  fetchUsers } from '../../../services/ApiCalls'
import { Button, Modal, message } from 'antd'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { fetchDocument } from '../../../services/ApiCalls'
import { useAuth } from '../core/Auth'
import { login, parseJwt } from '../core/_requests'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong format')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 6 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  // tenantId: Yup.string().required('Company is required'),
})

const initialValues = {
  email: '',
  password: '',
  // tenantId: 'test',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser , saveTenant} = useAuth()
  const tenantId = localStorage.getItem('tenant')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  

  const handleChange = (e:any) => {
    // e.target.value 
  }
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

 

  const OnSUbmit = handleSubmit(async (values) => {
    // setLoading(true)
    // const data = {
    //   tenantId: tenantId,
    //   code: values.code,
    //   name: values.name,
    // }
    // const dataUpdate = {
    //   id: tempData.id,
    //   tenantId: tenantId,
    //   code: values.code,
    //   name: values.name,
    // }
    // console.log(data)

    // // const newData = gridData.filter((item: any) => item.code == data.code) 

    // if (!isUpdateModalOpen){
    //   if(newData.length==0){
    //     try {
    //       const response = await axios.post(url, data)
    //       setSubmitLoading(false)
    //       reset()
    //       setIsModalOpen(false)
    //       queryClient.invalidateQueries('appraisals')
    //       return response.statusText
    //     } catch (error: any) {
    //       setSubmitLoading(false)
    //       return error.statusText
    //     }
    //   }
    //   window.alert("The Code you entered already exist!");
    // }
    
    // try {
    //   const response = await axios.put(urlUpdate, dataUpdate)

    //   reset()
    //   setIsModalOpen(false)
    //   queryClient.invalidateQueries('appraisals')
    //   return response.statusText
    // } catch (error:any) {
    //   setSubmitLoading(false)
    //   return error.statusText
    // }
    
  })
  // const { data: userApplications } = useQuery('userApplications', () => fetchDocument(`userApplications`), { cacheTime: 5000 })
  // const { data: allCompanies } = useQuery('companies', () => fetchDocument(`companies`), { cacheTime: 5000 })


 
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data: auth } = await login(values.email, values.password)
        saveAuth(auth)

        //this gets the jwtToken of the login user!
        const token:any = localStorage.getItem("accessToken")
        
        // const {data: user} = await getUserByToken(auth.jwtToken)
        // setCurrentUser(auth.jwtToken)

         //this goes to decode the token and return the user details!
         parseJwt(token)
        
         //now I have to assign the !
         const curUser:any =  parseJwt(token)

        //  if(appId===1){
           setCurrentUser(curUser)
        //  }else{
        //   setStatus("you don't have access to this application")
        //  }
        saveTenant('omnigroup')

        // check if user isAdmin

        // const  userApp = userApplications?.data.filter((item:any )=> item.userId === parseInt(curUser?.id)).map((filteredItem:any) => {
        //   return filteredItem?.applicationId?.toString()
        // })

        // const newIt = userApp?.find((applicationId:any)=>{
        //   return applicationId==='10'
        // })
        
        // if(!newIt)
        // {
        //   setStatus("You can't access this application, contact your Administrator!")
        //   setSubmitting(false)
        //   setLoading(false)
        // }
      } catch (error) {
        console.error(error)
        setStatus('The login detail is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })


  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {formik.status ?
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
        : null}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
        <input
          placeholder='Email'
          
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
          </div>
        </div>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
        <br></br>
        <a style={{color:"blue", cursor:"pointer", fontWeight:"600"}} onClick={showModal}>Forgot your password?</a>
      </div>

      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      <Modal
            title="Change Password"
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
                // loading={submitLoading}
                onClick={OnSUbmit}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              onSubmit={OnSUbmit}
            >
              <hr></hr>
              <div style={{ padding: "20px 20px 20px 20px" }} >
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                  <input type="text" {...register("username")} onChange={handleChange} className="form-control form-control-solid" />
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Password</label>
                  <input type="text" {...register("password")} onChange={handleChange} className="form-control form-control-solid" />
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Confirm Password </label>
                  <input type="text" {...register("confirmPassword")} onChange={handleChange} className="form-control form-control-solid" />
                </div>
              </div>
            </form>
          </Modal>
    </form>
  )
}
