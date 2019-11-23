import React, { Component } from 'react'
import { Text, View,StyleSheet,FlatList,TextInput,DeviceEventEmitter } from 'react-native'
import { Button } from './../../../components'
import { theme, screen} from '../../../common'
import { Network, toastShort } from '../../../utils'
import api from '../../../api'
export default class AliasScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            positionDesc:null,
            sensor:null
        }
    }
    saveSetData=()=>{
        const {sensor,positionDesc}=this.state;
        var reg = /^[\u4E00-\u9FA5A-Za-z0-9]*$/;
        if (!reg.test(positionDesc)) {
            toastShort('自定义格式不正确')
            return false
        }
        let headers = {
            'X-Token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let params ={
            "id":sensor.id,
            "positionDesc": positionDesc,
          }
        Network.postJson(api.HOST + api.UPDATELOGICDEVICE, params, headers, (res) => {
            // console.info(res)
            if (res.meta.success) {
                toastShort('保存成功')
                // DeviceEventEmitter.emit('aliasSuccess',positionDesc)
            }else{
                toastShort(res.meta.message)
            }
        })
    }
    componentDidMount(){
        const { data } = this.props;
            this.setState({
                sensor:data,
                positionDesc:(data.positionDesc)?data.positionDesc:data.positionName
            })    
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            const { data } = nextProps;
            this.setState({
                sensor:data,
                positionDesc:data.positionName
            })
        }
        return true
    } 
    render() {
        const {sensor,positionDesc}=this.state;
        return(
            <View style={styles.container}>
                <Text style={styles.itemTip}>{(sensor)?sensor.deviceName:''}</Text>
                <TextInput
                    style={styles.textInputStyle}
                    maxLength={10}
                    placeholder="请输入别名"
                    placeholderTextColor="#ccc"
                    underlineColorAndroid="transparent"
                    ref='aliasConf'
                    defaultValue={`${positionDesc}`}
                    onChangeText={(text) => this.setState({ positionDesc: text })}/>
                    <View style={styles.btnWraper}>
                        <Button
                                btnStyle={[styles.btnStyle,styles.saveBtnStyle]}
                                btnTextStyle={styles.btnTxtStyle}
                                title='保存'
                                onPress={this.saveSetData} /> 
                    </View>
                     
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        flex: 1,
        flexDirection:'row',
        margin:6,
        padding:6,
        height:45,
    },
    itemTip:{
        width:100,
        fontSize:14,
        // textAlignVertical:'center',
        alignSelf:'center'
        
    },
    textInputStyle:{
        paddingLeft:10,
        width:120,
        fontSize:14,
        borderRadius:4,
        borderWidth:1,
        borderColor:theme.theme,
        marginHorizontal:6
    },
    btnWraper:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'flex-end',
    },
    btnStyle:{
        paddingHorizontal:15,
        borderRadius:5,
        justifyContent:'center',
    },
    saveBtnStyle:{
        backgroundColor:'#289fff'
    },
    btnTxtStyle:{
        color:'#ffffff',
        fontSize:14    
    },
});
