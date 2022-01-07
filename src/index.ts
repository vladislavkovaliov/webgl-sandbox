
const { mat4 } = require("gl-matrix");

class Base {
    protected gl: any;
    protected canvas: HTMLCanvasElement;
    protected shaderProgram: WebGLProgram;
    protected scalingMatrix: number[];
    protected translationMatrix: number[];

    protected constructor(vertex: string, fragment: string) {
        this.canvas = document.querySelector("#canvas") as HTMLCanvasElement;
        this.gl = this.canvas.getContext('webgl');
        this.shaderProgram = this.createProgram(vertex, fragment);

        this.setScaling();
        this.setTransition();
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
        this.scalingMatrix = this.multiply(this.identity(), this.scaling(sx, sy, sz));
    }

    public setTransition(tx: number = 0, ty: number = 0, tz: number = 0): void {
        this.translationMatrix = this.multiply(this.identity(), this.translation(tx, ty, tz));
    }

    protected render(): void {
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
}

class Render extends Base {
    private a_position: any;
    private a_color: GLint;
    private u_matrix: WebGLUniformLocation;

    public constructor() {
        super("vertex-shader-2d", "fragment-shader-2d");
    }

    public init() {
        this.a_position = this.getAttribute(this.shaderProgram, "a_position");
        this.a_color    = this.getAttribute(this.shaderProgram, "a_color");

        this.u_matrix = this.getUniformLocation(this.shaderProgram, 'u_matrix');
    }

    /**
     * buffer = [
     *  x, y, z,  r,g,b, // Point 1
     *  x, y, z,  r,g,b  // Point 2
     *  x, y, z,  r,g,b  // Point 3
     * ]
     * count - points count
     */
    public render2D(buffer: number[], faces: number[], count: number) {
        super.render();

        this.gl.enableVertexAttribArray(this.a_position);
        this.gl.enableVertexAttribArray(this.a_color);

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const POSITION_BUFFER = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, POSITION_BUFFER);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(buffer), this.gl.STATIC_DRAW);

        const FACES_BUFFER = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, FACES_BUFFER);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), this.gl.STATIC_DRAW);

        let matrix = this.identity();

        matrix = this.multiply(matrix, this.scalingMatrix);
        matrix = this.multiply(matrix, this.translationMatrix);

        this.gl.uniformMatrix4fv(this.u_matrix, false, matrix);

        this.gl.vertexAttribPointer(this.a_position, 3, this.gl.FLOAT, false, 4 * (3 + 3), 0);
        this.gl.vertexAttribPointer(this.a_color, 3, this.gl.FLOAT, false, 4 * (3 + 3), 3 * 4);
        this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, 0);
    }

    // public render() {
    //     super.render();
    //
    //     this.gl.enableVertexAttribArray(this.a_position);
    //     this.gl.enableVertexAttribArray(this.a_color);
    //
    //     const TRIANGLE_VERTEX = this.gl.createBuffer();
    //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    //     this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.triangle_vertex), this.gl.STATIC_DRAW);
    //
    //     const TRIANGLE_FACES = this.gl.createBuffer();
    //     this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    //     this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triable_face), this.gl.STATIC_DRAW);
    //
    //     let projection = mat4.create();
    //     let model = mat4.create();
    //     let view = mat4.create();
    //
    //     mat4.perspective(projection, Math.PI / 4, 1, 1, 100);
    //     mat4.identity(view);
    //     mat4.identity(model);
    //
    //     mat4.rotateX(model, model, 0);
    //     mat4.lookAt(view, [0.0, 0.0, 10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    //
    //     let prevTime = 0;
    //
    //     const animate = (time: any) => {
    //         const dt = time - prevTime;
    //
    //         // mat4.rotateX(model, model, 0.0005 * dt * 2);
    //         // mat4.rotateZ(model, model, 0.0005 * dt * 2);
    //         // mat4.rotateY(model, model, 0.0005 * dt * 2);
    //
    //         this.gl.enable(this.gl.DEPTH_TEST);
    //         this.gl.depthFunc(this.gl.LEQUAL);
    //         this.gl.clearDepth(1.0);
    //
    //         // Clear
    //         this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
    //         this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    //
    //         this.gl.uniformMatrix4fv(this.u_pMatrix, false, projection);
    //         this.gl.uniformMatrix4fv(this.u_mMatrix, false, model);
    //         this.gl.uniformMatrix4fv(this.u_vMatrix, false, view);
    //
    //         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    //
    //         this.gl.vertexAttribPointer(this.a_position, 3, this.gl.FLOAT, false, 4 * (3 + 3), 0);
    //         this.gl.vertexAttribPointer(this.a_color, 3, this.gl.FLOAT, false, 4 * (3 + 3), 3 * 4);
    //
    //
    //         this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    //         this.gl.drawElements(this.gl.TRIANGLES, TRIANGLE_FACES.length, this.gl.UNSIGNED_SHORT, 0);
    //         this.gl.flush();
    //
    //         window.requestAnimationFrame(animate)
    //
    //     }
    //
    //     animate(0);
    // }
}


function main(): void {
    const cube = new Render();

    cube.init();
    cube.setScaling();
    cube.setTransition();
    cube.render2D([
        -0.5, -0.5, 0.0,    1, 0, 0.5,
        -0.5,  0.5, 0.0,    1, 0, 0.5,
        0.5,  0.5, 0.0,    1, 0, 0.5,
        0.5, -0.5, 0.0,    1, 0, 0.5,
    ], [0, 1, 2, 0, 2, 3], 6);
}

main();
