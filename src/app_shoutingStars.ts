import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const MeshLineModule: any = require('three.meshline');

// 複数の流れ星の情報を保持するための型定義
type StarContainer = {
    mesh: THREE.Mesh;           // 星本体のメッシュ
    trailGroup: THREE.Group;    // 軌跡のセグメントを保持するグループ
    trailPoints: THREE.Vector3[]; // 軌跡の頂点座標
    trailSegments: THREE.Mesh[];// 軌跡のBoxGeometryメッシュ
    startTime: number;          // 発射時刻 (clock.getElapsedTime()の時刻)
    isFinished: boolean;        // 軌道を終えたか
    interval:number;
};


class ThreeJSContainer {
    private scene: THREE.Scene;
    private clock: THREE.Clock = new THREE.Clock(); // 時間経過を追跡
    
    private maxTrailPoints = 30; // 軌跡の最大点数 (尾の長さ)

    // ⭐【修正】アクティブな流れ星を管理する配列
    private activeStars: StarContainer[] = [];
    
    // ⭐【修正】セグメントのベースジオメトリをクラスプロパティとして定義 (長さは1.0)
    private segmentGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0); 
    
    private orbitRadius: number = 2;       // 軌道の半径
    private orbitSpeed: number = 2;        // 軌道の速度（elapsedTimeに乗算される係数）

    // ⭐【追加】星本体の見た目のためのジオメトリとマテリアル
    private starGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    private starMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        blending: THREE.AdditiveBlending 
    });


    constructor() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    // Aキーが押されたときのハンドラ
    private handleKeyDown = (event: KeyboardEvent) => {
        // ⭐【修正】isStarActiveのチェックを削除。aキーで常に新しい星を発射する
        if (event.key.toLowerCase() === 'a') { 
            this.launchStar(1);
        }else if(event.key.toLowerCase()=="s"){
            this.launchStar(2);
        }else if(event.key.toLowerCase()=="d"){
            this.launchStar(3);
        }
    }

    // 流れ星を発射するロジック
    private launchStar = (interval:number) => {
        const currentTime = this.clock.getElapsedTime();

        // 1. 新しいメッシュとグループを生成
        const newStarMesh = new THREE.Mesh(this.starGeometry, this.starMaterial.clone());
        const newTrailGroup = new THREE.Group();
        
        // 2. シーンに追加
        this.scene.add(newStarMesh);
        this.scene.add(newTrailGroup);

        // 3. コンテナオブジェクトを生成し、初期位置を設定
        const newStar: StarContainer = {
            mesh: newStarMesh,
            trailGroup: newTrailGroup,
            trailPoints: [],
            trailSegments: [],
            startTime: currentTime,
            isFinished: false,
            interval:interval
        };

        // 初期位置を即座に設定 (Z=2, X=0, Y=0 の位置からスタート)
        newStarMesh.position.set(0, 0, this.orbitRadius);
        
        // 4. 配列に追加
        this.activeStars.push(newStar);
    }

    // 画面部分の作成（省略なし）
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000009));
        renderer.shadowMap.enabled = true;

        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos); 
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
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

    // シーンの作成
    private createScene = () => {
        this.scene = new THREE.Scene();

        // ライトの設定（省略なし）
        let light = new THREE.DirectionalLight(0xffeebb, 0.8);
        light.position.set( 0, 15, 10);
        light.castShadow = true;
        
        const lightTarget = new THREE.Object3D();
        lightTarget.position.set( 2.5, 0, 0);
        this.scene.add(lightTarget);
        light.target = lightTarget;
        
        const shadowMapSize = 2048;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize     
        const shadowCameraHalfSize = 10;
        light.shadow.camera.left = -shadowCameraHalfSize;
        light.shadow.camera.right = shadowCameraHalfSize;
        light.shadow.camera.top = shadowCameraHalfSize;
        light.shadow.camera.bottom = -shadowCameraHalfSize;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 40;
        light.shadow.bias = -0.0005;
        this.scene.add(light);
        
        // 毎フレームのupdateを呼んで，更新
        let update: FrameRequestCallback = (time) => {
            const elapsedTime = this.clock.getElapsedTime(); 
            
            // ⭐【修正】アクティブな星をすべて処理するループ
            this.activeStars.forEach(star => {
                //半径を決める
                this.orbitRadius=0.5*star.interval;
                if (star.isFinished) return; // 終了済みの星はスキップ

                const timeSinceLaunch = elapsedTime - star.startTime;
                const angle = timeSinceLaunch * this.orbitSpeed;
                
                // 1周（2πラジアン）を回ったら星を消滅（終了）させる
                if (angle >= 2 * Math.PI) {
                    star.isFinished = true;
                    // シーンからメッシュを削除
                    this.scene.remove(star.mesh);
                    this.scene.remove(star.trailGroup);
                    return; 
                }
                
                // 軌道計算
                const trailThickness = 0.05; 
                const newX = Math.sin(angle) * this.orbitRadius;
                const newY = 0; 
                const newZ = Math.cos(angle) * this.orbitRadius;
                const newPosition = new THREE.Vector3(newX, newY, newZ);

                star.mesh.position.copy(newPosition);

                // 軌跡の頂点を追加
                star.trailPoints.push(newPosition.clone());

                // 軌跡の点数を制限
                while(star.trailPoints.length > this.maxTrailPoints){
                    star.trailPoints.shift();
                }

                // 軌跡セグメントの更新
                if(star.trailPoints.length >= 2){
                    const p1 = star.trailPoints[star.trailPoints.length - 2];
                    const p2 = star.trailPoints[star.trailPoints.length - 1];

                    const distance = p1.distanceTo(p2);
                    const midPoint = p1.clone().lerp(p2, 0.5);

                    let segmentToUpdate:THREE.Mesh;
                    
                    if(star.trailSegments.length < this.maxTrailPoints - 1){
                        // 新規作成
                        const material = new THREE.MeshBasicMaterial({ 
                            color: 0x88bbff,
                            transparent: true, 
                            blending: THREE.AdditiveBlending,
                            depthWrite: false, 
                            side: THREE.DoubleSide 
                        });
                        segmentToUpdate = new THREE.Mesh(this.segmentGeometry, material);
                        segmentToUpdate.scale.x = trailThickness; // 幅
                        segmentToUpdate.scale.y = trailThickness; // 高さ
                        star.trailGroup.add(segmentToUpdate);
                        star.trailSegments.push(segmentToUpdate);
                    } else {
                        // 再利用（最も古いものを再利用し、配列の最後へ）
                        segmentToUpdate = star.trailSegments.shift() as THREE.Mesh;
                        star.trailSegments.push(segmentToUpdate); 
                    }
                    
                    // スケールと位置、回転を更新
                    segmentToUpdate.scale.z = distance;
                    segmentToUpdate.position.copy(midPoint);
                    const orientation = new THREE.Quaternion();
                    const offset = new THREE.Vector3().subVectors(p2, p1); 
                    orientation.setFromUnitVectors(new THREE.Vector3(0, 0, 1), offset.clone().normalize()); 
                    segmentToUpdate.setRotationFromQuaternion(orientation);

                    // フェードアウト効果の適用
                    star.trailSegments.forEach((mesh, index) => {
                        const ratio = index / star.trailSegments.length; 
                        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.pow(ratio, 1.5) * 0.8; 
                    });
                }
            });

            // ⭐【新規】終了した星を activeStars 配列から削除し、メモリ使用量を管理する
            this.activeStars = this.activeStars.filter(star => !star.isFinished);
            
            requestAnimationFrame(update);
        }
    
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-3, 4, 2));
    document.body.appendChild(viewport);
}