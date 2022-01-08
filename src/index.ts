import Base from "./Base";

class Render extends Base {
    private a_position: any;
    private a_color: GLint;
    private u_matrix: WebGLUniformLocation;

    public constructor() {
        super("vertex-shader-2d", "fragment-shader-2d");
        console.log(this.gl.canvas.clientHeight, this.gl.canvas.width, 1580 / 3008 );
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
    public render(buffer: number[], faces: number[], count: number) {
        super._render();

        this.gl.enableVertexAttribArray(this.a_position);
        this.gl.enableVertexAttribArray(this.a_color);

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);

        const POSITION_BUFFER = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, POSITION_BUFFER);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(buffer), this.gl.STATIC_DRAW);

        const FACES_BUFFER = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, FACES_BUFFER);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), this.gl.STATIC_DRAW);

        let matrix = this.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight, 400);

        matrix = this.multiply(matrix, this.translationMatrix);
        matrix = this.multiply(matrix, this.xRotation(this.xDegrees));
        matrix = this.multiply(matrix, this.yRotation(this.yDegrees));
        matrix = this.multiply(matrix, this.zRotation(this.zDegrees));
        matrix = this.multiply(matrix, this.scalingMatrix);

        this.gl.uniformMatrix4fv(this.u_matrix, false, matrix);

        this.gl.vertexAttribPointer(this.a_position, 3, this.gl.FLOAT, false, 4 * (3 + 3), 0);
        this.gl.vertexAttribPointer(this.a_color, 3, this.gl.FLOAT, false, 4 * (3 + 3), 3 * 4);
        this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, 0);
    }
}


function main(): void {
    const cube = new Render();
    // const cube2 = new Render();

    cube.init();
    cube.setScaling();
    cube.setTransition();
    // cube2.render([
    //     -0.5, -0.5, 0,    1, 0, 0.5,
    //     -0.5,  0.5, 0,    0.1, 0.5, 0.5,
    //     0.5,  0.5, 0.0,    0.5, 0.8, 0.5,
    //     0.5, -0.5, 0.0,    0.9, 0.2, 0.5,
    // ], [2, 1, 0, 3, 2, 0], 6);

    const animate = (time: number) => {

        // cube.setXDegrees(0.05 * time * 0.5);
        cube.setYDegrees(0.09 * time * 0.7);
        cube.setZDegrees(0.08 * time * 0.6);

        cube.render([
            -0.5, -0.5,  0.5,    1.0, 0.0, 0.5, // 0
            -0.5,  0.5,  0.5,    1.0, 0.0, 0.5, // 1
            0.5,  0.5,  0.5,    1.0, 0.0, 0.5, // 2
            0.5, -0.5,  0.5,    1.0, 0.0, 0.5, // 3

            0.5,  0.5,  0.5,    0.0, 0.5, 1.0, // 4
            0.5,  0.5, -0.5,    0.0, 0.5, 1.0, // 5
            -0.5,  0.5,  0.5,    0.0, 0.5, 1.0, // 6
            -0.5,  0.5, -0.5,    0.0, 0.5, 1.0, // 7

            0.5,  0.5,  0.5,    0.5, 1.0, 0.0, // 8
            0.5, -0.5,  0.5,    0.5, 1.0, 0.0, // 9
            0.5,  0.5, -0.5,    0.5, 1.0, 0.0, // 10
            0.5, -0.5, -0.5,    0.5, 1.0, 0.0, // 11

            -0.5,  0.5,  0.5,    0.5, 0.0, 1.0, // 12
            -0.5, -0.5,  0.5,    0.5, 0.0, 1.0, // 13
            -0.5,  0.5, -0.5,    0.5, 0.0, 1.0, // 14
            -0.5, -0.5, -0.5,    0.5, 0.0, 1.0, // 15

            -0.5, -0.5,  0.5,    0.8, 0.3, 0.6, // 16
            -0.5, -0.5, -0.5,    0.8, 0.3, 0.6, // 17
            0.5, -0.5,  0.5,    0.8, 0.5, 0.6, // 18
            0.5, -0.5, -0.5,    0.8, 0.3, 0.6, // 19

            -0.5, -0.5, -0.5,    0.3, 0.8, 0.5, // 20
            -0.5,  0.5, -0.5,    0.3, 0.8, 0.5, // 21
            0.5, -0.5, -0.5,    0.3, 0.8, 0.5, // 22
            0.5,  0.5, -0.5,    0.3, 0.8, 0.5, // 23
        ], [
            // front - red
            2, 1, 0,
            3, 2, 0,

            // top - blue
            4, 5, 6,
            5, 7, 6,

            // left - green
            10, 8, 9,
            10, 9, 11,

            // right - purple
            15, 13, 12,
            12, 14, 15,

            // bottom - brown
            18, 16, 17,
            19, 18, 17,

            // back
            23, 22, 21,
            22, 20, 21,
        ], 36);

        window.requestAnimationFrame(animate);
    }

    animate(0);
}

main();
