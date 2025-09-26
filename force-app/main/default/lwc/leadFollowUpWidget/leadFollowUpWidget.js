import { LightningElement, api, wire } from 'lwc';
import createFollowUpTask from '@salesforce/apex/LeadController.createFollowUpTask';
import getFollowUpTasks from '@salesforce/apex/LeadController.getFollowUpTasks';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Due Date', fieldName: 'ActivityDate', type: 'date' }
];

export default class LeadFollowUpWidget extends LightningElement {
    @api recordId;
    columns = columns;

    wiredTasksResult; // <-- store the full wired result
    tasks; 
    error;

    @wire(getFollowUpTasks, { leadId: '$recordId' })
    wiredTasks(result) {
        this.wiredTasksResult = result; // store the result for refreshApex
        if (result.data) {
            this.tasks = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.tasks = undefined;
        }
    }

    handleCreateTask() {
        createFollowUpTask({ leadId: this.recordId })
            .then(() => {
                // Success toast
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Follow-up task created',
                        variant: 'Success'
                    })
                );

                // Refresh the wired data
                if (this.wiredTasksResult) {
                    return refreshApex(this.wiredTasksResult);
                }
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating task',
                        message: error.body?.message || error.message,
                        variant: 'error'
                    })
                );
            });
    }
}