import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity,FlatList} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class MyDonationScreen extends Component{
    static navigationOptions = {
        header:null
    }
    constructor(){
        super();
        this.state = {
            userId:firebase.auth().currentUser.email,
            allDonations:[]
        },
        this.requestRef = null

    }
    getDonorDetails = (donorId)=>{
        db.collections("users").where("email_id",'==',donorId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    "donorName":doc.data().first_name+" "+doc.data().last_name
                })
            })
            
        })
    }
    getAllDonations = ()=>{
        this.requestRef = db.collections("all_donations").where("donor_id",'==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allDonations = snapshot.docs.map(document=>document.data());
            this.setState({
                allDonations:allDonations
            })
        })

    }
    keyExtractor = (item,index)=>index.toString()

    renderItem = ({item,i})=>{
        return(
            <ListItem
            key = {i}
            title = {item.book_name}
            subtitle = {"requested by : "+item.requested_by+"\nStatus: "+item.request_status}
            leftElement = {<Icon name = "book" type = "font-awesome" color = '#696969'/>}
            titleStyle = {{color:'black',fontWeight:'bold'}}
            rightElement = {
                <TouchableOpacity style = {styles.button}>
                    <Text style = {{color:'#ffff'}}>send book</Text>
                </TouchableOpacity>
            }
            bottomDivider />
        )
    }
    componentDidMount(){
        this.getAllDonations()
    }
    componentWillUnmount(){
        this.requestRef()
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "My donations" navigation = {this.props.navigation}/>
                <View style = {{flex:1}}>{
                    this.state.allDonations.length === 0
                    ?(
                        <View style = {styles.subContainer}>
                            <Text style = {{fontSize:20}}>list of all book donations</Text>
                            </View>
                    ):(
                        <FlatList
                        keyExtractor = {this.keyExtractor}
                        data = {this.state.allDonations}
                        renderItem = {this.renderItem}
                        />

                    )
                }

                </View>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    subContainer:{
        flex:1,
        fontSize:20,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
    },
    
})

 

