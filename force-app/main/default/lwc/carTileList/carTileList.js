import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/carRecords.getCars'   
// Lightning Message Service and a message channel
import {publish, subscribe, unsubscribe, MessageContext} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFiltered__c'
import CARS_SELECED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'
export default class CarTileList extends LightningElement {
    cars=[]
    error
    filters = {}
    carFilterSubscription
    @wire(getCars, {filters:'$filters'})
    carsHandler({data, error}){
        if(data){
            console.log(data)
            this.cars = data
        }if(error){
            console.error(error)
            this.error = error
        }
    }

    /**Load context for LMS, to pass subscribe immeadiately we need to call connectedcallback*/
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext, CARS_FILTERED_MESSAGE, (message)=>this.handleFilterChanges(message))
    }
    handleFilterChanges(message){
        console.log(message.filters)
        this.filters ={...message.filters}
    }

    handleCarSelected(event){
        console.log("selected car id", event.detail)
        publish(this.messageContext, CARS_SELECED_MESSAGE, {
            carId:event.detail
        })
    }
    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }
}