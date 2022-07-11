## Challenge
 
### Task 1: Extend the application

The task is to extend the current functionality of the backend by
- showing the progress of the task execution
- implementing a task cancellation mechanism.

The new task type is a simple counter which is configured with two input parameters, `x` and `y`.

When the task is executed, counter should start in the background and progress should be monitored.

When counting reaches the time, the task should finish successfully.

The progress of the task should be exposed via the API so that a web client can monitor it.
Canceling a task that is being executed should be possible, in which case the execution should stop.

### Task 2: Periodically clean up the tasks

The API can be used to create tasks, but the user is not required to execute those tasks.
The tasks that are not executed after an extended period (e.g. a week) should be periodically cleaned up (deleted).

### Task 3: Pause task
Users can pause a task, when restarted the counter should continue from its previous progress
