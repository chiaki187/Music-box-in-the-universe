import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from 'lil-gui';
import { Sequence } from "@tweenjs/tween.js";
//import spongepowered.noise.module.source.Perlin;

class ThreeJSContainer {
    
    private scene: THREE.Scene;
    private geometry: THREE.BufferGeometry;
    private material: THREE.Material;
    private cube: THREE.Mesh;
    private light: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
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

        let gui = new GUI(); // GUI用のインスタンスの生成
        //let guiObj = { rotationSpeedX: 0.05} // GUIのパラメータ
        //gui.add(guiObj, "rotationSpeedX", 0.0, 0.2); //GUIの設定
        

        //ドロップダウンリスト
        //最初はWaveを指定
        let guiObj1 = { Shape: 'P'}
        gui.add( guiObj1, 'Shape', [ 'P','Wave', 'Klein'] );

       

        //Wave
        let myPlane = (u:number, v:number, target:THREE.Vector3) =>{
           
            let r = 20;
            let x = r * u - r / 2;
            let z = r * v - r / 2;
            //中心からの距離を√で計算
            let y = Math.sin(Math.sqrt(x * x + z * z)) ;
           
            target.set(x, y, z);
        }
        let paramGeometry = new THREE.ParametricGeometry(myPlane, 30, 30);
        let paramMaterial = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});
        let lineMaterial  = new THREE.LineBasicMaterial({color: 0xffffff,transparent:true, opacity:0.5});
        let group = new THREE.Group();
        group.add(new THREE.Mesh(paramGeometry,paramMaterial));
        group.add(new THREE.LineSegments(paramGeometry,lineMaterial));
        this.scene.add(group);

        

        //Klein
        let myPlaneK = (u:number, v:number, target:THREE.Vector3) =>{
            u=u*2*Math.PI;
            v=v*2*Math.PI;

            let r = 4-2*Math.cos(u);
            let x;
            let y;
            
            if(u>=0&&u<Math.PI){
                x =6*Math.cos(u)*(1+Math.sin(u))+r*Math.cos(u)*Math.cos(v);
            }else{
                x =6*Math.cos(u)*(1+Math.sin(u))+r*Math.cos(v+Math.PI);

            }

            if(u>=0&&u<Math.PI){
                y = 16*Math.sin(u)+r*Math.sin(u)*Math.cos(v);
            }else{
                y=16*Math.sin(u);
            }
            
            
            
            let z = r*Math.sin(v);
            console.log(Math.sqrt(x * x + z * z));
            target.set(x, y, z);
        }
        let paramGeometry2 = new THREE.ParametricGeometry(myPlaneK, 30, 30);
        let groupK = new THREE.Group();
        groupK.add(new THREE.Mesh(paramGeometry2,paramMaterial));
        groupK.add(new THREE.LineSegments(paramGeometry2,lineMaterial));
        this.scene.add(groupK);


        //Klein
        let myPlaneP = (u:number, v:number, target:THREE.Vector3) =>{
          
            let r = 30;
            let x = r * u - r / 2;
            let z = r * v - r / 2;
            //中心からの距離を√で計算
            let y =  Math.random() * 3.0;
         
            target.set(x, y, z);
        }
        let paramGeometry3 = new THREE.ParametricGeometry(myPlaneP, 10, 10);
        let groupP = new THREE.Group();
        groupP.add(new THREE.Mesh(paramGeometry3,paramMaterial));
        groupP.add(new THREE.LineSegments(paramGeometry3,lineMaterial));
        this.scene.add(groupP);

    

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
           
           //Waveがvisibleの時はKleinはinvisible
           //Kleinがvisibleの時はWaveはinvisible    

           if(guiObj1.Shape=='Wave'){
             group.visible=true;
             groupK.visible=false;
           }else if(guiObj1.Shape=='Klein'){
            groupK.visible=true;
            group.visible=false;
           }else if(guiObj1.Shape=='P'){
            groupP.visible=true;
            group.visible=false;
            groupK.visible=false;
           }

           
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-20, 20, 20));
    document.body.appendChild(viewport);
}
