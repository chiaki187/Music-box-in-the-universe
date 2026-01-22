import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
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

   /////ここ書いてるよ！！！！！！！！！！！
        let points:THREE.Vector2[] = [];
        let pointNum=10;

        for(let i=0;i<pointNum;i++){
            points.push(new THREE.Vector2(Math.cos(Math.PI  * i / (pointNum - 1) - Math.PI / 2),
                                   Math.sin(Math.PI  * i / (pointNum - 1) - Math.PI /2)));           ///練習の回答！！！！！！！！！！！！！！！！！！！！！
        }
        
        
        /*
        points.push(new THREE.Vector2(0, -0.5)); //下の頂点
        points.push(new THREE.Vector2(0.5, 0));  //横に出っ張っている頂点
        points.push(new THREE.Vector2(0.0, 0.5));  //一番上の頂点
        */

        let latheGeometry = new THREE.LatheGeometry(points,24);//第二引数がy軸で回るときに分ける直線の数、上げるほど円に近くなる
        let lathmaterial =new THREE.MeshNormalMaterial({side:THREE.DoubleSide});

        let latheMaterial = new THREE.MeshNormalMaterial();
        let latheMesh = new THREE.Mesh(latheGeometry, lathmaterial);
       // this.scene.add(latheMesh);


        let sphereGeometry = new THREE.SphereGeometry(0.025);
        let redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});
        for(let i = 0; i < points.length; ++i) {
         let mesh = new THREE.Mesh(sphereGeometry, redMaterial);
         mesh.position.set(points[i].x, points[i].y, 0);
        // this.scene.add(mesh);
        }


      ////四角

      let drawShape=()=>{
        //THREE.Shapeを定義
        let shape=new THREE.Shape();
        shape.moveTo(1, 1);
        shape.lineTo(1, -1);
        shape.quadraticCurveTo(0, -2, -1, -1);
        shape.lineTo(-1, 1);

         let hole = new THREE.Path();
        hole.absellipse(0, 0, 0.25, 0.25, 0, Math.PI * 2, false, 0);
         shape.holes.push(hole);
        return shape;
      }
       let extrudeSettings = {
     steps: 2,
     depth: 4,
     bevelEnabled: false,
     bevelThickness: 4,
     bevelSize: 2,
     bevelSegments: 3
 };

      let shapeGeometry = new THREE.ShapeGeometry(drawShape());
      shapeGeometry = new THREE.ExtrudeGeometry(drawShape(), extrudeSettings)

      let lineMaterial  = new THREE.LineBasicMaterial({color: 0xffffff, transparent:true, opacity:0.5}) 
      let meshMaterial = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});

      let group = new THREE.Group();
      group.add(new THREE.Mesh(shapeGeometry, meshMaterial));
      group.add(new THREE.LineSegments(shapeGeometry,lineMaterial));

      this.scene.add(group);

      



        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 3));
    document.body.appendChild(viewport);
}
