import { toRadian } from "./utils";

class Base {
    protected gl: any;
    protected canvas: HTMLCanvasElement;
    protected shaderProgram: WebGLProgram;
    protected scalingMatrix: number[];
    protected translationMatrix: number[];
    protected xDegrees: number;
    protected yDegrees: number;
    protected zDegrees: number;

    protected constructor(vertex: string, fragment: string) {
        this.canvas = document.querySelector("#canvas") as HTMLCanvasElement;
        this.gl = this.canvas.getContext('webgl');
        this.shaderProgram = this.createProgram(vertex, fragment);

        this.setScaling();
        this.setTransition();
        this.setXDegrees();
        this.setYDegrees();
        this.setZDegrees();
    }

    public createProgram(
        vertexId: string,
        fragmentId: string): WebGLProgram {
        const vertexShaderSource
            = (document.querySelector(`#${vertexId}`) as HTMLScriptElement).text;
        const fragmentShaderSource
            = (document.querySelector(`#${fragmentId}`) as HTMLScriptElement).text;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader) {
            throw new Error("Vertex shader is not created.");
        }

        if (!fragmentShader) {
            throw new Error("Fragment shader is not created.");
        }

        const program = this.gl.createProgram()!;

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        this.gl.linkProgram(program);

        const ok = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

        if (ok) {
            return program;
        }

        this.gl.deleteProgram(program);

        throw new Error("Program is not created.")
    }

    public createShader(type: GLenum, src: string): WebGLShader | undefined {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        const ok = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

        if (ok) {
            return shader;
        }

        this.gl.deleteShader(shader);
    }

    public getAttribute(program: WebGLProgram, attributeId: string): GLint {
        return this.gl.getAttribLocation(program, attributeId);
    }

    public getUniformLocation(program: WebGLProgram, uniformId: string): WebGLUniformLocation {
        return this.gl.getUniformLocation(program, uniformId);
    }

    public resizeCanvasToDisplaySize(multiplier: number = 1): void {
        const width  = this.gl.canvas.clientWidth  * multiplier | 0;
        const height = this.gl.canvas.clientHeight * multiplier | 0;

        if (this.gl.canvas.width !== width ||  this.gl.canvas.height !== height) {
            this.gl.canvas.width  = width;
            this.gl.canvas.height = height;
        }
    }

    public setScaling(sx: number = 1, sy: number = 1, sz: number = 1): void {
        if (arguments.length === 1) {
            this.scalingMatrix = this.multiply(this.identity(), this.scaling(arguments[0], arguments[0], arguments[0]));
            return;
        }

        this.scalingMatrix = this.multiply(this.identity(), this.scaling(sx, sy, sz));
    }

    public getScaling(): number[] {
        return [this.scalingMatrix[0], this.scalingMatrix[5], this.scalingMatrix[10], this.scalingMatrix[15]];
    }

    public setTransition(tx: number = 0, ty: number = 0, tz: number = 0): void {
        this.translationMatrix = this.multiply(this.identity(), this.translation(tx, ty, tz));
    }

    public getTranslation(): number[] {
        return this.translationMatrix.slice(12);
    }

    public setXDegrees(degrees: number = 0): void {
        this.xDegrees = degrees;
    }

    public setYDegrees(degrees: number = 0): void {
        this.yDegrees = degrees;
    }

    public setZDegrees(degrees: number = 0): void {
        this.zDegrees = degrees;
    }

    public getXDegrees(): number {
        return this.xDegrees;
    }

    public getYDegrees(): number {
        return this.yDegrees;
    }

    public getZDegrees(): number {
        return this.zDegrees;
    }

    protected _render(): void {
        this.resizeCanvasToDisplaySize();
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.useProgram(this.shaderProgram);
    }

    protected multiply(a: number[], b: number[]): number[] {
        const a00 = a[0 * 4 + 0];
        const a01 = a[0 * 4 + 1];
        const a02 = a[0 * 4 + 2];
        const a03 = a[0 * 4 + 3];
        const a10 = a[1 * 4 + 0];
        const a11 = a[1 * 4 + 1];
        const a12 = a[1 * 4 + 2];
        const a13 = a[1 * 4 + 3];
        const a20 = a[2 * 4 + 0];
        const a21 = a[2 * 4 + 1];
        const a22 = a[2 * 4 + 2];
        const a23 = a[2 * 4 + 3];
        const a30 = a[3 * 4 + 0];
        const a31 = a[3 * 4 + 1];
        const a32 = a[3 * 4 + 2];
        const a33 = a[3 * 4 + 3];
        const b00 = b[0 * 4 + 0];
        const b01 = b[0 * 4 + 1];
        const b02 = b[0 * 4 + 2];
        const b03 = b[0 * 4 + 3];
        const b10 = b[1 * 4 + 0];
        const b11 = b[1 * 4 + 1];
        const b12 = b[1 * 4 + 2];
        const b13 = b[1 * 4 + 3];
        const b20 = b[2 * 4 + 0];
        const b21 = b[2 * 4 + 1];
        const b22 = b[2 * 4 + 2];
        const b23 = b[2 * 4 + 3];
        const b30 = b[3 * 4 + 0];
        const b31 = b[3 * 4 + 1];
        const b32 = b[3 * 4 + 2];
        const b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    }

    protected identity(): number[] {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    protected inverse(m: number[]): number[] {
        const m00 = m[0 * 4 + 0];
        const m01 = m[0 * 4 + 1];
        const m02 = m[0 * 4 + 2];
        const m03 = m[0 * 4 + 3];
        const m10 = m[1 * 4 + 0];
        const m11 = m[1 * 4 + 1];
        const m12 = m[1 * 4 + 2];
        const m13 = m[1 * 4 + 3];
        const m20 = m[2 * 4 + 0];
        const m21 = m[2 * 4 + 1];
        const m22 = m[2 * 4 + 2];
        const m23 = m[2 * 4 + 3];
        const m30 = m[3 * 4 + 0];
        const m31 = m[3 * 4 + 1];
        const m32 = m[3 * 4 + 2];
        const m33 = m[3 * 4 + 3];
        const tmp_0  = m22 * m33;
        const tmp_1  = m32 * m23;
        const tmp_2  = m12 * m33;
        const tmp_3  = m32 * m13;
        const tmp_4  = m12 * m23;
        const tmp_5  = m22 * m13;
        const tmp_6  = m02 * m33;
        const tmp_7  = m32 * m03;
        const tmp_8  = m02 * m23;
        const tmp_9  = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
    }

    protected projection(width: number, height: number, depth: number): number[] {
        return [
            height / width, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    protected translation(tx: number = 1, ty: number = 1, tz: number = 1): number[] {
        return [
            1,   0,  0, 0,
            0,   1,  0, 0,
            0,   0,  1, 0,
            tx, ty, tz, 1,
        ];
    }

    protected scaling(sx: number, sy: number, sz: number): number[] {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0,  0, sz, 0,
            0,  0, 0, 1,
        ];
    }

    protected xRotation(degrees: number): number[] {
        const c = Math.cos(toRadian(degrees));
        const s = Math.sin(toRadian(degrees));

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    }

    protected yRotation(degrees: number): number[] {
        const c = Math.cos(toRadian(degrees));
        const s = Math.sin(toRadian(degrees));

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    }

    protected zRotation(degrees: number): number[] {
        const c = Math.cos(toRadian(degrees));
        const s = Math.sin(toRadian(degrees));

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    protected ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): number[] {
        return [
            2 / (right - left), 0, 0, 0,
            0, 2 / (bottom - top), 0, 0,
            0, 0, 1 / (far - near), 0,

            - (left + right) / (left - right),
            - (bottom + top) / (bottom - top),
            - near / (far - near),
            1,
        ];
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

    protected cross(a: number[], b: number[]): number[] {
        return [a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]];
    }

    protected subtractVectors(a: number[], b: number[]): number[] {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    protected normalize(v: number[]): number[] {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // check there is no divide by zero
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length];
        } else {
            return [0, 0, 0];
        }
    }

    protected lookAt(cameraPosition: number[], target: number[], up: number[]): number[] {
        const zAxis = this.normalize(
            this.subtractVectors(cameraPosition, target));
        const xAxis = this.normalize(this.cross(up, zAxis));
        const yAxis = this.normalize(this.cross(zAxis, xAxis));

        return [
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            cameraPosition[0], cameraPosition[1], cameraPosition[2], 1,
        ];
    }
}

export default Base;
