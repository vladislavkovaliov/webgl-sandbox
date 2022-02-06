import Base from "./Base";
import Camera from "./Camera";

class Render extends Base {
    public sen = 0.2;
    public camera: {
        rotationX: number,
        rotationY: number,
        rotationZ: number,
        translateX: number,
        translateY: number,
        translateZ: number,
    } = {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
    };
    private cameraType: "perspective" | "ortho" = "ortho";
    private a_position: any;
    private a_color: GLint;
    private u_matrix: WebGLUniformLocation;
    private u_model: WebGLUniformLocation;

    public constructor() {
        super("vertex-shader-2d", "fragment-shader-2d");
    }

    public init() {
        this.a_position = this.getAttribute(this.shaderProgram, "a_position");
        this.a_color    = this.getAttribute(this.shaderProgram, "a_color");

        this.u_matrix = this.getUniformLocation(this.shaderProgram, 'u_matrix');
        this.u_model = this.getUniformLocation(this.shaderProgram, 'u_model');
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

        let matrix = this.identity();

        switch (this.cameraType) {
            case "ortho": {
                // TODO: make them passable.
                matrix = this.ortho(-2, 2, -1, 1, -2, 2);
                break;
            }
            case "perspective": {
                const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
                // TODO: make them passable.
                matrix = this.perspective(60, aspect, 1, 200);
                break;
            }
            default: {
                throw Error("CameraType is not defined.");
            }
        }

        let camera = this.identity();

        const cameraTranslation = this.translation(this.camera.translateX, this.camera.translateY, this.camera.translateZ)
        camera = this.multiply(camera, this.yRotation(this.camera.rotationY));
        camera = this.multiply(camera, this.xRotation(this.camera.rotationX));
        camera = this.multiply(camera, this.zRotation(this.camera.rotationZ));
        camera = this.multiply(camera, cameraTranslation);

        const firstCubePosition = [0, 0, 2];
        const cameraPosition = [
            camera[12],
            camera[13],
            camera[14],
        ];

        const up = [0, 1, 0];
        const cameraMatrix = this.lookAt(cameraPosition, firstCubePosition, up);

        matrix = this.multiply(matrix, this.inverse(cameraMatrix));

        for (let i = 0; i < 5; ++i) {
            const angel = 2 * i * Math.PI / 5 ;
            const x = Math.cos(angel) * 2;
            const z = Math.sin(angel) * 2;

            const translateMatrix = this.multiply(this.identity(), this.translation(x, (angel + 0.5) / 4, z));

            let model = this.identity();
            model = this.multiply(model, translateMatrix);
            // model = this.multiply(model, this.translationMatrix);
            // model = this.multiply(model, this.xRotation(this.xDegrees));
            // model = this.multiply(model, this.yRotation(this.yDegrees));
            // model = this.multiply(model, this.zRotation(this.zDegrees));
            // console.log(i, 'x = ', x, 'z = ', z);
            const [sx, _, sz] = this.getScaling();
            this.setScaling(sx, (angel + 0.5) / 2, sz);
            model = this.multiply(model, this.scalingMatrix);

            this.gl.uniformMatrix4fv(this.u_matrix, false, matrix);
            this.gl.uniformMatrix4fv(this.u_model, false, model);

            this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, 0);
        }
    }

    public attachCamera(cameraType: "perspective" | "ortho"): void {
        this.setCameraType(cameraType);
    }

    public setCameraType(type: "perspective" | "ortho"): void {
        this.cameraType = type;
    }

    public cameraRotationX(value: number): void {
        this.camera.rotationX = this.camera.rotationX + value;
    }

    public cameraRotationY(value: number): void {
        this.camera.rotationY = this.camera.rotationY + value;
    }

    public cameraRotationZ(value: number): void {
        this.camera.rotationZ = this.camera.rotationZ + value;
    }

    public cameraTranslateX(value: number): void {
        this.camera.translateX = this.camera.translateX + value;
    }

    public cameraTranslateY(value: number): void {
        this.camera.translateY = this.camera.translateY + value;
    }

    public cameraTranslateZ(value: number): void {
        this.camera.translateZ = this.camera.translateZ + value;
    }
}

export default Render;
