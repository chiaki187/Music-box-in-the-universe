import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud:THREE.Points;
    private particleVelocity: THREE.Vector3[];

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000)); 
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


///-----------------
        let createParticles = () => {
            //ジオメトリの作成
            const geometry = new THREE.BufferGeometry();

            //マテリアルの作成
            //const material = new THREE.PointsMaterial({ size: 1, color: 0xFFFFFF, transparent: true, opacity:0.8 });
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('raindrop.png'); 
            const material = new THREE.PointsMaterial({ size: 1, map: texture, blending: THREE.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.5 }) 

            //particleの作成
            const particleNum = 11 * 11; // パーティクルの数
            const positions = new Float32Array(particleNum * 3);
            this.particleVelocity=[];
            let   particleIndex = 0;
            for (let x = -5; x <= 5; x++){
                for(let y = -5; y <= 5; y++){
                    positions[particleIndex++] = x; // x座標
                    positions[particleIndex++] = y; // y座標
                    positions[particleIndex++] = 0; // z座標
                    this.particleVelocity.push(new THREE.Vector3( -0.01, 0, -Math.random()*0.1));
                }
            }
            geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));

            //THREE.Pointsの作成
            this.cloud = new THREE.Points(geometry, material);
            //シーンへの追加
            this.scene.add(this.cloud);
            

        }
        

        createParticles();
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
           // this.cloud.rotation.x += 0.01;
            //this.cloud.rotation.y += 0.01;
            //this.cloud.rotation.z += 0.01;


            const geom = <THREE.BufferGeometry>this.cloud.geometry;
            const positions = geom.getAttribute('position'); // 座標データ

            positions.setX(0, positions.getX(0) + this.particleVelocity[0].x);
            positions.setX(0, positions.getX(0) + this.particleVelocity[0].x);
            positions.needsUpdate = true;
            positions.getX(1);

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
