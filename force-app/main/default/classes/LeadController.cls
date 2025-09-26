public with sharing class LeadController {
    @AuraEnabled
    public static void createFollowUpTask(Id leadId) {
        Task t = new Task(
            WhoId = leadId,
            Subject = 'Follow up with qualified Lead',
            Status = 'Not Started',
            Priority = 'Normal',
            ActivityDate = Date.today().addDays(3)
        );
        insert t;
    }

    @AuraEnabled(cacheable=true)
    public static List<Task> getFollowUpTasks(Id leadId) {
        return [SELECT Id, Subject, Status, ActivityDate 
                FROM Task 
                WHERE WhoId = :leadId AND Status != 'Completed'
                ORDER BY ActivityDate ASC];
    }
}
