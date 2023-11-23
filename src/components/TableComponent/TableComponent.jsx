import React, { useMemo, useState } from 'react';
import { Button, Table } from 'antd';
import Loading from "../../hooks/LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";



const TableComponent = (props) => {
  const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
  const [rowSelectedKeys, setrowSelectedKeys] = useState([])
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'action')
    return arr
  }, [columns])



  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setrowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys)

  }
  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };
  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKeys.length > 0 && (
        <div style={{
          background: 'rgb(5, 5, 7)',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer',
        }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <Button onClick={exportExcel}>Export Excel</Button>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />

    </Loading >
  )
}

export default TableComponent

