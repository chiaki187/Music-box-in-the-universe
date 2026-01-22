import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;

    // 取っ手を回転させるための度
    private radius:number=0;
    // 異なるサイズの星のグループ (THREE.Meshに変更)
    private cloudTorusA: THREE.Group;  // わっか上の星（種類A）
    private cloudTorusB: THREE.Group;  // わっか上の星（種類B）
    // 周囲に散らす静止した星 (THREE.Meshに変更)
    private cloudStaticSmall: THREE.Group;   // 小さい静止星
    private cloudStaticMedium: THREE.Group;  // 中くらいの静止星
    private cloudStaticLarge: THREE.Group;   // 大きい静止星

    private torusRadii: number[] = []; // 各わっかの半径を格納する配列
    private torusYBase: number; // わっかの基本的なY座標

    // 各パーティクルグループの初期角度と半径（回転のために必要）
    // meshプロパティを追加し、対応するTHREE.Meshオブジェクトを保持します
    private particleInitialDataTorusA: { angle: number; radius: number; mesh: THREE.Mesh }[] = [];
    private particleInitialDataTorusB: { angle: number; radius: number; mesh: THREE.Mesh }[] = [];

    // ★追加: 彗星の尾の関連プロパティ (変更なし)
    private tailHistoryLength: number = 30; // 尾の長さ（過去何フレーム分の位置を記憶するか）
    private particleTrailsA: THREE.Vector3[][] = []; // cloudTorusAの各パーティクルの軌跡
    private particleTrailsB: THREE.Vector3[][] = []; // cloudTorusBの各パーティクルの軌跡
    private tailLinesA: THREE.Line[] = []; // cloudTorusAの各パーティクルに対応するTHREE.Lineオブジェクト
    private tailLinesB: THREE.Line[] = []; // cloudTorusBの各パーティクルに対応するTHREE.Lineオブジェクト


    constructor() {
        // コンストラクタは空のままでOK
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x050515)); // 背景色を深い青みがかった黒
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        // 毎フレームのupdateを呼んで，render
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

        // スカイボックスの追加 (宇宙空間の背景)
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const skyboxTexture = cubeTextureLoader.load([
            './skybox/px.png', './skybox/nx.png',
            './skybox/py.png', './skybox/ny.png',
            './skybox/pz.png', './skybox/nz.png'
        ]);
        this.scene.background = skyboxTexture;

        // オルゴール部品の基本的なマテリアル
        let material = new THREE.MeshPhongMaterial({
            color: 0x808088,
            specular: 0xbbbbbb,
            shininess: 50
        });

        let materialunder = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            specular: 0xcccccc,
            shininess: 30
        });

        // 針の台
        let BigDai = new THREE.BoxGeometry(5, 0.05, 2.5);
        let meshBigDai = new THREE.Mesh(BigDai, materialunder);
        meshBigDai.position.set(2.5 * orgelS + orgelX, orgelY, orgelZ - 1 * orgelS);
        meshBigDai.scale.set(orgelS, orgelS, orgelS);
        meshBigDai.receiveShadow = true;
        this.scene.add(meshBigDai);

        let Bigcircle = new THREE.BoxGeometry(0.6, 0.2, 0.6);
        let mesh1 = new THREE.Mesh(Bigcircle, material);
        mesh1.position.set(5 * orgelS + orgelX, orgelY + 0.05 * orgelS, orgelZ);
        mesh1.scale.set(orgelS, orgelS, orgelS);
        mesh1.castShadow = true;
        this.scene.add(mesh1);

        let middlecircle = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32);
        let mesh2 = new THREE.Mesh(middlecircle, material);
        mesh2.position.set(5 * orgelS + orgelX, orgelY + 0.25 * orgelS, orgelZ);
        mesh2.scale.set(orgelS, orgelS, orgelS);
        mesh2.castShadow = true;
        this.scene.add(mesh2);

        let covercircle = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
        let mesh3 = new THREE.Mesh(covercircle, material);
        mesh3.position.set(5 * orgelS + orgelX, orgelY + 0.45 * orgelS, orgelZ);
        mesh3.scale.set(orgelS, orgelS, orgelS);
        mesh3.castShadow = true;
        this.scene.add(mesh3);


        this.torusYBase = orgelY + orgelS * 0.36;
        this.torusRadii = [];

        for (let x = 0; x < 18; x++) {
            this.torusRadii.push(0.3 + 0.25 * x * orgelS);

            let circle = new THREE.TorusGeometry(0.3 + 0.25 * x, 0.01, 4, 40);
            let mesh = new THREE.Mesh(circle, material);

            mesh.castShadow = true;
            mesh.rotateX(Math.PI / 2);
            mesh.position.set(orgelX, this.torusYBase, orgelZ);
            mesh.scale.set(orgelS, orgelS, orgelS);
           // this.scene.add(mesh); // わっか自体はシーンに追加せず、半径情報のみ使用
        }

        let negiDai = new THREE.BoxGeometry(4.4, 0.1, 0.5);
        let mesh4 = new THREE.Mesh(negiDai, material);
        mesh4.position.set(2.45 * orgelS + orgelX, orgelY + 0.15 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh4.scale.set(orgelS, orgelS, orgelS);
        mesh4.castShadow = true;
        this.scene.add(mesh4);

        let metalMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            specular: 0xffffff,
            shininess: 400
        });

        for (let x = 0; x < 18; x++) {
            let boxes = new THREE.BoxGeometry(0.15, 0.01, 1.9);
            let mesh = new THREE.Mesh(boxes, metalMaterial);
            mesh.castShadow = true;
            mesh.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ - 1.1 * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        for (let x = 0; x < 17; x++) {
            let boxes = new THREE.BoxGeometry(0.15, 0.01, 1.8 - x * 0.07);
            let mesh = new THREE.Mesh(boxes, metalMaterial);
            mesh.castShadow = true;
            mesh.position.set(x * 0.25 * orgelS + 0.4 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ - 1.1 * orgelS - 0.035 * x * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        let negiDai2 = new THREE.BoxGeometry(4.3, 0.05, 0.5);
        let mesh5 = new THREE.Mesh(negiDai2, material);
        mesh5.position.set(2.40 * orgelS + orgelX, orgelY + 0.21 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh5.scale.set(orgelS, orgelS, orgelS);
        mesh5.castShadow = true;
        this.scene.add(mesh5);

        let material2 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0
        });

        for (let i = 0; i < 3; i++) {
            let Negi = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 6);
            let mesh = new THREE.Mesh(Negi, material2);
            mesh.castShadow = true;
            mesh.position.set((0.8 + i * 1.5) * orgelS + orgelX, orgelY + 0.24 * orgelS, -2 + orgelZ + orgelZ + 0.11 * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        let NegiCylinder = new THREE.CylinderGeometry(0.02, 0.02, 5, 6);
        let mesh6 = new THREE.Mesh(NegiCylinder, material);
        mesh6.position.set(2.7 * orgelS + orgelX, orgelY + 0.19 * orgelS, orgelZ + orgelZ);
        mesh6.rotateZ(Math.PI / 2);
        mesh6.castShadow = true;
        this.scene.add(mesh6);

        for (let x = 0; x < 18; x++) {
            let boxesCylinder = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 32);
            let mesh = new THREE.Mesh(boxesCylinder, material);
            mesh.castShadow = true;

            for (let y = 0; y < 5; y++) {
                let breed = new THREE.BoxGeometry(0.35, 0.05, 0.01);
                let mesh2 = new THREE.Mesh(breed, material);
                mesh2.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ);
                mesh2.rotateZ(Math.PI / 2);
                mesh2.rotateY(Math.PI / 5 * y);
                mesh2.scale.set(orgelS, orgelS, orgelS);
                mesh2.castShadow = true;
                this.scene.add(mesh2);
            }

            mesh.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ);
            mesh.rotateZ(Math.PI / 2);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }

        let totte = new THREE.CylinderGeometry(0.16, 0.16, 0.4, 6);
        let mesh7 = new THREE.Mesh(totte, material);
        mesh7.position.set(5.85 * orgelS + orgelX, orgelY + 1.5 * orgelS, orgelZ + orgelZ);
        mesh7.castShadow = true;
        this.scene.add(mesh7);


        const path = new CustomSinCurve(orgelS * 0.2);
        const geometry1 = new THREE.TubeGeometry(path, 20, 0.1, 8, false);
        const mesh8 = new THREE.Mesh(geometry1, material);
        mesh8.rotateZ(Math.PI / 4);
        mesh8.position.set(5.7 * orgelS + orgelX, orgelY + 1.2 * orgelS, orgelZ + orgelZ);
        mesh8.castShadow = true;
        this.scene.add(mesh8);


        // --- パーティクル（星）の作成 ---

        // ★ポイント1: わっかを回る星A (cloudTorusA)
        let createTorusParticlesA = () => {
            this.cloudTorusA = new THREE.Group(); // THREE.Groupで星をまとめる
            const particleNum = 50;
            this.particleInitialDataTorusA = [];
            this.particleTrailsA = []; // 尾の履歴配列を初期化
            this.tailLinesA = []; // 尾のLineオブジェクト配列を初期化

            // 星のジオメトリ: スフィア（半径0.15、セグメント数16x16）
            const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16); 
            // 星のマテリアル: フォンマテリアルで自己発光を設定
            const material = new THREE.MeshPhongMaterial({
                color: 0x9acfff, // 淡い水色
                emissive: 0x6ac5ff, // 自己発光色（星が光って見える色）
                emissiveIntensity: 0.8, // 自己発光強度
                specular: 0xffffff,
                shininess: 30,
                transparent: true,
                opacity: 1,
              //  blending: THREE.AdditiveBlending // 加算合成で光を表現
            });

            for (let x = 0; x < particleNum; x++) {
                const randomRadiusIndex = Math.floor(Math.random() * this.torusRadii.length);
                const selectedRadius = this.torusRadii[randomRadiusIndex];
                const r = Math.random() * Math.PI * 2;

                const currentX = orgelX + Math.cos(r) * selectedRadius;
                const currentY = this.torusYBase;
                const currentZ = orgelZ + Math.sin(r) * selectedRadius;

                // スフィアメッシュの作成
                const starMesh = new THREE.Mesh(sphereGeometry, material);
                starMesh.position.set(currentX, currentY, currentZ);
                starMesh.castShadow = false; // 星は影を落とさない
                starMesh.receiveShadow = false; // 星は影を受けない
                this.cloudTorusA.add(starMesh); // グループに追加

                // 星の初期データ（角度、半径、そしてメッシュ自体）を保存
                this.particleInitialDataTorusA.push({ angle: r, radius: selectedRadius, mesh: starMesh });

                // 各星の軌跡履歴を初期化
                const trail: THREE.Vector3[] = [];
                for(let i=0; i<this.tailHistoryLength; i++) {
                    trail.push(new THREE.Vector3(currentX, currentY, currentZ)); // 初期位置で埋める
                }
                this.particleTrailsA.push(trail);

                // 軌跡を描画するためのLineオブジェクトを作成
                const lineGeometry = new THREE.BufferGeometry();
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.tailHistoryLength * 3), 3));
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x9acfff, // 尾の色を星の色に合わせる
                    transparent: true,
                    opacity: 0.8, // 尾の透明度
                    blending: THREE.AdditiveBlending,
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.tailLinesA.push(line);
                this.scene.add(line); // シーンに尾を追加
            }
            this.scene.add(this.cloudTorusA); // シーンに星のグループを追加
        };

        // ★ポイント2: わっかを回る星B (cloudTorusB)
        let createTorusParticlesB = () => {
            this.cloudTorusB = new THREE.Group(); // THREE.Groupで星をまとめる
            const particleNum = 200;
            this.particleInitialDataTorusB = [];
            this.particleTrailsB = []; // 尾の履歴配列を初期化
            this.tailLinesB = []; // 尾のLineオブジェクト配列を初期化

            // 星のジオメトリ: スフィア（半径0.1、セグメント数12x12）
            const sphereGeometry = new THREE.SphereGeometry(0.05, 12, 12); 
            // 星のマテリアル: フォンマテリアルで自己発光を設定
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff, // 白
                emissive: 0xffffff, // 自己発光色
                emissiveIntensity: 0.9, // 自己発光強度
                specular: 0xffffff,
                shininess: 20,
                transparent: true,
                opacity: 1,
                //blending: THREE.AdditiveBlending
            });

            for (let x = 0; x < particleNum; x++) {
                const randomRadiusIndex = Math.floor(Math.random() * this.torusRadii.length);
                const selectedRadius = this.torusRadii[randomRadiusIndex];
                const r = Math.random() * Math.PI * 2;

                const currentX = orgelX + Math.cos(r) * selectedRadius;
                const currentY = this.torusYBase;
                const currentZ = orgelZ + Math.sin(r) * selectedRadius;

                // スフィアメッシュの作成
                const starMesh = new THREE.Mesh(sphereGeometry, material);
                starMesh.position.set(currentX, currentY, currentZ);
                starMesh.castShadow = false;
                starMesh.receiveShadow = false;
                this.cloudTorusB.add(starMesh); // グループに追加

                // 星の初期データ（角度、半径、そしてメッシュ自体）を保存
                this.particleInitialDataTorusB.push({ angle: r, radius: selectedRadius, mesh: starMesh });

                // 各星の軌跡履歴を初期化
                const trail: THREE.Vector3[] = [];
                for(let i=0; i<this.tailHistoryLength; i++) {
                    trail.push(new THREE.Vector3(currentX, currentY, currentZ)); // 初期位置で埋める
                }
                this.particleTrailsB.push(trail);

                // 軌跡を描画するためのLineオブジェクトを作成
                const lineGeometry = new THREE.BufferGeometry();
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.tailHistoryLength * 3), 3));
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff, // 尾の色を星の色に合わせる
                    transparent: true,
                    opacity: 0.5, // 尾の透明度
                    blending: THREE.AdditiveBlending,
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.tailLinesB.push(line);
                this.scene.add(line); // シーンに尾を追加
            }
            this.scene.add(this.cloudTorusB); // シーンに星のグループを追加
        };


        // ★ポイント3: 周囲に散らす静止した星 (cloudStaticSmall)
        let createStaticSmallParticles = () => {
            this.cloudStaticSmall = new THREE.Group(); // THREE.Groupで星をまとめる
            const particleNum = 400;

            // 星のジオメトリ: スフィア（半径0.08、セグメント数8x8）
            const sphereGeometry = new THREE.SphereGeometry(0.08, 8, 8); 
            // 星のマテリアル: フォンマテリアルで自己発光を設定
            const material = new THREE.MeshPhongMaterial({
                color: 0xccddff,
                emissive: 0x99bbff,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });

            const sceneSpread = 100; // 星を配置する範囲
            for (let x = 0; x < particleNum; x++) {
                const posX = (Math.random() - 0.5) * sceneSpread;
                const posY = (Math.random() - 0.5) * sceneSpread * 0.7;
                const posZ = (Math.random() - 0.5) * sceneSpread;

                // スフィアメッシュの作成
                const starMesh = new THREE.Mesh(sphereGeometry, material);
                starMesh.position.set(posX, posY, posZ);
                starMesh.castShadow = false;
                starMesh.receiveShadow = false;
                this.cloudStaticSmall.add(starMesh); // グループに追加
            }
            this.scene.add(this.cloudStaticSmall); // シーンに星のグループを追加
        };

        // ★ポイント4: 周囲に散らす静止した星 (cloudStaticMedium)
        let createStaticMediumParticles = () => {
            this.cloudStaticMedium = new THREE.Group(); // THREE.Groupで星をまとめる
            const particleNum = 1500;

            // 星のジオメトリ: スフィア（半径0.15、セグメント数12x12）
            const sphereGeometry = new THREE.SphereGeometry(0.15, 12, 12); 
            // 星のマテリアル: フォンマテリアルで自己発光を設定
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const sceneSpread = 80; // 星を配置する範囲
            for (let x = 0; x < particleNum; x++) {
                const posX = (Math.random() - 0.5) * sceneSpread;
                const posY = (Math.random() - 0.5) * sceneSpread * 0.6;
                const posZ = (Math.random() - 0.5) * sceneSpread;

                // スフィアメッシュの作成
                const starMesh = new THREE.Mesh(sphereGeometry, material);
                starMesh.position.set(posX, posY, posZ);
                starMesh.castShadow = false;
                starMesh.receiveShadow = false;
                this.cloudStaticMedium.add(starMesh); // グループに追加
            }
            this.scene.add(this.cloudStaticMedium); // シーンに星のグループを追加
        };

        // ★ポイント5: 周囲に散らす静止した星 (cloudStaticLarge)
        let createStaticLargeParticles = () => {
            this.cloudStaticLarge = new THREE.Group(); // THREE.Groupで星をまとめる
            const particleNum = 500;

            // 星のジオメトリ: スフィア（半径0.25、セグメント数16x16）
            const sphereGeometry = new THREE.SphereGeometry(0.25, 16, 16); 
            // 星のマテリアル: フォンマテリアルで自己発光を設定
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffee,
                emissive: 0xffffaa,
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 1.0,
                blending: THREE.AdditiveBlending
            });

            const sceneSpread = 60; // 星を配置する範囲
            for (let x = 0; x < particleNum; x++) {
                const posX = (Math.random() - 0.5) * sceneSpread;
                const posY = (Math.random() - 0.5) * sceneSpread * 0.5;
                const posZ = (Math.random() - 0.5) * sceneSpread;

                // スフィアメッシュの作成
                const starMesh = new THREE.Mesh(sphereGeometry, material);
                starMesh.position.set(posX, posY, posZ);
                starMesh.castShadow = false;
                starMesh.receiveShadow = false;
                this.cloudStaticLarge.add(starMesh); // グループに追加
            }
            this.scene.add(this.cloudStaticLarge); // シーンに星のグループを追加
        };


        createTorusParticlesA(); // わっかの星Aを作成
        createTorusParticlesB(); // わっかの星Bを作成
        createStaticSmallParticles(); // 静止した小さい星を作成
        createStaticMediumParticles(); // 静止した中くらいの星を作成
        createStaticLargeParticles(); // 静止した大きい星を作成


        // --- ライトの設定 ---
        let light = new THREE.DirectionalLight(0xffeebb, 0.8);
        light.position.set(orgelX + 10, orgelY + 15, orgelZ - 10);
        light.castShadow = true;

        const lightTarget = new THREE.Object3D();
        lightTarget.position.set(orgelX + 2.5, orgelY, orgelZ);
        this.scene.add(lightTarget);
        light.target = lightTarget;

        const shadowMapSize = 2048;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;

        const shadowCameraHalfSize = 10;
        light.shadow.camera.left = -shadowCameraHalfSize;
        light.shadow.camera.right = shadowCameraHalfSize;
        light.shadow.camera.top = shadowCameraHalfSize;
        light.shadow.camera.bottom = -shadowCameraHalfSize;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 40;
        light.shadow.bias = -0.0005;
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        this.scene.add(ambientLight);
        // --- ライト設定ここまで ---

        // 毎フレームのupdateを呼んで，更新
        const clock = new THREE.Clock();
        let update: FrameRequestCallback = (time) => {

            const deltaTime = clock.getDelta();


            // 取っ手を回すアニメーション
            mesh8.rotateX(this.radius);
          //  mesh8.rotateY(Math.PI/3);

            // cloudTorusA の更新 (わっか上の星を回転させ、尾を更新)
            if (this.cloudTorusA) {
                for (let i = 0; i < this.particleInitialDataTorusA.length; i++) {
                    let particleData = this.particleInitialDataTorusA[i];
                    let currentAngle = particleData.angle;
                    const radius = particleData.radius;
                    const starMesh = particleData.mesh; // 対応するTHREE.Meshオブジェクトを取得

                    currentAngle += (Math.PI / 180) * deltaTime * 20; // 回転速度
                    particleData.angle = currentAngle; // 角度を更新

                    const newX = orgelX + Math.cos(currentAngle) * radius;
                    const newY = this.torusYBase; // Y座標はオルゴールのわっかの高さで固定
                    const newZ = orgelZ + Math.sin(currentAngle) * radius;

                    starMesh.position.set(newX, newY, newZ); // メッシュの位置を更新

                    // ★彗星の尾の更新ロジック (cloudTorusA)
                    const trail = this.particleTrailsA[i];
                    trail.unshift(new THREE.Vector3(newX, newY, newZ)); // 最新の位置を先頭に追加
                    if (trail.length > this.tailHistoryLength) {
                        trail.pop(); // 古い位置を削除
                    }

                    // THREE.Lineのジオメトリを更新
                    const linePositions = (<THREE.BufferGeometry>this.tailLinesA[i].geometry).getAttribute('position') as THREE.BufferAttribute;
                    for (let j = 0; j < trail.length; j++) {
                        linePositions.setXYZ(j, trail[j].x, trail[j].y, trail[j].z);
                    }
                    linePositions.needsUpdate = true; // ジオメトリの更新をTHREE.jsに伝える
                    // 尾の透明度を距離に応じてフェードアウトさせる（LineBasicMaterialでは難しいが、LineDashedMaterialなどでは可能）
                    // ここでは簡単なグラデーション効果のため、opacityを尾の長さに応じて調整
                    (<THREE.LineBasicMaterial>this.tailLinesA[i].material).opacity = 0.5 * (trail.length / this.tailHistoryLength);
                }
            }

            // cloudTorusB の更新 (わっか上の星を回転させ、尾を更新)
            if (this.cloudTorusB) {
                for (let i = 0; i < this.particleInitialDataTorusB.length; i++) {
                    let particleData = this.particleInitialDataTorusB[i];
                    let currentAngle = particleData.angle;
                    const radius = particleData.radius;
                    const starMesh = particleData.mesh; // 対応するTHREE.Meshオブジェクトを取得

                    currentAngle += (Math.PI / 180) * deltaTime * 20; // 少し遅い回転速度
                    particleData.angle = currentAngle;

                    const newX = orgelX + Math.cos(currentAngle) * radius;
                    const newY = this.torusYBase;
                    const newZ = orgelZ + Math.sin(currentAngle) * radius;

                    starMesh.position.set(newX, newY, newZ); // メッシュの位置を更新

                    // ★彗星の尾の更新ロジック (cloudTorusB)
                    const trail = this.particleTrailsB[i];
                    trail.unshift(new THREE.Vector3(newX, newY, newZ));
                    if (trail.length > this.tailHistoryLength) {
                        trail.pop();
                    }

                    const linePositions = (<THREE.BufferGeometry>this.tailLinesB[i].geometry).getAttribute('position') as THREE.BufferAttribute;
                    for (let j = 0; j < trail.length; j++) {
                        linePositions.setXYZ(j, trail[j].x, trail[j].y, trail[j].z);
                    }
                    linePositions.needsUpdate = true;
                    (<THREE.LineBasicMaterial>this.tailLinesB[i].material).opacity = 0.5 * (trail.length / this.tailHistoryLength);
                }
            }

            // 静止した星 (cloudStaticSmall, cloudStaticMedium, cloudStaticLarge) は
            // update関数内で位置を更新しないため、静止したままになります。
            // (もし回転させたい場合は、この場所に回転のコードを追加できます。例: this.cloudStaticSmall.rotation.y += 0.001;)

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-8, 5, 8));
    document.body.appendChild(viewport);
}

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
    public scale: number;

    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
        const tx = t * 6 - 5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}