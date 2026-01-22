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
        const world1 = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0)});
        world1.defaultContactMaterial.friction = 0.025;
        world1.defaultContactMaterial.restitution = 0;
        const geometry1 = new THREE.BoxGeometry(0.4, 1, 0.2);
        const material1 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube1 = new THREE.Mesh(geometry1, material1);
        cube1.position.set(0,0.5,0);
        cube1.rotateX(Math.PI/6);
        this.scene.add(cube1);

        world1.defaultContactMaterial.friction = 0.3;
        world1.defaultContactMaterial.restitution = 0.0;
        const geometry2 = new THREE.BoxGeometry(0.4, 1, 0.2);
        const material2 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube2 = new THREE.Mesh(geometry2, material2);
        cube2.position.set(0,0.5,0.3);
        this.scene.add(cube2);

       
        world1.defaultContactMaterial.friction = 0.3;
        world1.defaultContactMaterial.restitution = 0.0;
        const geometry3 = new THREE.BoxGeometry(0.4, 1, 0.2);
        const material3 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube3 = new THREE.Mesh(geometry3, material3);
        cube3.position.set(0,0.5,0.6);
        this.scene.add(cube3);





        //カノン物理演算用の立方体　物理空間だと表示用の半分の大きさにしなければならない
        const cubeShape1 = new CANNON.Box(new CANNON.Vec3(0.2, 0.5, 0.1));
        const cubeBody1 = new CANNON.Body({ mass: 2 });//massはkg単位
        cubeBody1.addShape(cubeShape1);
        //表示用のboxの位置情報を物理演算用のオブジェクトをコピー
        cubeBody1.position.set(cube1.position.x, cube1.position.y, cube1.position.z);
        cubeBody1.quaternion.set(cube1.quaternion.x, cube1.quaternion.y, cube1.quaternion.z, cube1.quaternion.w);
        //　物理演算用の空間に追加
        world1.addBody(cubeBody1);


        const cubeShape2 = new CANNON.Box(new CANNON.Vec3(0.2, 0.5, 0.1));
        const cubeBody2 = new CANNON.Body({ mass: 0.1 });//massはkg単位
        cubeBody2.addShape(cubeShape2);
        //表示用のboxの位置情報を物理演算用のオブジェクトをコピー
        cubeBody2.position.set(cube2.position.x, cube2.position.y, cube2.position.z);
        cubeBody2.quaternion.set(cube2.quaternion.x, cube2.quaternion.y, cube2.quaternion.z, cube2.quaternion.w);
        world1.addBody(cubeBody2);
        //　物理演算用の空間に追加

        const cubeShape3 = new CANNON.Box(new CANNON.Vec3(0.2, 0.5, 0.1));
        const cubeBody3 = new CANNON.Body({ mass: 0.1 });//massはkg単位
        cubeBody3.addShape(cubeShape3);
        //表示用のboxの位置情報を物理演算用のオブジェクトをコピー
        cubeBody3.position.set(cube3.position.x, cube3.position.y, cube3.position.z);
        cubeBody3.quaternion.set(cube3.quaternion.x, cube3.quaternion.y, cube3.quaternion.z, cube3.quaternion.w);
        //　物理演算用の空間に追加
        world1.addBody(cubeBody3);
      



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
        world1.addBody(planeBody);
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
            world1.fixedStep();
            
          

           
            //物理演算用の空間と表示用の空間を関連図けている
            cube1.position.set(cubeBody1.position.x, cubeBody1.position.y, cubeBody1.position.z);
            cube1.quaternion.set(cubeBody1.quaternion.x, cubeBody1.quaternion.y, cubeBody1.quaternion.z, cubeBody1.quaternion.w);

            cube2.position.set(cubeBody2.position.x, cubeBody2.position.y, cubeBody2.position.z);
            cube2.quaternion.set(cubeBody2.quaternion.x, cubeBody2.quaternion.y, cubeBody2.quaternion.z, cubeBody2.quaternion.w);

            cube3.position.set(cubeBody3.position.x, cubeBody3.position.y, cubeBody3.position.z);
            cube3.quaternion.set(cubeBody3.quaternion.x, cubeBody3.quaternion.y, cubeBody3.quaternion.z, cubeBody3.quaternion.w);
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
