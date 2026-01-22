import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;

    //取っ手を回転させるための度
    private radius:number=0;
    // 異なるサイズの星のグループ
    private cloudTorusA: THREE.Points; 	// わっか上の星（種類A）
    private cloudTorusB: THREE.Points; 	// わっか上の星（種類B）
    // 周囲に散らす静止した星
    private cloudStaticSmall: THREE.Points; 	// 小さい静止星
    private cloudStaticMedium: THREE.Points; 	// 中くらいの静止星
    private cloudStaticLarge: THREE.Points; 	// 大きい静止星

    private torusRadii: number[] = []; // 各わっかの半径を格納する配列
    private torusYBase: number; // わっかの基本的なY座標

    // 各パーティクルグループの初期角度と半径（回転のために必要）
    private particleInitialDataTorusA: { angle: number; radius: number }[] = [];
    private particleInitialDataTorusB: { angle: number; radius: number }[] = [];

    // ★追加: 彗星の尾の関連プロパティ
    private tailHistoryLength: number = 30; // 尾の長さ（過去何フレーム分の位置を記憶するか）
    private particleTrailsA: THREE.Vector3[][] = []; // cloudTorusAの各パーティクルの軌跡
    private particleTrailsB: THREE.Vector3[][] = []; // cloudTorusBの各パーティクルの軌跡
    private tailLinesA: THREE.Line[] = []; // cloudTorusAの各パーティクルに対応するTHREE.Lineオブジェクト
    private tailLinesB: THREE.Line[] = []; // cloudTorusBの各パーティクルに対応するTHREE.Lineオブジェクト

    
    constructor() {
        // コンストラクタは空のままでOK
    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000)); // 背景色を深い青みがかった黒
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(7, width / height, 0.1, 1000);
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

        let is0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        
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

        const materialu = new THREE.MeshBasicMaterial({
            color: 0x000fff, // 緑色
            transparent: true, // 透明度を有効にする
            opacity: 0.2, 	// 半透明に設定 (50%の不透明度)
            side: THREE.DoubleSide
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
       // this.scene.add(mesh3);


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
           // this.scene.add(mesh);
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

        //振動板
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
        

        //歯車
        // 刃の部分宣言
        let breed = new THREE.BoxGeometry(0.35, 0.05, 0.01);

        // ★meshBreedを二次元配列として宣言★
        let meshBreed: THREE.Mesh[][] = []; 

        for (let x = 0; x < 18; x++) {
            let boxesCylinder = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 32);
            let cylinderMesh = new THREE.Mesh(boxesCylinder, material); 
            cylinderMesh.castShadow = true;

            // シリンダーの絶対位置を直接設定 (以前のgearGroup.positionとcylinderMesh.positionの結合結果)
            const cylinderAbsX = (x * 0.25 * orgelS + 0.3 * orgelS + orgelX);
            const cylinderAbsY = (orgelY + 0.2 * orgelS);
            const cylinderAbsZ = (orgelZ + orgelZ);

            cylinderMesh.position.set(cylinderAbsX, cylinderAbsY, cylinderAbsZ);
            cylinderMesh.rotateZ(Math.PI / 2); // シリンダーをXZ平面に寝かせる
            cylinderMesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(cylinderMesh); // ★シーンに直接追加★

            meshBreed[x] = []; 

            for (let y = 0; y < 5; y++) {
                let bladeMesh = new THREE.Mesh(breed, material); 
                bladeMesh.castShadow = true;
                bladeMesh.scale.set(orgelS, orgelS, orgelS); 

                const angle = (Math.PI / 5) * y; 
                
                bladeMesh.position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ);
                
                bladeMesh.rotateZ(Math.PI / 2); 
                bladeMesh.rotateY(angle); 
                
                // 二次元配列に要素を追加し、シーンにも追加
                meshBreed[x].push(bladeMesh); 
                this.scene.add(bladeMesh); // シーン追加
            }
        }

        let totte = new THREE.CylinderGeometry(0.16, 0.16, 0.4, 6);
        let mesh7 = new THREE.Mesh(totte, material);
        mesh7.position.set(5.85 * orgelS + orgelX, orgelY + 1.5 * orgelS, orgelZ + orgelZ);
        mesh7.castShadow = true;
        this.scene.add(mesh7);

        const path = new CustomSinCurve(orgelS * 0.2);
        const geometry1 = new THREE.TubeGeometry(path, 20, 0.1, 8, false);
        const mesh8 = new THREE.Mesh(geometry1, material);
        mesh8.rotateZ(Math.PI/4 );
        mesh8.position.set(5.7 * orgelS + orgelX, orgelY + 1.2 * orgelS, orgelZ + orgelZ);
        
        mesh8.castShadow = true;
        this.scene.add(mesh8);

        

        // --- パーティクル（星）の作成 ---
        const textureLoader = new THREE.TextureLoader();
        const stardustTexture = textureLoader.load('stardust.png');
        const stardustTexture2 = textureLoader.load('splushStar.png');

        const splushMateri = new THREE.PointsMaterial({
            size: 1, // 固定サイズA
            map: stardustTexture2,
            blending: THREE.AdditiveBlending,
            color: 0xf0ffff, // 淡い水色
            depthWrite: false,
            transparent: true,
            opacity: 1
        });

        // ★ポイント1: わっかを回る星A (cloudTorusA)
        let createTorusParticlesA = () => {
            const geometry = new THREE.BufferGeometry();
            const particleNum = 50;
            const positions = new Float32Array(particleNum * 3);
            this.particleInitialDataTorusA = [];
            this.particleTrailsA = []; // 尾の履歴配列を初期化
            this.tailLinesA = []; // 尾のLineオブジェクト配列を初期化

            const material = new THREE.PointsMaterial({
                size: 0.5, // 固定サイズA
                map: stardustTexture,
                blending: THREE.AdditiveBlending,
                color: 0xffffff, // 淡い水色
                depthWrite: false,
                transparent: true,
                opacity: 0.9
            });

            let particleIndex = 0;
            for (let x = 0; x < particleNum; x++) {
                const randomRadiusIndex = Math.floor(Math.random() * this.torusRadii.length);
                const selectedRadius = this.torusRadii[randomRadiusIndex];
                const r = Math.random() * Math.PI * 2;

                const currentX = orgelX + Math.cos(r) * selectedRadius;
                const currentY = this.torusYBase;
                const currentZ = orgelZ + Math.sin(r) * selectedRadius;

                positions[particleIndex++] = currentX;
                positions[particleIndex++] = currentY;
                positions[particleIndex++] = currentZ;

                this.particleInitialDataTorusA.push({ angle: r, radius: selectedRadius });

                // 各パーティクルの軌跡履歴を初期化
                const trail: THREE.Vector3[] = [];
                for(let i=0; i<this.tailHistoryLength; i++) {
                    trail.push(new THREE.Vector3(currentX, currentY, currentZ)); // 初期位置で埋める
                }
                this.particleTrailsA.push(trail);

                // 軌跡を描画するためのLineオブジェクトを作成
                const lineGeometry = new THREE.BufferGeometry();
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.tailHistoryLength * 3), 3));
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x9acfff, // 尾の色をパーティクルの色に合わせる
                    transparent: true,
                    opacity: 0.8, // 尾の透明度
                    blending: THREE.AdditiveBlending,
                    // lineWidth: 1 // LineBasicMaterialではlineWidthは基本的に機能しない (WebGLRendererの制約)
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.tailLinesA.push(line);
                this.scene.add(line);
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.cloudTorusA = new THREE.Points(geometry, material);
            this.scene.add(this.cloudTorusA);
        };

        // ★ポイント2: わっかを回る星B (cloudTorusB)
        let createTorusParticlesB = () => {
            const geometry = new THREE.BufferGeometry();
            const particleNum = 200;
            const positions = new Float32Array(particleNum * 3);
            this.particleInitialDataTorusB = [];
            this.particleTrailsB = []; // 尾の履歴配列を初期化
            this.tailLinesB = []; // 尾のLineオブジェクト配列を初期化

            const material = new THREE.PointsMaterial({
                size: 0.5, // 固定サイズB (Aより小さい)
                map: stardustTexture,
                blending: THREE.AdditiveBlending,
                color: 0xffffff, // 白
                depthWrite: false,
                //transparent: true,
                opacity: 1
            });

            let particleIndex = 0;
            for (let x = 0; x < particleNum; x++) {
                const randomRadiusIndex = Math.floor(Math.random() * this.torusRadii.length);
                const selectedRadius = this.torusRadii[randomRadiusIndex];
                const r = Math.random() * Math.PI * 2;

                const currentX = orgelX + Math.cos(r) * selectedRadius;
                const currentY = this.torusYBase;
                const currentZ = orgelZ + Math.sin(r) * selectedRadius;

                positions[particleIndex++] = currentX;
                positions[particleIndex++] = currentY;
                positions[particleIndex++] = currentZ;

                this.particleInitialDataTorusB.push({ angle: r, radius: selectedRadius });

                // 各パーティクルの軌跡履歴を初期化
                const trail: THREE.Vector3[] = [];
                for(let i=0; i<this.tailHistoryLength; i++) {
                    trail.push(new THREE.Vector3(currentX, currentY, currentZ)); // 初期位置で埋める
                }
                this.particleTrailsB.push(trail);

                // 軌跡を描画するためのLineオブジェクトを作成
                const lineGeometry = new THREE.BufferGeometry();
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.tailHistoryLength * 3), 3));
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff, // 尾の色をパーティクルの色に合わせる
                    transparent: true,
                    opacity: 0.8, // 尾の透明度
                    blending: THREE.AdditiveBlending,
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.tailLinesB.push(line);
                this.scene.add(line);
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.cloudTorusB = new THREE.Points(geometry, material);
            this.scene.add(this.cloudTorusB);
        };


        // ★ポイント3: 周囲に散らす静止した星 (cloudStaticSmall)
        let createStaticSmallParticles = () => {
            const geometry = new THREE.BufferGeometry();
            const particleNum = 400;
            const positions = new Float32Array(particleNum * 3);

            const material = new THREE.PointsMaterial({
                size: 0.5,
                map: stardustTexture,
                blending: THREE.AdditiveBlending,
                color: 0xccddff,
                depthWrite: false,
                transparent: true,
                opacity: 0.6
            });

            let particleIndex = 0;
            const sceneSpread = 100;
            for (let x = 0; x < particleNum; x++) {
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread * 0.7;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.cloudStaticSmall = new THREE.Points(geometry, material);
           // this.scene.add(this.cloudStaticSmall);
        };

        // ★ポイント4: 周囲に散らす静止した星 (cloudStaticMedium)
        let createStaticMediumParticles = () => {
            const geometry = new THREE.BufferGeometry();
            const particleNum = 1500;
            const positions = new Float32Array(particleNum * 3);

            const material = new THREE.PointsMaterial({
                size: 0.3,
                map: stardustTexture,
                blending: THREE.AdditiveBlending,
                color: 0xffffff,
                depthWrite: false,
                transparent: true,
                opacity: 0.8
            });

            let particleIndex = 0;
            const sceneSpread = 80;
            for (let x = 0; x < particleNum; x++) {
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread * 0.6;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.cloudStaticMedium = new THREE.Points(geometry, material);
            this.scene.add(this.cloudStaticMedium);
        };

        // ★ポイント5: 周囲に散らす静止した星 (cloudStaticLarge)
        let createStaticLargeParticles = () => {
            const geometry = new THREE.BufferGeometry();
            const particleNum = 500;
            const positions = new Float32Array(particleNum * 3);

            const material = new THREE.PointsMaterial({
                size: 0.2,
                map: stardustTexture,
               // blending: THREE.AdditiveBlending,
                color: 0xffffff,
                depthWrite: false,
                transparent: true,
                opacity: 1.0
            });

            let particleIndex = 0;
            const sceneSpread = 60;
            for (let x = 0; x < particleNum; x++) {
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread * 0.5;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.cloudStaticLarge = new THREE.Points(geometry, splushMateri);
            this.scene.add(this.cloudStaticLarge);
        };

        // CircleGeometryのUVはデフォルトで適切に生成されるため、カスタムUVの設定は不要な場合が多いです。
        // もし `p.png` を円形にマッピングしたいだけなら、この `setAttribute` 行は削除してください。
        const uvs = new Float32Array([
            0.5, 1, // 中心
            0, 0,   // 左下
            1, 0    // 右下
            // CircleGeometryの頂点数に合わせて適切なUV座標を定義する必要があります
            // 現在のuvs定義は頂点数3の三角形用で、32セグメントの円には合いません
        ]);
        
        const loader = new THREE.TextureLoader();
        const texturet = loader.load('p.png');
        const materiatl = new THREE.MeshBasicMaterial( {
             map: texturet,
             transparent: true, 	// これを 'true' にしないと 'opacity' が効きません
             opacity: 0.6, 		// 70%の不透明度（30%透明）に設定します
             side: THREE.DoubleSide ,// 必要であれば両面表示に
             blending: THREE.AdditiveBlending,
             depthWrite: false // パーティクルが透けて見えるように
        } );

        const circlegeometry = new THREE.CircleGeometry( 5, 32 );
        // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
        // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
        // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
        let circlemesh=new THREE.Mesh(circlegeometry, materiatl);
        circlemesh.rotateX(-Math.PI/2);
        circlemesh.position.set(-3,0,0);
        this.scene.add(circlemesh);


        createTorusParticlesA();
        createTorusParticlesB();
        createStaticSmallParticles();
        createStaticMediumParticles();
        createStaticLargeParticles();
        
        // --- ライトの設定 ---
        let light = new THREE.DirectionalLight(0xffeebb, 0.8);
        light.position.set(orgelX - 10, orgelY + 15, orgelZ - 10);
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
        const l=150;

            //歯車を回す
            
            if(is0[0]==1){
                for(let i=0;i<5;i++){
                meshBreed[0][i].rotateY(-Math.PI/l);
                is0[0]=0;
               }
            }

            if(is0[1]==1){
                for(let i=0;i<5;i++){
                meshBreed[1][i].rotateY(-Math.PI/l);
                is0[1]=0;
               }
            }
            if(is0[2]==1){
                for(let i=0;i<5;i++){
                meshBreed[2][i].rotateY(-Math.PI/l);
                is0[2]=0;
               }
            }

            if(is0[3]==1){
                for(let i=0;i<5;i++){
                meshBreed[3][i].rotateY(-Math.PI/l);
                is0[3]=0;
               }
            }
            if(is0[4]==1){
                for(let i=0;i<5;i++){
                meshBreed[4][i].rotateY(-Math.PI/l);
                is0[4]=0;
               }
            }

            if(is0[5]==1){
                for(let i=0;i<5;i++){
                meshBreed[5][i].rotateY(-Math.PI/l);
                is0[5]=0;
               }
            }
            if(is0[6]==1){
                for(let i=0;i<5;i++){
                meshBreed[6][i].rotateY(-Math.PI/l);
                is0[6]=0;
               }
            }

            if(is0[7]==1){
                for(let i=0;i<5;i++){
                meshBreed[7][i].rotateY(-Math.PI/l);
                is0[7]=0;
               }
            }
            if(is0[8]==1){
                for(let i=0;i<5;i++){
                meshBreed[8][i].rotateY(-Math.PI/l);
                is0[8]=0;
               }
            }

            if(is0[9]==1){
                for(let i=0;i<5;i++){
                meshBreed[9][i].rotateY(-Math.PI/l);
                is0[9]=0;
               }
            }
            if(is0[10]==1){
                for(let i=0;i<5;i++){
                meshBreed[10][i].rotateY(-Math.PI/l);
                is0[10]=0;
               }
            }

            if(is0[11]==1){
                for(let i=0;i<5;i++){
                meshBreed[11][i].rotateY(-Math.PI/l);
                is0[11]=0;
               }
            }
            if(is0[12]==1){
                for(let i=0;i<5;i++){
                meshBreed[12][i].rotateY(-Math.PI/l);
                is0[12]=0;
               }
            }

            if(is0[13]==1){
                for(let i=0;i<5;i++){
                meshBreed[13][i].rotateY(-Math.PI/l);
                is0[13]=0;
               }
            }
            if(is0[14]==1){
                for(let i=0;i<5;i++){
                meshBreed[14][i].rotateY(-Math.PI/l);
                is0[14]=0;
               }
            }

            if(is0[15]==1){
                for(let i=0;i<5;i++){
                meshBreed[15][i].rotateY(-Math.PI/l);
                is0[15]=0;
               }
            }
            if(is0[16]==1){
                for(let i=0;i<5;i++){
                meshBreed[16][i].rotateY(-Math.PI/l);
                is0[16]=0;1
               }
            }

            if(is0[17]==1){
                for(let i=0;i<5;i++){
                meshBreed[17][i].rotateY(-Math.PI/l);
                is0[17]=0;
               }
            }
            
            // cloudTorusA の更新 (わっか上の星を回転させ、尾を更新)
            if (this.cloudTorusA) {
                const geom = <THREE.BufferGeometry>this.cloudTorusA.geometry;
                const positions = geom.getAttribute('position');
                for (let i = 0; i < this.particleInitialDataTorusA.length; i++) {
                    let currentAngle = this.particleInitialDataTorusA[i].angle;
                    const radius = this.particleInitialDataTorusA[i].radius;

                    currentAngle += (Math.PI / 180) * deltaTime * 20; // 回転速度
                    
                    this.particleInitialDataTorusA[i].angle = currentAngle;

                    let newX = orgelX + Math.cos(currentAngle) * radius;
                    const newY = this.torusYBase; // Y座標はオルゴールのわっかの高さで固定
                    const newZ = orgelZ + Math.sin(currentAngle) * radius;

                    positions.setX(i, newX);
                    positions.setY(i, newY);
                    positions.setZ(i, newZ);

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
                    linePositions.needsUpdate = true;
                    // 尾の透明度を距離に応じてフェードアウトさせる
                    (<THREE.LineBasicMaterial>this.tailLinesA[i].material).opacity = 0.5 * (trail.length / this.tailHistoryLength);
                }
                positions.needsUpdate = true;
            }

            // cloudTorusB の更新 (わっか上の星を回転させ、尾を更新)
            if (this.cloudTorusB) {
                const geom2 = <THREE.BufferGeometry>this.cloudTorusB.geometry;
                const positions2 = geom2.getAttribute('position');
                for (let i = 0; i < this.particleInitialDataTorusB.length; i++) {
                    let currentAngle = this.particleInitialDataTorusB[i].angle;
                    const radius = this.particleInitialDataTorusB[i].radius;

                    currentAngle += (Math.PI / 180) * deltaTime * 20; // 少し遅い回転速度
                    this.particleInitialDataTorusB[i].angle = currentAngle;

                    const newX = orgelX + Math.cos(currentAngle) * radius;
                    const newY = this.torusYBase;
                    const newZ = orgelZ + Math.sin(currentAngle) * radius;

                    console.log(radius);
                        
                    if(newZ>-0.5 && newZ<0.5){
                        if(radius==0.3){
                            is0[0]=1;
                        }else if(radius==0.3+0.25){
                            is0[1]=1;
                        }else if(radius==0.3+0.25*2){
                            is0[3]=1;
                        }else if(radius==0.3+0.25*3){
                            is0[4]=1;
                        }else if(radius==0.3+0.25*4){
                            is0[5]=1;
                        }else if(radius==0.3+0.25*5){
                            is0[6]=1;
                        }else if(radius==0.3+0.25*6){
                            is0[7]=1;
                        }else if(radius==0.3+0.25*7){
                            is0[8]=1;
                        }else if(radius==0.3+0.25*8){
                            is0[9]=1;
                        }else if(radius==0.3+0.25*9){
                            is0[10]=1;
                        }else if(radius==0.3+0.25*10){
                            is0[11]=1;
                        }else if(radius==0.3+0.25*11){
                            is0[12]=1;
                        }else if(radius==0.3+0.25*12){
                            is0[13]=1;
                        }else if(radius==0.3+0.25*13){
                            is0[14]=1;
                        }else if(radius==0.3+0.25*14){
                            is0[15]=1;
                        }else if(radius==0.3+0.25*15){
                            is0[16]=1;
                        }else if(radius==0.3+0.25*16){
                            is0[17]=1;
                        }
                    }

                    positions2.setX(i, newX);
                    positions2.setY(i, newY);
                    positions2.setZ(i, newZ);

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
                positions2.needsUpdate = true;
            }

            
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(8, 60, 4));
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