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
        world.defaultContactMaterial.restitution = 0.8;
        world.defaultContactMaterial.friction = 0.03;

        

        const carBody = new CANNON.Body({ mass: 5 });
        const carBodyShape = new CANNON.Box(new CANNON.Vec3(4, 0.5, 2));
        carBody.addShape(carBodyShape);
        carBody.position.y = 1;

        const vehicle = new CANNON.RigidVehicle({ chassisBody: carBody });


        const wheelShape = new CANNON.Sphere(1);
        const frontLeftWheelBody = new CANNON.Body({ mass: 1 });
        frontLeftWheelBody.addShape(wheelShape);

        const frontrightWheelBody = new CANNON.Body({ mass: 1 });
        frontrightWheelBody.addShape(wheelShape);

        const backLeftWheelBody = new CANNON.Body({ mass: 1 });
        backLeftWheelBody.addShape(wheelShape);

        const backrightWheelBody = new CANNON.Body({ mass: 1 });
        backrightWheelBody.addShape(wheelShape);
        

        frontLeftWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: frontLeftWheelBody,
            position: new CANNON.Vec3(-2, 0, 2.5)
        });
        vehicle.addWheel({
            body: frontrightWheelBody,
            position: new CANNON.Vec3(-2, 0, -2.5)
        });vehicle.addWheel({
            body: backLeftWheelBody,
            position: new CANNON.Vec3(2, 0, 2.5)
        });vehicle.addWheel({
            body: backrightWheelBody,
            position: new CANNON.Vec3(2, 0, -2.5)
        });
//
         
         vehicle.addToWorld(world);

         
         const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);




      
        boxMesh.position.set(carBody.position.x, carBody.position.y, carBody.position.z);
        boxMesh.quaternion.set(carBody.quaternion.x, carBody.quaternion.y, carBody.quaternion.z, carBody.quaternion.w);





        
        const wheelGeometry = new THREE.SphereGeometry(1);
        const wheelMaterial = new THREE.MeshNormalMaterial();

        const frontLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(frontLeftMesh);

        const frontrightMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(frontrightMesh);

        const backLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(backLeftMesh);

        const backrighttMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(backrighttMesh);

       


        //


       


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
            boxMesh.position.set(carBody.position.x, carBody.position.y, carBody.position.z);
            boxMesh.quaternion.set(carBody.quaternion.x, carBody.quaternion.y, carBody.quaternion.z, carBody.quaternion.w);


            frontLeftMesh.position.set(frontLeftWheelBody.position.x, frontLeftWheelBody.position.y, frontLeftWheelBody.position.z);
            frontLeftMesh.quaternion.set(frontLeftWheelBody.quaternion.x, frontLeftWheelBody.quaternion.y, frontLeftWheelBody.quaternion.z, frontLeftWheelBody.quaternion.w);

            frontrightMesh.position.set(frontrightWheelBody.position.x, frontrightWheelBody.position.y, frontrightWheelBody.position.z);
            frontrightMesh.quaternion.set(frontrightWheelBody.quaternion.x, frontrightWheelBody.quaternion.y, frontrightWheelBody.quaternion.z, frontrightWheelBody.quaternion.w);

            backLeftMesh.position.set(backLeftWheelBody.position.x, backLeftWheelBody.position.y, backLeftWheelBody.position.z);
            backLeftMesh.quaternion.set(backLeftWheelBody.quaternion.x, backLeftWheelBody.quaternion.y, backLeftWheelBody.quaternion.z, backLeftWheelBody.quaternion.w);

            backrighttMesh.position.set(backrightWheelBody.position.x, backrightWheelBody.position.y, backrightWheelBody.position.z);
            backrighttMesh.quaternion.set(backrightWheelBody.quaternion.x, backrightWheelBody.quaternion.y, backrightWheelBody.quaternion.z, backrightWheelBody.quaternion.w);

            //車を動かす
            vehicle.setWheelForce(10, 1);
            vehicle.setSteeringValue(THREE.MathUtils.degToRad(30), 0);
            vehicle.setSteeringValue(THREE.MathUtils.degToRad(30), 1);
            vehicle.setWheelForce(10, 1);

                                    
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
