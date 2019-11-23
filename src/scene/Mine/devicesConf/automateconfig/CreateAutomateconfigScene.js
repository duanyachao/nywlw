import React, { Component } from 'react'
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    FlatList
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { screen, theme } from './../../../../common'
import { Network, toastShort } from './../../../../utils'
import api from './../../../../api'
import { Button } from './../../../../components'
import { pickerStyle } from './../../../../common/theme'
import Picker from 'react-native-picker'
export default class CreateAutomateconfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configId: null,//配置项id
            orgId: null,//网点id
            devicesList: null,//设备列表(开关类、行程类)
            sensorsList: null,//传感器列表
            devicesTypeSelected: null,//自定义设备类型
            deviceTypeId: null,//设备类型id
            deviceId: null,//选择的设备id
            deviceActionList: null,//选择的设备对应的操作列表
            upperAction: null,//上限绑定的操作
            lowerAction: null,//下限绑定的操作
            sensorId: null,//选择的传感器id
            sensorName: null,
            sensorTypeId: null,//选择的传感器对应的设备类型id
            ECLs: null,//传感器对应的环境参数列表
            ECLsId: null,//选择的环境参数id
            ECLsName: null,
            upper: 0,//上限值
            upperSelected: null,//自定义上限值对应的操作的选中状态
            lower: 0,//下限值
            lowerSelected: null //自定义下限值对应的操作的选中状态

        }
    }
    //获取设备
    getDevicesList = (orgId, category) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId": orgId,
            "category": category
        }
        Network.get(api.HOST + api.GETLOGICDEVICESLIST, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success && res.data.length>0) {
                this.setState({
                    devicesList: res.data
                })
                if (!this.state.deviceId) {
                    this.setState({
                        deviceId: res.data[0].id,
                        deviceTypeId: res.data[0].typeId,
                        deviceName: res.data[0].deviceName
                    })
                    this.getDeviceActionList(res.data[0].typeId);
                    this.getSensorsList(orgId, 1);
                }
            }
        })
    }
    //渲染设备Picker
    renderDevices = () => {
        const {orgId,deviceTypeId,devicesList,deviceName}=this.state;
        if (!deviceTypeId) {
            toastShort('请先选择设备类型')    
        }
        if (deviceTypeId && devicesList) {
            let devices = [];
        for (var index = 0; index < devicesList.length; index++) {
            devices.push(devicesList[index].deviceName)
        }
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择设备',
            pickerData: devices,
            selectedValue:[(deviceName)?deviceName:devicesList[0].deviceName],
            onPickerConfirm: data => {
                devicesList.forEach((element,index)=> {
                    if(element.deviceName==data){
                        this.setState({
                            deviceId: devicesList[index].id,
                            deviceTypeId: devicesList[index].typeId,
                            deviceName: devicesList[index].deviceName   
                        })
                        this.getDeviceActionList(devicesList[index].typeId);
                        this.getSensorsList(orgId, 1);
                    }
                    
                }, this);
                
            }

        });
        Picker.show();    
        }
        
    }
    //获取设备操作
    getDeviceActionList = (deviceTypeId) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "deviceTypeId": deviceTypeId,
        }
        Network.get(api.HOST + api.GETACTIONS, params, headers, (res) => {
            if (res.meta.success) {
                this.setState({
                    deviceActionList: res.data
                })
                if (this.state.deviceActionList) {
                    this.state.deviceActionList.forEach((deviceAction, index) => {
                        if (this.state.upperAction == deviceAction.id) {
                            this.setState({
                                upperSelected: index
                            })
                        }
                        if (this.state.lowerAction == deviceAction.id) {
                            this.setState({
                                lowerSelected: index
                            })
                        }
                    });
                } else {
                    // console.info('没状态')
                }
            }
        })

    }
    //获取传感器
    getSensorsList = (orgId, category) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "orgId": orgId,
            "category": category
        }
        Network.get(api.HOST + api.GETLOGICDEVICESLIST, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success && res.data.length>0) {
                this.setState({
                    sensorsList: res.data
                })
                if (!this.state.sensorId) {
                    this.setState({
                        sensorId: res.data[0].id,
                        sensorTypeId: res.data[0].typeId,
                        sensorName: res.data[0].deviceName
                    })
                    this.getECLsList(res.data[0].typeId)
                }
            }
        })
    }
    //渲染传感器Picker
    renderSensors = () => {
        const {orgId,deviceId,sensorsList,sensorName}=this.state;
        console.info(sensorsList)
        if (!deviceId) {
            toastShort('请先选择设备')    
        }
        if ( sensorsList) {
            let sensors = [];
        for (var index = 0; index < sensorsList.length; index++) {
            sensors.push(sensorsList[index].deviceName)
        }
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择传感器',
            pickerData: sensors,
            selectedValue:[(sensorName)?sensorName:sensorsList[0].deviceName],
            onPickerConfirm: data => {
                sensorsList.forEach((element,index)=> {
                    if(element.deviceName==data){
                        this.setState({
                            sensorId: sensorsList[index].id,
                            sensorName: sensorsList[index].deviceName   
                        })
                        this.getECLsList(sensorsList[index].typeId)
                    }
                }, this);
                
            }

        });
        Picker.show();    
        }
        
    }
    //获取传感器环境参数
    getECLsList = (deviceTypeId) => {
        let headers = {
            'X-Token': token
        };
        let params = {
            "deviceTypeId": deviceTypeId
        }
        Network.get(api.HOST + api.GETECLS, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success && res.data.length>0) {
                this.setState({
                    ECLs: res.data
                })
                if (!this.state.ECLsId) {
                    this.setState({
                        ECLsId: res.data[0].id,
                        ECLsName: res.data[0].name
                    })
                }
            }
        })
    }
    //渲染传感器采集项Picker
    renderECls = () => {
        const {sensorId,ECLs,ECLsName}=this.state;
        if (!sensorId) {
            toastShort('请先选择传感器')    
        }
        if ( ECLs) {
            let ecls = [];
        for (var index = 0; index < ECLs.length; index++) {
            ecls.push(ECLs[index].name)
        }
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择采集项',
            pickerData: ecls,
            selectedValue:[(ECLsName)?ECLsName:ECLs[0].name],
            onPickerConfirm: data => {
                ECLs.forEach((element,index)=> {
                    if(element.name==data){
                        this.setState({
                            ECLsId: ECLs[index].id,
                            ECLsName: ECLs[index].name   
                        })
                        // this.getECLsList(sensorsList[index].typeId)
                    }
                }, this);
                
            }

        });
        Picker.show();    
        }
        
    }
    //选择设备类型
    selectDeviceType = (orgId, category) => {
        this.setState({
            devicesTypeSelected: category,
            devicesList: null,
            deviceId: null,
            sensorsList: null,
            sensorId: null,
            ECLs: null,
            ECLsId: null,
            deviceActionList: null,
            upperAction: null,
            upper: 0,
            lower: 0,
            upperSelected: null,
            lowerSelected: null,
            lowerAction: null
        })
        this.getDevicesList(orgId, category)

    }
    //选择操作
    selectDeviceAction(item, index, configType) {
        // console.info(index, this.state.upperSelected, this.state.lowerSelected)
        if (configType == 1) {
            this.setState({
                upperSelected: index,
                upperAction: item.id

            })
        }
        if (configType == 2) {
            this.setState({
                lowerSelected: index,
                lowerAction: item.id
            })
        }
    }
    //提交配置
    saveConfigData = () => {
        const {
            orgId,
            configId,
            devicesTypeSelected,
            deviceId,
            deviceTypeId,
            deviceActionList,
            devicesList,
            sensorsList,
            sensorId,
            sensorTypeId,
            ECLs,
            ECLsId,
            upper,
            lower,
            upperSelected,
            lowerSelected,
            upperAction,
            lowerAction,
        } = this.state;
        let regInt = /^\d+$/;
        if (!deviceId) {
            toastShort('设置失败,请选择设备');
            return false
        }
        if (!sensorId) {
            toastShort('设置失败,请选择传感器');
            return false
        }
        if (!ECLsId) {
            toastShort('设置失败,请选择环境参数');
            return false
        }
        if (!regInt.test(upper)) {
            toastShort('上限值设置不正确,请重新设置');
            return false
        }
        if (!regInt.test(lower)) {
            toastShort('上限值设置不正确,请重新设置');
            return false
        }
        if (parseInt(upper) < parseInt(lower) || parseInt(lower) > parseInt(upper) || parseInt(upper) == parseInt(lower)) {
            toastShort('上下限值设置不正确,请重新设置');
            return false
        }
        if (!upperAction) {
            toastShort('设置失败,上限操作未设置');
            return false
        }
        if (!lowerAction) {
            toastShort('设置失败,下限操作未设置');
            return false
        }
        if (lowerAction == upperAction) {
            toastShort('设置失败,上下限操作设置不能相同');
            return false
        }
        let headers = {
            'X-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let params = {
            "id": (configId) ? configId : null,
            "columnDesId": ECLsId,
            "deviceId": deviceId,
            "downDeviceActionId": lowerAction,
            "downLimit": parseInt(lower),
            "orgId": orgId,
            "sensorId": sensorId,
            "upDeviceActionId": upperAction,
            "upLimit": parseInt(upper)
        }
        Network.postJson(api.HOST + api.SAVECONFAUTOMATION, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                toastShort('保存成功')
                this.props.navigation.navigate('AutomateConfig', { 'orgId': orgId })
            } else {
                toastShort(res.meta.message)
            }
        })
    }
    componentDidMount() {
        const { navigation } = this.props;
        let config = navigation.state.params.item;
        let orgId = navigation.state.params.orgId;
        let deviceTypeCategory = navigation.state.params.deviceTypeCategory;
        let sensorTypeId = navigation.state.params.sensorTypeId;
        let deviceTypeId = navigation.state.params.deviceTypeId;
        let deviceName=navigation.state.params.deviceName;
        let sensorName=navigation.state.params.sensorName;
        let ECLsName=navigation.state.params.ECLsName;
        this.setState({
            orgId: orgId,
            deviceTypeId: deviceTypeId,
            devicesTypeSelected: deviceTypeCategory,
            sensorTypeId: sensorTypeId,
        })
        if (config) {
            this.setState({
                configId: config.id,
                deviceId: config.deviceId,
                deviceName:deviceName,
                sensorId: config.sensorId,
                sensorName:sensorName,
                ECLsId: config.columnDesId,
                ECLsName:ECLsName,
                upper: config.upLimit,
                upperAction: config.upDeviceActionId,
                lower: config.downLimit,
                lowerAction: config.downDeviceActionId
            })
            this.getDevicesList(orgId, deviceTypeCategory)
            this.getSensorsList(orgId, 1);
            this.getDeviceActionList(deviceTypeId);
            this.getECLsList(sensorTypeId);

        } else {
            // console.info(1)
        }
    }
    componentWillUnmount(){
        Picker.hide()
    }
    render() {
        const {
            orgId,
            configId,
            devicesTypeSelected,
            deviceId,
            deviceName,
            deviceActionList,
            devicesList,
            sensorsList,
            sensorId,
            sensorName,
            ECLs,
            ECLsId,
            ECLsName,
            upper,
            lower,
            upperSelected,
            lowerSelected,
            upperAction,
            lowerAction
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.selectDeviceTypeStyle}>
                    <View style={styles.deviceTypeLeft}>
                        <Text style={styles.deviceTypeTipStyle}>设备类型：</Text>
                    </View>
                    <View style={styles.deviceTypeRight}>
                        <TouchableOpacity
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectDeviceType(orgId, 2)}>
                            {(devicesTypeSelected == 2) ?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} /> :
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>开关设备</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={.9}
                            style={styles.deviceTypeCheckboxStyle} onPress={() => this.selectDeviceType(orgId, 3)}>
                            {(devicesTypeSelected == 3) ?
                                <MaterialCommunityIcons
                                    name='check-circle'
                                    size={20}
                                    color={theme.theme} /> :
                                <MaterialCommunityIcons
                                    name='checkbox-blank-circle-outline'
                                    size={20}
                                    color={'#ccc'} />}
                            <Text style={styles.deviceTypeName}>行程设备</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.selectDeviceStyle}>
                    <Text style={styles.deviceTipStyle}>选择设备：</Text>
                    <TouchableHighlight
                        style={styles.deviceRight}
                        activeOpacity={.6}
                        underlayColor="transparent"
                        onPress={() => this.renderDevices()}>
                        <View style={styles.pickWrapper}>
                            <Text style={styles.selectedName}>{(deviceName) ? deviceName : '暂无设备'}</Text>
                            <MaterialCommunityIcons name='arrow-right' size={24} />
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.selectDeviceStyle}>
                    <Text style={styles.deviceTipStyle}>选择传感器：</Text>
                    <TouchableHighlight
                        style={styles.deviceRight}
                        activeOpacity={.6}
                        underlayColor="transparent"
                        onPress={() => this.renderSensors()}>
                        <View style={styles.pickWrapper}>
                            <Text style={styles.selectedName}>{(sensorName) ? sensorName : '暂无传感器'}</Text>
                            <MaterialCommunityIcons name='arrow-right' size={24} />
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.selectDeviceStyle}>
                    <Text style={styles.deviceTipStyle}>选择环境参数：</Text>
                    <TouchableHighlight
                        style={styles.deviceRight}
                        activeOpacity={.6}
                        underlayColor="transparent"
                        onPress={() => this.renderECls()}>
                        <View style={styles.pickWrapper}>
                            <Text style={styles.selectedName}>{ECLsName ? ECLsName : '暂无环境参数'}</Text>
                            <MaterialCommunityIcons name='arrow-right' size={24} />
                        </View>
                    </TouchableHighlight>
                </View>
                {(ECLsId) ?
                    <View style={styles.setContentStyle}>
                        <View style={styles.setItemStyle}>
                            <View style={styles.setItemLeftStyle}>
                                <Text style={styles.setItemLeftTipStyle}>上限值</Text>
                                <TextInput
                                    style={styles.textInputStyle}
                                    maxLength={4}
                                    // editable={this.state.editable}
                                    placeholder="正整数"
                                    placeholderTextColor="#ccc"
                                    underlineColorAndroid="transparent"
                                    keyboardType='numeric'
                                    ref='upper'
                                    defaultValue={`${upper}`}
                                    onChangeText={(text) => this.setState({ upper: text })}
                                />
                                <Text style={styles.tipEndStyle}></Text>
                            </View>
                            <View style={styles.setItemRightStyle}>
                                {(deviceActionList && deviceActionList.length > 0) ?
                                    deviceActionList.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={.9}
                                            style={styles.actionCheckboxStyle}
                                            onPress={() => this.selectDeviceAction(item, index, 1)}>
                                            {(upperSelected == index) ?
                                                <MaterialCommunityIcons
                                                    name='check-circle'
                                                    size={20}
                                                    color={theme.theme} /> :
                                                <MaterialCommunityIcons
                                                    name='checkbox-blank-circle-outline'
                                                    size={20}
                                                    color={'#ccc'} />}
                                            <Text style={styles.actionName}>{item.name}</Text>
                                        </TouchableOpacity>)) : null}
                            </View>
                        </View>
                        <View style={styles.setItemStyle}>
                            <View style={styles.setItemLeftStyle}>
                                <Text style={styles.setItemLeftTipStyle}>下限值</Text>
                                <TextInput
                                    style={styles.textInputStyle}
                                    maxLength={4}
                                    // editable={this.state.editable}
                                    placeholder="正整数"
                                    placeholderTextColor="#ccc"
                                    underlineColorAndroid="transparent"
                                    keyboardType='numeric'
                                    ref='lower'
                                    defaultValue={`${lower}`}
                                    onChangeText={(text) => this.setState({ lower: text })}
                                />
                                <Text style={styles.tipEndStyle}></Text>
                            </View>
                            <View style={styles.setItemRightStyle}>
                                {(deviceActionList && deviceActionList.length > 0) ?
                                    deviceActionList.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={.9}
                                            style={styles.actionCheckboxStyle} onPress={() => this.selectDeviceAction(item, index, 2)}>
                                            {(lowerSelected == index) ?
                                                <MaterialCommunityIcons
                                                    name='check-circle'
                                                    size={20}
                                                    color={theme.theme} /> :
                                                <MaterialCommunityIcons
                                                    name='checkbox-blank-circle-outline'
                                                    size={20}
                                                    color={'#ccc'} />}
                                            <Text style={styles.actionName}>{item.name}</Text>
                                        </TouchableOpacity>)) : null}
                            </View>
                        </View>
                    </View> :
                    <View style={styles.noConfigStyle}>
                        <MaterialCommunityIcons
                            name='alert-box'
                            size={30}
                            color={theme.bgGray2} />
                        <Text style={styles.noConfigTip}>阈值设置之前,必须先关联相关设备、传感器、环境参数等</Text>
                    </View>}
                <View style={styles.btnGroup}>
                    <Button
                        btnStyle={[styles.configBtnStyle, styles.saveBtnStyle]}
                        btnTextStyle={styles.configBtnTxtStyle}
                        title='保存'
                        onPress={() => { this.saveConfigData() }} />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    selectDeviceTypeStyle: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: screen.onePixel,
        borderBottomColor: theme.bgGray2,
    },
    deviceTypeLeft: {
    },
    deviceTypeRight: {
        marginLeft: 20,
        flexDirection: 'row',
    },
    deviceTypeTipStyle: {
        fontSize: 14
    },
    deviceTypeCheckboxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    deviceTypeName: {
        fontSize: 14,
        paddingLeft: 6
    },
    selectDeviceStyle: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: screen.onePixel,
        borderBottomColor: theme.bgGray2
    },
    deviceLeft: {
        // paddingLeft: 10,
    },
    deviceRight: {
        flexDirection: 'row',
        // justifyContent: 'flex-end',
        alignItems: 'center',
        // marginRight:6
    },
    deviceTipStyle: {
        fontSize: 14,
    },
    pickWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingRight: 6
    },
    selectedName: {
        // color:theme.colorG,
        fontSize: 14,
        marginRight: 10
    },
    setContentStyle: {
        paddingBottom: 10,
        borderBottomWidth: screen.onePixel,
        borderBottomColor: theme.bgGray2,
    },
    setItemStyle: {
        paddingVertical: 6,
        flexDirection: 'row',
    },
    setItemLeftStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    setItemLeftTipStyle: {

        paddingLeft: 10,
        justifyContent: 'center'
    },
    textInputStyle: {
        marginHorizontal: 5,
        fontSize: 14,
        width: 80,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.theme,
        height: 40,
        paddingLeft: 6
    },
    setItemRightStyle: {
        flexDirection: 'row',

    },
    noConfigStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noConfigTip: {
        color: theme.colorG,
        padding: 10

    },
    actionCheckboxStyle: {

        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 5
    },
    actionName: {
        fontSize: 14,
        paddingLeft: 0
    },
    btnGroup: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    configBtnStyle: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 5,
    },
    saveBtnStyle: {
        backgroundColor: theme.theme
    },
    delBtnStyle: {
        backgroundColor: theme.colorFirebrick
    },
    configBtnTxtStyle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff'
    },

})
