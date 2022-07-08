import { MyWonkyClass } from './MyWonkyClass';

(async () => {
    console.log('Usage examples:');

    console.log('\n\n\n');
    console.log('Failing by timeout');
    console.log('==================');
    const myWonkyClassThatFailsByTimeout = new MyWonkyClass(10, 300);
    try {
        const result = await myWonkyClassThatFailsByTimeout.doSomethingWonky('foo', 'bar');
        console.log(`    SUCCEEDED`);
        console.log(`        result: ${result}`);
    } catch (err) {
        console.log(`    FAILED`);
        console.log(`        ${err}`);
    }

    console.log('\n\n\n');
    console.log('Failing by max retries');
    console.log('======================');
    
    const myWonkyClassThatFailsByMaxRetries = new MyWonkyClass(3, 50_000);
    try {
        const result = await myWonkyClassThatFailsByMaxRetries.doSomethingWonky('foo', 'bar');
        console.log(`    SUCCEEDED`);
        console.log(`        result: ${result}`);
    } catch (err) {
        console.log(`    FAILED`);
        console.log(`        ${err}`);
    }

    console.log('\n\n\n');
    console.log('Not failing at all');
    console.log('==================');
    const myWonkyClassThatWorks = new MyWonkyClass(10, 100_000);
    try {
        const result = await myWonkyClassThatWorks.doSomethingWonky('foo', 'bar');
        console.log(`    SUCCEEDED`);
        console.log(`        result: ${result}`);
    } catch (err) {
        console.log(`    FAILED`);
        console.log(`        ${err}`);
    }

    console.log('\n\n\n');
    console.log('Throwing non retryable error');
    console.log('============================');
    const myWonkyClassThatThrowsNonRetryableError = new MyWonkyClass(10, 100_000);
    try {
        const result = await myWonkyClassThatThrowsNonRetryableError.doSomethingNonRetryable('foo', 'bar');
        console.log(`    SUCCEEDED`);
        console.log(`        result: ${result}`);
    } catch (err) {
        console.log(`    FAILED`);
        console.log(`        ${err}`);
    }

    console.log('Byeee!');
})();
