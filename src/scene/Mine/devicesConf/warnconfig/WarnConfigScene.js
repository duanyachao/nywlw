import React, { Component } from 'react'
import { Text, View ,StyleSheet} from 'react-native'
import { Network, toastShort } from '../../../../utils'
import api from '../../../../api'
import { screen, theme } from './../../../../common'
export default class WarnConfigScene extends Component {
    constructor(props){
        super(props)
        this.state={
        }
    }
    
    componentDidMount(){
        const {navigation}=this.props;
    }
    
    render() {
        return (
            <View style={theme.nodata}>
                <Text>敬请期待</Text>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1
    }
})
