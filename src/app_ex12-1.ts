//23FI094  早﨑千明
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon-es';

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


        //ドミノ群生性
        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0)});
        world.defaultContactMaterial.friction = 0.025;
        world.defaultContactMaterial.restitution = 0;
        const geometry1 = new THREE.BoxGeometry(0.5, 1, 0.1);
        const material1 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });


        const cubeMeshes: THREE.Mesh[]=[];
        

        let r=3;
        let n=30;
        for(let i=0;i<n;i++){
            cubeMeshes.push(new THREE.Mesh(geometry1, material1));
            let x=r*Math.cos(2*Math.PI/n*i);
            let z=r*Math.sin(2*Math.PI/n*i);
            cubeMeshes[i].position.set(x,0.5,z);
            cubeMeshes[i].rotateY(-2*Math.PI*i/n);

            this.scene.add(cubeMeshes[i]);
        }
        cubeMeshes[0].rotateX(Math.PI/6);
        
        
       // this.scene.add(cube1);
        
        

        





        //カノン物理演算用の立方体　物理空間だと表示用の半分の大きさにしなければならない
        const cubeShape1 = new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.05));
        const cubeBodies: CANNON.Body[] = [];//massはkg単位

        for(let i=0;i<n;i++){
            cubeBodies.push( new CANNON.Body({ mass: 1 }));
            cubeBodies[i].addShape(cubeShape1);
            let x=r*Math.cos(2*Math.PI/n*i);
            let z=r*Math.sin(2*Math.PI/n*i);
            cubeBodies[i].position.set(cubeMeshes[i].position.x, cubeMeshes[i].position.y, cubeMeshes[i].position.z);
            cubeBodies[i].quaternion.set(cubeMeshes[i].quaternion.x, cubeMeshes[i].quaternion.y,cubeMeshes[i].quaternion.z, cubeMeshes[i].quaternion.w);
            world.addBody(cubeBodies[i]);
            
        }
       

        //表示用のboxの位置情報を物理演算用のオブジェクトをコピー
        //cubeBody1.position.set(cube1.position.x, cube1.position.y, cube1.position.z);
        //cubeBody1.quaternion.set(cube1.quaternion.x, cube1.quaternion.y, cube1.quaternion.z, cube1.quaternion.w);
        //　物理演算用の空間に追加
        


      
      



        //地面を作る
        const phongMaterial = new THREE.MeshPhongMaterial();
        const planeGeometry = new THREE.PlaneGeometry(25, 25);
        const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);//両面から見えるように
        planeMesh.material.side = THREE.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
         this.scene.add(planeMesh);
        
        //　物理演算用の空間
        const planeShape = new CANNON.Plane()
        const planeBody = new CANNON.Body({ mass: 0 })//    0にすると重力の影響を受けなくなる、これが1でも動かないのは物理空間だけ落ちて表示空間と合わせていないからupdate関数内で
        planeBody.addShape(planeShape)
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        world.addBody(planeBody);
        // グリッド表示
        const gridHelper = new THREE.GridHelper( 10,);
        this.scene.add( gridHelper );  

        // 軸表示
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
        
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        
        let update: FrameRequestCallback = (time) => {

            //物理演算実行　物理演算のが始まる
            world.fixedStep();
            
          

           
            //物理演算用の空間と表示用の空間を関連図けている
            for(let i=0;i<n;i++){
                cubeMeshes[i].position.set(cubeBodies[i].position.x, cubeBodies[i].position.y, cubeBodies[i].position.z);
                cubeMeshes[i].quaternion.set(cubeBodies[i].quaternion.x, cubeBodies[i].quaternion.y, cubeBodies[i].quaternion.z, cubeBodies[i].quaternion.w);
            }
            

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}
