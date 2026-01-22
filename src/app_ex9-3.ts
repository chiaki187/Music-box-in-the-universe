import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud:THREE.Points;
    private cloud2:THREE.Points;
    private cloud3:THREE.Points;
    private particleVelocity: THREE.Vector3[];
    private particleVelocity2: THREE.Vector3[];
    private particleVelocity3: THREE.Vector3[];

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000020)); 
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
            const geometry2 = new THREE.BufferGeometry();
            const geometry3 = new THREE.BufferGeometry();

            //マテリアルの作成
            //const material = new THREE.PointsMaterial({ size: 1, color: 0xFFFFFF, transparent: true, opacity:0.8 });
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('star.png');
            const texture2 = textureLoader.load('littlestar.png'); 
            const texture3 = textureLoader.load('stardust.png'); 
            const material = new THREE.PointsMaterial({ size: 0.7, map: texture, blending: THREE.AdditiveBlending, color: 0xeeeeff, depthWrite: false, transparent: true, opacity: 1 }) 
            const material2 = new THREE.PointsMaterial({ size: 0.3, map: texture2, blending: THREE.AdditiveBlending, color: 0x9acfff, depthWrite: false, transparent: true, opacity: 1 }) 
            const material3 = new THREE.PointsMaterial({ size: 1, map: texture3, blending: THREE.AdditiveBlending, color: 0x0afbfff, depthWrite: false, transparent: true, opacity: 1 }) 

            //particleの作成
            const particleNum = 1000; // パーティクルの数
            const positions = new Float32Array(particleNum * 3);
            const positions2 = new Float32Array(particleNum * 3);
            const positions3 = new Float32Array(particleNum * 3);
            this.particleVelocity=[];
            this.particleVelocity2=[];
            this.particleVelocity3=[];

            let   particleIndex = 0;
            for (let x = 0; x < particleNum; x++){
                    const r=Math.random()*5;//円の半径
                    const radius=Math.random()*Math.PI*2-Math.PI;//円の角度
                    const r2=Math.random()*7;//円の半径
                    const radius2=Math.random()*Math.PI*2-Math.PI;//円の角度
                    const r3=Math.random()*2;//円の半径
                    const radius3=Math.random()*Math.PI*2-Math.PI;//円の角度
                
                    positions[particleIndex++] = Math.cos(radius)*r; // x座標
                    positions[particleIndex++] =Math.random()*10-5; // y座標
                    positions[particleIndex++] = Math.sin(radius)*r; // z座標

                    positions2[particleIndex++] = Math.cos(radius2)*r2; // x座標
                    positions2[particleIndex++] =Math.random()*10-5; // y座標
                    positions2[particleIndex++] = Math.sin(radius2)*r2; // z座標

                    positions3[particleIndex++] = Math.cos(radius3)*r3; // x座標
                    positions3[particleIndex++] =Math.random()*10-5; // y座標
                    positions3[particleIndex++] = Math.sin(radius3)*r3; // z座標

                    //円の半径、円の角度、回る速度
                    this.particleVelocity.push(new THREE.Vector3( r , radius,Math.random()*4));
                    this.particleVelocity2.push(new THREE.Vector3( r2 , radius2,Math.random()*4));
                    this.particleVelocity3.push(new THREE.Vector3( r3 , radius3,Math.random()*4));
                
            }
            geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
            geometry2.setAttribute('position',new THREE.BufferAttribute(positions2,3));
            geometry3.setAttribute('position',new THREE.BufferAttribute(positions3,3));

            //THREE.Pointsの作成
            this.cloud = new THREE.Points(geometry, material);
            this.cloud2 = new THREE.Points(geometry2, material2);
            this.cloud3 = new THREE.Points(geometry3, material3);
            //シーンへの追加

            this.scene.add(this.cloud);
            this.scene.add(this.cloud2);
           // this.cloud3.rotateX(20);
            this.scene.add(this.cloud3);

            
            

        }
        

        

        createParticles();
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const clock = new THREE.Clock();
        let update: FrameRequestCallback = (time) => {
           // this.cloud.rotation.x += 0.01;
            //this.cloud.rotation.y += 0.01;
            //this.cloud.rotation.z += 0.01;

            const deltaTime = clock.getDelta();
            const geom = <THREE.BufferGeometry>this.cloud.geometry;
            const geom2 = <THREE.BufferGeometry>this.cloud2.geometry;
            const geom3 = <THREE.BufferGeometry>this.cloud3.geometry;
            const positions = geom.getAttribute('position'); // 座標データ
            const positions2 = geom2.getAttribute('position'); // 座標データ
            const positions3 = geom3.getAttribute('position'); // 座標データ

            for(let i=0;i<this.particleVelocity.length;i++){
                if(this.particleVelocity[i].x>10){
                    this.particleVelocity[i].x=0;         
                }
                if(this.particleVelocity2[i].x>10){
                    this.particleVelocity2[i].x=0; 
                }
                if(this.particleVelocity3[i].x>10){
                    this.particleVelocity3[i].x=0; 
                }
                positions.setX(i,  Math.cos(this.particleVelocity[i].y+=this.particleVelocity[i].z*deltaTime/2)*(this.particleVelocity[i].x+=deltaTime));
                positions.setZ(i,  Math.sin(this.particleVelocity[i].y+=this.particleVelocity[i].z*deltaTime/2)*(this.particleVelocity[i].x+=deltaTime));

                positions2.setX(i,  Math.cos(this.particleVelocity2[i].y+=this.particleVelocity2[i].z*deltaTime/2)*(this.particleVelocity2[i].x+=deltaTime));
                positions2.setZ(i,  Math.sin(this.particleVelocity2[i].y+=this.particleVelocity2[i].z*deltaTime/2)*(this.particleVelocity2[i].x+=deltaTime));

                positions3.setX(i,  Math.cos(this.particleVelocity3[i].y+=this.particleVelocity3[i].z*deltaTime/2)*(this.particleVelocity3[i].x+=deltaTime));
                positions3.setZ(i,  Math.sin(this.particleVelocity3[i].y+=this.particleVelocity3[i].z*deltaTime/2)*(this.particleVelocity3[i].x+=deltaTime));
                
            }
            
            positions.needsUpdate = true;
            positions2.needsUpdate = true;
            positions3.needsUpdate = true;
            

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 2, 10));

    document.body.appendChild(viewport);
}
