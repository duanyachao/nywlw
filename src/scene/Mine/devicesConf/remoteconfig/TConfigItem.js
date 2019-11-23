import React, { Component } from 'react'
import { Alert,Text, View,StyleSheet,Switch,TouchableHighlight } from 'react-native'
import { Button } from './../../../../components'
import { Network, toastShort } from './../../../../utils'
import api from './../../../../api'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Picker from 'react-native-picker'
export default class TConfigItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configId:null,
            devices:null,
            deviceId: null,//选择的设备id
            deviceName:null,
            configStatus:false
        }
    }
    //提交配置
    saveConfigData=()=>{
        let headers = {
            'X-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let params ={
            "buttonNum":1,
            "confType":1,
            "deviceActionId":'08b9c4e0-a40d-4509-92ac-fc9c273973e9',
            "deviceId":this.state.deviceId,
            "id":this.state.configId,
            "orgId":this.props.orgId,
            "signalChannel":this.props.data
          }
        Network.postJson(api.HOST + api.SAVEREMOTERDATA, params, headers, (res) => {
            console.info(res)
            if (res.meta.success) {
                toastShort('保存成功')
                this.props.reload(this.props.orgId)
            }else{
                toastShort(res.meta.message)
            }
        })
    }
    //渲染设备Picker
    renderDevices = () => {
        const {deviceId,configStatus,deviceName}=this.state;
        const {data,devices,confData}=this.props;
            let devicesList = [];
        for (var index = 0; index < devices.length; index++) {
            devicesList.push(devices[index].deviceName)
        }
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择设备',
            pickerData: devicesList,
            selectedValue:[(deviceName)?deviceName:devices[0].deviceName],
            onPickerConfirm: data => {
                devices.forEach((element,index)=> {
                    if(element.deviceName==data){
                        this.setState({
                            deviceId: element.id,
                            deviceName: element.deviceName  
                        })
                    }
                    
                }, this);
                
            }

        });
        Picker.show();
        
    }
    //启用禁用删除配置
    switchConfig=()=>{
        if (this.state.configId) {
            if (this.state.configStatus) {
                Alert.alert(
                    '提示',
                    '确定禁用此项设置',
                    [
                      {text: '确定', onPress: () =>{
                            fetch(api.HOST + api.DELREMOTERDATA, {
                                method: 'POST',
                                headers: {
                                    'X-Token': token,
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: 'id=' +this.state.configId
                            }).then((res) =>res.json()).then((res)=>{
                                //  console.info(res)
                                if (res.meta.success) {
                                    toastShort('禁用成功')
                                    this.props.reload(this.props.orgId)
                                    this.setState({
                                        configId:null,
                                        deviceId:null,
                                        deviceName:null,
                                        configStatus:!this.state.configStatus
                                    })
                                } else {
                                    toastShort(res.meta.message)
                                    return false
                                }    
                            })
                      }},
                     {text:'取消',onPress:()=>{
                         return
                     }} 
                    ]
                  )
            } else {
                this.setState({
                    configStatus:!this.state.configStatus
                })    
            }    
        } else {
            this.setState({
                configStatus:!this.state.configStatus,
                deviceId:this.props.devices[0].id,
                deviceName:this.props.devices[0].deviceName
            })    
        }
        
        
    }
    componentDidMount(){ 
       setTimeout(() => {
        const {data,devices,confData}=this.props;
        const {deviceId,configStatus,deviceName}=this.state;
        if (confData) {
            this.setState({
                configStatus:true,
                deviceId:confData.deviceId,
                configId:confData.id
            })
            // console.info(devices)
            devices.forEach((device,index)=>{
                if (confData.deviceId==device.id) {
                    this.setState({
                        deviceName:devices[index].deviceName
                    })
                }
            })    
        }else{

        }
       }, 500);
        
    }
    componentWillReceiveProps(nextProps){
        const {data,devices,confData}=nextProps;
        this.setState({
            configId:confData?confData.id:null   
        })    
    }
    componentWillUnmount(){
        Picker.hide()
    }
    render() {
        const {data,devices,confData}=this.props;
        const {deviceId,configStatus,deviceName}=this.state;
        // console.info(deviceName)
        return (
            <View style={styles.container}>
                <View style={styles.signalChannelItem}>
                    <Text style={styles.channelTip}>信道编号：</Text>
                    <Text style={styles.channelName}>{data}</Text>
                </View>
                <View style={styles.tDeviceItemStatus}>
                    <Text style={styles.channelTip}>信道状态：</Text>
                    <View style={styles.switchable}>
                        <Switch 
                            onValueChange={this.switchConfig} 
                            style={styles.switchBtn} 
                            value={configStatus}/>
                        <Text style={styles.channelTip}>{(configStatus)?'启用':'禁用'}</Text>
                    </View>
                </View>
                <View style={styles.tDeviceItem}>
                    <Text style={styles.deviceTip}>设备名称：</Text>
                    {(devices && configStatus)?
                        <TouchableHighlight
                        style={styles.deviceRight}
                        activeOpacity={.6}
                        underlayColor="transparent"
                        onPress={() => this.renderDevices()}>
                        <View style={styles.pickWrapper}>
        <Text style={styles.selectedName}>{(deviceName)?deviceName:'未绑定设备'}</Text>
                            <MaterialCommunityIcons name='arrow-right' size={24} />
                        </View>
                    </TouchableHighlight>
                    :<Text style={styles.nodeviceTip}>暂无设备</Text>}
                    

                </View>
                    {(configStatus)?
                        <Button
                        btnStyle={[styles.btnStyle,styles.saveBtnStyle]}
                        btnTextStyle={styles.btnTxtStyle}
                        title='保存'
                        onPress={this.saveConfigData} />:null
                    }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
        margin:3,
        padding:6
    },
    signalChannelItem:{
        flexDirection:'row',
        paddingVertical:4
    },
    tDeviceItem:{
        height:40,
        flexDirection:'row',
        alignItems:'center',
    },
    tDeviceItemStatus:{
        
        flexDirection:'row',
        alignItems:'center',

    },
    switchable:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    deviceRight:{
        flexDirection:'row'
    },
    pickWrapper: {
        flexDirection: 'row',
        // backgroundColor:'red',
        // justifyContent:'space-between',
        alignItems: 'center',
        // paddingRight: 6
    },
    selectedName:{
        fontSize:14,
        paddingRight:10
    },
    btnStyle:{
        alignSelf:'center',
        paddingHorizontal:15,
        paddingVertical:10,
        marginTop:0,
        borderRadius:5  
    },
    saveBtnStyle:{
        backgroundColor:'#f57831',
    },
    btnTxtStyle:{
        color:'#ffffff',
        fontSize:14    
    },
})
