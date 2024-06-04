import { UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Select, Upload } from 'antd'
import Title from 'antd/es/typography/Title'

const ExcelRevisi = () => {
  return (
    <Flex vertical={true} gap={32} style={{ padding: 40 }}>
      <Title level={2}>Excel</Title>

      <Flex gap={16}>
        <Upload
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          action='/'
          maxCount={1}
          multiple={false}
          //   onChange={handleFileChange}
          //   beforeUpload={handleBeforeUpload}
        >
          <Button icon={<UploadOutlined />} size='middle' style={{ height: 40 }}>
            File Utama
          </Button>
        </Upload>

        <Upload
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          action='/'
          multiple={true}
          //   onChange={handleFileChange}
          //   beforeUpload={handleBeforeUpload}
        >
          <Button icon={<UploadOutlined />} size='middle' style={{ height: 40 }}>
            File Turunan
          </Button>
        </Upload>

        <Select
          allowClear
          size='middle'
          showSearch
          style={{ width: 200, height: 40 }}
          placeholder='Pilih Kolom'
          //   onChange={(value) => handleFiltersChange('type', value)}
          //   options={Object.values(ExcelType)}
        />
      </Flex>
    </Flex>
  )
}

export default ExcelRevisi
