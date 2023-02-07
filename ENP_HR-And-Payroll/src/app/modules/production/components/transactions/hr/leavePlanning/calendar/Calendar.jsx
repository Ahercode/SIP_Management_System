import {L10n} from '@syncfusion/ej2-base'
import {
  ScheduleComponent,
  Day,
  Week,
  Month,
  Agenda,
  Inject, DragAndDrop, Resize, WorkWeek,
} from "@syncfusion/ej2-react-schedule";
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-lists/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-splitbuttons/styles/material.css'
import '@syncfusion/ej2-react-schedule/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import {
  addSchedule,
  deleteSchedule,
  fetchCustodians,
  fetchSchedules,
  fetchServiceTypes,
  fetchVmequps,
  localData,
  updateSchedule,
} from './requests'
import {message} from 'antd'
import {employeedata, LEAVE} from "../../../../../../../data/DummyData";

/**
 *  Schedule editor custom fields sample
 */

//Editing editor buttons
L10n.load({
  'en-US': {
    schedule: {
      saveButton: 'Schedule Leave',
      cancelButton: 'Cancel',
      deleteButton: 'Remove',
      newEvent: 'Schedule Employee Leave',
    },
  },
})

const Calendar = ({chosenLocationIdFromDropdown}) => {
  // const [serviceTypeDropDownValues, setserviceTypeDropDownValues] = useState([])
  let scheduleObj
  let scheduleQueryClient = useQueryClient() // for refetching the schedules
  // React Query
  //Get
  const {data: schedulesData} = useQuery('schedules', fetchSchedules, {
    refetchOnWindowFocus: false,
    staleTime: 300000,
  })
  const {data: vmequps} = useQuery('vmequps', fetchVmequps, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
  const {data: custodiansData} = useQuery('custodians', fetchCustodians, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
  const {data: serviceTypes} = useQuery('serviceTypes', fetchServiceTypes, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  //Create
  const {mutate: addScheduleMutation} = useMutation(addSchedule, {
    onSuccess: () => {
      scheduleQueryClient.invalidateQueries('schedules')
      return message.success('Schedule added successfully')
    },
    onError: (error) => {
      console.log('error adding schedule', error)
      return message.error('Error adding schedule')
    },
  })
  //delete
  const {mutate: deleteScheduleMutation} = useMutation(deleteSchedule, {
    onSuccess: () => {
      scheduleQueryClient.invalidateQueries('schedules')
      return message.success('Schedule deleted successfully')
    },
    onError: (error) => {
      console.log('error deleting schedule', error)
      return message.error('Error deleting schedule')
    },
  })
  //put (update)
  const {mutate: updateScheduleMutation} = useMutation(updateSchedule, {
    onSuccess: () => {
      scheduleQueryClient.invalidateQueries('schedules')
      return message.success('Schedule updated successfully')
    },
    onError: (error) => {
      console.log('error updating schedule', error)
      return message.error('Error updating schedule')
    },
  })
  //Access the same location query from cycle details component
  const locationQuery = useQueryClient().getQueryData('Locations')

    let dropDownListObject;

  let vmQuery = useQueryClient()

  function editorTemplate(props) {
    console.log('props', props)
    if (props.serviceTypeId) {
      const fleetModel = vmQuery.getQueryData('vmequps')?.data?.find((fleet) => fleet.fleetID.trimEnd() === props.fleetId.trimEnd())?.modlName
      const serviceTypesOfSelectedModel = serviceTypes?.data?.filter((service) => service.model.trimEnd() === fleetModel.trimEnd())
      console.log('fleetModel during props', fleetModel)
      console.log('serviceTypesOfSelectedModel', serviceTypesOfSelectedModel)
      // Setting Service Type dropdown values
      dropDownListObject.dataSource = serviceTypesOfSelectedModel.map((service) => {
        return { text: service.name, value: service.id }
      })
      dropDownListObject.dataBind() // refresh the dropdown list
    }
    function getEmployeeUnit(e) {
    if (e.itemData) {
      console.log("e.itemData", e.itemData)
      const fleetModel = vmQuery.getQueryData('vmequps')?.data?.find((fleet) => fleet.fleetID.trimEnd() === e.itemData.value.trimEnd())?.modlName
      const serviceTypesOfSelectedModel = serviceTypes?.data?.filter((service) => service.model.trimEnd() === fleetModel.trimEnd())
      console.log('serviceTypesOfSelectedModel', serviceTypesOfSelectedModel)
      dropDownListObject.dataSource = serviceTypesOfSelectedModel.map((service) => {
        return { text: service.name, value: service.id }
      })
      dropDownListObject.dataBind() // refresh the dropdown list
    }
  }
    return props !== undefined ? (
      <table className='custom-event-editor' style={{width: '100%'}} cellPadding={5}>
        <tbody>
          <tr>
            <td className='e-textlabel'>Employee Code</td>
            <td colSpan={4}>
              <DropDownListComponent
                id='Summary'
                placeholder='Choose Employee Code'
                data-name='fleetId'
                className='e-field'
                style={{width: '100%'}}
                dataSource={employeedata.map((employee) => {
                  return {
                    text: `${employee.firstname} ${employee.lastname}`,
                    value: `${employee.code}`, //this is the value that will be sent to the backend
                  }
                })}
                fields={{text: 'text', value: 'value'}}
                value={props && props.fleetId ? `${props.fleetId}` : null}
                change={getEmployeeUnit}
              />
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>Unit</td>
            <td colSpan={4}>
              <DropDownListComponent
                id='Location'
                placeholder='Choose Employee Unit'
                data-name='locationId'
                className='e-field'
                style={{width: '100%'}}
                // dataSource={locationQuery?.data.map((location) => {
                //   return {
                //     text: `${location.locationCode} - ${location.locationDesc}`,
                //     value: `${location.locationCode}`,
                //   }
                // })}
                fields={{text: 'text', value: 'value'}}
                value={props?.locationId}
              />
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>Type of Leave</td>
            <td colSpan={4}>
              <DropDownListComponent
                id='serviceTypeId'
                placeholder='Choose Type of Leave'
                data-name='serviceTypeId'
                className='e-field'
                ref={(scope) => (dropDownListObject = scope)}
                style={{width: '100%'}}
                dataSource={LEAVE.map((leave) => {
                  return {
                    text: `${leave.name}`,
                    value: `${leave.code}`
                  }
                })}
                fields={{text: 'text', value: 'value'}}
                value={props?.serviceTypeId}
              />
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>From</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id='StartTime'
                format='dd/MM/yy hh:mm a'
                data-name='timeStart'
                value={props && props.timeStart ? new Date(props?.timeStart) : props?.StartTime}
                className='e-field'
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>To</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id='EndTime'
                format='dd/MM/yy hh:mm a'
                data-name='timeEnd'
                value={props && props.timeEnd ? new Date(props?.timeEnd) : props?.EndTime}
                className='e-field'
              ></DateTimePickerComponent>
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      message.error('Please select an event')
    )
  }

  //on double click event

  // Fired before the editorTemplate closes.
  // const onActionBegin = (args) => {
  //   console.log('args in action begin', args)
  //   let data = args.data instanceof Array ? args.data[0] : args.data
  //   if (args.requestType === 'eventCreate') {
  //     console.log(scheduleObj)
  //     // make data in array so that I can map though it
  //     const preparedData = [{...data}]
  //     console.log('preparedData', preparedData)
  //     // map through the array and set each field to what the calendar will understand
  //     const formattedDataToPost = preparedData.map((schedule) => {
  //       console.log('schedule', schedule)
  //       return {
  //         fleetId: schedule.fleetId,
  //         locationId: schedule.locationId,
  //         timeStart: schedule.StartTime,
  //         timeEnd: schedule.EndTime,
  //         entryId: 0,
  //         vmModel: 'null',
  //         vmClass: 'null',
  //         serviceTypeId: schedule.serviceTypeId,
  //         responsible: schedule.responsible,
  //       }
  //     })
  //     //Since format is an array, I need to change it to the format that the API will understand which is an object
  //     const dataToPost = formattedDataToPost[0]
  //     addScheduleMutation(dataToPost)
  //   }
  //   if (args.requestType === 'eventRemove') {
  //     args.cancel = true
  //     deleteScheduleMutation(data)
  //   }
  //   if (args.requestType === 'eventChange') {
  //     args.cancel = true
  //     console.log('data', data)
  //     console.log('args in eventChange', args)
  //     const preparedData = [{...data}]
  //     const formattedDataToPost = preparedData.map((schedule) => {
  //       return {
  //         fleetId: schedule.fleetId,
  //         locationId: schedule.locationId,
  //         timeStart: schedule.StartTime,
  //         timeEnd: schedule.EndTime,
  //         entryId: schedule.entryId,
  //         vmModel: 'null',
  //         vmClass: 'null',
  //         serviceTypeId: schedule.serviceTypeId,
  //         responsible: schedule.responsible,
  //       }
  //     })
  //     const dataToPost = formattedDataToPost[0]
  //     updateScheduleMutation(dataToPost)
  //   }
  // }
  // const headerTemplate = (props) => {
  //     return (
  //         <div>
  //             {props.elementType === "event" ? (<div className="e-cell-header e-popup-header">
  //                 <div className="e-header-icon-wrapper">
  //                     {/*<button id="edit" className="e-edit e-edit-icon e-icons" title="Edit"/>*/}
  //                     <button id="close" className="e-close e-close-icon e-icons" title="Close"/>
  //                 </div>
  //             </div>) : (<div className="e-event-header e-popup-header">
  //                 <div className="e-header-icon-wrapper">
  //                     <button id="close" className="e-close e-close-icon e-icons" title="CLOSE"/>
  //                 </div>
  //             </div>)}
  //         </div>
  //     );
  // }
  // const contentTemplate = (props) => {
  //     return (<div className="quick-info-content">
  //         {props.elementType === 'cell' ?
  //             <div className="e-cell-content">
  //                 <div className="content-area">asdasd
  //                     {/*<TextBoxComponent id="title" ref={(textbox) => titleObj = textbox} placeholder="Title"/>*/}
  //                 </div>
  //                 <div className="content-area">
  //                     {/*<DropDownListComponent id="eventType" ref={(ddl) => eventTypeObj = ddl} dataSource={roomData} fields={{ text: "Name", value: "Id" }} placeholder="Choose Type" index={0} popupHeight="200px"/>*/}
  //                 </div>
  //                 <div className="content-area">
  //                     {/*<TextBoxComponent id="notes" ref={(textbox) => notesObj = textbox} placeholder="Notes"/>*/}
  //                 </div>
  //             </div>
  //             :
  //             <div className="event-content">
  //                 <div className="meeting-type-wrap">
  //                     <label>Subject</label>:
  //                     <span>sdfsdfs</span>
  //                 </div>
  //                 <div className="meeting-subject-wrap">
  //                     <label>Type</label>:sdfsdf
  //                     {/*<span>{getEventType(props)}</span>*/}
  //                 </div>
  //                 <div className="notes-wrap">
  //                     {/*<Link to={"/checkListForm/tabs"}>View Details</Link>*/}
  //                     {/*<span>{props.Description}</span>*/}
  //                 </div>
  //             </div>}
  //     </div>);
  // }
  // const footerTemplate = (props) => {
  //     console.log("props", props);
  //     return (
  //         <div className="quick-info-footer">
  //
  //             {props.elementType === "event" ?
  //                 <div className="cell-footer">
  //                     <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" />
  //                     <ButtonComponent id="add" cssClass='e-flat' content="Add" isPrimary={true} />
  //                 </div>
  //                 :
  //                 <div className="event-footer">
  //                     <ButtonComponent id="delete" cssClass='e-flat' content="Delete" />
  //                     <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" isPrimary={true} />
  //                 </div>
  //             }
  //         </div>
  //     );
  // }

  return (
    <div className='schedule-control-section'>
      <div className='col-lg-12 control-section'>
        <div className='control-wrapper'>
          {/*<ScheduleComponent*/}
          {/*  width='100%'*/}
          {/*  height='650px'*/}
          {/*  ref={(schedule) => (scheduleObj = schedule)}*/}
          {/*  eventSettings={*/}
          {/*    // Filtering based on the chosen location*/}
          {/*    schedulesData &&*/}
          {/*    localData(*/}
          {/*      chosenLocationIdFromDropdown*/}
          {/*        ? schedulesData.data.filter(*/}
          {/*            (schedule) => schedule.locationId === chosenLocationIdFromDropdown*/}
          {/*          )*/}
          {/*        : schedulesData.data*/}
          {/*    )*/}
          {/*  }*/}
          {/*  currentView='Month'*/}
          {/*  eventRendered={onEventRendered}*/}
          {/*  editorTemplate={editorTemplate}*/}
          {/*  actionBegin={onActionBegin}*/}
          {/*  // id='schedule'*/}
          {/*  // quickInfoTemplates={{*/}
          {/*  //     header: headerTemplate.bind(this),*/}
          {/*  //     content: contentTemplate.bind(this),*/}
          {/*  //     footer: footerTemplate.bind(this)*/}
          {/*  // }}*/}
          {/*>*/}
          {/*  <Inject services={[Day, Week, Month, Agenda]} />*/}
          {/*</ScheduleComponent>*/}
          <ScheduleComponent
              width='100%'
              height='650px'
              ref={t => scheduleObj = t}
              // eventSettings={{ dataSource: data }}
              // eventRendered={onEventRendered.bind(this)}
              currentView='Week'
              id='schedule'
              editorTemplate={editorTemplate}
          >
          <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
        </ScheduleComponent>
        </div>
      </div>
    </div>
  )
}
export {Calendar}
