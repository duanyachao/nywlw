import React, { Component } from 'react'
import { Text, View,StyleSheet,FlatList,TextInput } from 'react-native'
import { Area, Header,Button } from '../../../components'
import { theme, screen } from '../../../common'
import { Network, toastShort } from '../../../utils'
import AliasItem from './AliasItem'
import api from '../../../api'
export default class AliasScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgId: null,
            sensors:null,
        }
    }
    areaChange(orgId) {
        this.setState({
            orgId: orgId,
        })
        this.getSensors(orgId,1)
    }
    //获取传感器
    getSensors = (orgId, category) => {
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
                    sensors: res.data,
                })
            }
        })
    }
    //渲染传感器
    renderSensor=(sensor)=>{
        const {item,index}=sensor;
        return<AliasItem key={index} data={item}/>
    }   
    render() {
        const {sensors,orgId}=this.state;
        return (
            <View style={styles.container}>
                <Area callbackParent={ orgId => this.areaChange(orgId)}></Area>
                {sensors?
                <FlatList
                data={sensors}
                keyExtractor={(item, index) => index}
                refreshing={false}
                onRefresh={()=>this.getSensors(orgId,1)}
                ref="sensorsList"
                renderItem={(item) => this.renderSensor(item)} />:
                <View style={theme.nodata}><Text>暂无数据</Text></View>    
            }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})
