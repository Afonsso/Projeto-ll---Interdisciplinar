import * as THREE from "https://esm.sh/three@0.160.0";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

export function createEyeProgress(canvas, options = {}) {
    const config = {
        modelUrl: "../imagens/eye.glb",
        idleClips: ["IrisLookAction"],
        idleTimeScale: 0.3,
        ...options
    };

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;

    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(2, 3, 4);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
    light2.position.set(-2, -1, 3);
    scene.add(light2);

    const holder = new THREE.Group();
    scene.add(holder);

    let blinkMixer = null;
    let idleMixer = null;
    let blinkActions = [];
    let lastProgress = 0;

    const clock = new THREE.Clock();

    const loader = new GLTFLoader();

    loader.load(
        config.modelUrl,
        gltf => {
            const model = gltf.scene;
            holder.add(model);

            fitModel(model);

            const animations = gltf.animations || [];
            const idleNames = new Set(config.idleClips);

            blinkMixer = new THREE.AnimationMixer(model);
            idleMixer = new THREE.AnimationMixer(model);

            animations.forEach(clip => {
                if (idleNames.has(clip.name)) {
                    const idleAction = idleMixer.clipAction(clip);
                    idleAction.setLoop(THREE.LoopRepeat, Infinity);
                    idleAction.timeScale = config.idleTimeScale;
                    idleAction.play();
                } else {
                    const action = blinkMixer.clipAction(clip);
                    action.play();
                    action.paused = true;
                    blinkActions.push(action);
                }
            });

            setEyeProgress(lastProgress);

            console.log("[olho] carregado");
            console.log("[olho] animações:", animations.map(a => a.name));
        },
        undefined,
        error => {
            console.error("[olho] erro ao carregar eye.glb:", error);
        }
    );

    function fitModel(model) {
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        model.scale.setScalar(2.4 / maxDim);
    }

    function setEyeProgress(progress) {
        if (!blinkMixer || !blinkActions.length) return;

        const t = THREE.MathUtils.clamp(progress, 0, 1);

        const maxDuration = Math.max(
            ...blinkActions.map(action => action.getClip().duration)
        );

        const time = maxDuration * t;

        blinkActions.forEach(action => {
            action.time = time;
        });

        blinkMixer.update(0);
    }

    function resize() {
        const width = canvas.clientWidth || 1;
        const height = canvas.clientHeight || 1;

        renderer.setSize(width, height, false);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resize);
    resize();

    renderer.setAnimationLoop(() => {
        controls.update();

        if (idleMixer) {
            idleMixer.update(clock.getDelta());
        }

        renderer.render(scene, camera);
    });

    return {
        setProgress(xp, maxXp) {
            lastProgress = maxXp > 0 ? xp / maxXp : 0;
            setEyeProgress(lastProgress);
        }
    };
}