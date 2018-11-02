//LSY
//2028-9-6
import React from 'react';
import { Table } from 'antd';
import { Link } from 'dva/router';
const GradeList = ({ dataSource }) => {
    console.log(dataSource);
    
    const dataSource1=[...dataSource];
    dataSource1.map((item)=>{
        const dateBegin=item.date_from.split(" ");
        const dataEnd=item.date_thru.split(" ")
        item.date=dateBegin[0];
        item.time=dateBegin[1]+'~'+dataEnd[1]
        return item
    })
    const columns = [{
        title: "日期",
        dataIndex: "date",
        align:"center",
        render: (value, row, index) => {
            
            const obj = {
              children: value,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = 4;
            }else if (index === 4) {
              obj.props.rowSpan = 5;
            }else {
              obj.props.rowSpan = 0;
            }
            return obj;
        },
    }, {
        title: "时间",
        dataIndex: 'time',
        align:"center",
       
    }, {
        title: "公开团体赛",
        dataIndex: 'name',
        align:"center",
        render: (text, row) => {
            return (
                <Link 
                to={{pathname:'/details/grade/graresult',search:`id=${row.id}`}}
                >{text}</Link>
            )
        }
    }]
    return (
        <div style={{ width:'700px',margin:"0 auto"}}>
            <Table
            rowKey={row=>row.id}
            columns={columns}
            dataSource={dataSource1}
            bordered={true}
            />
        </div>
    )
}

export default GradeList;