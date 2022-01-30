import { object } from "./model";
import Render from "./Render";
import {makeControl} from "./utils";

const dat = require("dat.gui");
console.log(dat);
function main(): void {
    const cube = new Render();
    cube.attachCamera("perspective");

    cube.init();
    cube.setScaling(0.8);
    cube.cameraTranslateX(0);
    cube.cameraTranslateY(0);
    cube.cameraTranslateZ(9);


    const gui = new dat.GUI();

    gui.add(cube.camera, 'rotationY').min(-360).max(360);
    gui.add(cube.camera, 'rotationX').min(-360).max(360);
    gui.add(cube.camera, 'rotationZ').min(-360).max(360);

    gui.add(cube.camera, 'translateX').min(-360).max(360).step(0.00001);
    gui.add(cube.camera, 'translateY').min(-360).max(360).step(0.00001);
    gui.add(cube.camera, 'translateZ').min(-360).max(360).step(0.00001);

    let animationID: number | null = null;

    const animate = (time: number) => {
        // cube.setXDegrees(0.05 * time);
        // cube.setYDegrees(0.09 * time);
        // cube.setZDegrees(0.8 * time);

        // cube.setTransition(
        //     9 * Math.sin(time * 0.001),
        //     9,
        //     9 * Math.cos(time * 0.001),
        // );


        cube.render(object.cube.buffer, object.cube.faces, object.cube.faces.length);

        // if (animationID) {
            window.requestAnimationFrame(animate);
        // }
    }

    animate(0);

    document.addEventListener("keypress", (event) => {
        if (event.code.toLowerCase() === "space") {
            if (!animationID) {
                animationID = window.requestAnimationFrame(animate);
            } else {
                window.cancelAnimationFrame(animationID);
                animationID = null;
            }
        }
    });

    document.addEventListener("keypress", makeControl(cube));

    let isPressing: boolean = false;

    document.getElementById("canvas").addEventListener("mousedown", () => {
        isPressing = true;
    });

    document.getElementById("canvas").addEventListener("mouseup", (event: MouseEvent) => {
        isPressing = false;
    });

    document.getElementById("canvas").addEventListener("mousemove", (event: MouseEvent) => {
        if (isPressing === false) {
            return;
        }

        cube.cameraRotationX(event.movementY);
        cube.cameraRotationY(event.movementX);
        cube.cameraRotationZ(event.movementY);
    });

    document.getElementById("canvas").addEventListener("mousewheel", (event: WheelEvent) => {
        const [x,y,z] = cube.getTranslation();
        cube.setTransition(
            x,y,z + Math.round(event.deltaY) / 10,
        );
    });
}

main();
