// Action.ts
import { confirmationModalService } from "@utils/GlobalModal/ConfirmationModalService";

/**
 * Class representing an executable action with an optional confirmation modal.
 */
export class Action {
    /**
     * Function to execute when the action is confirmed.
     * @type {() => void}
     */
    handler: () => void;
    /**
     * Configuration for the confirmation modal.
     * @type {{
     *   title: string,
     *   message: string,
     *   color: "primary" | "danger" | "success" | "warning",
     *   actionButton?: string,
     *   cancelButton?: string
     * } | null}
     */
    _confirm: {
        title: string;
        message: string;
        color: "primary" | "danger" | "success" | "warning";
        actionButton?: string;
        cancelButton?: string;
    } | null;

    /**
     * Creates a new instance of Action.
     * @param {() => void} handler - The function to execute when the action is triggered.
     */
    constructor(handler: () => void) {
        this.handler = handler;
        this._confirm = null;
    }

    /**
     * Static method to create an Action instance.
     * @param {() => void} handler - The function to execute when the action is triggered.
     * @returns {Action} A new instance of Action.
     */
    static create(handler: () => void) {
        return new Action(handler);
    }

    /**
     * Configures a confirmation modal for the action.
     * @param {string} title - The title of the modal.
     * @param {string} message - The message displayed in the modal.
     * @param {"primary" | "danger" | "success" | "warning"} color - The theme color of the modal.
     * @param {string} [actionButton] - Text for the action button.
     * @param {string} [cancelButton] - Text for the cancel button.
     * @returns {Action} The current instance for chaining.
     */
    confirm(
        title: string,
        message: string,
        color: "primary" | "danger" | "success" | "warning",
        actionButton?: string,
        cancelButton?: string,
    ): Action {
        this._confirm = { title, message, color, actionButton, cancelButton };
        return this;
    }

    /**
     * Builds and returns a function that, when executed, displays the confirmation modal
     * if configured, or directly executes the handler function.
     * @returns {() => void} A function that performs the action.
     */
    build(): () => void {
        return () => {
            if (this._confirm) {
                confirmationModalService.openModal({
                    ...this._confirm,
                    onConfirm: this.handler,
                });
            } else {
                this.handler();
            }
        };
    }
}
