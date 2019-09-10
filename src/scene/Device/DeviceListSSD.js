//import liraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView
} from 'react-native';
import DeviceSSDItem from './DeviceSSDItem';
import DeviceSSDItemDP from './DeviceSSDItemDP';
// create a component
export default class DeviceListSSD extends Component {
    constructor(props){
        super(props);
        this.state = {
            bTypeName:null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }
    renderItem(rowData, sectionID, rowID) {
        let {orgId}=this.props;
        return (<DeviceSSDItemDP rowData={rowData} rowID={rowID} orgId={orgId}></DeviceSSDItemDP>)
        // if (this.state.bTypeName=='温室大棚') {
        //     return <DeviceSSDItemDP rowData={rowData} rowID={rowID} orgId={orgId}></DeviceSSDItemDP>        
        //     } else {
        //         return <DeviceSSDItem rowData={rowData} rowID={rowID} orgId={orgId}></DeviceSSDItem>    
        //     }
        
    }
    componentDidMount(){
        storage.load({
            key:'userInfo'
        }).then((ret)=>{
            this.setState({
                bTypeName:ret.bTypeName    
            })
        })
        .catch(err => {
            // 如果没有找到数据且没有sync方法，
            // 或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
              case 'NotFoundError':
                // TODO;
                break;
              case 'ExpiredError':
                // TODO
                break;
            }
          })    
    }
    render() {
        const {devices}=this.props;
        return (
            <ListView
                initialListSize={1}
                dataSource={this.state.dataSource.cloneWithRows(devices)}
                renderRow={(rowData,sectionID,rowID)=>this.renderItem(rowData,sectionID,rowID)}
                style={styles.listViewStyle}
                onEndReachedThreshold={10}
                enableEmptySections={true}
            ></ListView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
});
