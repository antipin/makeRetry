import { makeRetryable } from './makeRetryable';

export class RetryableError extends Error {};

export class MyWonkyClass {

    private attempts = 1;

    /**
     * In constructor we wrap and reassign `this.doSomethingWonky`
     * into `makeRetryable` function.
     */
    constructor(maxRetries: number, timeout: number) {
        this.doSomethingWonky = makeRetryable<[string, string], string>(this.doSomethingWonky, {
            maxRetries,
            timeout,
            retryTimeout: (retryAttempt) => retryAttempt * 100,
            isRetryableError: error => error instanceof RetryableError,
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
                    return reject(new RetryableError('no answer'));
                },
                100,
            );
        });
    }

    /**
     * This method throws an error that is not supposed to be retried
     */
    public doSomethingNonRetryable = (_a: string, _b: string): Promise<string> => {
        return new Promise((_resolve, reject) => {
            setTimeout(
                () => reject(new Error('non retryable error')),
                1000,
            );
        });
    }
}
