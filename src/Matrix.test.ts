
import {identity} from './Matrix';

describe("identity()", () => {
    it('should return correct matrix', () => {
        expect(identity()).toEqual([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    });
});