import { makeRetryable } from './makeRetryable';

type MyRequestArgs = [string, string];

export class MyWonkyClass {

    private attempts = 0;

    /**
     * In constructor we wrap and reassign `this.doSomethingWonky`
     * into `makeRetryable` function.
     */
    constructor(maxRetries: number, timeout: number) {
        this.doSomethingWonky = makeRetryable<MyRequestArgs, string>(this.doSomethingWonky, {
            maxRetries,
            timeout
        });
    }

    /**
     * This method fails 9 out of 10 times.
     * We use arrow function here (=>) to automatically bind it with `this`.
     */
    public doSomethingWonky = (a: string, b: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setTimeout(
                () => {
                    if (this.attempts >= 10) {
                        return resolve(`${a.toUpperCase()} + ${b.toUpperCase()}`);
                    }
                    this.attempts += 1;
                    return reject(new Error('no answer'));
                },
                1000,
            );
        });
    }
}
