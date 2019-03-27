import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Select, Checkbox, Button } from 'antd';
import { Link } from 'dva/router';
import BtnTimer from '../../../component/BtnTimer';
import styles from './index.less';
import router from 'umi/router';
import odoo from '../../../odoo-rpc/odoo';

const { Option } = Select;

class RegisterBlock extends Component {

    state = {
        confirmDirty: false,
        btnTimerTitle: true,
        timeCount: 60,
        btnDisable: false
    };

    // 创建用户
    createUser = async (values) => {
        const users = await odoo._rpc.register({ ...values, role: "player" });
        console.log('--- createUser ---', users, values);
        if (users.code === 0) {
            router.push('/user/login');
        }
    }

    handleSubmit = (e) => {
        console.log(e);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.createUser(values)
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('您两次输入的密码不一致，请重新输入 ^v^');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        console.log(this.state.confirmDirty);
        if (value && this.state.confirmDirty) {
            console.log(this.state.confirmDirty);
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 2 },
                sm: { span: 16 },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
            </Select>
        );



        return (
            <div className={styles.registerBox}>
                <Form onSubmit={this.handleSubmit} >
                    <Form.Item
                        {...formItemLayout}
                        label="昵称"
                    >
                        {getFieldDecorator('login', {
                            rules: [{
                                required: true,
                                message: '请填写您的昵称 ^v^',
                                whitespace: true
                            }],
                        })(
                            <Input style={{ width: '85%', maxWidth: '300px' }} />
                        )}
                    </Form.Item>

                    <Form.Item
                        {...formItemLayout}
                        label={(
                            <span>
                                密码&nbsp;
                                <Tooltip title="密码是6~12位字母和数字组合，字母区分大小写">
                                    <Icon type='question-circle-o'></Icon>
                                </Tooltip>
                            </span>
                        )}
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: '请填写您的密码 ^v^'
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input type="password" style={{ width: '85%', maxWidth: '300px' }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="确认密码"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true,
                                message: '请再次确认您的密码 ^v^'
                            }, {
                                validator: this.compareToFirstPassword
                            }],
                        })(
                            <Input
                                type="password"
                                onBlur={this.handleConfirmBlur}
                                style={{ width: '85%', maxWidth: '300px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        {...formItemLayout}
                        label="邮箱"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email',
                                message: '邮箱格式错误，请重输 ^v^'
                            }, {
                                required: true,
                                message: '请填写您的邮箱 ^v^'
                            }],
                        })(
                            <Input style={{ width: '85%', maxWidth: '300px' }} />
                        )}
                    </Form.Item>

                    <Form.Item
                        {...formItemLayout}
                        label="手机号"
                    >
                        {getFieldDecorator('phone', {
                            rules: [{
                                required: true,
                                message: '请输入您的手机号 ^v^',
                            },
                            {
                                pattern: /^\d{11}$/,
                                message: '手机号格式错误 ^v^',
                            }],
                        })(
                            <Input
                                addonBefore={prefixSelector}
                                style={{ width: '85%', maxWidth: '300px' }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="验证码"
                        extra="请填写从手机获取的短信验证码."
                    >
                        {getFieldDecorator('captcha', {
                            rules: [{
                                required: true,
                                message: '请填写验证码 ^v^',
                                whitespace: true
                            }],
                        })(
                            <Input style={{ width: '55%', maxWidth: '220px' }} />
                        )}
                        <BtnTimer></BtnTimer>

                    </Form.Item>
                    <Form.Item
                        style={{ textAlign: 'center' }}
                    >
                        {getFieldDecorator('agreement', {
                            valuePropName: 'checked',
                            rules: [{
                                required: true,
                                message: '您还没有阅读并同意我们的协议 ^v^'
                            }]
                        })(
                            <Checkbox style={{ fontSize: '12px' }}>
                                我已经阅读并且同意
                                <Link to="/user/userAgreement">智赛棋牌用户协议</Link>
                            </Checkbox>
                        )}
                    </Form.Item>

                    <Form.Item
                        style={{ textAlign: 'center' }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}



const WrappedRegistrationForm = Form.create({ name: '注册表单' })(RegisterBlock);

export default WrappedRegistrationForm;