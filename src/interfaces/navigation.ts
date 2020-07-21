import { TemplateRef } from '@angular/core';

export interface NavigationItem {
    name:
        | 'entity-profile'
        | 'attribute-profile'
        | 'tracking-profile'
        | 'table'
        | 'filters'
        | 'events'
        | 'events-feed'
        | 'notifications'
        | 'quick-creation'
        | 'quick-bulk-creation'
        | 'files'
        | 'action-form'
        | 'association-form'
        | 'mobile-app-download'
        | 'import'
        | 'guides'
        | 'null';
    targetPanelName?: string;
    targetPanelClass?: string;
    inputs: any;
    outputs?: {
        [name: string]: (...args: any[]) => any;
    };
    template?: TemplateRef<any>;
    drawerWidth?: string;
}

export interface NavigationHistory {
    history: NavigationItem[];
    position: number;
}
