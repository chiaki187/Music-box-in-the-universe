//23FI094 早﨑千明

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

   /////花びら
   
        let points1:THREE.Vector2[] = []; //一番外側
        let points2:THREE.Vector2[]=[];
        let points3:THREE.Vector2[]=[];
        let points4:THREE.Vector2[]=[]; //一番内側
        let points5:THREE.Vector2[]=[];//花びらの中にある球
        let points6:THREE.Vector2[]=[]; //花を包んでいる紙
        let points7:THREE.Vector2[]=[];  //リボン

        //茎
        let shape=new THREE.Shape();
        shape.moveTo(0,0.5);
        shape.quadraticCurveTo(1,0,0,-0.5);
        shape.quadraticCurveTo(-1,0,0,0.5);

         let extrudeSettings = {
            steps: 1,
            depth: 70,
            bevelEnabled: false,
            bevelThickness: 4,
            bevelSize: 2,
            bevelSegments: 3
         };
         
         //机の木の部分
         let shape2=new THREE.Shape();
         shape2.moveTo(-20,20);
         shape2.lineTo(20,20);
         shape2.lineTo(20,-20);
         shape2.lineTo(-20,-20);
         shape2.lineTo(-20,20);

         let extrudeSettings2 = {
            steps: 1,
            depth: 5,
            bevelEnabled: false,
            bevelThickness: 4,
            bevelSize: 2,
            bevelSegments: 3
         };

         //机の鉄の部分
         let shape3=new THREE.Shape();
         shape3.moveTo(-18,18);
         shape3.lineTo(18,18);
         shape3.lineTo(18,-18);
         shape3.lineTo(-18,-18);
         shape3.lineTo(-18,18);

         let extrudeSettings3 = {
            steps: 1,
            depth: 8,
            bevelEnabled: false,
            bevelThickness: 4,
            bevelSize: 2,
            bevelSegments: 3
         };

        //机の脚
         let shape4=new THREE.Shape();
         shape4.moveTo(0,3);
         shape4.lineTo(3,3);
         shape4.lineTo(3,0);
         shape4.lineTo(0,0);
         

         let extrudeSettings4 = {
            steps: 1,
            depth: 50,
            bevelEnabled: false,
            bevelThickness: 4,
            bevelSize: 2,
            bevelSegments: 3
         };
        let pointNum=13;

        for(let i=0;i<pointNum;i++){
            points1.push(new THREE.Vector2( i,0.6*Math.exp(i*0.2)-1));           ///練習の回答！！！！！！！！！！！！！！！！！！！！！
            points2.push(new THREE.Vector2 (i*0.8,0.8*Math.exp(i*0.2)-0.7));
            points3.push(new THREE.Vector2 (i*0.6,0.9*Math.exp(i*0.2)-0.4));
            points4.push(new THREE.Vector2 (i*0.4,0.9*Math.exp(i*0.2)-0.1));        
            points5.push(new THREE.Vector2(1.5*Math.cos(Math.PI * i / (pointNum - 1) - Math.PI / 2),
                                  3+1.5*Math.sin(Math.PI * i / (pointNum - 1) - Math.PI / 2)));

           
        }

        points6.push(new THREE.Vector2(13,-8));
        points6.push(new THREE.Vector2(1,-50));
        points6.push(new THREE.Vector2(3,-55));

        points7.push(new THREE.Vector2(1.5,-46));
        points7.push(new THREE.Vector2(1.5,-51));
        
        
        


        let shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings); //茎のgeometry
        let shapeGeometry2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);//机のgeometry
        let shapeGeometry3 = new THREE.ExtrudeGeometry(shape3, extrudeSettings3);//机のテツの部分geometry
        let shapeGeometry4 = new THREE.ExtrudeGeometry(shape4, extrudeSettings4);//机の足のgeometry

        //机の金属部分は黒で金属質にする
        let meshmaterial3 =new THREE.MeshStandardMaterial({ color: 0x000000 });
        meshmaterial3.metalness = 0.8;//値を変えてみましょう
        meshmaterial3.roughness = 0.5;//値を変えてみましょう
        //机の木の部分
        let meshmaterial4 =new THREE.MeshStandardMaterial({ color: 0xdaa520 });
        meshmaterial4.flatShading = true;
        
        //茎の緑色
        let meshMaterial = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});
        

        //一番外側の花びら
        let latheGeometry11 = new THREE.LatheGeometry(points1,12,0,Math.PI/3);//第二引数がy軸で回るときに分ける直線の数、上げるほど円に近くなる
        let latheGeometry12 = new THREE.LatheGeometry(points1,12,2*Math.PI/3,Math.PI/3);
        let latheGeometry13 = new THREE.LatheGeometry(points1,12,4*Math.PI/3,Math.PI/3);

        let n2=Math.PI/6;//ずらす
       
        //二番目に外側
        let latheGeometry21 = new THREE.LatheGeometry(points2,12,n2+0,Math.PI/3);//第二引数がy軸で回るときに分ける直線の数、上げるほど円に近くなる
        let latheGeometry22 = new THREE.LatheGeometry(points2,12,n2+2*Math.PI/3,Math.PI/3);
        let latheGeometry23 = new THREE.LatheGeometry(points2,12,n2+4*Math.PI/3,Math.PI/3);

        let n3=Math.PI/3;//ずらす

        //三番目に外側
        let latheGeometry31 = new THREE.LatheGeometry(points3,12,n3+0,Math.PI/3);//第二引数がy軸で回るときに分ける直線の数、上げるほど円に近くなる
        let latheGeometry32 = new THREE.LatheGeometry(points3,12,n3+2*Math.PI/3,Math.PI/3);
        let latheGeometry33 = new THREE.LatheGeometry(points3,12,n3+4*Math.PI/3,Math.PI/3);

        let n4=Math.PI/2;//ずらす

        //四番目に外側
        let latheGeometry41 = new THREE.LatheGeometry(points4,12,n4+0,Math.PI/3);//第二引数がy軸で回るときに分ける直線の数、上げるほど円に近くなる
        let latheGeometry42 = new THREE.LatheGeometry(points4,12,n4+2*Math.PI/3,Math.PI/3);
        let latheGeometry43 = new THREE.LatheGeometry(points4,12,n4+4*Math.PI/3,Math.PI/3);

        //花の中心の球
        let latheGeometry5 = new THREE.LatheGeometry(points5);
        //花を包んでいる紙
        let latheGeometry6 = new THREE.LatheGeometry(points6,50);
        //↑のリボン
        let latheGeometry7 = new THREE.LatheGeometry(points7,100);

        //赤色
        let lathmaterial =new THREE.MeshPhongMaterial({color:0xff4000, side:THREE.DoubleSide,flatShading:true});
        //白色
        let lathmaterial2 =new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide,flatShading:true});
      


        let latheMesh11 = new THREE.Mesh(latheGeometry11, lathmaterial);
        let latheMesh12 = new THREE.Mesh(latheGeometry12, lathmaterial);
        let latheMesh13 = new THREE.Mesh(latheGeometry13, lathmaterial);

        let latheMesh21 = new THREE.Mesh(latheGeometry21, lathmaterial);
        let latheMesh22 = new THREE.Mesh(latheGeometry22, lathmaterial);
        let latheMesh23 = new THREE.Mesh(latheGeometry23, lathmaterial);

        let latheMesh31 = new THREE.Mesh(latheGeometry31, lathmaterial);
        let latheMesh32 = new THREE.Mesh(latheGeometry32, lathmaterial);
        let latheMesh33 = new THREE.Mesh(latheGeometry33, lathmaterial);

        let latheMesh41 = new THREE.Mesh(latheGeometry41, lathmaterial);
        let latheMesh42 = new THREE.Mesh(latheGeometry42, lathmaterial);
        let latheMesh43 = new THREE.Mesh(latheGeometry43, lathmaterial);

        let latheMesh5 = new THREE.Mesh(latheGeometry5, lathmaterial);

        let latheMesh6 = new THREE.Mesh(latheGeometry6, lathmaterial2);
        let latheMesh7 = new THREE.Mesh(latheGeometry7, lathmaterial);
        
     

       let mesh = new THREE.Mesh(shapeGeometry,meshMaterial);
       //机の木のところ
       let mesh2 = new THREE.Mesh(shapeGeometry2,meshmaterial4);
       //机の木の下の金属部分
       let mesh3 = new THREE.Mesh(shapeGeometry3,meshmaterial3);
       //机のあし
       let mesh4 = new THREE.Mesh(shapeGeometry4,meshmaterial3);
       mesh.rotateX(Math.PI/2);

      

       let group = new THREE.Group();//ここで一輪の花を作る
       group.add(mesh)
       //花びら追加
        group.add(latheMesh11);
        group.add(latheMesh12);
        group.add(latheMesh13);
        group.add(latheMesh21);
        group.add(latheMesh22);
        group.add(latheMesh23);
        group.add(latheMesh31);
        group.add(latheMesh32);
        group.add(latheMesh33);
        group.add(latheMesh41);
        group.add(latheMesh42);
        group.add(latheMesh43);
        group.add(latheMesh5);
        
        
        group.scale.set(0.5,0.5,0.5);
      //  this.scene.add(group);

      //上で作った花をコピーして増やしていく
        let group2=group.clone();
        group2.position.x+=7;
        group2.rotateZ(-Math.PI/16);
       

        let group3=group.clone();
        group3.position.x+=4;
        group3.position.z+=8;
        group3.position.y-=3;
        group3.rotateZ(-Math.PI/17);
        group3.rotateX(Math.PI/15);
       

        let group4=group.clone();
        group4.position.x-=4;
        group4.position.z-=5;
        group4.position.y-=4;
        group4.rotateZ(Math.PI/17);
        group4.rotateX(-Math.PI/15);
     

        let group5=group.clone();
        group5.position.x-=8;
        group5.position.z+=5;
        group5.position.y-=2;
        group5.rotateZ(Math.PI/13);
        group5.rotateX(Math.PI/13);
    

        let group6=group.clone();
        group6.position.x-=1;
        group6.position.z+=10;
        group6.position.y-=6;
        group6.rotateX(Math.PI/10);
     

        let group7=group.clone();
        group7.position.x+=8;
        group7.position.z-=9;
        group7.position.y-=3;
        group7.rotateZ(-Math.PI/13);
        group7.rotateX(-Math.PI/17);
      

        let group8=group.clone();
        group8.position.x+=2;
        group8.position.z-=12;
        group8.position.y-=4;
        group8.rotateZ(-Math.PI/13);
        group8.rotateX(-Math.PI/10);
       

        let group9=group.clone();
        group9.position.x-=11;
        group9.position.z-=2;
        group9.rotateZ(Math.PI/13);
        group9.rotateX(0);
       

         let group10=group.clone();
        group10.position.x+=13;
        group10.position.z+=2;
        group10.position.y-=7;
        group10.rotateZ(-Math.PI/7);
        group10.rotateX(Math.PI/19);
       

       let groupL=new THREE.Group();//増やした花を一個のグループにまとめる
       groupL.add(group);
       groupL.add(group2);
       groupL.add(group3);
       groupL.add(group4);
       groupL.add(group5);
       groupL.add(group6);
       groupL.add(group7);
       groupL.add(group8);
       groupL.add(group9);
       groupL.add(group10);
       groupL.add(latheMesh6);
       groupL.add(latheMesh7);

       
       let groupDesc=new THREE.Group();//机部分のグループ
       mesh2.position.z-=1;
       groupDesc.add(mesh2);
       groupDesc.add(mesh3);
       mesh4.position.x+=14;
       mesh4.position.y+=14;
       groupDesc.add(mesh4);
       groupDesc.position.y-=7;
       groupDesc.position.x+=7;

       //机の脚の量産と位置調整
       let mesh42=mesh4.clone();
       mesh42.position.x-=31;
       mesh42.position.y-=0;
       groupDesc.add(mesh42);

       let mesh43=mesh4.clone();
       mesh43.position.y-=31;
       groupDesc.add(mesh43);


       let mesh44=mesh4.clone();
       mesh44.position.x-=31;
       mesh44.position.y-=31;
       groupDesc.add(mesh44);
       groupDesc.position.z-=5;
       groupDesc.rotateX(Math.PI/2);
       groupDesc.scale.set(0.7,0.7,0.7);
    
      
       //最終調整
       groupL.rotateX(Math.PI/14*5);
       groupL.rotateZ(Math.PI/3);
       groupL.position.y+=1;
       this.scene.add(groupDesc);
       groupL.scale.set(0.50,0.5,0.5);
       this.scene.add(groupL);

       
      


      ////四角



      



        //ライトの設定
        this.light = new THREE.SpotLight(0xffffff);
        let lvec = new THREE.Vector3(5, 5, 5).normalize();
        this.light.position.set(lvec.x+30, lvec.y+30, lvec.z+30);
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

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 30, 50));
    document.body.appendChild(viewport);
}
