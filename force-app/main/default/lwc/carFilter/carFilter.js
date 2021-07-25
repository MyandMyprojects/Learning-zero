import { LightningElement, wire } from 'lwc';
import {getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi'
import CAR_OBJECT from '@salesforce/schema/Car__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
//constants
const CATEGORY_ERROR = "Error loading categories"
const MAKE_TYPE_ERROR = "Error loading make"
// Lightning Message Service and a message channel
import {publish, MessageContext} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFiltered__c'

export default class CarFilter extends LightningElement {
    filters={
        searchKey:'',
        maxPrice:999999
    }
    CATEGORY_ERROR=CATEGORY_ERROR
    MAKE_TYPE_ERROR=MAKE_TYPE_ERROR
    timer
    /**Load context for LMS */
    @wire(MessageContext)
    messageContext

    /***fetching PICKLIST CATEGORY */
    @wire(getObjectInfo, {objectApiName:CAR_OBJECT})
    carObjInfo
    @wire(getPicklistValues, {
        recordTypeId: '$carObjInfo.data.defaultRecordTypeId', 
        fieldApiName: CATEGORY_FIELD
    })
    categories  
    /***fetching PICKLIST MAKE */
    @wire(getPicklistValues, {
        recordTypeId: '$carObjInfo.data.defaultRecordTypeId', 
        fieldApiName: MAKE_FIELD
    })
    makeType

    handleSearch(event){
        //console.log('event.target.value', event.target.value)
        this.filters = {...this.filters, "searchKey":event.target.value}
        this.sendDataToCarList()
    }

    handleMaxPriceChange(event){
        console.log('event.target.value', event.target.value)
        this.filters = {...this.filters, "maxPrice":event.target.value}
        this.sendDataToCarList()
    }
    handleCheckbox(event){
        if(!this.filters.categories){
            const categories = this.categories.data.values.map(item=>item.value)
            //console.log('categories', item)
            const makeType = this.makeType.data.values.map(item=>item.value)
            //console.log('makeType', item.value)
            this.filters = {...this.filters, categories:categories, makeType:makeType}
        }
        const {name, value} = event.target.dataset
        //console.log('name', name)
        //console.log('value', value)
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
        }else{
            this.filters[name] = this.filters[name].filter(item=>item !== value)
        }
        this.sendDataToCarList()
    }
    /**pass data from LMS, where filters come from LMS.xml and other filters is in our object*/
    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext, CARS_FILTERED_MESSAGE, {
            filters:this.filters
            })
        }, 400)
    }
}