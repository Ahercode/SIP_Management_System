import { Button, Modal, Space, Table } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { fetchProducts } from "../../../../../../services/ApiCalls";
import { KTSVG } from "../../../../../../../_metronic/helpers";

const productByProvider = () => {
    const tenantId = localStorage.getItem('tenant')
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const [selectedProvider, setSeletedProvider] = useState<any>("");

    const showProductModal = () => {
        setIsProductModalOpen(true)
      }

    const handleProductCancel = () => {
        setIsProductModalOpen(false)
      }
    
    
      const handleSelect = (product:any) => {
        setSelectedProducts((prevSelectedProducts:any) => [...prevSelectedProducts, product]);
      };
    
      console.log('Selected',selectedProducts);
      
    
      const handleRemove = (product:any) => {
        setSelectedProducts((prevSelectedProducts:any) =>
          prevSelectedProducts.filter((p:any) => p.id !== product.id)
        );
      };

    const { data: products } = useQuery('products',()=> fetchProducts(), { cacheTime: 5000 })

    const productColumn:any = [
        {
          title: 'Product',
          key: 'medicalServiceId',
          render: (row: any) => {
            return getProductName(row.medicalServiceId)
          },
          sorter: (a: any, b: any) => {
            if (a.medicalServiceId > b.medicalServiceId) {
              return 1
            }
            if (b.medicalServiceId > a.medicalServiceId) {
              return -1
            }
            return 0
          },
        },
        {
          title: 'Cost',
          dataIndex: 'cost',
          sorter: (a: any, b: any) => {
            if (a.cost > b.cost) {
              return 1
            }
            if (b.cost > a.cost) {
              return -1
            }
            return 0
          },
        },
        {
          title: 'Action',
          fixed: 'right',
          width: 100,
          render: (_: any, record: any) => (
            <Space size='middle'>
              <a onClick={() => handleRemove(record)} className='btn btn-light-danger btn-sm'>
                Remove
              </a>
            </Space>
          ),
        },
      ]

      const getProductName = (proId: any) => {
        let productName = ""
        products?.data.map((item: any) => {
          if (item.id === proId) {
            productName=item.name
          }
        })
        return productName
      } 

    return (
        <>
                      <button type='button' className='btn btn-primary me-3 mb-3' onClick={showProductModal}>
                        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                        Select Products
                      </button>

                        <Table 
                            columns={productColumn} 
                            // dataSource={dataByProvider}
                            />
                        <Modal
                          title='Product list'
                          open={isProductModalOpen}
                          onCancel={handleProductCancel}
                          closable={true}
                          footer={[
                            <Button key='back' onClick={handleProductCancel}>
                                Cancel
                            </Button>,
                            <Button
                            key='submit'
                            type='primary'
                            htmlType='submit'
                            // loading={submitLoading}
                            // onClick={OnSubmit}
                            >
                              Submit
                            </Button>,
                          ]}
                        
                        >
                          <hr></hr>

                          {
                            productByProvider.length ===0?
                            <>
                            <div style={{alignItems:"center", justifyContent:"center", padding:"30px, 0px", textAlign:"center"}}>
                              <h4>
                                No Data for this provider
                              </h4>
                            </div>
                              
                            </>:
                            productByProvider?.map((item:any)=>{
                              const productNam = products?.data?.find((p:any) => p.id === item.medicalServiceId);
                              return (
                                <>
                                  <div className='d-flex justify-content-between'>
                                    <p>
                                      {
                                        productNam?.name
                                      }
                                    </p>
                                    <button 
                                      onClick={() => handleSelect(item)}
                                      className='btn btn-light-primary btn-sm mb-3'
                                      >Add</button>
                                  </div>
                                </>
                              );
                            })
                          }
                          <hr></hr>
                        </Modal>
                        
                      </>
    );
    
};

export default productByProvider;

