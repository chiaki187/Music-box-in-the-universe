//23FI094  早﨑千明 
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

        
    
        


     
    ///--------------------------------



     let addSceneFromObjFile = async (filePath: string,materialPath: string) => {  
            const meshStr = await readFile(filePath);//ファイルを詠む関数、ファイルの中身をすべて文字列で返すの
            const mateStr  = await readFile(materialPath); //マテリアルのファイル名

            //このままではファイルの中身を読む込み完了する前に[await]で同期化する
    
            let vertices :number[][] =[];//頂点情報
            
            let vertexPos :number[] = [];//頂点インデックス
            let vertexUv :number[]=[];
            let vertexuv: number[][]=[];
            


            let verColor :number[]= []; //色情報
            const positionArray: number[] = [];
            const uvArray: number[] = [];
    
            const meshLines = meshStr.split("\n");//改行で読み込む
            const mateLines = mateStr.split("\n");//マテリアルファイルを改行で読み込む

            
            for(let i = 0; i < meshLines.length; ++i) {
                const meshLine = meshLines[i];
                const meshSpaceSplitArray = meshLine.split(" ");
                
    
                const meshType = meshSpaceSplitArray[0]; //どの情報を表すか、文字列
                if(meshType == "v") { //頂点
                    vertices.push([
                        parseFloat(meshSpaceSplitArray[1]),
                        parseFloat(meshSpaceSplitArray[2]),
                        parseFloat(meshSpaceSplitArray[3])
                        ])
                } else if (meshType=="vt"){
                    vertexuv.push([parseFloat(meshSpaceSplitArray[1]),parseFloat(meshSpaceSplitArray[2])]);
                    
                }else if (meshType == "f") { //面の情報
                    const f1 = meshSpaceSplitArray[1].split("/");
                    const f2 = meshSpaceSplitArray[2].split("/");
                    const f3 = meshSpaceSplitArray[3].split("/");
                    vertexPos.push(parseInt(f1[0])-1 ); //頂点インデックス
                    vertexPos.push(parseInt(f2[0]) -1); //頂点インデックス
                    vertexPos.push(parseInt(f3[0]) -1); //頂点インデックス

                    vertexUv.push(parseInt(f1[1]) -1); //頂点インデックス
                    vertexUv.push(parseInt(f2[1]) -1); //頂点インデックス
                    vertexUv.push(parseInt(f3[1]) -1); //頂点インデックス
                } 
            }

            for (let i = 0; i < vertexPos.length; i++) {
                const pos = vertices[vertexPos[i]];
                const uv = vertexuv[vertexUv[i]];

                positionArray.push(pos[0]);
                positionArray.push(pos[1]);
                positionArray.push(pos[2]);
                uvArray.push(uv[0]);
                uvArray.push(uv[1]);
            }

            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionArray), 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvArray), 2));

                        


          
    
            
            geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positionArray), 3 ) );
            
            geometry.computeVertexNormals();  
          
           // console.log(verColor[0]+ verColor[1]+ verColor[2]);
           const loader=new THREE.TextureLoader();
            const texture=loader.load("tex_dice.png");
            const material = new THREE.MeshBasicMaterial(  {map: texture} );
            
    
            const mesh = new THREE.Mesh( geometry, material );
            this.scene.add(mesh);
        }
    addSceneFromObjFile("dice.obj","dice.mtl");    
    



    ////-----------------------------------
        

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

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 3));
    document.body.appendChild(viewport);
}
