import { Button, Empty, Modal } from "antd";
import { type } from "os";
import { ChangeEvent, useState } from "react";
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';


type SupportFileProps = {
    title: string,
    deliverableId: string
}

const SupportFile = ({title, deliverableId }:SupportFileProps) => {


    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const onFileChange = (event:any) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  const onDocumentLoadSuccess = ({ numPages }:any) => {
    setNumPages(numPages);
  };
    const handleUpload = () => {
        // Handle file upload logic here (e.g., send file to a server)
        if (selectedFile) {
          // Example: You can use fetch or any library to handle file upload
          const formData = new FormData();
          formData.append('file', selectedFile);
          
          // Example: Replace with your API endpoint
          fetch('your-upload-endpoint', {
            method: 'POST',
            body: formData,
          })
            .then((response) => {
              // Handle response
            })
            .catch((error) => {
              // Handle error
            });
        }
      };
      const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          setSelectedFile(file);
        }
      };

      const showModal = () => {
        setIsModalOpen(true)
      }

      
      const handleCancel = ()=>{
        setIsModalOpen(false)
        setSelectedFile(null)
      }


      return (
        <>

          <button onClick={showModal} className="btn btn-light-info btn-sm" >
            {title==="final"|| title==="hr"?"View":"Choose File"}
          </button>

        <Modal
            title={"Supporting Files"}
            open={isModalOpen}
            onCancel={handleCancel}
            closable={true}
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
                disabled={!selectedFile}
                // onClick={isUpdateModalOpen ? handleUpdate : OnSubmit}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              // onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit}
            >
              <hr></hr>
              <Empty
                  description={<span className='text-gray-600'>Empty </span>}
                  className="mt-4" /> 
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

                {/* {pdfFile && (
                  <div>
                    <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                      {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                      ))}
                    </Document>
                  </div>
                  )} */}
              </div>
              <hr />
            </form>
          </Modal>
          
        </>
      )

}

export { SupportFile}