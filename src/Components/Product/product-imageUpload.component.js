import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import {PlusOutlined} from '@ant-design/icons';
import Axios from 'axios';
import { Row, Typography } from 'antd';
import {serverUrl} from "../config";

const { Text } = Typography;

function ProductImageUploadComponent(props) {

    const [Images, setImages] = useState([])

    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        //save the Image we chose inside the Node Server
        Axios.post(serverUrl+'/products/uploadImage', formData, config)
            .then(response => {
                if (response.data.success) {

                    setImages([...Images, response.data.image])
                    props.refreshFunction([...Images, response.data.image])

                } else {
                    alert('Failed to save the Image in Server')
                }
            })
    }

    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);

        let newImages = [...Images]
        newImages.splice(currentIndex, 1)

        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
            >
                {({ getRootProps, getInputProps }) => (
                    <div style={{
                        width: '300px', height: '240px', border: '1px solid lightgray',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                         {...getRootProps()}
                    >
                        {console.log('getRootProps', { ...getRootProps() })}
                        {console.log('getInputProps', { ...getInputProps() })}
                        <input {...getInputProps()} />
                        <div>
                            <Row justify="space-around" align="middle">
                                <PlusOutlined type="plus" style={{ fontSize: '3rem' }} />
                            </Row>

                            <Row justify="space-around" align="end">

                                <Text>Images will be JPG or PNG format</Text>
                                <Text>Recommended ratio 640x960 </Text>
                            </Row>
                        </div>




                    </div>

                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (
                    <div onClick={() => onDelete(image)} >
                        <img style={{ minWidth: '300px', width: '300px', height: '220px' }} src={`${serverUrl}/${image}`} alt={`productImg-${index}`} />
                    </div>
                ))}
            </div>

        </div>
    );
}

export default ProductImageUploadComponent;
