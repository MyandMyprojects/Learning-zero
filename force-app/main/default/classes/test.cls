/**
 * Created by mzeleniuk on 13.04.2023.
 */

public with sharing class OpportunityDataAccess {
    public List<Opportunity> getOppsForGivenIds(Set<Id> oppsIds){
        if(oppsIds.isEmpty()){
            System.debug('oppsIds ::: ' + oppsIds);
            return [SELECT Id, Name FROM Opportunity WHERE Id IN :oppsIds];
        }
        else {
            return new List<Opportunity>();
        }
    }
}
