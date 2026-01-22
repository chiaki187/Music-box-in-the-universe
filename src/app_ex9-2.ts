import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud:THREE.Points;
    private cloud2:THREE.Points;
    private cloud3:THREE.Points;
    private cloud4:THREE.Points;
    private cloud5:THREE.Points;
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
        
       
        let generateSprite = ( r:number, g:number, b:number) =>{
            //新しいキャンバスの作成
            let canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;

            //円形のグラデーションの作成
            let context = canvas.getContext('2d');
            let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(0.1, 'rgba('+r+','+g+','+b+',0.7)');
            gradient.addColorStop(0.3, 'rgba('+r/2+','+g/2+','+b/2+',0.5)');
            gradient.addColorStop(1, 'rgba('+r/10+','+g/10+','+b/10+',0.1)');
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            //テクスチャの生成
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        let createPoints = (geom: THREE.BufferGeometry,r:number,g:number,b:number)=> {
        let material = new THREE.PointsMaterial({
                color: 0xffffff,
                map:generateSprite(r,g,b),
                size: 0.2,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            return new THREE.Points(geom, material);
        }

      

        this.cloud = createPoints(new THREE.TorusGeometry(5, 0.5, 20, 15),0,120,170);
        this.cloud2 = createPoints(new THREE.TorusGeometry(5, 0.75, 25, 15),20,70,150);
        this.cloud3 = createPoints(new THREE.TorusGeometry(5, 1, 30, 8),0,150,110);
        this.cloud4 = createPoints(new THREE.TorusGeometry(1, 1, 15, 8),60,0,60);
        this.cloud5 = createPoints(new THREE.TorusGeometry(1.3, 0.3, 20, 16),50,20,20);
        this.cloud.rotation.y +=20;
        this.cloud2.rotation.x +=20;
        this.scene.add(this.cloud3);
        this.scene.add(this.cloud2);
        this.scene.add(this.cloud);
        
        this.scene.add(this.cloud4);
        this.scene.add(this.cloud5);
        
        


        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const clock = new THREE.Clock();
        let update: FrameRequestCallback = (time) => {
             
             

            const deltaTime = clock.getDelta();
             this.cloud.rotation.x += (1.5)* deltaTime;
             this.cloud2.rotation.y += (1.2)* deltaTime;
             this.cloud3.rotation.z += (1)* deltaTime;
             this.cloud4.rotation.x += (1.5)* deltaTime;
             this.cloud5.rotation.y += (1.5)* deltaTime;
            const speed = 1.0;
           


            const geom = <THREE.BufferGeometry>this.cloud.geometry;
            const positions = geom.getAttribute('position'); // 座標データ

            
            
            //positions.needsUpdate = true;
           

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 10));
    const renderer=new THREE.WebGL1Renderer;
    renderer.setClearColor(new THREE.Color(0x000000)); 
    document.body.appendChild(viewport);
}
