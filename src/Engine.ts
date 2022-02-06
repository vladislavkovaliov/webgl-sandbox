
export class Engine {
    private handlers: Map<string, number>;

    public constructor() {
        this.handlers = new Map<string, number>();
    }

    public registerHandler = (name: string, fn: () => number): void => {
        try {
            if (name === null || name === "") {
                throw new Error("Provide proper name for function.");
            }

            const id = fn();

            this.handlers.set(name, id);
        } catch (ex) {
            alert(ex.message);
            console.trace(ex);
            this.disposeAll();
        }
    }

    public disposeAll = (): void => {
        this.handlers.forEach(this.removeHandler);
    }

    public removeHandler = (value: number, key: string): void => {
        const id = this.handlers.get(key);

        window.cancelAnimationFrame(id);
    }
}