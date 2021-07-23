/**
 * jest
 * */
import axios from "axios";

class Utils {
    max = 0;
    min = 0;
    count = 0;
    init(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
    reset() {
        this.min = 0;
        this.max = 0;
    }
    sum(a: number, b: number) {
        const sum = a + b;
        return Math.min(Math.max(sum, this.min), this.max);
    }
    minus(a: number, b: number) {
        const minus = a - b;
        return Math.min(Math.max(minus, this.min), this.max);
    }
    log(title: string) {
        this.count += 1;
        // eslint-disable-next-line no-console
        console.log(`【${this.count}】${title}`, this.min, this.max);
    }
    useCallbackFn(callback: () => any) {
        [this.min, this.max].forEach(callback);
    }
    getData() {
        return axios.get('/data');
    }
}

export default Utils;