import {
    bitable,
    FieldType,
    Selection,
    ToastType,
} from '@lark-base-open/js-sdk';
import { from, tap } from 'rxjs';

type Task = {
    tableId: string;
    recordId: string;
    fieldId: string;
}

type TaskStatus = 'pending' | 'downloading' | 'downloaded' | 'processing' | 'failed'


const createTasks = (tasks: Task[], updateStatus: (task: Task, status: TaskStatus) => void) => {
    from(tasks).pipe(
        tap(task => updateStatus(task, 'pending')),

    )
}