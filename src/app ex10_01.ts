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


        const CubeGeometry = new THREE.BoxGeometry();
        const Material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const Cube = new THREE.Mesh(CubeGeometry, Material);
        this.scene.add(Cube);
        
        let CubeTweeninfo = {scaleX: 0.0,scaleY: -5.0};
        let updateCubeScale =()=>{
            Cube.position.x = CubeTweeninfo.scaleX;
            Cube.position.y = CubeTweeninfo.scaleY;
        }

        const CubeTween1 = new TWEEN.Tween(CubeTweeninfo).to({ scaleX: -5 ,scaleY:0}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateCubeScale);
        const CubeTween2 = new TWEEN.Tween(CubeTweeninfo).to({ scaleX: 0 ,scaleY:5}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateCubeScale);
        const CubeTween3 = new TWEEN.Tween(CubeTweeninfo).to({ scaleX: 5,scaleY:0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateCubeScale);
        const CubeTween4 = new TWEEN.Tween(CubeTweeninfo).to({ scaleX: 0 ,scaleY:-5}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateCubeScale);
        

        CubeTween1.chain(CubeTween2.chain(CubeTween3.chain(CubeTween4.chain(CubeTween1))));
       
    
        CubeTween1.start();
        

        


        const greenCubeGeometry = new THREE.BoxGeometry();
        const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const greenCube = new THREE.Mesh(greenCubeGeometry, greenMaterial);
        this.scene.add(greenCube);
        
        let greenCubeTweeninfo = {scaleX: 0.0,scaleY: 5.0};
        let updateGreenCubeScale =()=>{
            greenCube.position.x = greenCubeTweeninfo.scaleX;
            greenCube.position.y = greenCubeTweeninfo.scaleY;
        }

        const greenCubeTween1 = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: 5 ,scaleY:0}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        const greenCubeTween2 = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: 0 ,scaleY:-5}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        const greenCubeTween3 = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: -5,scaleY:0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        const greenCubeTween4 = new TWEEN.Tween(greenCubeTweeninfo).to({ scaleX: 0 ,scaleY:5}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubeScale);
        

        greenCubeTween1.chain(greenCubeTween2.chain(greenCubeTween3.chain(greenCubeTween4.chain(greenCubeTween1))));
       
    
        greenCubeTween1.start();

       
        


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
