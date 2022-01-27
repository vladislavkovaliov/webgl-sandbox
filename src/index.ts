import Base from "./Base";
import { object } from "./model";
import Render from "./Render";
import {makeControl} from "./utils";

function main(): void {
    const cube = new Render();

    cube.init();
    cube.setScaling(0.5);
    cube.setTransition(0, 0, 9);
    // cube2.render([
    //     -0.5, -0.5, 0,    1, 0, 0.5,
    //     -0.5,  0.5, 0,    0.1, 0.5, 0.5,
    //     0.5,  0.5, 0.0,    0.5, 0.8, 0.5,
    //     0.5, -0.5, 0.0,    0.9, 0.2, 0.5,
    // ], [2, 1, 0, 3, 2, 0], 6);

    let animationID: number | null = null;

    const animate = (time: number) => {
        cube.setXDegrees(0.05 * time);
        cube.setYDegrees(0.09 * time);
        cube.setZDegrees(0.08 * time);

        // cube.setTransition(
            // Math.cos(Math.PI * time * 0.0002),
            // Math.sin(Math.PI * time * 0.0002),
            // -2.5,
        // );

        cube.render(object.cube.buffer, object.cube.faces, object.cube.faces.length);

        if (animationID) {
            window.requestAnimationFrame(animate);
        }
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
}

main();
