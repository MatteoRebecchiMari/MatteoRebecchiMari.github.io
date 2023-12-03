const RiveHandler = function () {


    let riveInstance;

    const init = function () {

        // Html elements
        const riveCanvas = document.querySelector("#rive-canvas");
        const startButton = document.querySelector("#startButton");
        const stopButton = document.querySelector("#stopButton");

        // Rive setup https://help.rive.app/runtimes/layout
        const layout = new rive.Layout({
            fit: rive.Fit.Contain, // Change to: rive.Fit.Contain, or Cover
            alignment: rive.Alignment.Center,
        });

        const stateMachine = "RocketLife";


        let startTrigger;
        let stopTrigger;

        // Load the rive instance from the source file
        riveInstance = new rive.Rive({
            src: "assets/rive/azure_rocket.riv",
            // Or the path to a public Rive asset
            // src: '/public/example.riv',
            canvas: riveCanvas,
            layout: layout, // This is optional. Provides additional layout control.
            autoplay: true,
            stateMachines: stateMachine,
            onLoad: () => {

                // Resise the surface
                riveInstance.resizeDrawingSurfaceToCanvas();

                //
                // Get triggers to manage the stateMachine (see rive project)
                //
                const stateMachineInputs = riveInstance.stateMachineInputs(stateMachine);

                startTrigger = stateMachineInputs.find((_) => _.name === 'StartFlying')
                stopTrigger = stateMachineInputs.find((_) => _.name === 'StopFlying')

                //
                // When the mouse hover the canvas, the animation start
                //
                riveCanvas.addEventListener("mouseenter", (event) => {
                    startTrigger.fire();
                });

                //
                // When the mouse exit the canvas, the animation stop
                //
                riveCanvas.addEventListener("mouseleave", (event) => {
                    stopTrigger.fire();
                });

                startButton.addEventListener('click', (event) => {
                    startTrigger.fire();
                });

                stopButton.addEventListener('click', (event) => {
                    stopTrigger.fire();
                });

                // Create an intersection observer instance to detect when canvas is in view
                const observer = new IntersectionObserver((entries, observer) => {

                    entries.forEach((entry) => {

                        // If the canvas element is in view, play the state machine
                        // if (entry.isIntersecting) {
                        //     r.play("State Machine 1");
                        //     stateMachineInput.value = true;
                        //     // Stop observing the canvas element
                        //     // observer.unobserve(entry.target);
                        // } else {
                        //     // Pause the state machine if its out of view again if you want
                        //     r.pause("State Machine 1");
                        // }

                        // when you're done, unobserve the canvas
                        // observer.unobserve(entry.target);

                    });
                });
                observer.observe(riveCanvas);

                // Play the machine
                riveInstance.play(stateMachine);

                // Autoplay the animation at startup
                setTimeout(() => {
                    startTrigger.fire();
                }, 1000);

            },
            onStateChange: (event) => {

                let stateName = event.data[0];

                console.log(stateName);

                switch (stateName) {
                    case 'Wobbling':
                        break;
                    case 'StartFlying':
                        break;
                    case 'FlyingStarting':
                        break;
                    case 'Flying':
                        let stopAnimation = function () {
                            console.log('...stopping animation');
                            stopTrigger.fire();
                        }
                        setTimeout(stopAnimation, 6000);
                        break;
                    case 'FlyingEnding':
                        break;
                    case 'StopFlying':
                        break;
                }

                return;
            },
        });

        // Resize the drawing surface if the window resizes
        window.addEventListener(
            "resize",
            () => {
                riveInstance.resizeDrawingSurfaceToCanvas();
            },
            false
        );


    };

    return {
        init: () => {
            init();
        },
        clean: () => {
            if (riveInstance) {
                riveInstance.cleanup();
            }
        }
    };

}();

const DarkModeHandler = function () {

    const init = function () {


        let checkboxDarkMode = document.querySelector('#darkModeCB');
        checkboxDarkMode.addEventListener('change', (e) => {

            let isDarkSelected = checkboxDarkMode.checked === true;

            if (isDarkSelected) {
                document.querySelector('html').setAttribute('data-bs-theme', 'dark')
            }
            else {
                document.querySelector('html').removeAttribute('data-bs-theme')
            }

        });

    };

    return {
        init: function () {
            init();
        }
    }

}();

const BootstrapHandler = function () {

    const init = function () {

        // Load tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    };

    return {
        init: function () {
            init();
        }
    }

}();


document.addEventListener("DOMContentLoaded", (event) => {
    RiveHandler.init();
    DarkModeHandler.init();
    BootstrapHandler.init();
});

window.addEventListener("beforeunload", function (e) {
    RiveHandler.clean();
    return null;
});