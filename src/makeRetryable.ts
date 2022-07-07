// Generic part

type RetryableFn<Args extends Array<unknown>, Res> = (...args: Args) => Promise<Res>

type RetryOptions = {
    maxRetries?: number;
    timeout?: number;
}

export function makeRetryable<Args extends Array<unknown>, Res>(fn: RetryableFn<Args, Res>, retryOptions: RetryOptions) {
    const { maxRetries = 3, timeout = 10_000 } = retryOptions;
    return function (...args: Args): Promise<Res> {
        return new Promise((resolve, reject) => {

            let lastError: unknown;

            let isTimeoutExpired = false;
            const timeoutCountdown = setTimeout(() => { isTimeoutExpired = true; }, timeout);

            let retriesCount = 0
            
            async function retryFn(...args: Args) {
                retriesCount += 1;
                if (isTimeoutExpired === true) {
                    clearTimeout(timeoutCountdown);
                    console.log('Max amount of retires has exceeded');
                    return reject(lastError);
                }
                if (retriesCount > maxRetries) {
                    clearTimeout(timeoutCountdown);
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
                    retryFn(...args);
                }
            }
            return retryFn(...args);
        });
    }
}
