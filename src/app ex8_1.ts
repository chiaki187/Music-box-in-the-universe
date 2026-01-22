//23FI094 早﨑千明
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { collapseTextChangeRangesAcrossMultipleVersions, convertToObject } from "typescript";

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

        // 頂点座標の定義
        const vertices = new Float32Array([
            //三角から四角に変更したよ
            
            0.5,0.5,0.5,
            -0.5,0.5,0.5,
            -0.5,-0.5,0.5,
            0.5,-0.5,0.5,
            0.5,-0.5,-0.5,
            -0.5,-0.5,-0.5,
            -0.5,0.5,-0.5,
            0.5,0.5,-0.5
            

            
           


        ]);

        // 頂点インデックス四角形バージョン
        
        const indices = [ 
         // 0,2,1,1,2,3
          0,1,2,2,3,0,0,3,7,7,3,4,4,3,2,2,5,4,2,1,6,2,6,5,6,1,7,7,1,0,5,6,7,7,4,5
          
        ];
        let colors = new Float32Array([
            0.0, 0, 0.0, //赤
            1.0, 0.0, 0.0, 
            1.0, 1.0, 0.0 ,
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 0.0, 1.0,
            0.0, 0.0, 1.0

        ]);

        

        const uvs = new Float32Array([
            -0.5,0.5,0.5,//一番上の頂点
            0.5,0.5, 0.5,//　左の部分
            0.5,-0.5,0.5 //　　右の部分
        ]);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );//頂点情報と三次元のものだといっている
        geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3));
        geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 3));
        geometry.computeVertexNormals();  //法線を計算しています


        const loader = new THREE.TextureLoader();
        const texture = loader.load('parasol.jpg');
        const material = new THREE.MeshBasicMaterial( { vertexColors:true } );
        //const material = new THREE.MeshBasicMaterial( { color: new THREE.Color(1, 0, 0) } );
      //  const material = new THREE.MeshBasicMaterial( { color: new THREE.Color(1, 0, 0) } );
        const mesh = new THREE.Mesh( geometry, material );
        geometry.setIndex(indices);//インデックスを追加
        this.scene.add(mesh);



        

        //xyz軸の追加
        const axesBarLength = 10.0;
        this.scene.add(new THREE.AxesHelper(axesBarLength));    

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
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

async function readFile(path): Promise<string> {
    return new Promise((resolve => {
        const loader = new THREE.FileLoader();
        loader.load(path, (data) => {
                if(typeof data === "string") {
                    resolve(data);
                } else {
                    const decoder = new TextDecoder('utf-8');
                    const decodedString = decoder.decode(data);
                    resolve(decodedString);
                }
            },
        );
    }));
}


window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(1.5, 1.5, 1.5));
    document.body.appendChild(viewport);
}
