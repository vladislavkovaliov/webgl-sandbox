import { identity, multiply, scaling, translation } from "./Matrix";

class Base {
    protected gl: any;
    protected canvas: HTMLCanvasElement;
    protected shaderProgram: WebGLProgram;
    protected scalingMatrix: number[];
    protected translationMatrix: number[];
    protected xDegrees: number;
    protected yDegrees: number;
    protected zDegrees: number;
    protected uniforms: Map<string, WebGLUniformLocation>;

    protected constructor(vertex: string, fragment: string) {
        this.canvas = document.querySelector("#canvas") as HTMLCanvasElement;
        this.gl = this.canvas.getContext('webgl');
        this.shaderProgram = this.createProgram(vertex, fragment);

        this.setScaling();
        this.setTransition();
        this.setXDegrees();
        this.setYDegrees();
        this.setZDegrees();

        this.uniforms = new Map<string, number>();

        this.initUniforms();
    }

    private initUniforms(): void {
        const count: number = this.gl.getProgramParameter(this.shaderProgram, this.gl.ACTIVE_UNIFORMS);

        for(let i = 0; i < count; i++) {
            const info = this.gl.getActiveUniform(this.shaderProgram, i);
            const location = this.getUniformLocation(this.shaderProgram, info.name);

            this.uniforms.set(info.name, location);
        }
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
            this.scalingMatrix = multiply(identity(), scaling(arguments[0], arguments[0], arguments[0]));
            return;
        }

        this.scalingMatrix = multiply(identity(), scaling(sx, sy, sz));
    }

    public getScaling(): number[] {
        return [this.scalingMatrix[0], this.scalingMatrix[5], this.scalingMatrix[10], this.scalingMatrix[15]];
    }

    public setTransition(tx: number = 0, ty: number = 0, tz: number = 0): void {
        this.translationMatrix = multiply(identity(), translation(tx, ty, tz));
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
    }

    protected setUniform(name: string, value: any): void {
        if (this.uniforms.has(name) === false) {
            return;
        }

        const location = this.uniforms.get(name);

        this.gl.uniformMatrix4fv(location, false, value);
    }
}

export default Base;
