import { CoreEventType } from '../types/core-event-type';

export interface CoreEvent {
    id: string;
    type: CoreEventType;
    data: {
        keyId?: string;
        resource: any;
        previousData?: any;
    };
}
