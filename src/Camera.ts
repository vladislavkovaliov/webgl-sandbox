import {identity, multiply, perspective, translation, xRotation, yRotation, zRotation} from "./Matrix";
import {action, computed, makeObservable, observable} from "mobx";

export class Camera {
    public view: number[];
    public rotationX: number;
    public rotationY: number;
    public rotationZ: number;
    public translateX: number;
    public translateY: number;
    public translateZ: number;

    public constructor() {
        makeObservable(this, {
            translateZ: observable,
            setTranslateZ: action,
            rotation: computed,
            translate: computed,
        });

        this.view = identity();

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;
    }

    public perspective = (angel: number, aspect: number, near: number, far: number) => {
        this.view = perspective(angel, aspect, near, far);
    }

    public setTranslateZ = (value: number): void => {
        this.translateZ = value;
    }

    public get translate(): number[] {
        return translation(this.translateX, this.translateY, this.translateZ);
    };

    public get rotation(): number[] {
        let result = identity();

        result = multiply(result, yRotation(this.rotationY));
        result = multiply(result, xRotation(this.rotationX));
        result = multiply(result, zRotation(this.rotationZ));

        return result;
    };
}