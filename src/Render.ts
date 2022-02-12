import Base from "./Base";
import { inverse, identity, multiply, translation, lookAt } from "./Matrix";
import {Camera} from "./Camera";

class Render extends Base {
    public camera: Camera;
    private a_position: any;
    private a_color: GLint;

    public constructor() {
        super("vertex-shader-2d", "fragment-shader-2d");
    }

    public init() {
        this.a_position = this.getAttribute(this.shaderProgram, "a_position");
        this.a_color    = this.getAttribute(this.shaderProgram, "a_color");

        this.gl.useProgram(this.shaderProgram);

        this.gl.enableVertexAttribArray(this.a_position);
        this.gl.enableVertexAttribArray(this.a_color);

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
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

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const POSITION_BUFFER = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, POSITION_BUFFER);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(buffer), this.gl.STATIC_DRAW);

        const FACES_BUFFER = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, FACES_BUFFER);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), this.gl.STATIC_DRAW);

        this.gl.vertexAttribPointer(this.a_position, 3, this.gl.FLOAT, false, 4 * (3 + 3), 0);
        this.gl.vertexAttribPointer(this.a_color, 3, this.gl.FLOAT, false, 4 * (3 + 3), 3 * 4);

        let view = this.camera.view;

        const cameraTranslation = this.camera.translate;
        const cameraRotation = this.camera.rotation;

        const camera = multiply(cameraRotation, cameraTranslation);

        const firstCubePosition = [0, 0, 2];
        const cameraPosition = [
            camera[12],
            camera[13],
            camera[14],
        ];

        const up = [0, 1, 0];
        const cameraMatrix = lookAt(cameraPosition, firstCubePosition, up);

        view = multiply(view, inverse(cameraMatrix));

        for (let i = 0; i < 5; ++i) {
            const angel = 2 * i * Math.PI / 5;

            const [sx, _, sz] = this.getScaling();

            this.setScaling(sx, (angel + 0.7) / 2, sz);

            let model = identity();

            model = multiply(model, translation(Math.PI / 3.5 * i, (angel + 0.5) / 4, 0));
            model = multiply(model, this.scalingMatrix);

            this.setUniform('u_view', view);
            this.setUniform('u_model', model);

            this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, 0);
        }
    }

    public attachCamera(camera: Camera): void {
        this.camera = camera;
    }
}

export default Render;
