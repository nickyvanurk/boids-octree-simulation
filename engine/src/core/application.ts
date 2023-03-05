import * as THREE from 'three';

import { Loop } from './loop';
import { Scene } from '../scene/scene';
import { SceneManager } from '../scene/scene_manager';

type Config = {
    scene: { new (): Scene } | { new (): Scene }[];
    parent?: string;
    backgroundColor?: string | number;
};

export class Application {
    private renderer: THREE.WebGLRenderer;
    private sceneManager: SceneManager;
    private loop: Loop;

    constructor(config: Config) {
        const canvas = document.createElement('canvas');
        const parent = document.querySelector(config.parent || 'body');
        parent.appendChild(canvas);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setClearColor(config.backgroundColor || 0x000000);
        this.renderer.setSize(parent.clientWidth, parent.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.loop = new Loop(1 / 50);
        this.loop.start(this.fixedStep.bind(this), this.step.bind(this));

        this.sceneManager = new SceneManager(config.scene);
    }

    fixedStep() {
        this.sceneManager.fixedUpdate();
    }

    step() {
        this.sceneManager.update();
    }
}
