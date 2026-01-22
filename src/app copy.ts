import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private cloud:THREE.Points;
    private particleVelocity: THREE.Vector3[];

    private torusRadii: number[] = []; // 各わっかの半径を格納する配列
    private torusYBase: number; // わっかの基本的なY座標
    private particleInitialData: { angle: number; radius: number }[] = []; // パーティクルの初期角度と半径を保持


    constructor() {
        // コンストラクタは空のままでOK
    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer({ antialias: true }); // アンチエイリアスを有効にすると滑らかになります
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000)); // スカイボックスを使用する場合、この色は上書きされますが、念のため黒に
        renderer.shadowMap.enabled = true; // シャドウマップを有効にする
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 影を滑らかにする

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

        let orgelX = -3;
        let orgelY = 0;
        let orgelZ = 0;
        let orgelS = 1;

        
        // オルゴール部品の基本的なマテリアル
        let material = new THREE.MeshPhongMaterial({
            color: 0xa0a0a0,
            specular: 0xafafaf,
            shininess: 30
        });

        //下の台のマテリアル
       let materialunder = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 20
        });

        //針の台
        let BigDai = new THREE.BoxGeometry(5, 0.05, 2.5);
        let meshBigDai = new THREE.Mesh(BigDai, materialunder); // mesh変数名を変更してループ内のmeshと区別
        meshBigDai.position.set(2.5 * orgelS + orgelX, orgelY, orgelZ - 1 * orgelS); // 冗長な記述を修正
        meshBigDai.scale.set(orgelS, orgelS, orgelS);
        meshBigDai.receiveShadow = true // 影を落とすように設定
        this.scene.add(meshBigDai);

        //回すやつの台を支える台
        let Bigcircle = new THREE.BoxGeometry(0.6, 0.2, 0.6);
        let mesh1 = new THREE.Mesh(Bigcircle, material);
        mesh1.position.set(5 * orgelS + orgelX, orgelY + 0.05 * orgelS, orgelZ); // 冗長な記述を修正
        mesh1.scale.set(orgelS, orgelS, orgelS);
        mesh1.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh1);

        //回すやつの台
        let middlecircle = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32);
        let mesh2 = new THREE.Mesh(middlecircle, material);
        mesh2.position.set(5 * orgelS + orgelX, orgelY + 0.25 * orgelS, orgelZ); // 冗長な記述を修正
        mesh2.scale.set(orgelS, orgelS, orgelS);
        mesh2.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh2);

        //回すやつの台
        let covercircle = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
        let mesh3 = new THREE.Mesh(covercircle, material);
        mesh3.position.set(5 * orgelS + orgelX, orgelY + 0.45 * orgelS, orgelZ); // 冗長な記述を修正
        mesh3.scale.set(orgelS, orgelS, orgelS);
        mesh3.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh3);


        //このわっかに通す者たちのための座標格納
        this.torusYBase = orgelY + orgelS * 0.36; // わっかの基本的なY座標をクラスプロパティに保存
        this.torusRadii = []; // 念のため初期化

  
        // わっか
        for (let x = 0; x < 18; x++) {
         
            this.torusRadii.push(0.3 + 0.25 * x * orgelS); // スケール適用後の半径を保存

            let circle = new THREE.TorusGeometry(0.3 + 0.25 * x, 0.01, 4, 40);
            let mesh = new THREE.Mesh(circle, material);
            
            mesh.castShadow = true;
            mesh.rotateX(Math.PI / 2);
            mesh.position.set(orgelX,this.torusYBase, orgelZ);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        //振動版にねじをさし土台
        let negiDai = new THREE.BoxGeometry(4.4, 0.1, 0.5);
        let mesh4 = new THREE.Mesh(negiDai, material);
        mesh4.position.set(2.45 * orgelS + orgelX, orgelY + 0.15 * orgelS, orgelZ + orgelZ - 1.9 * orgelS); 
        mesh4.scale.set(orgelS, orgelS, orgelS);
        mesh4.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh4);

        //金属っぽいマテリアル
        let metalMaterial = new THREE.MeshPhongMaterial({
            color: 0xa0a0a0,   // 物体の基本的な色（拡散光）
            specular: 0xffffff, // 鏡面反射の色（ハイライトの色）
            shininess: 300      // 光沢の強さ
        });

        //振動版
        for (let x = 0; x < 18; x++) {
            let boxes = new THREE.BoxGeometry(0.15, 0.01, 1.9);
            let mesh = new THREE.Mesh(boxes, metalMaterial);
            mesh.castShadow = true;
            mesh.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ - 1.1 * orgelS); 
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        //振動板の間
        for (let x = 0; x < 17; x++) {
            let boxes = new THREE.BoxGeometry(0.15, 0.01, 1.8 - x * 0.07);
            let mesh = new THREE.Mesh(boxes, metalMaterial);
            mesh.castShadow = true;
            mesh.position.set(x * 0.25 * orgelS + 0.4 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ - 1.1 * orgelS - 0.035 * x * orgelS); 
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        //振動版固定板
        let negiDai2 = new THREE.BoxGeometry(4.3, 0.05, 0.5);
        let mesh5 = new THREE.Mesh(negiDai2, material);
        mesh5.position.set(2.40 * orgelS + orgelX, orgelY + 0.21 * orgelS, orgelZ + orgelZ - 1.9 * orgelS); 
        mesh5.scale.set(orgelS, orgelS, orgelS);
        mesh5.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh5);

        //ねじ用のマテリアル
        let material2 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0
        });

        //ねじ
        for (let i = 0; i < 3; i++) {
            let Negi = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 6);
            let mesh = new THREE.Mesh(Negi, material2);
            mesh.castShadow = true; // 影を落とすように設定
            mesh.position.set((0.8 + i * 1.5) * orgelS + orgelX, orgelY + 0.24 * orgelS, -2 + orgelZ + orgelZ + 0.11 * orgelS); 
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        //歯車の櫛
        let NegiCylinder = new THREE.CylinderGeometry(0.02, 0.02, 5, 6); // 変数名を変更してループ内のNegiと区別
        let mesh6 = new THREE.Mesh(NegiCylinder, material);
        mesh6.position.set(2.7 * orgelS + orgelX, orgelY + 0.19 * orgelS, orgelZ + orgelZ); 
        mesh6.rotateZ(Math.PI / 2);
        mesh6.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh6);

        //歯車
        for (let x = 0; x < 18; x++) {
            //本体
            let boxesCylinder = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 32);
            let mesh = new THREE.Mesh(boxesCylinder, material);
            mesh.castShadow = true; // 影を落とすように設定

            for (let y = 0; y < 5; y++) {
                //刃の部分
                let breed = new THREE.BoxGeometry(0.35, 0.05, 0.01);
                let mesh2 = new THREE.Mesh(breed, material); // mesh2を毎回定義
                mesh2.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ); 
                mesh2.rotateZ(Math.PI / 2);
                mesh2.rotateY(Math.PI / 5 * y);
                mesh2.scale.set(orgelS, orgelS, orgelS);
                mesh2.castShadow = true; // 影を落とすように設定
                this.scene.add(mesh2);
            }

            mesh.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ); 
            mesh.rotateZ(Math.PI / 2);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        //回すところのとって
        let totte = new THREE.CylinderGeometry(0.16, 0.16, 0.4, 6);
        let mesh7 = new THREE.Mesh(totte, material);
        mesh7.position.set(5.85 * orgelS + orgelX, orgelY + 1.5 * orgelS, orgelZ + orgelZ); 
        mesh7.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh7);


        //回すところのチューブ
        const path = new CustomSinCurve(orgelS * 0.2);
        const geometry1 = new THREE.TubeGeometry(path, 20, 0.1, 8, false);
        const mesh8 = new THREE.Mesh(geometry1, material);
        mesh8.rotateZ(Math.PI / 4);
        mesh8.position.set(5.7 * orgelS + orgelX, orgelY + 1.2 * orgelS, orgelZ + orgelZ); 
        mesh8.castShadow = true; // 影を落とすように設定
        this.scene.add(mesh8);



        

        //どのわっかにどのパーティクルを置いたか調べる変数
        const particles: number[][] = []; // 各わっかの半径を格納する配列

        ///パーティクルの作成
                let createParticles = () => {
                    //ジオメトリの作成
                    const geometry = new THREE.BufferGeometry();
        
                    //マテリアルの作成
                    //const material = new THREE.PointsMaterial({ size: 1, color: 0xFFFFFF, transparent: true, opacity:0.8 });
                    const textureLoader = new THREE.TextureLoader();
                    const texture = textureLoader.load('stardust.png'); 
                    const material = new THREE.PointsMaterial({
                        size: 0.3,
                        map: generateSprite(150, 200, 255),
                        blending: THREE.AdditiveBlending,
                        color: 0x9acfff,
                        depthWrite: false,
                        transparent: true,
                        opacity: 1
                    });

                    
                    //particleの作成
                    const particleNum = 100; // パーティクルの数
                    const positions = new Float32Array(particleNum * 3);
                    this.particleVelocity = []; // クラスプロパティを初期化
                    this.particleInitialData = []; // クラスプロパティを初期化


                    let particleIndex = 0;
                    for (let x =0; x <= particleNum; x++){
                       
                        // ランダムなわっかの半径を選択し、その半径内にX/Z座標を配置
                        const randomRadiusIndex = Math.floor(Math.random() * this.torusRadii.length);
                        const selectedRadius = this.torusRadii[randomRadiusIndex]; // いずれかのわっかの半径を選ぶ
                  

                        const r=Math.random()*Math.PI*2;
                    

                        //↑の情報を格納
                        particles.push([r,selectedRadius]);

                        positions[particleIndex++] = orgelX + Math.cos(r) * selectedRadius; // x座標
                        positions[particleIndex++] = this.torusYBase; // y座標
                        positions[particleIndex++] = orgelZ + Math.sin(r) * selectedRadius; // z座標
                        
                        this.particleInitialData.push({ angle: r, radius: selectedRadius });
                        //  particleVelocityのプッシュは1回のみにする (Y軸アニメーションしないので0,0,0でOK)
                        this.particleVelocity.push(new THREE.Vector3(0.0, 0.0, 0.0));
                        
                    }
                    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
        
                    //THREE.Pointsの作成
                    this.cloud = new THREE.Points(geometry, material);
                    //シーンへの追加
                    this.scene.add(this.cloud);
                    
        
                }
                
                
                createParticles();





    




        // --- ライトの設定 ---
        // 宇宙の太陽をシミュレートするDirectionalLight
        let light = new THREE.DirectionalLight(0xffffff, 1.5); // 強度を少し上げる
        light.position.set(orgelX + 10, orgelY + 15, orgelZ - 10); // オルゴール部品から少し離れた位置に
        light.castShadow = true;

        // ライトのターゲットをオルゴール部品の中心付近に設定
        const lightTarget = new THREE.Object3D();
        lightTarget.position.set(orgelX + 2.5, orgelY, orgelZ); // オルゴール部品の中心あたり
        this.scene.add(lightTarget); // ターゲットオブジェクトをシーンに追加
        light.target = lightTarget;

        // 影の品質と描画範囲の調整
        const shadowMapSize = 2048; // 影の解像度 (大きいほど綺麗)
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;

        const shadowCameraHalfSize = 10; // 影を計算するカメラの範囲の半分
        light.shadow.camera.left = -shadowCameraHalfSize;
        light.shadow.camera.right = shadowCameraHalfSize;
        light.shadow.camera.top = shadowCameraHalfSize;
        light.shadow.camera.bottom = -shadowCameraHalfSize;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 40; // オブジェクトとターゲットをカバーする距離
        light.shadow.bias = -0.0005; // 影のノイズ（シャドウアクネ）を軽減するためのバイアス（任意）
        this.scene.add(light);

        // 非常に弱い環境光 (完全に真っ暗になるのを防ぐため)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.08); // 非常に弱い灰色光
        this.scene.add(ambientLight);
        // --- ライト設定ここまで ---

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const clock = new THREE.Clock();
        let update: FrameRequestCallback = (time) => {

        const deltaTime = clock.getDelta();

            const geom = <THREE.BufferGeometry>this.cloud.geometry;
            const positions = geom.getAttribute('position'); // 座標データ

            for(let i=0;i<this.particleVelocity.length;i++){
                let currentAngle = this.particleInitialData[i].angle;
                    const radius = this.particleInitialData[i].radius;

                    // 回転速度を調整: 1秒間に30度回転
                    currentAngle += (Math.PI / 180) * deltaTime * 30;
                    this.particleInitialData[i].angle = currentAngle; // 角度を更新

                    // Y座標は変えないので現在の値を取得
                    const particleY = positions.getY(i);

                    const x = orgelX + Math.cos(currentAngle) * radius;
                    const z = orgelZ + Math.sin(currentAngle) * radius;

                    positions.setXYZ(i, x, particleY, z);

            }
            
            
            positions.needsUpdate = true;



            
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    // カメラの位置を調整して、オルゴール全体が見えるように
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-8, 5, 8)); // カメラの座標
    document.body.appendChild(viewport);
}

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
    public scale: number;

    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
        // X座標: tが0から1に変化するにつれて、-5から1まで変化（長さ6）
        const tx = t * 6 - 5;
        // Y座標: tが0から1に変化するにつれて、サイン波が2サイクル繰り返す
        const ty = Math.sin(2 * Math.PI * t);
        // Z座標: 常に0（XY平面上）
        const tz = 0;

        // 計算した座標にスケール値を適用して返す
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}

//パーティクルの描画設定
        let generateSprite = ( r:number, g:number, b:number) =>{
                //新しいキャンバスの作成
                let canvas = document.createElement('canvas');
                canvas.width = 16;
                canvas.height = 16;
        
                //円形のグラデーションの作成
                let context = canvas.getContext('2d');
                let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.1, 'rgba('+r+','+g+','+b+',1)');
                gradient.addColorStop(0.3, 'rgba('+r+','+g+','+b+',0.9)');
                gradient.addColorStop(1, 'rgba('+r/10+','+g/10+','+b/10+',1)');
                                        context.fillStyle = gradient;
                context.fillRect(0, 0, canvas.width, canvas.height);
                //テクスチャの生成
                let texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;
                return texture;
        }
