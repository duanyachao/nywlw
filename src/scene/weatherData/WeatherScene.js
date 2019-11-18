//import liraries
import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    FlatList,
    Image,
    ListView,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Network, toastShort } from '../../utils';
import api from '../../api';
import { ParamsIcon } from '../../common/Normal';
import { theme, screen } from '../../common';
import { setSpText, scaleSize } from '../../common/scale'
import { Button } from '../../components';
// create a component
export default class WeatherScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData:null
        }
    }
    componentDidMount() {
        this.loadWeather()
    }
    WdataList= data =>{
        return (
            <View style={styles.wWrapper}>
                {data.sensorVOs.map((item)=>{
                    if(item.key=='FX'){
                        item.unitName='风';
                        if (item.value==0 || item.value==360) {
                            item.value='东';    
                        }else if(item.value<90){
                            item.value='东北';
                        }else if(item.value==90){
                            item.value='北';
                        }else if(item.value>90 && item.value<180){
                            item.value='西北';
                        }else if(item.value==180){
                            item.value='西';
                        }else if(item.value>180 && item.value<270){
                            item.value='西南';
                        }else if(item.value==270){
                            item.value='南';
                        }else if(item.value>270 && item.value<360){
                            item.value='东南';
                        }else{

                        }  
                    }else{

                    }
                    return (
                        <View key={item.key} style={styles.listItem}>
                            <Text>{item.name}:&nbsp;</Text>
                            <Text>{item.value}</Text>
                            <Text>{item.unitName}</Text>
                        </View>
                    )
                })}
                
            </View>
        )
    }
    loadWeather(){
        let headers = {
            'X-Token': token
        };
        let params = { "orgId": weatherStationOrgId};
        // console.info(weatherStationOrgId)
        Network.get(api.HOST+api.WEATHERURL, params, headers, (res) => {
            console.info(res)
            if (res.meta.success && res.data.length>0) {
                this.setState({
                    weatherData:res.data
                })    
            }

        })
    }
    renderItem=data=>{
        const {index,item}=data;
        return (
            <View style={styles.container}>
                        <View style={styles.wTitle}>
                            <Text style={styles.wTitleT}>{item.facName}</Text>
                        </View>
                        {this.WdataList(item)}
                        <View style={styles.wTime}>
                            <Text style={styles.wTimeTxt}>{item.dataTime}</Text>
                        </View>
                    </View>
                )   

    }
    render(){
        const {weatherData}=this.state;
        return (
            <View style={styles.container}>
                {(weatherData)?<FlatList
                data={weatherData}
                keyExtractor={(item, index) =>index}
                onRefresh={() => this.loadWeather()}
                refreshing={false}
                renderItem={(item) => this.renderItem(item)}>
            </FlatList>:<View style={styles.nodata}><Text>暂无数据</Text></View>}
            </View>
            
        )
}
}
// define your styles
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderBottomColor:'#eee'
    },
    nodata:{
        flexDirection:'row',
        justifyContent:'center',
        padding:10
    },
    wTitle:{
        flexDirection:'row',
        // justifyContent:'center',
        alignItems:'center'
    },
    wTitleT:{
        alignSelf:'flex-start',
        color:'#222',
        padding:10
    },
    wTime:{
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    wTimeTxt:{
        padding:6
    },
    wWrapper:{
        flexDirection:'row',
        flexWrap:'wrap',
        paddingBottom:10
    },
    listItem:{
        flexDirection:'row',
        paddingLeft:15,
        paddingVertical:5
        
    }
});
