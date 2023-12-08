const RiveHandler = function () {


    let riveInstance;

    // triggers for animation state handling
    let startTrigger;
    let stopTrigger;

    const init = function () {

        if (riveInstance) {
            return;
        }

        // Html elements
        const riveCanvas = document.querySelector("#rive-canvas");

        // Rive setup https://help.rive.app/runtimes/layout
        const layout = new rive.Layout({
            fit: rive.Fit.Contain, // Change to: rive.Fit.Contain, or Cover
            alignment: rive.Alignment.Center,
        });

        const stateMachine = "RocketLife";

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
                // When the page scroll the animation start
                //
                window.addEventListener("scroll", () => {
                    startTrigger.fire();
                })

                // Create an intersection observer instance to detect when canvas is in view
                const observer = new IntersectionObserver((entries, observer) => {

                    setTimeout(() => {
                        startTrigger.fire();
                    }, 1000);

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

                //console.log(stateName);

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
        fireRocket: () => {
            if (riveInstance && startTrigger) {
                startTrigger.fire();
            }
        },
        clean: () => {
            if (riveInstance) {
                riveInstance.cleanup();
                riveInstance = undefined;
            }
        }
    };

}();

const DarkModeHandler = function () {

    const init = function () {


        let checkboxDarkMode = document.querySelector('#darkModeCB');
        checkboxDarkMode.addEventListener('change', (e) => {

            let isDarkSelected = checkboxDarkMode.checked === true;

            // Start the rocket when the dark mode change
            RiveHandler.fireRocket();

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