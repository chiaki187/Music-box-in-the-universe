//23FI094_早﨑千明
import *
 as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
       
       
  
        let addObject = () =>{
            //Geometryの生成
            
            let ConeNumber:number=Math.round(Math.random()*7+3);//角数の設定３～１０
            let size:number =Math.random()*0.15+0.05;//大きさのランダム設定0.05~0.2


            
            let addObjectGeometry1: THREE.BufferGeometry=new THREE.OctahedronGeometry(0.2*size,1); //中心の立体
            let addObjectGeometry2: THREE.BufferGeometry=new THREE.RingGeometry(0.5*size,0.3*size,ConeNumber,0,33); //中の平面
            let addObjectGeometry3: THREE.BufferGeometry=new THREE.RingGeometry(1.0*size,0.8*size,ConeNumber,0,33); //外の平面
            let addObjectGeometry4: THREE.BufferGeometry=new THREE.BoxGeometry(0.06*size,0.3*size,0.13*size); //中の四角形
            let addObjectGeometry5: THREE.BufferGeometry=new THREE.BoxGeometry(0.08*size,0.5*size,0.05*size); //外の四角形
            let addObjectGeometry6: THREE.BufferGeometry=new THREE.CylinderGeometry(0.04*size,0.04*size,1*size); //六本の棒
            let addObjectGeometry7: THREE.BufferGeometry=new THREE.ConeGeometry(0.08*size,0.2*size,10,1); //六本の先っちょ
            let addObjectGeometry8: THREE.BufferGeometry=new THREE.PlaneGeometry(0.15*size,0.5*size); //六本の先っちょの三つ並んでいるやつ
            let addObjectGeometry9: THREE.BufferGeometry=new THREE.PlaneGeometry(0.15*size,0.8*size); //六本の先っちょの三つ並んでいるやつ長め
            let addObjectGeometry10: THREE.BufferGeometry=new THREE.BoxGeometry(10,10,0.01); //白い床


            
            
            //Materialの生成
            let meshMaterial: THREE.Material=new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
            let meshMateria2: THREE.Material=new THREE.MeshBasicMaterial({ color: 0xFFFFFF });//白色
          

            
        
            //オブジェクトの生成
            
            let addObject1: THREE.Mesh=new THREE.Mesh(addObjectGeometry1,meshMaterial); //中心の立体
            let addSmallSix: THREE.Mesh=new THREE.Mesh(addObjectGeometry2,meshMaterial); //小さい六角形
            let addBigSix: THREE.Mesh=new THREE.Mesh(addObjectGeometry3,meshMaterial); //大きい六角形
            let addWhiteFloor: THREE.Mesh=new THREE.Mesh(addObjectGeometry10,meshMateria2); //白い床
           
           

            //Cubeオブジェクトのプロパティを設定する
            addObject1.name="cube-"+this.scene.children.length;
            
         
            //移動変数
            let x:number =(Math.random() * 8) - 4;
            let y:number =(Math.random() * 3) - 1.5;
            let z:number =(Math.random() * 8) - 4;


            //一個だけ描画するものを移動
            addObject1.position.x = x;
            addObject1.position.y = y;
            addObject1.position.z = z;

            addSmallSix.position.x = x;
            addSmallSix.position.y = y;
            addSmallSix.position.z = z;

            addBigSix.position.x = x;
            addBigSix.position.y = y;
            addBigSix.position.z = z;


            //白い床
            addWhiteFloor.position.x = 0;
            addWhiteFloor.position.y = -2;
            addWhiteFloor.position.z = 0;
            addWhiteFloor.rotation.x = THREE.MathUtils.degToRad(90);

            
            let n3:number=0//角の個数が３の時だけ修正変数
            if(ConeNumber==3){
               n3=30;
            }

            
            for(let i=0;i<ConeNumber;i++){//画数に応じた数のループで描く
                
            
                let r:number=360/ConeNumber;
                
                //内側の四角
                let addBox1: THREE.Mesh=new THREE.Mesh(addObjectGeometry4,meshMaterial);
                //回転と移動
                addBox1.position.x = Math.cos(THREE.MathUtils.degToRad(r * i)) * 0.34*size+x;
                addBox1.position.y = Math.sin(THREE.MathUtils.degToRad(r * i)) * 0.34*size+y;
                addBox1.position.z = z;
                addBox1.rotation.z = THREE.MathUtils.degToRad(r*(i)+n3);

                if(ConeNumber==3){
                    //角が三つの時だけ四角形を増やす
                    let addBox1: THREE.Mesh=new THREE.Mesh(addObjectGeometry4,meshMaterial);
                    addBox1.position.x =- Math.cos(THREE.MathUtils.degToRad(r * i)) * 0.34*size+x;
                    addBox1.position.y = Math.sin(THREE.MathUtils.degToRad(r * i)) * 0.34*size+y;
                    addBox1.position.z = z;
                    addBox1.rotation.z = -THREE.MathUtils.degToRad(r*(i)+n3);

                    this.scene.add(addBox1);

                    //外側の四角
                    let addBox2: THREE.Mesh=new THREE.Mesh(addObjectGeometry5,meshMaterial);
                    addBox2.position.x =- Math.cos(THREE.MathUtils.degToRad(r * i)) * 0.5*size+x;
                    addBox2.position.y = Math.sin(THREE.MathUtils.degToRad(r * i)) * 0.5*size+y;
                    addBox2.position.z = z;
                    addBox2.rotation.z = -THREE.MathUtils.degToRad(r*(i)+n3);
                    this.scene.add(addBox2);
                    }

                //外側の四角
                let addBox2: THREE.Mesh=new THREE.Mesh(addObjectGeometry5,meshMaterial);
                addBox2.position.x = Math.cos(THREE.MathUtils.degToRad(r * i)) * 0.5*size+x;
                addBox2.position.y = Math.sin(THREE.MathUtils.degToRad(r * i)) * 0.5*size+y;
                addBox2.position.z = z;
                addBox2.rotation.z = THREE.MathUtils.degToRad(r*(i)+n3)
      
                //棒
                let addBox3: THREE.Mesh=new THREE.Mesh(addObjectGeometry6,meshMaterial);
                addBox3.position.x = Math.cos(THREE.MathUtils.degToRad(r * i+90))*1.5*size+x ;
                addBox3.position.y = Math.sin(THREE.MathUtils.degToRad(r * i+90))*1.5*size+y;
                addBox3.position.z = z;
                addBox3.rotation.z = THREE.MathUtils.degToRad(r*(i));

                //三角柱　外向き
                let addBox4: THREE.Mesh=new THREE.Mesh(addObjectGeometry7,meshMaterial);
                addBox4.position.x = Math.cos(THREE.MathUtils.degToRad(r * i+90))*2.3*size+x ;
                addBox4.position.y = Math.sin(THREE.MathUtils.degToRad(r * i+90))*2.3*size+y;
                addBox4.position.z = z;
                addBox4.rotation.z = THREE.MathUtils.degToRad(r*(i));

                //三角柱　内向き
                let addBox5: THREE.Mesh=new THREE.Mesh(addObjectGeometry7,meshMaterial);
                addBox5.position.x = Math.cos(THREE.MathUtils.degToRad(r * i+90))*2.1*size+x ;
                addBox5.position.y = Math.sin(THREE.MathUtils.degToRad(r * i+90))*2.1*size+y;
                addBox5.position.z = z;
                addBox5.rotation.z = THREE.MathUtils.degToRad(r*(i)+180);

                //棒の四角短い　左
                let addBox6: THREE.Mesh=new THREE.Mesh(addObjectGeometry8,meshMaterial);
                addBox6.position.x = +Math.cos(THREE.MathUtils.degToRad(r * i+93+n3/6))*1.7*size +x;
                addBox6.position.y = +Math.sin(THREE.MathUtils.degToRad(r * i+93+n3/6))*1.7*size+y;
                addBox6.position.z = z;
                addBox6.rotation.z = THREE.MathUtils.degToRad(r*(i)+r/2);

                //棒の四角短い　右
                let addBox7: THREE.Mesh=new THREE.Mesh(addObjectGeometry8,meshMaterial);   
                addBox7.position.x = Math.cos(THREE.MathUtils.degToRad(r * i+87-n3/6))*1.7*size +x;
                addBox7.position.y = Math.sin(THREE.MathUtils.degToRad(r * i+87-n3/6))*1.7*size+y;
                addBox7.position.z = z;
                addBox7.rotation.z = THREE.MathUtils.degToRad(r*(i)-r/2);

                //棒の四角長い　左
                let addBox8: THREE.Mesh=new THREE.Mesh(addObjectGeometry9,meshMaterial);
                addBox8.position.x = Math.cos(THREE.MathUtils.degToRad(r * i+100+n3/6))*1.4*size+x ;
                addBox8.position.y = Math.sin(THREE.MathUtils.degToRad(r * i+100+n3/6))*1.4*size+y;
                addBox8.position.z = z;
                addBox8.rotation.z = THREE.MathUtils.degToRad(r*(i)+r/2);

                //棒の四角長い　右
                let addBox9: THREE.Mesh=new THREE.Mesh(addObjectGeometry9,meshMaterial);   
                addBox9.position.x = Math.cos(THREE.MathUtils.degToRad(r * i+80-n3/6))*1.4*size+x;
                addBox9.position.y = Math.sin(THREE.MathUtils.degToRad(r * i+80-n3/6))*1.4*size+y;
                addBox9.position.z = z;
                addBox9.rotation.z = THREE.MathUtils.degToRad(r*(i)-r/2);


                //オブジェクトを追加
                this.scene.add(addBox2);
                this.scene.add(addBox1);
                this.scene.add(addBox3);
                this.scene.add(addBox4);
                this.scene.add(addBox5);
                this.scene.add(addBox6);
                this.scene.add(addBox7);
                this.scene.add(addBox8);
                this.scene.add(addBox9);
            }
            
        

       
        
            //オブジェクトのシーンへの追加
            this.scene.add(addObject1);
            this.scene.add(addSmallSix);
            this.scene.add(addBigSix);
            this.scene.add(addWhiteFloor);
            
          
        
        }

        //１１００個追加
         for (let i: number = 0; i < 100; i++) {
           // addcube();
            addObject();
         }
       



        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            this.cube.rotateX(0.01);
            

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-3, 3, 3));
    document.body.appendChild(viewport);
}
