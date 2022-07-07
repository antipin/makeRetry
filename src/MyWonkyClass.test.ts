import { MyWonkyClass } from './MyWonkyClass';

(async () => {
    console.log('Usage examples:');

    console.log('\n\n\n');
    console.log('Failing by timeout');
    console.log('==================');
    const myWonkyClassThatFailsByTimeout = new MyWonkyClass(10, 5_000);
    try {
        const result = await myWonkyClassThatFailsByTimeout.doSomethingWonky('foo', 'bar');
        console.log(`    RESULT: ${result}`);
    } catch (err) {
        console.log(err);
    }
    console.log('Process is still alive!');

    console.log('\n\n\n');
    console.log('Failing by max retries');
    console.log('======================');
    
    const myWonkyClassThatFailsByMaxRetries = new MyWonkyClass(3, 5_000);
    try {
        const result = await myWonkyClassThatFailsByMaxRetries.doSomethingWonky('foo', 'bar');
        console.log(`    RESULT: ${result}`);
    } catch (err) {
        console.log(err);
    }
    console.log('Process is still alive!');

    console.log('\n\n\n');
    console.log('Not failing at all');
    console.log('==================');
    const myWonkyClassThatWorks = new MyWonkyClass(10, 15_000);
    try {
        const result = await myWonkyClassThatWorks.doSomethingWonky('foo', 'bar');
        console.log(`    RESULT: ${result}`);
    } catch (err) {
        console.log(err);
    }
    console.log('Process is still alive!');

    console.log('Byeee!');
})();
