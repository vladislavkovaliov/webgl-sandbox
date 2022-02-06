import {object} from "./model";
import Render from "./Render";

export const compose = (...fns: any[]) => (x: any) => fns.reduceRight((acc, fn) => fn(acc), x);

export const makeControl = (cube: Render) => (event: KeyboardEvent) => {
    const key: string = event.key.toLowerCase();
    const shiftHold: boolean = event.shiftKey;
    const [x, y, z, w]: number[] = cube.getTranslation();
    const [sX, sY, sZ]: number[] = cube.getScaling();

    if (shiftHold) {
        if (key === "+") {
            cube.setScaling(sX + 0.01, sY + 0.01, sZ + 0.01);
        }

        if (key === "_") {
            cube.setScaling(sX - 0.01, sY - 0.01, sZ - 0.01);
        }
    }

    if (key === "w") {
        if (shiftHold) {
            cube.setXDegrees(cube.getXDegrees() - 4);
        } else {
            cube.setTransition(x, y + 0.2, z);
        }
    }

    if (key === "s") {
        if (shiftHold) {
            cube.setXDegrees(cube.getXDegrees() + 4);
        } else {
            cube.setTransition(x, y - 0.2, z);
        }
    }

    if (key === "a") {
        if (shiftHold) {
            cube.setYDegrees(cube.getYDegrees() - 4);
        } else {
            cube.setTransition(x - 0.2, y, z);
        }
    }
    if (key === "d") {
        if (shiftHold) {
            cube.setYDegrees(cube.getYDegrees() + 4);
        } else {
            cube.setTransition(x +  0.2 , y, z);
        }
    }

    if (key === "e") {
        if (shiftHold) {
            cube.setZDegrees(cube.getZDegrees() - 4);
        } else {
            cube.setTransition(x, y, z + 0.2);
        }
    }

    if (key === "q") {
        if (shiftHold) {
            cube.setZDegrees(cube.getZDegrees() + 4);
        } else {
            cube.setTransition(x, y, z - 0.2);
        }
    }

    cube.render(object.cube.buffer, object.cube.faces, object.cube.faces.length);
};

export const  toRadian = (degrees: number): number => degrees * Math.PI / 180;

export const  toDegrees = (rad: number): number => rad * 180 / Math.PI;

