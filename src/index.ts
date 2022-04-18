import { object } from "./model";
import Render from "./Render";
import {makeControl} from "./utils";

import { Engine } from "./Engine";
import {Camera} from "./Camera";

const dat = require("dat.gui");

function main(): void {
    const cube = new Render();
    const canvas = document.querySelector("#canvas");
    const camera = new Camera();
    const secondCamera = new Camera();


    camera.perspective(60, canvas.clientWidth / canvas.clientHeight, 1, 200);
    secondCamera.perspective(60, canvas.clientWidth / canvas.clientHeight, 1, 200);

    cube.init();

    cube.attachCamera(camera);
    cube.setScaling(0.8);

    camera.translateX = 0;
    camera.translateY = 0;
    camera.translateZ = 9;

    const gui = new dat.GUI();

    gui.add(camera, 'rotationY').min(-360).max(360);
    gui.add(camera, 'rotationX').min(-360).max(360);
    gui.add(camera, 'rotationZ').min(-360).max(360);

    gui.add(camera, 'translateX').min(-360).max(360).step(0.00001);
    gui.add(camera, 'translateY').min(-360).max(360).step(0.00001);
    gui.add(camera, 'translateZ').min(-360).max(360).step(0.00001);

    const engine = new Engine();

    const animation = (): number => {
        cube.render(object.cube.buffer, object.cube.faces, object.cube.faces.length);
        return window.requestAnimationFrame(animation);
    };

    engine.registerHandler("animation", animation);

    document.addEventListener("keypress", makeControl(cube));

    let isPressing: boolean = false;

    document.getElementById("canvas").addEventListener("mousedown", () => {
        isPressing = true;
    });

    document.getElementById("canvas").addEventListener("mouseup", () => {
        isPressing = false;
    });

    document.getElementById("canvas").addEventListener("mousemove", (event: MouseEvent) => {
        if (isPressing === false) {
            return;
        }

        camera.rotationX = camera.rotationX + event.movementY;
        camera.rotationY = camera.rotationY + event.movementX;
        camera.rotationZ = camera.rotationZ + event.movementY;
    });

    document.getElementById("canvas").addEventListener("mousewheel", (event: WheelEvent) => {
        camera.translateZ = camera.translateZ + Math.round(event.deltaY) / 10;
    });
}

main();
