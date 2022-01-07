var mat4 = require("gl-matrix").mat4;
var Engine = /** @class */ (function () {
    function Engine() {
        this.isInitialized = false;
        this.canvas = null;
        this.gl = null;
    }
    Engine.prototype.init = function (id) {
        if (id === void 0) { id = 'canvas'; }
        this.canvas = document.querySelector("#".concat(id));
        if (this.canvas) {
            this.isInitialized = true;
            this.gl = this.canvas.getContext('webgl');
            this.program = this.createProgram("vertex-shader-2d", "fragment-shader-2d");
            this.positionAttributeLocation = this.createAttribute(this.program, "a_position");
            this.colorAttribute = this.createAttribute(this.program, "a_color");
            this.projectionMatrix = this.createUniformLocation(this.program, 'u_pMatrix');
            this.viewMatrix = this.createUniformLocation(this.program, 'u_vMatrix');
            this.modelMatrix = this.createUniformLocation(this.program, 'u_mMatrix');
            this.vertex = [
                -0.5, -0.5,
                0.9, 0.1, 0.1,
                -0.5, 0.5,
                0.9, 0.1, 0.1,
                0.5, 0.5,
                0.1, 0.9, 0.0,
                0.5, -0.5,
                0.0, 0.0, 0.9,
            ];
        }
    };
    Engine.prototype.createShader = function (type, src) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);
        var ok = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (ok) {
            return shader;
        }
        this.gl.deleteShader(shader);
    };
    Engine.prototype.createProgram = function (vertexId, fragmentId) {
        var vertexShaderSource = document.querySelector("#".concat(vertexId)).text;
        var fragmentShaderSource = document.querySelector("#".concat(fragmentId)).text;
        var vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (vertexShader && fragmentShader) {
            var program = this.gl.createProgram();
            this.gl.attachShader(program, vertexShader);
            this.gl.attachShader(program, fragmentShader);
            this.gl.linkProgram(program);
            var ok = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
            if (ok) {
                return program;
            }
            this.gl.deleteProgram(program);
            return undefined;
        }
    };
    Engine.prototype.createAttribute = function (program, attributeId) {
        return this.gl.getAttribLocation(program, attributeId);
    };
    Engine.prototype.createUniformLocation = function (program, uniformId) {
        return this.gl.getUniformLocation(program, uniformId);
    };
    Engine.prototype.resizeCanvasToDisplaySize = function (multiplier) {
        if (multiplier === void 0) { multiplier = 1; }
        var width = this.gl.canvas.clientWidth * multiplier | 0;
        var height = this.gl.canvas.clientHeight * multiplier | 0;
        if (this.gl.canvas.width !== width || this.gl.canvas.height !== height) {
            this.gl.canvas.width = width;
            this.gl.canvas.height = height;
        }
    };
    Engine.prototype.render = function () {
        var _this = this;
        this.resizeCanvasToDisplaySize();
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.enableVertexAttribArray(this.colorAttribute);
        // Draw triangles
        var vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertex), this.gl.STATIC_DRAW);
        // Draw faces
        var faces = [0, 1, 2, 0, 2, 3];
        var facesBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), this.gl.STATIC_DRAW);
        var projection = mat4.create();
        console.log(projection);
        var model = mat4.create();
        var view = mat4.create();
        mat4.perspective(projection, Math.PI / 4, 1, 1, 100);
        var animate = function (time) {
            mat4.identity(view);
            mat4.identity(model);
            mat4.translate(view, view, [0.0, 0.0, -10.0]);
            mat4.rotateZ(model, model, 0.0005 * time * 2);
            mat4.rotateY(model, model, 0.0005 * time * 2);
            mat4.lookAt(view, [10.0, 10.0, 10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
            // Clear
            _this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
            _this.gl.clear(_this.gl.COLOR_BUFFER_BIT);
            _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, vertexBuffer);
            _this.gl.uniformMatrix4fv(_this.projectionMatrix, false, projection);
            _this.gl.uniformMatrix4fv(_this.modelMatrix, false, model);
            _this.gl.uniformMatrix4fv(_this.viewMatrix, false, view);
            _this.gl.vertexAttribPointer(_this.positionAttributeLocation, 2, _this.gl.FLOAT, false, 4 * (2 + 3), 0);
            _this.gl.vertexAttribPointer(_this.colorAttribute, 3, _this.gl.FLOAT, false, 4 * (2 + 3), 2 * 4);
            _this.gl.bindBuffer(_this.gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
            _this.gl.drawElements(_this.gl.TRIANGLES, 6, _this.gl.UNSIGNED_SHORT, 0);
            _this.gl.flush();
            // window.requestAnimationFrame(animate);
        };
        animate(0);
    };
    return Engine;
}());
var Watch = /** @class */ (function () {
    function Watch(engine) {
        var _this = this;
        this.engine = null;
        this.init = function () {
            if (_this.engine) {
                _this.engine.init();
                _this.engine.render();
            }
        };
        this.engine = engine;
    }
    return Watch;
}());
function main() {
    var engine = new Engine();
    var watch = new Watch(engine);
    watch.init();
}
main();
