import { BulbThings } from '..';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationHistory, NavigationItem } from '../interfaces/navigation';

export class NavigationResource {
    private panels = new Map<string, NavigationHistory>();
    private navEvent = new Subject<NavigationItem>();
    drawer: MatSidenav;
    dialog: MatDialogRef<any>;
    defaultPanel = 'drawer';

    constructor(private bulbthings: BulbThings) {}

    navigateTo(item: NavigationItem, skipHistory = false) {
        if (!item.targetPanelName) {
            item.targetPanelName = this.drawer.opened
                ? 'drawer'
                : this.defaultPanel;
        }

        const panel = this.getPanel(item.targetPanelName);

        if (!skipHistory) {
            panel.position++;
            panel.history[panel.position] = item;
            // discard history after current index
            panel.history.length = panel.position + 1;
        }
        this.navEvent.next(item);
    }

    private getPanel(panelName: string): NavigationHistory {
        if (!this.panels.has(panelName)) {
            this.panels.set(panelName, {
                history: [],
                position: -1,
            });
        }

        return this.panels.get(panelName);
    }
}
