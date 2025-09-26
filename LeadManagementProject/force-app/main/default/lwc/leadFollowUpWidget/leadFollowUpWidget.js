import { LightningElement, api, wire } from 'lwc';
import createFollowUpTask from '@salesforce/apex/LeadController.createFollowUpTask';
import getFollowUpTasks from '@salesforce/apex/LeadController.getFollowUpTasks';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Due Date', fieldName: 'ActivityDate', type: 'date' }
];

export default class LeadFollowUpWidget extends LightningElement {
    @api recordId;
    columns = columns;

    @wire(getFollowUpTasks, { leadId: '$recordId' })
    tasks;

    handleCreateTask() {
        createFollowUpTask({ leadId: this.recordId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Follow-up task created',
                        variant: 'success'
                    })
                );
                return refreshApex(this.tasks);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating task',
                        message: error.body ? error.body.message : error.message,
                        variant: 'error'
                    })
                );
            });
    }
}
