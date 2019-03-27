/**
 * title: 组织
 * isNotMenu: true
 */
import React, { Component, useEffect, useState, useRef } from 'react';
import { Input, Transfer, Button, Table } from 'antd'
import router from 'umi/router';
import StepContent from '@/component/steps'
import { parseNotes } from '@/utils/tools'
import odoo from '../../../../odoo-rpc/odoo';
const steps = [{
    title: '创建组',
    dataIndex: [{
        label: "组名称",
        type: "Input",
        name: "name",
        rules: [{ required: true, message: '请输入组名称' }]
    }, {
        label: "类型",
        type: "Radio",
        values: ['循环赛', '积分编排赛', '淘汰赛'],
        name: "date",
        rules: [{ required: true, message: '选择一个类型' }]
    }]
}, {
    title: '赛制',
    skip: (data) => data.date === "淘汰赛",
    dataIndex: [{
        label: "IMP - VP",
        type: "select",
        name: "host",
        values: ['20-VP WBF', '25-VP WBF', '20-VP 北美'],
        rules: [{ required: true, message: '选择一个赛制' }]
    }, {
        label: "轮空IMP",
        type: "Input",
        name: "unit",
        rules: [{ required: true, message: '必填' }]
    }, {
        label: "轮空VP",
        type: "Input",
        name: "concet",
        rules: [{ required: true, message: '必填' }]
    }],
}, {
    title: '牌桌/桌号',
    dataIndex: [{
        label: "轮次",
        type: "Input",
        name: "referee",
        rules: []
    }, {
        label: "每轮时间（分钟）",
        type: "Input",
        name: "arbitration",
        rules: []
    }, {
        label: "每轮牌数",
        type: "Input",
        name: "arbitrations",
        rules: []
    }, {
        label: "桌号（开闭室计1桌）",
        type: "Input",
        name: "arbitrationss",
        render: (form, data, item) => {
            console.log(form.getFieldProps('name'));
            return (
                <>
                    {form.getFieldDecorator(item.name, {
                        initialValue: data[item.name],
                        rules: [{ required: true, message: 'The tags must be urls' }],
                    })(
                        <MyInput />
                    )}
                </>
            )
        }
    }],
},
{
    title: '组内队',
    dataIndex: [{
        label: "",
        type: "Input",
        name: "refereeww",
        rules: [],
        render: (form, data, item) => {
            return (
                <>
                    {form.getFieldDecorator(item.name, {
                        initialValue: data[item.name],
                        rules: [],
                    })(
                        <Team />
                    )}
                </>
            )
        }
    },]
}, {
    title: '轮次表',
    dataIndex: [{
        label: "",
        type: "Input",
        name: "refereew",
        rules: [],
        render: (form, data, item) => {
            return (
                <>
                    {form.getFieldDecorator(item.name, {
                        initialValue: data[item.name],
                        rules: [],
                    })(
                        <>
                            <Button style={{ marginRight: "24px" }}>默认轮次表</Button> <Button >录入轮次表</Button>
                            <div style={{ height: "auto", marginTop: "24px", marginBottom: "24px", }}><Table bordered></Table></div>
                            <Button >确认</Button>
                        </>
                    )}
                </>
            )
        }
    },]
}, {
    title: '确认',
    render(form, steps, data) {
        return steps.map((item) => item.dataIndex).filter((item) => item && item.title !== "组内队" && item !== "轮次表").reduce((pre, cur) => [...pre, ...cur], []).map((item) => {
            return (
                <p key={item.name}><span style={{ fontWeight: "bolder" }}>{item.label + "："}</span> {data[item.name]}</p>
            )
        })
    }
}]
class MyInput extends React.Component {
    onChange = (index, e) => {
        const val = e.target.value
        let { onChange, value } = this.props;
        console.log(value);
        if (!value) {
            value = '~'
        }
        const x = value.split('~')
        x[index] = val;
        if (index === 0) {
            x.splice(1, 0, '~')
        } else {
            x[1] = '~'
        }
        console.log(x, index);
        onChange(x.reduce((pre, cur) => {
            return pre + cur
        }, ''));
    };
    render() {
        const { value = '~' } = this.props;
        return (
            < Input.Group compact>
                <Input value={value.split('~')[0]} style={{ width: 100, textAlign: 'center' }} onChange={this.onChange.bind(this, 0)} placeholder="Minimum" />
                <Input
                    style={{
                        width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff',
                    }}
                    placeholder="~"
                    disabled
                />
                <Input value={value.split('~')[1]} onChange={this.onChange.bind(this, 2)} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
            </Input.Group>
        );
    }
}

class Team extends Component {
    state = {
        dataSource: [],
        selectedRows: [],
        targetKeys: [],
    }
    componentDidMount() {
        this.getData()
    }
    getData = async () => {
        const game_id = localStorage.game
        const cls = odoo.env('og.team');
        const domain = [['id', '>=', '0'], ['game_id', '=', game_id]]
        const fields = {
            name: null,
            number: null,
            phase_ids: null
        }
        const dataSource = await cls.search_read(domain, fields);
        console.log(dataSource);
        const targetKeys = dataSource.map(item => item.id)
        // console.log(targetKeys);
        this.setState({
            dataSource: dataSource,
            targetKeys: targetKeys,
        })
    }
    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
        const { onChange } = this.props
        onChange(targetKeys)

    }

    renderFooter = () => (
        <Button
            size="small"
            style={{ float: 'right', margin: 15 }}
            onClick={this.getMock}
        >
            更新队伍数据
        </Button>
    )

    render() {
        const { dataSource, selectedRows } = this.state;
        const columns = [
            {
                title: '编号',
                dataIndex: 'number',
            },
            {
                title: '队名',
                dataIndex: 'name',
            },
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows: selectedRows
                })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        }
        return (
            <div style={{ background: "#fff", }}>
                <Transfer
                    dataSource={dataSource}
                    rowKey={item => item.id}
                    showSearch
                    listStyle={{
                        width: '220px',
                        height: '400px',
                    }}
                    operations={['添加', '移除',]}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange}
                    render={item => `${item.id}-${item.name}`}
                    footer={this.renderFooter}
                    titles={['所有队伍', '已添加队伍',]}
                    locale={{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }}
                >

                </Transfer>
            </div>
        )
    }
}

export default (props) => {
    const onSubmit = async (data, setLoading) => {
        console.log(data);

    }
    const onCancel = () => {
        router.replace("/sponsor/match")
    }
    return (
        <StepContent
            steps={steps}
            lastStep={onSubmit}
            onCancel={onCancel}
        />
    )
}