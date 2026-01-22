//23FI094　早﨑千明
import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();
        

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);



        // Tweenでコントロールする変数の定義
        let tweeninfo = {scaleX: 5.0,scaleY: 0.0};

        //  Tweenでパラメータの更新の際に呼び出される関数
        let updateScale =()=>{
            cube.position.x = tweeninfo.scaleX;
            cube.position.y = tweeninfo.scaleY;
        }

        // Tweenの作成
        const tween = new TWEEN.Tween(tweeninfo).to({ scaleX: 0.0,scaleY: -5.0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateScale);
        const tween1 = new TWEEN.Tween(tweeninfo).to({ scaleX: -5.0,scaleY: 0.0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateScale);
        const tween2 = new TWEEN.Tween(tweeninfo).to({ scaleX: 0.0,scaleY: 5.0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateScale);
        const tween3 = new TWEEN.Tween(tweeninfo).to({ scaleX: 5.0,scaleY: 0.0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateScale);
    

        tween.chain(tween1);
        tween1.chain(tween2);
        tween2.chain(tween3);
        tween3.chain(tween);
        // アニメーションの開始
        tween.start();


        const greenCubeGeometry = new THREE.BoxGeometry();
        const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const greenCube = new THREE.Mesh(greenCubeGeometry, greenMaterial);
        this.scene.add(greenCube);
        
        let greenCubeTweeninfo = {scaleX: -5.0, scaleY: 0.0};
        let updateGreenCubeScale =()=>{
            greenCube.position.x = greenCubeTweeninfo.scaleX;
            greenCube.position.y = greenCubeTweeninfo.scaleY;
        }

        const greenCubeTween = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: 0 ,scaleY: 5}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        const greenCubeTween1 = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: 5 ,scaleY: 0}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        const greenCubeTween2 = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: 0 ,scaleY: -5}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        const greenCubeTween3 = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: -5 ,scaleY: 0}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        
        
        



        greenCubeTween.chain(greenCubeTween1);
        greenCubeTween1.chain(greenCubeTween2);
        greenCubeTween2.chain(greenCubeTween3);
        greenCubeTween3.chain(greenCubeTween);

        greenCubeTween.start();


        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
        
            TWEEN.update();//追加分

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 10));
    document.body.appendChild(viewport);
}
