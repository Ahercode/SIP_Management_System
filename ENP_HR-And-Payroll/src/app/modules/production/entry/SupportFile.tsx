import { Button, Empty, Modal } from "antd";
import { type } from "os";
import { useEffect, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";


type SupportFileProps = {
    title: string,
    deliverableId: string
}

const SupportFile = ({title, deliverableId }:SupportFileProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [file, setFile] = useState<any>(null);

      const handleFileChange = (event: any) => {

          const file = event.target.files[0];
          // setSelectedFile(file);
          setFile(file);
      };

      console.log("file", file);

      const showModal = () => {
        setIsModalOpen(true)
      }

      
      const handleCancel = ()=>{
        setIsModalOpen(false)
        setFile(null)
      }


      return (
        <>

          <button onClick={showModal} className="btn btn-light-info btn-sm" >
            {title==="final"|| title==="hr"?"View":"Upload a File"}
          </button>
        <Modal
            title={"Supporting Files"}
            open={isModalOpen}
            onCancel={handleCancel}
            closable={true}
            width={800}
            footer={[
              <Button key='back' 
              onClick={handleCancel}
              >
                Cancel
              </Button>,
              <Button
                key='submit'
                type='primary'
                htmlType='submit'
                disabled={!file}
              >
                Submit
              </Button>,
            ]}
          >
            <form
            >
              <hr></hr>
                  {file === null?
                  <Empty
                      description={<span className='text-gray-600'>Empty </span>}
                      className="mt-4" />:
                  (
                    <div>
                      <iframe
                        title="pdfViewer"
                        src={URL.createObjectURL(file)}
                        width="100%"
                        height="600px"
                      ></iframe>
                    </div>
                  )} 
              <div className="d-flex mt-10 justify-content-center items-center">
                {
                  title==="final"|| title==="hr"?"":
                  <>
                    <label htmlFor="fileInput" className="btn btn-light-info btn-sm">
                      Choose File
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      className="visually-hidden"
                      onChange={handleFileChange}
                    />
                  </>
              }
              </div>
              <hr />
            </form>
          </Modal>
          
        </>
      )

}

export { SupportFile}