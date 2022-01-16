import Base from "./Base";

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

        this.gl.vertexAttribPointer(this.a_position, 3, this.gl.FLOAT, false, 4 * (3 + 3), 0);
        this.gl.vertexAttribPointer(this.a_color, 3, this.gl.FLOAT, false, 4 * (3 + 3), 3 * 4);

        // let matrix = this.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight, 400);
        // let matrix = this.ortho(-1, 1, -1, 1, -1, 1);
        let matrix = this.perspective(
            45,
            this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
            1,
            3);

        matrix = this.multiply(matrix, this.translationMatrix);
        matrix = this.multiply(matrix, this.xRotation(this.xDegrees));
        matrix = this.multiply(matrix, this.yRotation(this.yDegrees));
        matrix = this.multiply(matrix, this.zRotation(this.zDegrees));
        matrix = this.multiply(matrix, this.scalingMatrix);

        this.gl.uniformMatrix4fv(this.u_matrix, false, matrix);

        this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, 0);
    }
}

export default Render;
