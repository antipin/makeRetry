type RetryTimeoutFn = (retryAttempt: number) => number;

type RetryOptions = {
    maxRetries?: number;
    timeout?: number;
    retryTimeout?: number | RetryTimeoutFn;
    isRetryableError?: (error: unknown) => boolean;
}

type RetryableFn<Args extends Array<unknown>, Res> = (...args: Args) => Promise<Res>

export function makeRetryable<Args extends Array<unknown>, Res>(fn: RetryableFn<Args, Res>, retryOptions: RetryOptions) {
    const {
        maxRetries = 3,
        timeout = 10_000,
        retryTimeout = 0,
        isRetryableError = () => true,
    } = retryOptions;
    return function (...args: Args): Promise<Res> {
        return new Promise((resolve, reject) => {

            let lastError: unknown;

            let isTimeoutExpired = false;
            const timeoutCountdown = setTimeout(() => { isTimeoutExpired = true; }, timeout);

            let retriesCount = 0;
            
            async function retryFn(...args: Args) {
                retriesCount += 1;
                if (isTimeoutExpired === true) {
                    clearTimeout(timeoutCountdown);
                    console.log('Max amount of retires has exceeded');
                    return reject(new Error('Retry timeout'));
                }
                if (retriesCount > maxRetries) {
                    clearTimeout(timeoutCountdown);
                    console.log('Retry timeout has expired');
                    return reject(lastError);
                }
                try {
                    const res = await fn(...args)
                    console.log(`retry #${retriesCount} succeeded`);
                    clearTimeout(timeoutCountdown);
                    return resolve(res);
                } catch(err) {
                    console.log(`retry #${retriesCount} returned error:`, err);
                    lastError = err;
                    // Checking if the given error requires a retry
                    if (isRetryableError(err)) {
                        // Calculating retry timeout
                        let waitForBeforeRetry = 0;
                        if (typeof retryTimeout === 'function') {
                            waitForBeforeRetry = retryTimeout(retriesCount);
                        } else {
                            waitForBeforeRetry = retryTimeout;
                        }
                        console.log(`waiting for ${waitForBeforeRetry}ms before retry`);
                        setTimeout(() => retryFn(...args), waitForBeforeRetry);
                    } else {
                        console.log(`wrapped function returned non-retryable error`, lastError);
                        return reject(lastError);
                    }
                }
            }
            return retryFn(...args);
        });
    }
}
