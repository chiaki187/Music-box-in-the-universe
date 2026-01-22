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

        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0)});
        world.defaultContactMaterial.friction = 0.3;
        world.defaultContactMaterial.restitution = 0.0;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 3;
        this.scene.add(cube);

        //カノン物理演算用の立方体　物理空間だと表示用の半分の大きさにしなければならない
        const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const cubeBody = new CANNON.Body({ mass: 1 });//massはkg単位
        cubeBody.addShape(cubeShape);
        //表示用のboxの位置情報を物理演算用のオブジェクトをコピー
        cubeBody.position.set(cube.position.x, cube.position.y, cube.position.z);
        cubeBody.quaternion.set(cube.quaternion.x, cube.quaternion.y, cube.quaternion.z, cube.quaternion.w);
        //　物理演算用の空間に追加
        world.addBody(cubeBody);



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
            world.addBody(planeBody)
            //物理演算用の空間と表示用の空間を関連図けている
            cube.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z);
            cube.quaternion.set(cubeBody.quaternion.x, cubeBody.quaternion.y, cubeBody.quaternion.z, cubeBody.quaternion.w);
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
