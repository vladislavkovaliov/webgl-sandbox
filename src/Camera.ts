import { toRadian } from "./utils";

class Camera  {
    private rotationX: number = 0;
    private rotationY: number = 0;
    private rotationZ: number = 0;

    public setRotationX(value: number): void {
        this.rotationX = value;
    }

    public setRotationY(value: number): void {
        this.rotationY = value;
    }

    public setRotationZ(value: number): void {
        this.rotationZ = value;
    }

    protected perspective(angel: number, aspect: number, near: number, far: number): number[] {
        const fieldOfView = Math.tan(toRadian(angel) * 0.5);

        return [
            1 / fieldOfView / aspect, 0, 0, 0,
            0, 1 / fieldOfView, 0, 0,
            0, 0, (far + near) / (near - far), -1,
            0, 0, 2 * near * far / (near - far), 0,
        ];
    }
}

export default Camera;
