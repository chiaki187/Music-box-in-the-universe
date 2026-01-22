//23FI094　早﨑千明
import * as TWEEN from "@tweenjs/tween.js";
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
      

        let generateSprite = () =>{
        //新しいキャンバスの作成
        let canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        //円形のグラデーションの作成
        let context = canvas.getContext('2d');
        let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.3, 'rgb(44, 2, 2)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        //テクスチャの生成
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }


       let createParticles = () => {
                   //ジオメトリの作成

       
                   //マテリアルの作成
                   //const material = new THREE.PointsMaterial({ size: 1, color: 0xFFFFFF, transparent: true, opacity:0.8 });
                   const textureLoader = new THREE.TextureLoader();
                   const geometry = new THREE.BufferGeometry();
                    const material = new THREE.PointsMaterial({
                        color: 0xffffff,
                        map: generateSprite(),
                        size: 0.8, // 変更点: 1から2や3に増やしてみてください
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    })
       
                   //particleの作成
                   const particleNum = 1000; // パーティクルの数
                   const positions = new Float32Array(particleNum * 3);
                   this.particleVelocity=[];
                   let   particleIndex = 0;
                   for (let x =0; x <= particleNum; x++){
                      
                           positions[x*3] = 0; // x座標
                           positions[x*3+1] = 0; // y座標
                           positions[x*3+2] = 0; // z座標
                           this.particleVelocity.push(new THREE.Vector3( 0.0, -Math.random()*5-3, 0));
                       
                   }
                   geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
       
                   //THREE.Pointsの作成
                   this.cloud = new THREE.Points(geometry, material);
                   //シーンへの追加
                   this.scene.add(this.cloud);
                   
       
               }
               
       
               createParticles();
            

        let geometry = <THREE.BufferGeometry>this.cloud.geometry;
        let positions = geometry.getAttribute('position');
        positions.needsUpdate = true;

        let tweeninfo: { x: number, y: number, z: number, index: number }[] = [];
        const tween = new TWEEN.Tween({ x: 0, y: 0, z: 0, index: 0 });

        const updateParticlePosition = (tweenData: { x: number, y: number, z: number, index: number }) => {
            positions.setX(tweenData.index, tweenData.x);
            positions.setY(tweenData.index, tweenData.y);
            positions.setZ(tweenData.index, tweenData.z);
            positions.needsUpdate = true; // 位置が更新されたら必ずneedsUpdateをtrueにする
        };


        for(let i = 0; i < 1000; ++i) {
            // tweeninfoの作成
             tweeninfo[i] = { x: 0, y: 0, z: 0, index: i};
            // Tweenでパラメータの更新の際に呼び出される関数の作成
            
            // 球面上の座標値の作成（遷移先の作成）
        
            const a=Math.random()*Math.PI;
            const b=Math.random()*Math.PI*2;
            let PosX= 3*Math.sin(a)*Math.cos(b);
            let PosY= 3*Math.sin(a)*Math.sin(b);
            let PosZ= 3*Math.cos(a);

           const tween = new TWEEN.Tween(tweeninfo[i]).to({ x: PosX, y: PosY, z: PosZ }, 1000).easing(TWEEN.Easing.Cubic.InOut).onUpdate(updateParticlePosition);
           const tween2 = new TWEEN.Tween(tweeninfo[i]).to({ x: 0,y:0 ,z:0 }, 1000).easing(TWEEN.Easing.Circular.InOut).onUpdate(updateParticlePosition);
            // Twennの作成（球面上への遷移と、原点への遷移を作る）

            // アニメーションのループの作成
           tween.chain(tween2);
           tween2.chain(tween);
            // アニメーションの実行
            tween.start()
            
        }
    

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
    // カメラのZ座標を小さくして、球に近づけます。
    // 例: 半径3の球なので、Z座標を5くらいにすると全体が見えやすくなります。
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 10)); // 変更点
    document.body.appendChild(viewport);
}
