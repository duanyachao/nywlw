import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { screen, theme } from '../common';
const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: theme.theme
    },
    msgIcon: {

    },
    topBarLeft: {
        justifyContent:'center',
        alignItems:'center',
        width: 50
    },
    topBarCenter: {
        flexDirection: 'row',
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    topBarCenterTitle: {
        fontSize: 15,
        color: '#fff',
    },
    topBarRight: {
        width: 50,
        alignItems: 'center',
        justifyContent:'center'
    },
});
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state={
            iconName:null
        }
    }
    rightBtnAction=(rightBtn) =>{
        const {navigation} = this.props;
        if (rightBtn=='skyatlas') {
            InteractionManager.runAfterInteractions(() => {
                navigation.navigate('Weather')
            })    
        }
        
    }
    componentDidMount() {

    }
    componentWillUnmount(){
        // this.pushListener && this.pushListener.remove()    
    }

    render() {
        const{rightBtn,leftBtn,navigation}=this.props;
        return (
            <View>
                <View style={styles.topBar}>
                    <View style={styles.topBarLeft}>
                        {(leftBtn)?
                            <Icon.Button
                            borderRadius={0}
                            name="angle-left"
                            backgroundColor="transparent"
                            size={30}
                            color='#FFF'
                            activeOpacity={.2}
                            underlayColor={'transparent'}
                            onPress={() => navigation.goBack()}
                            />:null}
                    </View>
                    <View style={styles.topBarCenter}>
                        <Text style={styles.topBarCenterTitle}>{this.props.title}</Text>
                    </View>
                    <View style={styles.topBarRight}>
                    {(rightBtn)?
                        <Icon.Button
                            borderRadius={0}
                            name={`${rightBtn}`}
                            backgroundColor="transparent"
                            size={20}
                            color='#FFF'
                            activeOpacity={.2}
                            underlayColor={'transparent'}
                            onPress={()=>this.rightBtnAction(rightBtn)}
                            />:null}
                    </View>
                    
                </View>
            </View>
        );
    }
}