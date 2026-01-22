//23FI094 早﨑千明
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    // ドミノ（板）と球のオブジェクトをクラスプロパティとして宣言
    private cubeMesh: THREE.Mesh;
    private sphereMesh: THREE.Mesh;

    // アニメーション制御用の変数
    private isRotatingDomino: boolean = false;
    private rotationSpeed: number = 0.05; // 回転速度
    private targetRotationY: number = Math.PI / 2; // 目標のY軸回転角度 (90度)
    private currentRotationY: number = 0;

    constructor() {
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer({ antialias: true }); // アンチエイリアスを有効化
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed)); // 背景色
        renderer.shadowMap.enabled = true; // シャドウマップを有効にする

        //カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0)); // カメラの中心を原点に向ける

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene(); // シーンの初期化

        const render: FrameRequestCallback = () => {
            // ボールの移動
            this.sphereMesh.position.z -= 0.05; // Z軸負方向に移動

            // 簡易的な衝突判定 (ボールと板のZ座標が近い場合)
            if (!this.isRotatingDomino && this.sphereMesh.position.z <= 0.2) { // 板のZ座標(0)に近づいたら
                this.isRotatingDomino = true; // 回転開始フラグを立てる
            }

            // 板のY軸回転アニメーション
            if (this.isRotatingDomino) {
                if (this.currentRotationY < this.targetRotationY) {
                    this.currentRotationY += this.rotationSpeed;
                    if (this.currentRotationY > this.targetRotationY) {
                        this.currentRotationY = this.targetRotationY; // 目標角度を超えないように調整
                    }
                    this.cubeMesh.rotation.y = this.currentRotationY;
                }
            }
            
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); // レンダリングループを開始

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        // ★ドミノ（板）の作成 (Three.jsのみ) ★
        const dominoWidth = 0.5; // ドミノの幅
        const dominoHeight = 1; // ドミノの高さ
        const dominoDepth = 0.1; // ドミノの奥行き
        const geometry1 = new THREE.BoxGeometry(dominoWidth, dominoHeight, dominoDepth);
        const material1 = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // 緑色

        // Three.jsメッシュの作成
        this.cubeMesh = new THREE.Mesh(geometry1, material1);
        this.cubeMesh.castShadow = true;
        this.cubeMesh.receiveShadow = true;
        this.cubeMesh.position.set(0, dominoHeight / 2, 0); // 地面から少し浮かせた位置に配置
        this.scene.add(this.cubeMesh);
        
        // ★球の作成 (Three.jsのみ) ★
        const sphereRadius = 0.25; // 球の半径
        const geometry2 = new THREE.SphereGeometry(sphereRadius, 32, 16);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff4500 }); // オレンジ色
        this.sphereMesh = new THREE.Mesh(geometry2, sphereMaterial);
        this.sphereMesh.castShadow = true;
        this.sphereMesh.receiveShadow = true;
        // 球の初期位置をドミノの手前、ドミノの中心Y座標と同じ高さに設定
        this.sphereMesh.position.set(0, sphereRadius + 0.1, 3); // Z=3からZ=0のドミノに向かって動く
        this.scene.add(this.sphereMesh);
        
        // 地面を作成 (Three.jsのみ)
        const phongMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x808080 }); // 色を設定
        const planeGeometry = new THREE.PlaneGeometry(25, 25);
        const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
        planeMesh.rotateX(-Math.PI / 2); // 地面として水平にする
        planeMesh.receiveShadow = true;
        this.scene.add(planeMesh);
        
        // グリッド表示
        const gridHelper = new THREE.GridHelper( 10,);
        this.scene.add( gridHelper );  

        // 軸表示
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
        
        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff, 1); // 強さ1の白色ライト
        this.light.position.set(5, 10, 5); // ライトの位置
        this.light.castShadow = true; // 影を落とす
        this.light.shadow.mapSize.width = 1024; // 影の解像度
        this.light.shadow.mapSize.height = 1024;
        // シャドウカメラ設定は削除済み
        this.scene.add(this.light);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // 環境光
        this.scene.add(ambientLight);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(800, 600, new THREE.Vector3(5, 5, 5)); // カメラ位置を調整
    document.body.appendChild(viewport);
}