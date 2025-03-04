// Action.ts
import { confirmationModalService } from "@utils/GlobalModal/ConfirmationModalService";

export class Action {
    handler: () => void;
    _confirm: {
        title: string;
        message: string;
        actionButton?: string;
        cancelButton?: string;
    } | null;

    constructor(handler: () => void) {
        this.handler = handler;
        this._confirm = null;
    }

    static create(handler: () => void) {
        return new Action(handler);
    }

    confirm(
        title: string,
        message: string,
        actionButton?: string,
        cancelButton?: string,
    ) {
        this._confirm = { title, message, actionButton, cancelButton };
        return this;
    }

    build(): () => void {
        return () => {
            if (this._confirm) {
                confirmationModalService.openModal({
                    ...this._confirm,
                    onConfirm: this.handler,
                    onCancel: () => {
                        console.log("Action annulée");
                    },
                });
            } else {
                this.handler();
            }
        };
    }
}
