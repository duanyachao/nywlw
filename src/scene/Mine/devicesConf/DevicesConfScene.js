import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { StackNavigator, } from 'react-navigation'
import { Area, Header } from './../../../components'
import ConfigItemsScene from './ConfigItemsScene'
import WarnConfigScene from './warnconfig/WarnConfigScene'
import AutomateConfigScene from './automateconfig/AutomateConfigScene'
import CreateAutomateconfigScene from './automateconfig/CreateAutomateconfigScene'
// import AutomateStack from './automateconfig/AutomateStack'
import DevicesPortsConfigScene from './portconfig/DevicesPortsConfigScene'
import TimerConfigScene from './timeconfig/TimerConfigScene'
import RemoterConfigScene from './remoteconfig/RemoterConfigScene'
export default class DevicesConfScene extends Component {
    render() {
        return <ConfigStack/>
    }
}
const ConfigStack=StackNavigator({
    ConfigItems:{
        screen: ConfigItemsScene,
        navigationOptions: ({navigation}) => ({
            header: <Header title='我的设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
        })
    },
    WarnConfig: {
        screen: WarnConfigScene,
        navigationOptions: ({navigation}) => ({
            header: <Header title='报警设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
        })
    },
    AutomateConfig: {
        screen: AutomateConfigScene,
        navigationOptions: ({navigation}) => ({
            header: <Header title='阈值设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
        })
    },
    CreateAutomate:{
        screen: CreateAutomateconfigScene,
        navigationOptions: ({navigation}) => ({
            header: <Header title='新增/修改阈值设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
        })
    },
    TimerConfig: {
        screen: TimerConfigScene,
        navigationOptions: ({navigation}) => ({
            header: <Header title='定时设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
        })
    },
    DevicesPortsConfig: {
        screen: DevicesPortsConfigScene,
        navigationOptions: ({navigation}) => ({
            header: <Header title='端口设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
        })
    },
    RemoterConfigConfig: {
        screen: RemoterConfigScene,
        navigationOptions: ({navigation}) => ({
            header: <Header title='遥控设置' leftBtn={true} rightBtn={false} navigation={navigation}></Header>
        })
    }
},
{
    initialRouteName: 'ConfigItems',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
        header:null
    }
})
