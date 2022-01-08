

class Base {
    protected gl: any;
    protected canvas: HTMLCanvasElement;
    protected shaderProgram: WebGLProgram;
    protected scalingMatrix: number[];
    protected translationMatrix: number[];
    protected xDegrees: number;
    protected yDegrees: number;
    protected zDegrees: number;

    protected static toRadian = (degrees: number): number => degrees * Math.PI / 180;

    protected static toDegrees = (rad: number): number => rad * 180 / Math.PI;

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

    public setTransition(tx: number = 0, ty: number = 0, tz: number = 0): void {
        this.translationMatrix = this.multiply(this.identity(), this.translation(tx, ty, tz));
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

    protected _render(): void {
        this.resizeCanvasToDisplaySize();
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.useProgram(this.shaderProgram);
    }

    protected multiply(a: number[], b: number[]): number[] {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        const b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
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
        const c = Math.cos(Base.toRadian(degrees));
        const s = Math.sin(Base.toRadian(degrees));

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    }

    protected yRotation(degrees: number): number[] {
        const c = Math.cos(Base.toRadian(degrees));
        const s = Math.sin(Base.toRadian(degrees));

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    }

    protected zRotation(degrees: number): number[] {
        const c = Math.cos(Base.toRadian(degrees));
        const s = Math.sin(Base.toRadian(degrees));

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    protected ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): number[] {
        // return [
        //     2 / (right - left), 0, 0, 0,
        //     0, 2 / (top - bottom), 0, 0,
        //     0, 0, 2 / (near - far), 0,
        //
        //     (left + right) / (left - right),
        //     (bottom + top) / (bottom - top),
        //     (near + far) / (near - far),
        //     1,
        // ];

        return [
            (top - bottom) / (right - left), 0, 0, 0,
            0, 1 , 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    protected perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number): number[] {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        const rangeInv = 1.0 / (near - far);

        // return [
        //     f / aspect, 0, 0, 0,
        //     0, f, 0, 0,
        //     0, 0, (near + far) * rangeInv, -1,
        //     0, 0, near * far * rangeInv * 2, 0
        // ];

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0,
        ];
    }
}

export default Base;
