
const compose = (...fns: any[]) => (x: any) => fns.reduceRight((acc, fn) => fn(acc), x);

export default {
    compose,
};
