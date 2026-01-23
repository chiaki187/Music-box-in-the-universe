/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var tone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tone */ "./node_modules/tone/build/esm/index.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");



//音のテスト関数
const synth = new tone__WEBPACK_IMPORTED_MODULE_0__.PolySynth(tone__WEBPACK_IMPORTED_MODULE_0__.Synth, {
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.2,
        release: 0.9
    }
}).toDestination();
class ThreeJSContainer {
    scene;
    clock = new three__WEBPACK_IMPORTED_MODULE_2__.Clock(); // 時間経過を追跡
    maxTrailPoints = 30; // 軌跡の最大点数 (尾の長さ)
    activeStars = []; //動いている隆盛を管理する配列
    //流れ星の尾のセグメントのベースのジオメトリ
    segmentGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(1, 1, 1);
    orbiteRadius = 2; //軌跡の半径
    orbiteSpeed = 4; //軌跡の移動速度
    starHeight = 1.1; // 星の軌道高さをオルゴール部品と干渉しないように設定
    // 周囲に散らす静止した星
    cloudStaticSmall; // 小さい静止星
    cloudStaticMedium; // 中くらいの静止星
    cloudStaticLarge; // 大きい静止星
    starGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.SphereGeometry(0.1, 16, 16);
    starMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
        color: 0xe0f8ffff,
        blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending
    });
    constructor() {
        window.addEventListener('keydown', this.handleKeyDown);
    }
    //音とキーの場所のマップ
    map = {
        C5: 24,
        "C#5": 23,
        D5: 22,
        "D#5": 21,
        E5: 20,
        F5: 19,
        "F#5": 18,
        G5: 17,
        "G#5": 16,
        A5: 15,
        "A#5": 14,
        B5: 13,
        C6: 12,
        "C#6": 11,
        D6: 10,
        "D#6": 9,
        E6: 8,
        F6: 7,
        "F#6": 6,
        G6: 5,
        "G#6": 4,
        A6: 3,
        "A#6": 2,
        B6: 1,
        C7: 24,
        "C#7": 23,
        D7: 22,
        "D#7": 21,
        E7: 20,
        F7: 19,
        "F#7": 18,
        G7: 17,
        "G#7": 16,
        A7: 15,
        "A#7": 14,
        B7: 13,
        C8: 12,
        "C#8": 11,
        D8: 10,
        "D#8": 9,
        E8: 8,
        F8: 7,
        "F#8": 6,
        G8: 5,
        "G#8": 4,
        A8: 3,
        "A#8": 2,
        B8: 1,
    };
    //keyが押されてから音が鳴るまでの時間
    waitTime = 400;
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    //"E7","F7","G7",null,"E8",null,"C8",null,"D8","C8","C8",null,"B7",null,"B7",null,"D7","E7","F7",null,"D8",null,"B7",null,"C8","B7","A7",null,"G7",null,"G7",null,"E7","F7","G7",null,"C8","D8","E8", null,"D8", "C8","A7",null,"D8","E8","F8", null,"E8", "D8","G7",null,"F8",null,"E8",null,"D8",null,"C8",null,null,null,null,null]
    //null,null,"C6","G6","E6","G6","C6","G6","E6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","G6","E6","G6","C6","B#6","G8","B#6","C6","A6","F6","A6","C6","A#6","E6","A#6","B5","G6","F6","G6","B5","G6","F6","G6","C6","G6","E6","G6","C6",null
    playSong = async () => {
        const notes = ["E7", "F7", "G7", null, "E8", null, "C8", null, "D8", "C8", "C8", null, "B7", null, "B7", null, "D7", "E7", "F7", null, "D8", null, "B7", null, "C8", "B7", "A7", null, "G7", null, "G7", null, "E7", "F7", "G7", null, "C8", "D8", "E8", null, "D8", "C8", "A7", null, "D8", "E8", "F8", null, "E8", "D8", "G7", null, "F8", null, "E8", null, "D8", null, "C8", null, null, null, null, null];
        const notes2 = [null, null, "C6", "G6", "E6", "G6", "C6", "G6", "E6", "G6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "C6", "G6", "E6", "G6", "C6", "G6", "E6", "G6", "C6", "G6", "E6", "G6", "C6", "B#6", "G8", "B#6", "C6", "A6", "F6", "A6", "C6", "A#6", "F6", "A#6", "B5", "G6", "F6", "G6", "B5", "G6", "F6", "G6", "C6", "G6", "E6", "G6", "C6", null];
        for (let i = 0; i < notes.length; i++) {
            if (notes[i] != null) {
                this.launchStar(this.map[notes[i]]);
            }
            if (notes2[i] != null) {
                this.launchStar(this.map[notes2[i]]);
            }
            await this.sleep(this.waitTime);
            if (notes[i] != null) {
                synth.triggerAttackRelease(notes[i], "100n");
            }
            if (notes2[i] != null) {
                synth.triggerAttackRelease(notes2[i], "100n");
            }
        }
    };
    //keyが押されたときのイベントハンドラ
    handleKeyDown = (event) => {
        if (event.key.toLowerCase() === 'q') {
            this.playSong();
        }
        else if (event.key.toLowerCase() === 'a') {
            this.launchStar(25);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 's') {
            this.launchStar(24);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'd') {
            this.launchStar(23);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'f') {
            this.launchStar(22);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'g') {
            this.launchStar(21);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'h') {
            this.launchStar(19);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'j') {
            this.launchStar(18);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'k') {
            this.launchStar(17);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'l') {
            this.launchStar(16);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === ';') {
            this.launchStar(15);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'z') {
            this.launchStar(14);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'x') {
            this.launchStar(13);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'c') {
            this.launchStar(12);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'v') {
            this.launchStar(11);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'b') {
            this.launchStar(10);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'n') {
            this.launchStar(9);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'm') {
            this.launchStar(8);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
    };
    //星が発射されるときのロジック
    launchStar = (interval) => {
        //経過時間
        const currentTime = this.clock.getElapsedTime();
        // 1. 新しいメッシュとグループを生成
        // 【修正済み】ジオメトリとマテリアルを渡す
        const newStarMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(this.starGeometry, this.starMaterial.clone());
        const newTrailGroup = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
        this.scene.add(newStarMesh);
        this.scene.add(newTrailGroup);
        const newStar = {
            mesh: newStarMesh,
            trailGroup: newTrailGroup,
            trailPoints: [],
            trailSegments: [],
            startTime: currentTime,
            isFinished: false,
            interval: interval
        };
        // 初期半径を設定
        const currentRadius = 0.5 * interval;
        // 初期位置を設定 (X=0, Y=starHeight, Z=currentRadius からスタート)
        newStarMesh.position.set(0, this.starHeight, currentRadius);
        this.activeStars.push(newStar);
    };
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        let renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x000009));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, width / height, 0.1, 1000); //どの様なカメラを使用するか
        camera.position.copy(cameraPos); //カメラの位置は
        camera.lookAt(15, 0, 0); //カメラの注視点
        let orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        // --- パーティクル（星）の作成 ---
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();
        const stardustTexture2 = textureLoader.load('splushStar.png');
        const splushMateri = new three__WEBPACK_IMPORTED_MODULE_2__.PointsMaterial({
            size: 0.1,
            map: stardustTexture2,
            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
            color: 0xf0ffff,
            depthWrite: false,
            transparent: true,
            opacity: 1
        });
        // ★ポイント5: 周囲に散らす静止した星 (cloudStaticLarge)
        let createStaticLargeParticles = () => {
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry();
            const particleNum = 500;
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;
            const sceneSpread = 120;
            for (let x = 0; x < particleNum; x++) {
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread * 0.5;
                positions[particleIndex++] = (Math.random() - 0.5) * sceneSpread;
            }
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_2__.BufferAttribute(positions, 3));
            this.cloudStaticLarge = new three__WEBPACK_IMPORTED_MODULE_2__.Points(geometry, splushMateri);
            this.scene.add(this.cloudStaticLarge);
        };
        createStaticLargeParticles();
        //音を鳴らす準備
        tone__WEBPACK_IMPORTED_MODULE_0__.start();
        //歯車の動き制御変数
        let isRolling = [];
        let rollAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let orgelX = 0;
        let orgelY = 0;
        let orgelZ = 0;
        let orgelS = 3;
        // オルゴール部品の基本的なマテリアル
        let material = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0x808088,
            specular: 0xbbbbbb,
            shininess: 50
        });
        let materialunder = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0x757252,
            specular: 0xcccccc,
            shininess: 1
        });
        const materialu = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            color: 0x000fff,
            transparent: true,
            opacity: 0.2,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide
        });
        // #757252ff
        //通常の振動版の色
        let metalMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            color: 0x9e9683,
        });
        //発光時の振動版の色
        let brightMetalMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0xcccccc,
            specular: 0xffffff,
            shininess: 400,
            // 自己発光色を設定
            emissive: 0x75c4fdff,
            // emissive の強さをコントロール
            emissiveIntensity: 0.8
        });
        // 針の台
        let BigDai = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(7, 0.05, 2.5);
        let meshBigDai = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(BigDai, metalMaterial);
        meshBigDai.position.set(3.6 * orgelS + orgelX, orgelY, orgelZ - 1 * orgelS);
        meshBigDai.scale.set(orgelS, orgelS, orgelS);
        meshBigDai.receiveShadow = true;
        this.scene.add(meshBigDai);
        //ねじの芯の下の四角
        let Bigcircle = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.6, 0.2, 0.6);
        let mesh1 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(Bigcircle, material);
        mesh1.position.set(6.8 * orgelS + orgelX, orgelY + 0.05 * orgelS, -0.05 * orgelS + orgelZ);
        mesh1.scale.set(orgelS, orgelS, orgelS);
        mesh1.castShadow = true;
        this.scene.add(mesh1);
        let middlecircle = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.25, 0.25, 0.3, 32);
        let mesh2 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(middlecircle, material);
        mesh2.position.set(6.8 * orgelS + orgelX, orgelY + 0.25 * orgelS, -0.05 * orgelS + orgelZ);
        mesh2.scale.set(orgelS, orgelS, orgelS);
        mesh2.castShadow = true;
        this.scene.add(mesh2);
        let covercircle = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.15, 0.15, 0.1, 32);
        let mesh3 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(covercircle, material);
        mesh3.position.set(6.8 * orgelS + orgelX, orgelY + 0.45 * orgelS, -0.05 * orgelS + orgelZ);
        mesh3.scale.set(orgelS, orgelS, orgelS);
        mesh3.castShadow = true;
        this.scene.add(mesh3); // シーンに追加
        //振動板のすぐ下の四角の板
        let negiDai = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(4.4, 0.1, 0.5);
        let mesh4 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(negiDai, material);
        mesh4.position.set(2.45 * orgelS + orgelX, orgelY + 0.15 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh4.scale.set(orgelS, orgelS, orgelS);
        mesh4.castShadow = true;
        this.scene.add(mesh4);
        //回すところの取っ手部分
        let totte = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.66, 0.66, 1.5, 6);
        let mesh7 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(totte, material);
        mesh7.position.set(7.65 * orgelS + orgelX, orgelY + 1.5 * orgelS, orgelZ + orgelZ - 0.1);
        mesh7.castShadow = true;
        this.scene.add(mesh7);
        //曲線のパイプ
        const path = new CustomSinCurve(orgelS * 0.2);
        const geometry1 = new three__WEBPACK_IMPORTED_MODULE_2__.TubeGeometry(path, 20, 0.5, 8, false);
        const mesh8 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(geometry1, material);
        mesh8.rotateZ(Math.PI / 4);
        mesh8.position.set(7.5 * orgelS + orgelX, orgelY + 1.2 * orgelS, orgelZ + orgelZ - 0.1);
        mesh8.castShadow = true;
        this.scene.add(mesh8);
        const uvs = new Float32Array([
            0.5, 1,
            0, 0,
            1, 0 // 右下
            // CircleGeometryの頂点数に合わせて適切なUV座標を定義する必要があります
            // 現在のuvs定義は頂点数3の三角形用で、32セグメントの円には合いません
        ]);
        const loader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();
        const texturet = loader.load('test.png');
        const materiatl = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            map: texturet,
            transparent: true,
            opacity: 0.3,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            //blending: THREE.AdditiveBlending,
            depthWrite: false // パーティクルが透けて見えるように
        });
        const texturet2 = loader.load('test2.png');
        const materiatl2 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            map: texturet2,
            transparent: true,
            opacity: 0.025,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
            depthWrite: false // パーティクルが透けて見えるように
        });
        const texturet3 = loader.load('test3.png');
        const materiatl3 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            map: texturet3,
            transparent: true,
            opacity: 0.025,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
            depthWrite: false // パーティクルが透けて見えるように
        });
        //オルゴールの下の色付き円盤
        const circlegeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CircleGeometry(20, 32);
        // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
        // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
        // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
        let circlemesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(circlegeometry, materiatl);
        circlemesh.rotateX(-Math.PI / 2);
        circlemesh.position.set(0, -1, 0);
        this.scene.add(circlemesh);
        const circlegeometry2 = new three__WEBPACK_IMPORTED_MODULE_2__.CircleGeometry(20, 32);
        // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
        // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
        // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
        let circlemesh2 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(circlegeometry2, materiatl2);
        circlemesh2.rotateX(-Math.PI / 2);
        circlemesh2.position.set(0, -0.6, 0);
        this.scene.add(circlemesh2);
        const circlegeometry1 = new three__WEBPACK_IMPORTED_MODULE_2__.CircleGeometry(20, 32);
        // CircleGeometryはデフォルトで適切なUV座標を持つため、通常は以下の行は不要です。
        // もし`p.png`が円形で、デフォルトのUVで問題なければこの行を削除してください。
        // circlegeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2));
        let circlemesh1 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(circlegeometry1, materiatl3);
        circlemesh1.rotateX(-Math.PI / 2);
        circlemesh1.position.set(0, 0, 0);
        this.scene.add(circlemesh1);
        for (let i = 1; i < 10; i++) {
            let circle = circlemesh2.clone();
            circle.position.set(0, -1.5 + 0.15 * i, 0);
            this.scene.add(circle);
        }
        for (let i = 0; i < 10; i++) {
            let circle1 = circlemesh1.clone();
            circle1.position.set(0, 0.15 * i, 0);
            this.scene.add(circle1);
        }
        let mesh = [];
        //振動板
        for (let x = 0; x < 25; x++) {
            let boxes = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.15, 0.01, 1.9);
            mesh[x] = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxes, materialunder);
            mesh[x].castShadow = true;
            mesh[x].position.set(x * 0.25 * orgelS + 0.3 * orgelS + orgelX, orgelY + 0.2 * orgelS, orgelZ + orgelZ - 1.1 * orgelS);
            mesh[x].scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh[x]);
        }
        //振動板の間
        for (let x = 0; x < 24; x++) {
            //1.665 - x *0.055,0.4 + x *0.055
            let boxes = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.15, 0.01, 1.665 - x * 0.05);
            let mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxes, materialunder);
            mesh.castShadow = true;
            mesh.position.set(x * 0.25 * orgelS + 0.42 * orgelS + orgelX, orgelY + 0.1999 * orgelS, orgelZ + orgelZ - 1.9 * orgelS + (0.525 - 0.02 * x) * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }
        //振動版のすぐ上の四角
        let negiDai2 = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(6, 0.05, 0.5);
        let mesh5 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(negiDai2, material);
        mesh5.position.set(3.3 * orgelS + orgelX, orgelY + 0.21 * orgelS, orgelZ + orgelZ - 1.9 * orgelS);
        mesh5.scale.set(orgelS, orgelS, orgelS);
        mesh5.castShadow = true;
        this.scene.add(mesh5);
        let material2 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0
        });
        //振動版をとめるねじ３つ
        for (let i = 0; i < 5; i++) {
            let Negi = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.2, 0.2, 0.3, 6);
            let mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(Negi, material2);
            mesh.castShadow = true;
            mesh.position.set((0.7 + i * 1.3) * orgelS + orgelX, orgelY + 0.14 * orgelS, orgelZ + orgelZ + (-1.89) * orgelS);
            mesh.scale.set(orgelS, orgelS, orgelS);
            this.scene.add(mesh);
        }
        //ねじの芯
        let NegiCylinder = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.02, 0.02, 5, 6);
        let mesh6 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(NegiCylinder, material);
        mesh6.position.set(2.7 * orgelS + orgelX, orgelY + 0.19 * orgelS, orgelZ + orgelZ);
        mesh6.rotateZ(Math.PI / 2);
        mesh6.castShadow = true;
        this.scene.add(mesh6);
        //歯車
        // 刃の部分宣言
        let breed = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(0.35, 0.1, 0.02);
        // ★meshBreedを二次元配列として宣言★
        let meshBreed = [];
        for (let x = 0; x < 25; x++) {
            let boxesCylinder = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.12, 0.12, 0.1, 32);
            let cylinderMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxesCylinder, material);
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
                let bladeMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(breed, material);
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
        // 平面の生成
        // --- ライトの設定 ---
        let light = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffeebb, 0.8);
        light.position.set(orgelX - 10, orgelY + 15, orgelZ - 10);
        light.castShadow = true;
        const lightTarget = new three__WEBPACK_IMPORTED_MODULE_2__.Object3D();
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
        //ライトの設定終わり
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            //歯車の動きについて
            for (let i = 0; i < 25; i++) {
                if (isRolling[i]) {
                    mesh[i].material = brightMetalMaterial;
                    for (let j = 0; j < 5; j++) {
                        meshBreed[i][j].rotateY(0.02);
                    }
                    rollAngle[i] += 0.02;
                    if (rollAngle[i] >= Math.PI / 5) {
                        isRolling[i] = false;
                        mesh[i].material = materialunder;
                        rollAngle[i] = 0;
                    }
                }
            }
            //終わりー歯車の動きについて
            //流れ星の動きについて
            const elapsedTime = this.clock.getElapsedTime();
            // アクティブな星をすべて処理するループ
            this.activeStars.forEach(star => {
                if (star.isFinished)
                    return;
                //半径を決める
                this.orbiteRadius = orgelS * (0.25 * star.interval + 0.05);
                //発射されてからの時間
                const timeSineceLaunch = elapsedTime - star.startTime;
                const angle = timeSineceLaunch * this.orbiteSpeed;
                // 1周）を回ったら星を消滅させる
                if (angle > (Math.PI * (4 / 8)) && angle < (Math.PI * (5 / 8))) {
                    isRolling[star.interval - 1] = true;
                }
                if (angle > Math.PI * 1.5) {
                    star.mesh.scale.set(star.mesh.scale.x * 0.9, star.mesh.scale.y * 0.9, star.mesh.scale.z * 0.9);
                    star.trailSegments.forEach((mesh) => {
                        mesh.scale.set(mesh.scale.x * 0.9, mesh.scale.y * 0.9, mesh.scale.z * 0.9);
                    });
                    //star.trailSegments[0].scale.set(star.trailGroup.scale.x*0.9,star.trailGroup.scale.y*0.9,star.trailGroup.scale.z*0.9);
                }
                if (angle > 2 * Math.PI) {
                    star.isFinished = true;
                    // シーンからメッシュを削除
                    this.scene.remove(star.mesh);
                    this.scene.remove(star.trailGroup);
                    return; // 終了したら次の星へ
                }
                //軌道計算
                const trailThickness = 0.04 * orgelS;
                const newX = Math.sin(angle) * this.orbiteRadius;
                // 【修正】Y座標をオルゴール部品より高い位置に設定
                const newY = this.starHeight;
                const newZ = Math.cos(angle) * this.orbiteRadius;
                const newPosition = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(newX, newY, newZ);
                star.mesh.position.copy(newPosition);
                // 軌跡の頂点を追加
                star.trailPoints.push(newPosition.clone());
                // 軌跡の点数を制限
                // 【修正1】maxTrailPointsを超えたとき (>= を > に変更)
                while (star.trailPoints.length > this.maxTrailPoints) {
                    star.trailPoints.shift();
                }
                // 軌跡セグメントの更新
                if (star.trailPoints.length >= 2) {
                    const p1 = star.trailPoints[star.trailPoints.length - 2];
                    const p2 = star.trailPoints[star.trailPoints.length - 1];
                    const distance = p1.distanceTo(p2);
                    const midPoint = p1.clone().clone().lerp(p2, 0.5);
                    let segmentToUpdate;
                    if (star.trailSegments.length < this.maxTrailPoints - 1) {
                        // 新規作成
                        const material = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
                            color: 0x88bbff,
                            transparent: true,
                            blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
                            depthWrite: false,
                            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide
                        });
                        segmentToUpdate = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(this.segmentGeometry, material);
                        //幅 (X)
                        segmentToUpdate.scale.x = trailThickness;
                        // 【修正2】高さ (Y)
                        segmentToUpdate.scale.y = trailThickness;
                        star.trailGroup.add(segmentToUpdate);
                        star.trailSegments.push(segmentToUpdate);
                    }
                    else {
                        // 再利用（最も古いものを再利用し、配列の最後へ）
                        segmentToUpdate = star.trailSegments.shift();
                        star.trailSegments.push(segmentToUpdate);
                    }
                    // スケールと位置、回転を更新
                    segmentToUpdate.scale.z = distance;
                    segmentToUpdate.position.copy(midPoint);
                    const orientation = new three__WEBPACK_IMPORTED_MODULE_2__.Quaternion();
                    const offset = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3().clone().subVectors(p2, p1);
                    orientation.setFromUnitVectors(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 1), offset.clone().clone().normalize());
                    segmentToUpdate.setRotationFromQuaternion(orientation);
                    // フェードアウト効果の適用
                    star.trailSegments.forEach((mesh, index) => {
                        const ratio = index / star.trailSegments.length;
                        mesh.material.opacity = Math.pow(ratio, 1.5) * 0.8;
                    });
                }
            });
            // 終了した星を activeStars 配列から削除する (リソース管理)
            this.activeStars = this.activeStars.filter(star => !star.isFinished);
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(480, 480, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(10, 10, 0)); //カメラの座標
    document.body.appendChild(viewport);
}
class CustomSinCurve extends three__WEBPACK_IMPORTED_MODULE_2__.Curve {
    scale;
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }
    getPoint(t, optionalTarget = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3()) {
        const tx = t * 6 - 5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).clone().multiplyScalar(this.scale);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js-node_modules_tone_build_esm-9e8d86"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxJQUFJLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDcFYsTUFBTSxNQUFNLEdBQUUsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUNwVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxD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V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCAqIGFzIFRvbmUgZnJvbSBcInRvbmVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcblxuXG4vL+mfs+OBruODhuOCueODiOmWouaVsFxuY29uc3Qgc3ludGg9bmV3IFRvbmUuUG9seVN5bnRoKFRvbmUuU3ludGgse1xuICAgIG9zY2lsbGF0b3I6e1xuICAgICAgICB0eXBlOlwic2luZVwiXG4gICAgfSxcbiAgICBlbnZlbG9wZTp7XG4gICAgICAgIGF0dGFjazowLjAxLFxuICAgICAgICBkZWNheTowLjUsXG4gICAgICAgIHN1c3RhaW46MC4yLFxuICAgICAgICByZWxlYXNlOjAuOVxuICAgIH1cbn0pLnRvRGVzdGluYXRpb24oKTtcblxuXG5cbi8v6KSH5pWw44Gu5aWJ5LuV44Gu5oOF5aCx44KS5L+d5oyB44GZ44KL44Gf44KB44Gu5a6a576pXG50eXBlIFN0YXJDb250YWluZXI9e1xuwqAgwqAgbWVzaDogVEhSRUUuTWVzaCwvL+aYn+acrOS9k+OBruODoeODg+OCt+ODpVxuwqAgwqAgdHJhaWxHcm91cDogVEhSRUUuR3JvdXAsLy/lpYfot6Hjga7jgrvjgrDjg6Hjg7Pjg4jkv53mjIHjga7jgrDjg6vjg7zjg5dcbsKgIMKgIHRyYWlsUG9pbnRzOiBUSFJFRS5WZWN0b3IzW10sLy/ou4zot6Hjga7poILngrnluqfmqJnjga7phY3liJdcbsKgIMKgIHRyYWlsU2VnbWVudHM6IFRIUkVFLk1lc2hbXSwvL+i7jOi3oeOBruODoeODg+OCt+ODpeS/neaMgeOBrumFjeWIl1xuwqAgwqAgc3RhcnRUaW1lOiBudW1iZXIsLy/ou4zot6Hnp7vli5Xplovlp4vmmYLplpNcbsKgIMKgIGlzRmluaXNoZWQ6IGJvb2xlYW4sLy/ou4zpgZPjgpLntYLjgYjjgZ/jgYtcbsKgIMKgIGludGVydmFsOiBudW1iZXIvL+OBqeOBrumfs+OBi1xufVxuXG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuwqAgwqAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG7CoCDCoCBwcml2YXRlIGNsb2NrOiBUSFJFRS5DbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpOyAvLyDmmYLplpPntYzpgY7jgpLov73ot6FcbsKgIMKgIHByaXZhdGUgbWF4VHJhaWxQb2ludHMgPSAzMDsgLy8g6LuM6Leh44Gu5pyA5aSn54K55pWwICjlsL7jga7plbfjgZUpXG5cbsKgIMKgIHByaXZhdGUgYWN0aXZlU3RhcnM6U3RhckNvbnRhaW5lcltdPVtdOy8v5YuV44GE44Gm44GE44KL6ZqG55ub44KS566h55CG44GZ44KL6YWN5YiXXG5cbsKgIMKgIC8v5rWB44KM5pif44Gu5bC+44Gu44K744Kw44Oh44Oz44OI44Gu44OZ44O844K544Gu44K444Kq44Oh44OI44OqXG7CoCDCoCBwcml2YXRlIHNlZ21lbnRHZW9tZXRyeT1uZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwxLDEpO1xuXG7CoCDCoCBwcml2YXRlIG9yYml0ZVJhZGl1czpudW1iZXI9MjsgwqAvL+i7jOi3oeOBruWNiuW+hFxuwqAgwqAgcHJpdmF0ZSBvcmJpdGVTcGVlZDpudW1iZXI9NDsgwqAvL+i7jOi3oeOBruenu+WLlemAn+W6plxuwqAgwqAgcHJpdmF0ZSBzdGFySGVpZ2h0Om51bWJlciA9IDEuMTsgLy8g5pif44Gu6LuM6YGT6auY44GV44KS44Kq44Or44K044O844Or6YOo5ZOB44Go5bmy5riJ44GX44Gq44GE44KI44GG44Gr6Kit5a6aXG5cblxuICAgIC8vIOWRqOWbsuOBq+aVo+OCieOBmemdmeatouOBl+OBn+aYn1xuICAgIHByaXZhdGUgY2xvdWRTdGF0aWNTbWFsbDogVEhSRUUuUG9pbnRzOyBcdC8vIOWwj+OBleOBhOmdmeatouaYn1xuICAgIHByaXZhdGUgY2xvdWRTdGF0aWNNZWRpdW06IFRIUkVFLlBvaW50czsgXHQvLyDkuK3jgY/jgonjgYTjga7pnZnmraLmmJ9cbiAgICBwcml2YXRlIGNsb3VkU3RhdGljTGFyZ2U6IFRIUkVFLlBvaW50czsgXHQvLyDlpKfjgY3jgYTpnZnmraLmmJ9cblxuwqAgwqAgcHJpdmF0ZSBzdGFyR2VvbWV0cnk9bmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMSwxNiwxNik7XG7CoCDCoCBwcml2YXRlIHN0YXJNYXRlcmlhbD1uZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgY29sb3I6IDB4ZTBmOGZmZmYsXG7CoCDCoCDCoCDCoCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyBcbsKgIMKgIH0pO1xuXG5cbsKgIMKgIFxuXG7CoCDCoCBjb25zdHJ1Y3RvcigpIHtcbsKgIMKgIMKgIMKgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMuaGFuZGxlS2V5RG93bik7XG7CoCDCoCB9XG5cblxuXG4gICAgLy/pn7Pjgajjgq3jg7zjga7loLTmiYDjga7jg57jg4Pjg5dcbiAgICBwcml2YXRlIG1hcDpSZWNvcmQ8c3RyaW5nLG51bWJlcj49e1xuICAgICAgICBDNToyNCxcbiAgICAgICAgXCJDIzVcIjoyMyxcbiAgICAgICAgRDU6MjIsXG4gICAgICAgIFwiRCM1XCI6MjEsXG4gICAgICAgIEU1OjIwLFxuICAgICAgICBGNToxOSxcbiAgICAgICAgXCJGIzVcIjoxOCxcbiAgICAgICAgRzU6MTcsXG4gICAgICAgIFwiRyM1XCI6MTYsXG4gICAgICAgIEE1OjE1LFxuICAgICAgICBcIkEjNVwiOjE0LFxuICAgICAgICBCNToxMyxcblxuICAgICAgICBDNjoxMixcbiAgICAgICAgXCJDIzZcIjoxMSxcbiAgICAgICAgRDY6MTAsXG4gICAgICAgIFwiRCM2XCI6OSxcbiAgICAgICAgRTY6OCxcbiAgICAgICAgRjY6NyxcbiAgICAgICAgXCJGIzZcIjo2LFxuICAgICAgICBHNjo1LFxuICAgICAgICBcIkcjNlwiOjQsXG4gICAgICAgIEE2OjMsXG4gICAgICAgIFwiQSM2XCI6MixcbiAgICAgICAgQjY6MSxcblxuXG4gICAgICAgIEM3OjI0LFxuICAgICAgICBcIkMjN1wiOjIzLFxuICAgICAgICBENzoyMixcbiAgICAgICAgXCJEIzdcIjoyMSxcbiAgICAgICAgRTc6MjAsXG4gICAgICAgIEY3OjE5LFxuICAgICAgICBcIkYjN1wiOjE4LFxuICAgICAgICBHNzoxNyxcbiAgICAgICAgXCJHIzdcIjoxNixcbiAgICAgICAgQTc6MTUsXG4gICAgICAgIFwiQSM3XCI6MTQsXG4gICAgICAgIEI3OjEzLFxuXG4gICAgICAgIEM4OjEyLFxuICAgICAgICBcIkMjOFwiOjExLFxuICAgICAgICBEODoxMCxcbiAgICAgICAgXCJEIzhcIjo5LFxuICAgICAgICBFODo4LFxuICAgICAgICBGODo3LFxuICAgICAgICBcIkYjOFwiOjYsXG4gICAgICAgIEc4OjUsXG4gICAgICAgIFwiRyM4XCI6NCxcbiAgICAgICAgQTg6MyxcbiAgICAgICAgXCJBIzhcIjoyLFxuICAgICAgICBCODoxLFxuXG4gICAgfTtcblxuICAgIC8va2V544GM5oq844GV44KM44Gm44GL44KJ6Z+z44GM6bO044KL44G+44Gn44Gu5pmC6ZaTXG4gICAgcHJpdmF0ZSB3YWl0VGltZT00MDA7XG4gICAgcHJpdmF0ZSBzbGVlcCA9IChtczogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG4gICAgfTtcbiAgICAvL1wiRTdcIixcIkY3XCIsXCJHN1wiLG51bGwsXCJFOFwiLG51bGwsXCJDOFwiLG51bGwsXCJEOFwiLFwiQzhcIixcIkM4XCIsbnVsbCxcIkI3XCIsbnVsbCxcIkI3XCIsbnVsbCxcIkQ3XCIsXCJFN1wiLFwiRjdcIixudWxsLFwiRDhcIixudWxsLFwiQjdcIixudWxsLFwiQzhcIixcIkI3XCIsXCJBN1wiLG51bGwsXCJHN1wiLG51bGwsXCJHN1wiLG51bGwsXCJFN1wiLFwiRjdcIixcIkc3XCIsbnVsbCxcIkM4XCIsXCJEOFwiLFwiRThcIiwgbnVsbCxcIkQ4XCIsIFwiQzhcIixcIkE3XCIsbnVsbCxcIkQ4XCIsXCJFOFwiLFwiRjhcIiwgbnVsbCxcIkU4XCIsIFwiRDhcIixcIkc3XCIsbnVsbCxcIkY4XCIsbnVsbCxcIkU4XCIsbnVsbCxcIkQ4XCIsbnVsbCxcIkM4XCIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXVxuICAgIC8vbnVsbCxudWxsLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkIjNlwiLFwiRzhcIixcIkIjNlwiLFwiQzZcIixcIkE2XCIsXCJGNlwiLFwiQTZcIixcIkM2XCIsXCJBIzZcIixcIkU2XCIsXCJBIzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsbnVsbFxuICAgIHByaXZhdGUgcGxheVNvbmc9YXN5bmMoKT0+e1xuICAgICAgICBjb25zdCBub3RlcyA9IFtcIkU3XCIsXCJGN1wiLFwiRzdcIixudWxsLFwiRThcIixudWxsLFwiQzhcIixudWxsLFwiRDhcIixcIkM4XCIsXCJDOFwiLG51bGwsXCJCN1wiLG51bGwsXCJCN1wiLG51bGwsXCJEN1wiLFwiRTdcIixcIkY3XCIsbnVsbCxcIkQ4XCIsbnVsbCxcIkI3XCIsbnVsbCxcIkM4XCIsXCJCN1wiLFwiQTdcIixudWxsLFwiRzdcIixudWxsLFwiRzdcIixudWxsLFwiRTdcIixcIkY3XCIsXCJHN1wiLG51bGwsXCJDOFwiLFwiRDhcIixcIkU4XCIsIG51bGwsXCJEOFwiLCBcIkM4XCIsXCJBN1wiLG51bGwsXCJEOFwiLFwiRThcIixcIkY4XCIsIG51bGwsXCJFOFwiLCBcIkQ4XCIsXCJHN1wiLG51bGwsXCJGOFwiLG51bGwsXCJFOFwiLG51bGwsXCJEOFwiLG51bGwsXCJDOFwiLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF07XG4gICAgICAgIGNvbnN0IG5vdGVzMiA9W251bGwsbnVsbCxcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsXCJCIzZcIixcIkc4XCIsXCJCIzZcIixcIkM2XCIsXCJBNlwiLFwiRjZcIixcIkE2XCIsXCJDNlwiLFwiQSM2XCIsXCJGNlwiLFwiQSM2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLG51bGxdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vdGVzLmxlbmd0aDsgaSsrKSB7ICAgIFxuICAgICAgICAgICAgaWYobm90ZXNbaV0hPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMubGF1bmNoU3Rhcih0aGlzLm1hcFtub3Rlc1tpXV0pO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGlmKG5vdGVzMltpXSE9bnVsbCl7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXVuY2hTdGFyKHRoaXMubWFwW25vdGVzMltpXV0pO1xuICAgICAgICAgICAgfSAgICAgIFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5zbGVlcCh0aGlzLndhaXRUaW1lKTtcbiAgICAgICAgICAgIGlmKG5vdGVzW2ldIT1udWxsKXtcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShub3Rlc1tpXSwgXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGlmKG5vdGVzMltpXSE9bnVsbCl7XG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2Uobm90ZXMyW2ldLCBcIjEwMG5cIik7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbsKgIMKgIC8va2V544GM5oq844GV44KM44Gf44Go44GN44Gu44Kk44OZ44Oz44OI44OP44Oz44OJ44OpXG7CoCDCoCBwcml2YXRlIGhhbmRsZUtleURvd249KGV2ZW50OktleWJvYXJkRXZlbnQpPT57XG4gICAgICAgIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J3EnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMucGxheVNvbmcoKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J2EnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigyNSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkM1XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdzJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMjQpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJENVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nZCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDIzKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRTVcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J2YnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigyMik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkY1XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdnJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMjEpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJHNVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0naCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDE5KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQTVcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J2onKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxOCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkI1XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdrJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTcpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJDNlwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nbCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDE2KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRDZcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09JzsnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxNSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkU2XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSd6Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTQpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJGNlwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0neCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDEzKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRjZcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J2MnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxMik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkc2XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSd2Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTEpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJBN1wiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nYicpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDEwKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQjdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J24nKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig5KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQzdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J20nKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig4KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRDdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1cbsKgIMKgIH1cblxuXG7CoCDCoCAvL+aYn+OBjOeZuuWwhOOBleOCjOOCi+OBqOOBjeOBruODreOCuOODg+OCr1xuwqAgwqAgcHJpdmF0ZSBsYXVuY2hTdGFyPShpbnRlcnZhbDpudW1iZXIpPT57XG7CoCDCoCDCoCDCoCAvL+e1jOmBjuaZgumWk1xuwqAgwqAgwqAgwqAgY29uc3QgY3VycmVudFRpbWU9dGhpcy5jbG9jay5nZXRFbGFwc2VkVGltZSgpO1xuXG7CoCDCoCDCoCDCoCAvLyAxLiDmlrDjgZfjgYTjg6Hjg4Pjgrfjg6XjgajjgrDjg6vjg7zjg5fjgpLnlJ/miJBcbsKgIMKgIMKgIMKgIC8vIOOAkOS/ruato+a4iOOBv+OAkeOCuOOCquODoeODiOODquOBqOODnuODhuODquOCouODq+OCkua4oeOBmVxuwqAgwqAgwqAgwqAgY29uc3QgbmV3U3Rhck1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLnN0YXJHZW9tZXRyeSwgdGhpcy5zdGFyTWF0ZXJpYWwuY2xvbmUoKSk7XG7CoCDCoCDCoCDCoCBjb25zdCBuZXdUcmFpbEdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG5ld1N0YXJNZXNoKTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG5ld1RyYWlsR3JvdXApO1xuXG7CoCDCoCDCoCDCoCBjb25zdCBuZXdTdGFyOlN0YXJDb250YWluZXI9e1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaDpuZXdTdGFyTWVzaCxcbsKgIMKgIMKgIMKgIMKgIMKgIHRyYWlsR3JvdXA6bmV3VHJhaWxHcm91cCxcbsKgIMKgIMKgIMKgIMKgIMKgIHRyYWlsUG9pbnRzOltdLFxuwqAgwqAgwqAgwqAgwqAgwqAgdHJhaWxTZWdtZW50czpbXSxcbsKgIMKgIMKgIMKgIMKgIMKgIHN0YXJ0VGltZTpjdXJyZW50VGltZSxcbsKgIMKgIMKgIMKgIMKgIMKgIGlzRmluaXNoZWQ6ZmFsc2UsXG7CoCDCoCDCoCDCoCDCoCDCoCBpbnRlcnZhbDppbnRlcnZhbFxuwqAgwqAgwqAgwqAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWIneacn+WNiuW+hOOCkuioreWumlxuICAgICAgICBjb25zdCBjdXJyZW50UmFkaXVzID0gMC41ICogaW50ZXJ2YWw7XG5cbsKgIMKgIMKgIMKgIC8vIOWIneacn+S9jee9ruOCkuioreWumiAoWD0wLCBZPXN0YXJIZWlnaHQsIFo9Y3VycmVudFJhZGl1cyDjgYvjgonjgrnjgr/jg7zjg4gpXG7CoCDCoCDCoCDCoCBuZXdTdGFyTWVzaC5wb3NpdGlvbi5zZXQoMCwgdGhpcy5zdGFySGVpZ2h0LCBjdXJyZW50UmFkaXVzKTtcbsKgIMKgIMKgIMKgIHRoaXMuYWN0aXZlU3RhcnMucHVzaChuZXdTdGFyKTtcbsKgIMKgIH1cblxuwqAgwqAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG7CoCDCoCBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuwqAgwqAgwqAgwqAgbGV0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbsKgIMKgIMKgIMKgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG7CoCDCoCDCoCDCoCByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwMDAwOSkpO1xuwqAgwqAgwqAgwqAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOyAvL+OCt+ODo+ODieOCpuODnuODg+ODl+OCkuacieWKueOBq+OBmeOCi1xuXG7CoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG7CoCDCoCDCoCDCoCBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTsvL+OBqeOBruanmOOBquOCq+ODoeODqeOCkuS9v+eUqOOBmeOCi+OBi1xuwqAgwqAgwqAgwqAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTsgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy/jgqvjg6Hjg6njga7kvY3nva7jga9cbsKgIMKgIMKgIMKgIGNhbWVyYS5sb29rQXQoMTUsIDAsIDApOyAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy/jgqvjg6Hjg6njga7ms6joppbngrlcblxuwqAgwqAgwqAgwqAgbGV0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG7CoCDCoCDCoCDCoCB0aGlzLmNyZWF0ZVNjZW5lKCk7XG7CoCDCoCDCoCDCoCAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcbsKgIMKgIMKgIMKgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuwqAgwqAgwqAgwqAgbGV0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuwqAgwqAgwqAgwqAgwqAgwqAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcbiAgICAgICAgICAgwqAgXG5cbsKgIMKgIMKgIMKgIMKgIMKgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuwqAgwqAgwqAgwqAgwqAgwqAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG7CoCDCoCDCoCDCoCB9XG7CoCDCoCDCoCDCoCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuwqAgwqAgwqAgwqAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuwqAgwqAgwqAgwqAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbsKgIMKgIMKgIMKgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuwqAgwqAgfVxuXG7CoCDCoCAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbsKgIMKgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAvLyAtLS0g44OR44O844OG44Kj44Kv44Or77yI5pif77yJ44Gu5L2c5oiQIC0tLVxuICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgY29uc3Qgc3RhcmR1c3RUZXh0dXJlMiA9IHRleHR1cmVMb2FkZXIubG9hZCgnc3BsdXNoU3Rhci5wbmcnKTtcbiAgICBcbiAgICAgY29uc3Qgc3BsdXNoTWF0ZXJpID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKHtcbiAgICAgICAgIHNpemU6IDAuMSwgLy8g5Zu65a6a44K144Kk44K6QVxuICAgICAgICAgbWFwOiBzdGFyZHVzdFRleHR1cmUyLFxuICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICBjb2xvcjogMHhmMGZmZmYsIC8vIOa3oeOBhOawtOiJslxuICAgICAgICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgfSk7XG5cbiAgICAgLy8g4piF44Od44Kk44Oz44OINTog5ZGo5Zuy44Gr5pWj44KJ44GZ6Z2Z5q2i44GX44Gf5pifIChjbG91ZFN0YXRpY0xhcmdlKVxuICAgICBsZXQgY3JlYXRlU3RhdGljTGFyZ2VQYXJ0aWNsZXMgPSAoKSA9PiB7XG4gICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgICAgY29uc3QgcGFydGljbGVOdW0gPSA1MDA7XG4gICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlTnVtICogMyk7XG4gICAgXG4gICAgICAgICBsZXQgcGFydGljbGVJbmRleCA9IDA7XG4gICAgICAgICBjb25zdCBzY2VuZVNwcmVhZCA9IDEyMDtcbiAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgcGFydGljbGVOdW07IHgrKykge1xuICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogc2NlbmVTcHJlYWQ7XG4gICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiBzY2VuZVNwcmVhZCAqIDAuNTtcbiAgICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCsrXSA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHNjZW5lU3ByZWFkO1xuICAgICAgICAgfVxuICAgICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUocG9zaXRpb25zLCAzKSk7XG4gICAgICAgICB0aGlzLmNsb3VkU3RhdGljTGFyZ2UgPSBuZXcgVEhSRUUuUG9pbnRzKGdlb21ldHJ5LCBzcGx1c2hNYXRlcmkpO1xuICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jbG91ZFN0YXRpY0xhcmdlKTtcbiAgICAgfTtcbiAgICBcbiAgICBjcmVhdGVTdGF0aWNMYXJnZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgXG5cblxuXG4gICAgICAgIFxuICAgICAgICAvL+mfs+OCkumztOOCieOBmea6luWCmVxuICAgICAgICBUb25lLnN0YXJ0KCk7XG4gICAgICAgIC8v5q2v6LuK44Gu5YuV44GN5Yi25b6h5aSJ5pWwXG4gICAgICAgIGxldCBpc1JvbGxpbmc6Ym9vbGVhbltdPVtdO1xuICAgICAgICBsZXQgcm9sbEFuZ2xlOm51bWJlcltdPVswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXTtcbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgbGV0IG9yZ2VsWCA9IDA7XG7CoCDCoCDCoCDCoCBsZXQgb3JnZWxZID0gMDtcbsKgIMKgIMKgIMKgIGxldCBvcmdlbFogPSAwO1xuwqAgwqAgwqAgwqAgbGV0IG9yZ2VsUyA9IDM7XG5cbsKgIMKgIMKgIMKgXG7CoCDCoCDCoCDCoCAvLyDjgqrjg6vjgrTjg7zjg6vpg6jlk4Hjga7ln7rmnKznmoTjgarjg57jg4bjg6rjgqLjg6tcbsKgIMKgIMKgIMKgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XG7CoCDCoCDCoCDCoCDCoCDCoCBjb2xvcjogMHg4MDgwODgsXG7CoCDCoCDCoCDCoCDCoCDCoCBzcGVjdWxhcjogMHhiYmJiYmIsXG7CoCDCoCDCoCDCoCDCoCDCoCBzaGluaW5lc3M6IDUwXG7CoCDCoCDCoCDCoCB9KTsgwqAgwqBcbsKgIMKgIMKgIMKgIGxldCBtYXRlcmlhbHVuZGVyID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweDc1NzI1MixcbsKgIMKgIMKgIMKgIMKgIMKgIHNwZWN1bGFyOiAweGNjY2NjYyxcbsKgIMKgIMKgIMKgIMKgIMKgIHNoaW5pbmVzczogMVxuwqAgwqAgwqAgwqAgfSk7IMKgIMKgXG7CoCDCoCDCoCDCoCBjb25zdCBtYXRlcmlhbHUgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgwqAgwqAgY29sb3I6IDB4MDAwZmZmLCAvLyDnt5HoibJcbsKgIMKgIMKgIMKgIMKgIMKgIHRyYW5zcGFyZW50OiB0cnVlLCAvLyDpgI/mmI7luqbjgpLmnInlirnjgavjgZnjgotcbsKgIMKgIMKgIMKgIMKgIMKgIG9wYWNpdHk6IDAuMiwgwqAgLy8g5Y2K6YCP5piO44Gr6Kit5a6aICg1MCXjga7kuI3pgI/mmI7luqYpXG7CoCDCoCDCoCDCoCDCoCDCoCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXG7CoCDCoCDCoCDCoCB9KTsgwqAgwqBcblxuICAgICAgIC8vICM3NTcyNTJmZlxuICAgICAgICAvL+mAmuW4uOOBruaMr+WLleeJiOOBruiJslxuwqAgwqAgwqAgwqAgbGV0IG1ldGFsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgwqAgwqAgY29sb3I6IDB4OWU5NjgzLFxuwqAgwqAgwqAgwqAgfSk7XG4gICAgICAgIC8v55m65YWJ5pmC44Gu5oyv5YuV54mI44Gu6ImyXG4gICAgICAgIGxldCBicmlnaHRNZXRhbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweGNjY2NjYywgICAvLyDniankvZPooajpnaLjga7lj43lsIToibLvvIjjg6njgqTjg4jjga7lvbHpn7/jgpLlj5fjgZHjgovvvIlcbsKgIMKgIMKgIMKgIMKgIMKgIHNwZWN1bGFyOiAweGZmZmZmZiwgLy8g6Y+h6Z2i5Y+N5bCE5YWJ44Gu6ImyXG7CoCDCoCDCoCDCoCDCoCDCoCBzaGluaW5lc3M6IDQwMCxcbiAgICAgICAgICAgIC8vIOiHquW3seeZuuWFieiJsuOCkuioreWumlxuICAgICAgICAgICAgZW1pc3NpdmU6IDB4NzVjNGZkZmYsIFxuICAgICAgICAgICAgLy8gZW1pc3NpdmUg44Gu5by344GV44KS44Kz44Oz44OI44Ot44O844OrXG4gICAgICAgICAgICBlbWlzc2l2ZUludGVuc2l0eTogMC44XG7CoCDCoCDCoCDCoCB9KTtcbsKgIMKgIMKgIMKgIC8vIOmHneOBruWPsFxuwqAgwqAgwqAgwqAgbGV0IEJpZ0RhaSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg3LCAwLjA1LCAyLjUpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2hCaWdEYWkgPSBuZXcgVEhSRUUuTWVzaChCaWdEYWksIG1ldGFsTWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaEJpZ0RhaS5wb3NpdGlvbi5zZXQoMy42ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFksIG9yZ2VsWiAtIDEgKiBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgbWVzaEJpZ0RhaS5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoQmlnRGFpLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaEJpZ0RhaSk7IMKgIMKgXG5cbsKgIMKgIMKgIMKgIC8v44Gt44GY44Gu6Iqv44Gu5LiL44Gu5Zub6KeSXG7CoCDCoCDCoCDCoCBsZXQgQmlnY2lyY2xlID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuNiwgMC4yLCAwLjYpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2gxID0gbmV3IFRIUkVFLk1lc2goQmlnY2lyY2xlLCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoMS5wb3NpdGlvbi5zZXQoNi44ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjA1ICogb3JnZWxTLC0wLjA1ICogb3JnZWxTKyBvcmdlbFopO1xuwqAgwqAgwqAgwqAgbWVzaDEuc2NhbGUuc2V0KG9yZ2VsUywgb3JnZWxTLCBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgbWVzaDEuY2FzdFNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChtZXNoMSk7IMKgIMKgIFxuXG7CoCDCoCDCoCDCoCBsZXQgbWlkZGxlY2lyY2xlID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4yNSwgMC4yNSwgMC4zLCAzMik7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDIgPSBuZXcgVEhSRUUuTWVzaChtaWRkbGVjaXJjbGUsIG1hdGVyaWFsKTtcbsKgIMKgIMKgIMKgIG1lc2gyLnBvc2l0aW9uLnNldCg2LjggKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMjUgKiBvcmdlbFMsIC0wLjA1ICogb3JnZWxTK29yZ2VsWik7XG7CoCDCoCDCoCDCoCBtZXNoMi5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoMi5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gyKTsgwqAgwqBcblxuwqAgwqAgwqAgwqAgbGV0IGNvdmVyY2lyY2xlID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4xNSwgMC4xNSwgMC4xLCAzMik7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDMgPSBuZXcgVEhSRUUuTWVzaChjb3ZlcmNpcmNsZSwgbWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaDMucG9zaXRpb24uc2V0KDYuOCAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC40NSAqIG9yZ2VsUywgLTAuMDUgKiBvcmdlbFMrIG9yZ2VsWik7XG7CoCDCoCDCoCDCoCBtZXNoMy5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoMy5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gzKTsgLy8g44K344O844Oz44Gr6L+95YqgXG5cbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgLy/mjK/li5Xmnb/jga7jgZnjgZDkuIvjga7lm5vop5Ljga7mnb9cbsKgIMKgIMKgIMKgIGxldCBuZWdpRGFpID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDQuNCwgMC4xLCAwLjUpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2g0ID0gbmV3IFRIUkVFLk1lc2gobmVnaURhaSwgbWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaDQucG9zaXRpb24uc2V0KDIuNDUgKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMTUgKiBvcmdlbFMsIG9yZ2VsWiArIG9yZ2VsWiAtIDEuOSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoNC5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoNC5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2g0KTtcblxuXG5cbiAgICAgICAgLy/lm57jgZnjgajjgZPjgo3jga7lj5bjgaPmiYvpg6jliIZcbiAgICAgICAgbGV0IHRvdHRlID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC42NiwgMC42NiwgMS41LCA2KTtcbiAgICAgICAgbGV0IG1lc2g3ID0gbmV3IFRIUkVFLk1lc2godG90dGUsIG1hdGVyaWFsKTtcbiAgICAgICAgbWVzaDcucG9zaXRpb24uc2V0KDcuNjUgKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDEuNSAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaLTAuMSk7XG4gICAgICAgIG1lc2g3LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoNyk7XG5cbiAgICAgICAgLy/mm7Lnt5rjga7jg5HjgqTjg5dcbiAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBDdXN0b21TaW5DdXJ2ZShvcmdlbFMgKiAwLjIpO1xuICAgICAgICBjb25zdCBnZW9tZXRyeTEgPSBuZXcgVEhSRUUuVHViZUdlb21ldHJ5KHBhdGgsIDIwLCAwLjUsIDgsIGZhbHNlKTtcbiAgICAgICAgY29uc3QgbWVzaDggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeTEsIG1hdGVyaWFsKTtcbiAgICAgICAgbWVzaDgucm90YXRlWihNYXRoLlBJLzQgKTtcbiAgICAgICAgbWVzaDgucG9zaXRpb24uc2V0KDcuNSAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMS4yICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFotMC4xKTtcbiAgICAgICAgXG4gICAgICAgIG1lc2g4LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoOCk7XG5cblxuICAgICAgICBjb25zdCB1dnMgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgICAgICAgICAgMC41LCAxLCAvLyDkuK3lv4NcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgICAvLyDlt6bkuItcbiAgICAgICAgICAgICAgICAgICAgMSwgMCAgICAvLyDlj7PkuItcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2lyY2xlR2VvbWV0cnnjga7poILngrnmlbDjgavlkIjjgo/jgZvjgabpganliIfjgapVVuW6p+aomeOCkuWumue+qeOBmeOCi+W/heimgeOBjOOBguOCiuOBvuOBmVxuICAgICAgICAgICAgICAgICAgICAvLyDnj77lnKjjga51dnPlrprnvqnjga/poILngrnmlbAz44Gu5LiJ6KeS5b2i55So44Gn44CBMzLjgrvjgrDjg6Hjg7Pjg4jjga7lhobjgavjga/lkIjjgYTjgb7jgZvjgpNcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHR1cmV0ID0gbG9hZGVyLmxvYWQoJ3Rlc3QucG5nJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYXRsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7XG4gICAgICAgICAgICAgICAgICAgICBtYXA6IHRleHR1cmV0LFxuICAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsIFx0Ly8g44GT44KM44KSICd0cnVlJyDjgavjgZfjgarjgYTjgaggJ29wYWNpdHknIOOBjOWKueOBjeOBvuOBm+OCk1xuICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zLCBcdFx0Ly8gNzAl44Gu5LiN6YCP5piO5bqm77yIMzAl6YCP5piO77yJ44Gr6Kit5a6a44GX44G+44GZXG4gICAgICAgICAgICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlICwvLyDlv4XopoHjgafjgYLjgozjgbDkuKHpnaLooajnpLrjgatcbiAgICAgICAgICAgICAgICAgICAgIC8vYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjgYzpgI/jgZHjgabopovjgYjjgovjgojjgYbjgatcbiAgICAgICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgICAgICAgY29uc3QgdGV4dHVyZXQyID0gbG9hZGVyLmxvYWQoJ3Rlc3QyLnBuZycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGVyaWF0bDIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgICAgICAgICAgIG1hcDogdGV4dHVyZXQyLFxuICAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsIFx0Ly8g44GT44KM44KSICd0cnVlJyDjgavjgZfjgarjgYTjgaggJ29wYWNpdHknIOOBjOWKueOBjeOBvuOBm+OCk1xuICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4wMjUsIFx0XHQvLyA3MCXjga7kuI3pgI/mmI7luqbvvIgzMCXpgI/mmI7vvInjgavoqK3lrprjgZfjgb7jgZlcbiAgICAgICAgICAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgLC8vIOW/heimgeOBp+OBguOCjOOBsOS4oemdouihqOekuuOBq1xuICAgICAgICAgICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjgYzpgI/jgZHjgabopovjgYjjgovjgojjgYbjgatcbiAgICAgICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0dXJldDMgPSBsb2FkZXIubG9hZCgndGVzdDMucG5nJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYXRsMyA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge1xuICAgICAgICAgICAgICAgICAgICAgbWFwOiB0ZXh0dXJldDMsXG4gICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSwgXHQvLyDjgZPjgozjgpIgJ3RydWUnIOOBq+OBl+OBquOBhOOBqCAnb3BhY2l0eScg44GM5Yq544GN44G+44Gb44KTXG4gICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjAyNSwgXHRcdC8vIDcwJeOBruS4jemAj+aYjuW6pu+8iDMwJemAj+aYju+8ieOBq+ioreWumuOBl+OBvuOBmVxuICAgICAgICAgICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSAsLy8g5b+F6KaB44Gn44GC44KM44Gw5Lih6Z2i6KGo56S644GrXG4gICAgICAgICAgICAgICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICAgICAgIGRlcHRoV3JpdGU6IGZhbHNlIC8vIOODkeODvOODhuOCo+OCr+ODq+OBjOmAj+OBkeOBpuimi+OBiOOCi+OCiOOBhuOBq1xuICAgICAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgICAgICAgICAvL+OCquODq+OCtOODvOODq+OBruS4i+OBruiJsuS7mOOBjeWGhuebpFxuICAgICAgICAgICAgICAgIGNvbnN0IGNpcmNsZWdlb21ldHJ5ID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KCAyMCwgMzIgKTtcbiAgICAgICAgICAgICAgICAvLyBDaXJjbGVHZW9tZXRyeeOBr+ODh+ODleOCqeODq+ODiOOBp+mBqeWIh+OBqlVW5bqn5qiZ44KS5oyB44Gk44Gf44KB44CB6YCa5bi444Gv5Lul5LiL44Gu6KGM44Gv5LiN6KaB44Gn44GZ44CCXG4gICAgICAgICAgICAgICAgLy8g44KC44GXYHAucG5nYOOBjOWGhuW9ouOBp+OAgeODh+ODleOCqeODq+ODiOOBrlVW44Gn5ZWP6aGM44Gq44GR44KM44Gw44GT44Gu6KGM44KS5YmK6Zmk44GX44Gm44GP44Gg44GV44GE44CCXG4gICAgICAgICAgICAgICAgLy8gY2lyY2xlZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCB1dnMsIDIpKTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlbWVzaD1uZXcgVEhSRUUuTWVzaChjaXJjbGVnZW9tZXRyeSwgbWF0ZXJpYXRsKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVtZXNoLnJvdGF0ZVgoLU1hdGguUEkvMik7XG4gICAgICAgICAgICAgICAgY2lyY2xlbWVzaC5wb3NpdGlvbi5zZXQoMCwtMSwwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGVtZXNoKTtcblxuXG4gICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlZ2VvbWV0cnkyID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KCAyMCwgMzIgKTtcbiAgICAgICAgICAgICAgICAvLyBDaXJjbGVHZW9tZXRyeeOBr+ODh+ODleOCqeODq+ODiOOBp+mBqeWIh+OBqlVW5bqn5qiZ44KS5oyB44Gk44Gf44KB44CB6YCa5bi444Gv5Lul5LiL44Gu6KGM44Gv5LiN6KaB44Gn44GZ44CCXG4gICAgICAgICAgICAgICAgLy8g44KC44GXYHAucG5nYOOBjOWGhuW9ouOBp+OAgeODh+ODleOCqeODq+ODiOOBrlVW44Gn5ZWP6aGM44Gq44GR44KM44Gw44GT44Gu6KGM44KS5YmK6Zmk44GX44Gm44GP44Gg44GV44GE44CCXG4gICAgICAgICAgICAgICAgLy8gY2lyY2xlZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCB1dnMsIDIpKTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlbWVzaDI9bmV3IFRIUkVFLk1lc2goY2lyY2xlZ2VvbWV0cnkyLCBtYXRlcmlhdGwyKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVtZXNoMi5yb3RhdGVYKC1NYXRoLlBJLzIpO1xuICAgICAgICAgICAgICAgIGNpcmNsZW1lc2gyLnBvc2l0aW9uLnNldCgwLC0wLjYsMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlbWVzaDIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlZ2VvbWV0cnkxID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KCAyMCwgMzIgKTtcbiAgICAgICAgICAgICAgICAvLyBDaXJjbGVHZW9tZXRyeeOBr+ODh+ODleOCqeODq+ODiOOBp+mBqeWIh+OBqlVW5bqn5qiZ44KS5oyB44Gk44Gf44KB44CB6YCa5bi444Gv5Lul5LiL44Gu6KGM44Gv5LiN6KaB44Gn44GZ44CCXG4gICAgICAgICAgICAgICAgLy8g44KC44GXYHAucG5nYOOBjOWGhuW9ouOBp+OAgeODh+ODleOCqeODq+ODiOOBrlVW44Gn5ZWP6aGM44Gq44GR44KM44Gw44GT44Gu6KGM44KS5YmK6Zmk44GX44Gm44GP44Gg44GV44GE44CCXG4gICAgICAgICAgICAgICAgLy8gY2lyY2xlZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCB1dnMsIDIpKTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlbWVzaDE9bmV3IFRIUkVFLk1lc2goY2lyY2xlZ2VvbWV0cnkxLCBtYXRlcmlhdGwzKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVtZXNoMS5yb3RhdGVYKC1NYXRoLlBJLzIpO1xuICAgICAgICAgICAgICAgIGNpcmNsZW1lc2gxLnBvc2l0aW9uLnNldCgwLDAsMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlbWVzaDEpO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTE7aTwxMDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2lyY2xlPWNpcmNsZW1lc2gyLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZS5wb3NpdGlvbi5zZXQoMCwtMS41KzAuMTUqaSwwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPDEwO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaXJjbGUxPWNpcmNsZW1lc2gxLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZTEucG9zaXRpb24uc2V0KDAsMC4xNSppLDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGUxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIFxuXG5cblxuICAgICAgICBcbsKgIFxuwqAgwqAgwqAgIMKgbGV0IG1lc2g6IFRIUkVFLk1lc2hbXT1bXTtcblxuwqAgwqAgwqAgwqAgLy/mjK/li5Xmnb9cbsKgIMKgIMKgIMKgIGZvciAobGV0IHggPSAwOyB4IDwgMjU7IHgrKykge1xuwqAgwqAgwqAgwqAgwqAgwqAgbGV0IGJveGVzID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuMTUsIDAuMDEsIDEuOSk7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoW3hdID0gbmV3IFRIUkVFLk1lc2goYm94ZXMsICBtYXRlcmlhbHVuZGVyKTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2hbeF0uY2FzdFNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoW3hdLnBvc2l0aW9uLnNldCh4ICogMC4yNSAqIG9yZ2VsUyArIDAuMyAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4yICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFogLSAxLjEgKiBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaFt4XS5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChtZXNoW3hdKTtcbsKgIMKgIMKgIMKgIH1cblxuXG7CoCDCoCDCoCDCoCAvL+aMr+WLleadv+OBrumWk1xuwqAgwqAgwqAgwqAgZm9yIChsZXQgeCA9IDA7IHggPCAyNDsgeCsrKSB7XG4gICAgICAgICAgICAvLzEuNjY1IC0geCAqMC4wNTUsMC40ICsgeCAqMC4wNTVcbsKgIMKgIMKgIMKgIMKgIMKgIGxldCBib3hlcyA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjE1LCAwLjAxLDEuNjY1IC0geCAqMC4wNSk7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGJveGVzLCAgbWF0ZXJpYWx1bmRlcik7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaC5wb3NpdGlvbi5zZXQoeCAqIDAuMjUgKiBvcmdlbFMgKyAwLjQyKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMTk5OSAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaIC0gMS45ICogb3JnZWxTICsoIDAuNTI1LTAuMDIgKiB4KSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xuwqAgwqAgwqAgwqAgfVxuXG7CoCDCoCDCoCDCoCAvL+aMr+WLleeJiOOBruOBmeOBkOS4iuOBruWbm+inklxuwqAgwqAgwqAgwqAgbGV0IG5lZ2lEYWkyID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDYsIDAuMDUsIDAuNSk7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDUgPSBuZXcgVEhSRUUuTWVzaChuZWdpRGFpMiwgbWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaDUucG9zaXRpb24uc2V0KDMuMyAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4yMSAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaIC0gMS45ICogb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2g1LnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2g1LmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaDUpO1xuXG7CoCDCoCDCoCDCoCBsZXQgbWF0ZXJpYWwyID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweGZmZmZmZixcbsKgIMKgIMKgIMKgIMKgIMKgIHNwZWN1bGFyOiAweGZmZmZmZixcbsKgIMKgIMKgIMKgIMKgIMKgIHNoaW5pbmVzczogMFxuwqAgwqAgwqAgwqAgfSk7XG5cbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgLy/mjK/li5XniYjjgpLjgajjgoHjgovjga3jgZjvvJPjgaRcbsKgIMKgIMKgIMKgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgTmVnaSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuMiwgMC4yLCAwLjMsIDYpO1xuwqAgwqAgwqAgwqAgwqAgwqAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChOZWdpLCBtYXRlcmlhbDIpO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2gucG9zaXRpb24uc2V0KCgwLjcgKyBpICogMS4zKSAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4xNCAqIG9yZ2VsUywgwqAgb3JnZWxaICsgb3JnZWxaICsgKC0xLjg5KSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xuwqAgwqAgwqAgwqAgfVxuXG7CoCDCoCDCoCDCoCAvL+OBreOBmOOBruiKr1xuwqAgwqAgwqAgwqAgbGV0IE5lZ2lDeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuMDIsIDAuMDIsIDUsIDYpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2g2ID0gbmV3IFRIUkVFLk1lc2goTmVnaUN5bGluZGVyLCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoNi5wb3NpdGlvbi5zZXQoMi43ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjE5ICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFopO1xuwqAgwqAgwqAgwqAgbWVzaDYucm90YXRlWihNYXRoLlBJIC8gMik7XG7CoCDCoCDCoCDCoCBtZXNoNi5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2g2KTtcblxuXG5cbsKgIMKgIMKgIMKgIC8v5q2v6LuKXG7CoCDCoCDCoCDCoCAvLyDliIPjga7pg6jliIblrqPoqIBcbsKgIMKgIMKgIMKgIGxldCBicmVlZCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjM1LCAwLjEsIDAuMDIpO1xuXG7CoCDCoCDCoCDCoCAvLyDimIVtZXNoQnJlZWTjgpLkuozmrKHlhYPphY3liJfjgajjgZfjgablrqPoqIDimIVcbsKgIMKgIMKgIMKgIGxldCBtZXNoQnJlZWQ6IFRIUkVFLk1lc2hbXVtdID0gW107IFxuXG7CoCDCoCDCoCDCoCBmb3IgKGxldCB4ID0gMDsgeCA8IDI1OyB4KyspIHtcbsKgIMKgIMKgIMKgIMKgIMKgIGxldCBib3hlc0N5bGluZGVyID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4xMiwgMC4xMiwgMC4xLCAzMik7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgY3lsaW5kZXJNZXNoID0gbmV3IFRIUkVFLk1lc2goYm94ZXNDeWxpbmRlciwgbWF0ZXJpYWwpOyBcbsKgIMKgIMKgIMKgIMKgIMKgIGN5bGluZGVyTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgLy8g44K344Oq44Oz44OA44O844Gu57W25a++5L2N572u44KS55u05o6l6Kit5a6aICjku6XliY3jga5nZWFyR3JvdXAucG9zaXRpb27jgahjeWxpbmRlck1lc2gucG9zaXRpb27jga7ntZDlkIjntZDmnpwpXG7CoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBjeWxpbmRlckFic1ggPSAoeCAqIDAuMjUgKiBvcmdlbFMgKyAwLjMgKiBvcmdlbFMgKyBvcmdlbFgpO1xuwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgY3lsaW5kZXJBYnNZID0gKG9yZ2VsWSArIDAuMiAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBjeWxpbmRlckFic1ogPSAob3JnZWxaICsgb3JnZWxaKTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgY3lsaW5kZXJNZXNoLnBvc2l0aW9uLnNldChjeWxpbmRlckFic1gsIGN5bGluZGVyQWJzWSwgY3lsaW5kZXJBYnNaKTtcbsKgIMKgIMKgIMKgIMKgIMKgIGN5bGluZGVyTWVzaC5yb3RhdGVaKE1hdGguUEkgLyAyKTsgLy8g44K344Oq44Oz44OA44O844KSWFrlubPpnaLjgavlr53jgYvjgZvjgotcbsKgIMKgIMKgIMKgIMKgIMKgIGN5bGluZGVyTWVzaC5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChjeWxpbmRlck1lc2gpOyAvLyDimIXjgrfjg7zjg7Pjgavnm7TmjqXov73liqDimIVcblxuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaEJyZWVkW3hdID0gW107IFxuXG7CoCDCoCDCoCDCoCDCoCDCoCBmb3IgKGxldCB5ID0gMDsgeSA8IDU7IHkrKykge1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgbGV0IGJsYWRlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGJyZWVkLCBtYXRlcmlhbCk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgYmxhZGVNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgYmxhZGVNZXNoLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTsgXG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IGFuZ2xlID0gKE1hdGguUEkgLyA1KSAqIHk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGFkZU1lc2gucG9zaXRpb24uc2V0KHggKiAwLjI1ICogb3JnZWxTICsgMC4zICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjIgKiBvcmdlbFMsIG9yZ2VsWiArIG9yZ2VsWik7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGJsYWRlTWVzaC5yb3RhdGVaKE1hdGguUEkgLyAyKTsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGFkZU1lc2gucm90YXRlWShhbmdsZSk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDkuozmrKHlhYPphY3liJfjgavopoHntKDjgpLov73liqDjgZfjgIHjgrfjg7zjg7PjgavjgoLov73liqBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIG1lc2hCcmVlZFt4XS5wdXNoKGJsYWRlTWVzaCk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQoYmxhZGVNZXNoKTsgLy8g44K344O844Oz6L+95YqgXG7CoCDCoCDCoCDCoCDCoCDCoCB9XG7CoCDCoCDCoCDCoCB9XG7CoCDCoCDCoCDCoFxuXG5cbsKgIMKgIFxuXG7CoCDCoCDCoCDCoCAvLyDlubPpnaLjga7nlJ/miJBcbsKgIMKgIMKgIMKgIFxuXG7CoCDCoCDCoCDCoCAvLyAtLS0g44Op44Kk44OI44Gu6Kit5a6aIC0tLVxuICAgICAgICBsZXQgbGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZWViYiwgMC44KTtcbiAgICAgICAgbGlnaHQucG9zaXRpb24uc2V0KG9yZ2VsWCAtIDEwLCBvcmdlbFkgKyAxNSwgb3JnZWxaIC0gMTApO1xuICAgICAgICBsaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBsaWdodFRhcmdldCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgICAgICBsaWdodFRhcmdldC5wb3NpdGlvbi5zZXQob3JnZWxYICsgMi41LCBvcmdlbFksIG9yZ2VsWik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0VGFyZ2V0KTtcbiAgICAgICAgbGlnaHQudGFyZ2V0ID0gbGlnaHRUYXJnZXQ7XG7CoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIGNvbnN0IHNoYWRvd01hcFNpemUgPSAyMDQ4O1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93Lm1hcFNpemUud2lkdGggPSBzaGFkb3dNYXBTaXplO1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93Lm1hcFNpemUuaGVpZ2h0ID0gc2hhZG93TWFwU2l6ZSDCoCDCoCBcbsKgIMKgIMKgIMKgIGNvbnN0IHNoYWRvd0NhbWVyYUhhbGZTaXplID0gMTA7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLmxlZnQgPSAtc2hhZG93Q2FtZXJhSGFsZlNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLnJpZ2h0ID0gc2hhZG93Q2FtZXJhSGFsZlNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLnRvcCA9IHNoYWRvd0NhbWVyYUhhbGZTaXplO1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93LmNhbWVyYS5ib3R0b20gPSAtc2hhZG93Q2FtZXJhSGFsZlNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLm5lYXIgPSAwLjE7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLmZhciA9IDQwO1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93LmJpYXMgPSAtMC4wMDA1O1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobGlnaHQpO1xuwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCAvL+ODqeOCpOODiOOBruioreWumue1guOCj+OCilxuXG5cbsKgIMKgIMKgIMKgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jOabtOaWsFxuwqAgwqAgwqAgwqAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG7CoCDCoCDCoCDCoCBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICAvL+atr+i7iuOBruWLleOBjeOBq+OBpOOBhOOBplxuICAgICAgICAgICAgZm9yKGxldCBpPTA7aTwyNTtpKyspe1xuICAgICAgICAgICAgICAgIGlmKGlzUm9sbGluZ1tpXSl7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBtZXNoW2ldLm1hdGVyaWFsPWJyaWdodE1ldGFsTWF0ZXJpYWw7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8NTtqKyspe1xuICAgICAgICAgICAgICAgICAgICBtZXNoQnJlZWRbaV1bal0ucm90YXRlWSgwLjAyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb2xsQW5nbGVbaV0rPTAuMDI7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJvbGxBbmdsZVtpXT49TWF0aC5QSS81KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUm9sbGluZ1tpXT1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc2hbaV0ubWF0ZXJpYWw9bWF0ZXJpYWx1bmRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGxBbmdsZVtpXT0wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy/ntYLjgo/jgorjg7zmra/ou4rjga7li5XjgY3jgavjgaTjgYTjgaZcbiAgICAgICAgICAgIFxuXG5cbsKgIMKgIMKgIMKgIMKgIMKgIC8v5rWB44KM5pif44Gu5YuV44GN44Gr44Gk44GE44GmXG7CoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBlbGFwc2VkVGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTsgXG5cbsKgIMKgIMKgIMKgIMKgIMKgIC8vIOOCouOCr+ODhuOCo+ODluOBquaYn+OCkuOBmeOBueOBpuWHpueQhuOBmeOCi+ODq+ODvOODl1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5hY3RpdmVTdGFycy5mb3JFYWNoKHN0YXI9PntcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGlmKHN0YXIuaXNGaW5pc2hlZClyZXR1cm47XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvL+WNiuW+hOOCkuaxuuOCgeOCi1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5vcmJpdGVSYWRpdXM9b3JnZWxTKigwLjI1KnN0YXIuaW50ZXJ2YWwrMC4wNSk7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8v55m65bCE44GV44KM44Gm44GL44KJ44Gu5pmC6ZaTXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCB0aW1lU2luZWNlTGF1bmNoPWVsYXBzZWRUaW1lLXN0YXIuc3RhcnRUaW1lO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgYW5nbGU9dGltZVNpbmVjZUxhdW5jaCp0aGlzLm9yYml0ZVNwZWVkO1xuXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyAx5ZGo77yJ44KS5Zue44Gj44Gf44KJ5pif44KS5raI5ruF44GV44Gb44KLXG4gICAgICAgICAgICAgICAgaWYoYW5nbGU+KE1hdGguUEkqKDQvOCkpJiZhbmdsZTwoTWF0aC5QSSooNS84KSkpe1xuICAgICAgICAgICAgICAgICAgICBpc1JvbGxpbmdbc3Rhci5pbnRlcnZhbC0xXSA9dHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoYW5nbGU+TWF0aC5QSSoxLjUpe1xuICAgICAgICAgICAgICAgICAgICBzdGFyLm1lc2guc2NhbGUuc2V0KHN0YXIubWVzaC5zY2FsZS54KjAuOSxzdGFyLm1lc2guc2NhbGUueSowLjksc3Rhci5tZXNoLnNjYWxlLnoqMC45KTtcbiAgICAgICAgICAgICAgICAgICAgc3Rhci50cmFpbFNlZ21lbnRzLmZvckVhY2goKG1lc2gpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoLnNjYWxlLnNldChtZXNoLnNjYWxlLngqMC45LG1lc2guc2NhbGUueSowLjksbWVzaC5zY2FsZS56KjAuOSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc3Rhci50cmFpbFNlZ21lbnRzWzBdLnNjYWxlLnNldChzdGFyLnRyYWlsR3JvdXAuc2NhbGUueCowLjksc3Rhci50cmFpbEdyb3VwLnNjYWxlLnkqMC45LHN0YXIudHJhaWxHcm91cC5zY2FsZS56KjAuOSk7XG4gICAgICAgICAgICAgICAgfVxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgaWYoYW5nbGU+MipNYXRoLlBJKXtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIuaXNGaW5pc2hlZD10cnVlO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44K344O844Oz44GL44KJ44Oh44OD44K344Ol44KS5YmK6ZmkXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLnJlbW92ZShzdGFyLm1lc2gpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5yZW1vdmUoc3Rhci50cmFpbEdyb3VwKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHJldHVybjsgLy8g57WC5LqG44GX44Gf44KJ5qyh44Gu5pif44G4XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8v6LuM6YGT6KiI566XXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCB0cmFpbFRoaWNrbmVzcz0wLjA0Km9yZ2VsUztcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG5ld1g9TWF0aC5zaW4oYW5nbGUpKnRoaXMub3JiaXRlUmFkaXVzO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44CQ5L+u5q2j44CRWeW6p+aomeOCkuOCquODq+OCtOODvOODq+mDqOWTgeOCiOOCiumrmOOBhOS9jee9ruOBq+ioreWumlxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgbmV3WT10aGlzLnN0YXJIZWlnaHQ7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgbmV3Wj1NYXRoLmNvcyhhbmdsZSkqdGhpcy5vcmJpdGVSYWRpdXM7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBuZXdQb3NpdGlvbj1uZXcgVEhSRUUuVmVjdG9yMyhuZXdYLG5ld1ksbmV3Wik7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIubWVzaC5wb3NpdGlvbi5jb3B5KG5ld1Bvc2l0aW9uKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOi7jOi3oeOBrumggueCueOCkui/veWKoFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci50cmFpbFBvaW50cy5wdXNoKG5ld1Bvc2l0aW9uLmNsb25lKCkpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDou4zot6Hjga7ngrnmlbDjgpLliLbpmZBcbiAgICAgICAgICAgICAgICAvLyDjgJDkv67mraMx44CRbWF4VHJhaWxQb2ludHPjgpLotoXjgYjjgZ/jgajjgY0gKD49IOOCkiA+IOOBq+WkieabtClcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHdoaWxlKHN0YXIudHJhaWxQb2ludHMubGVuZ3RoID4gdGhpcy5tYXhUcmFpbFBvaW50cyl7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzdGFyLnRyYWlsUG9pbnRzLnNoaWZ0KCk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOi7jOi3oeOCu+OCsOODoeODs+ODiOOBruabtOaWsFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgaWYoc3Rhci50cmFpbFBvaW50cy5sZW5ndGg+PTIpe1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgcDE9c3Rhci50cmFpbFBvaW50c1tzdGFyLnRyYWlsUG9pbnRzLmxlbmd0aC0yXTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IHAyPXN0YXIudHJhaWxQb2ludHNbc3Rhci50cmFpbFBvaW50cy5sZW5ndGgtMV07XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBkaXN0YW5jZT1wMS5kaXN0YW5jZVRvKHAyKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG1pZFBvaW50PXAxLmNsb25lKCkubGVycChwMiwwLjUpO1xuXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBsZXQgc2VnbWVudFRvVXBkYXRlOlRIUkVFLk1lc2g7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGlmKHN0YXIudHJhaWxTZWdtZW50cy5sZW5ndGg8IHRoaXMubWF4VHJhaWxQb2ludHMgLSAxKXtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOaWsOimj+S9nOaIkFxuICAgICAgICAgICAgICAgICAgICBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb2xvcjogMHg4OGJiZmYsXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB0cmFuc3BhcmVudDogdHJ1ZSwgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGRlcHRoV3JpdGU6IGZhbHNlLCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9KTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZSA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuc2VnbWVudEdlb21ldHJ5LCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvL+W5hSAoWClcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5zY2FsZS54PXRyYWlsVGhpY2tuZXNzO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44CQ5L+u5q2jMuOAkemrmOOBlSAoWSlcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5zY2FsZS55PXRyYWlsVGhpY2tuZXNzO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci50cmFpbEdyb3VwLmFkZChzZWdtZW50VG9VcGRhdGUpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci50cmFpbFNlZ21lbnRzLnB1c2goc2VnbWVudFRvVXBkYXRlKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH1lbHNle1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g5YaN5Yip55So77yI5pyA44KC5Y+k44GE44KC44Gu44KS5YaN5Yip55So44GX44CB6YWN5YiX44Gu5pyA5b6M44G477yJXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzZWdtZW50VG9VcGRhdGU9c3Rhci50cmFpbFNlZ21lbnRzLnNoaWZ0KCkgYXMgVEhSRUUuTWVzaDtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIudHJhaWxTZWdtZW50cy5wdXNoKHNlZ21lbnRUb1VwZGF0ZSk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOOCueOCseODvOODq+OBqOS9jee9ruOAgeWbnui7ouOCkuabtOaWsFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2VnbWVudFRvVXBkYXRlLnNjYWxlLnogPSBkaXN0YW5jZTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5wb3NpdGlvbi5jb3B5KG1pZFBvaW50KTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG9yaWVudGF0aW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc3ViVmVjdG9ycyhwMiwgcDEpOyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIG9yaWVudGF0aW9uLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKSwgb2Zmc2V0LmNsb25lKCkubm9ybWFsaXplKCkpOyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5zZXRSb3RhdGlvbkZyb21RdWF0ZXJuaW9uKG9yaWVudGF0aW9uKTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44OV44Kn44O844OJ44Ki44Km44OI5Yq55p6c44Gu6YGp55SoXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzdGFyLnRyYWlsU2VnbWVudHMuZm9yRWFjaCgobWVzaCwgaW5kZXgpID0+IHtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IHJhdGlvID0gaW5kZXggLyBzdGFyLnRyYWlsU2VnbWVudHMubGVuZ3RoOyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIChtZXNoLm1hdGVyaWFsIGFzIFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKS5vcGFjaXR5ID0gTWF0aC5wb3cocmF0aW8sIDEuNSkgKiAwLjg7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgfSk7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH1cblxuwqAgwqAgwqAgwqAgwqAgwqAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOe1guS6huOBl+OBn+aYn+OCkiBhY3RpdmVTdGFycyDphY3liJfjgYvjgonliYrpmaTjgZnjgosgKOODquOCveODvOOCueeuoeeQhilcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU3RhcnMgPSB0aGlzLmFjdGl2ZVN0YXJzLmZpbHRlcihzdGFyID0+ICFzdGFyLmlzRmluaXNoZWQpO1xuICAgICAgICAgICAgXG7CoCDCoCDCoCDCoCDCoCDCoCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbsKgIMKgIMKgIMKgIH1cbsKgIMKgIFxuwqAgwqAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG7CoCDCoCB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbsKgIMKgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG7CoCDCoCBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNDgwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDEwLCAxMCAsMCkpOy8v44Kr44Oh44Op44Gu5bqn5qiZXG7CoCDCoCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cblxuY2xhc3MgQ3VzdG9tU2luQ3VydmUgZXh0ZW5kcyBUSFJFRS5DdXJ2ZTxUSFJFRS5WZWN0b3IzPiB7XG4gICAgcHVibGljIHNjYWxlOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihzY2FsZSA9IDEpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xuICAgIH1cblxuICAgIGdldFBvaW50KHQ6IG51bWJlciwgb3B0aW9uYWxUYXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpKTogVEhSRUUuVmVjdG9yMyB7XG4gICAgICAgIGNvbnN0IHR4ID0gdCAqIDYgLSA1O1xuICAgICAgICBjb25zdCB0eSA9IE1hdGguc2luKDIgKiBNYXRoLlBJICogdCk7XG4gICAgICAgIGNvbnN0IHR6ID0gMDtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsVGFyZ2V0LnNldCh0eCwgdHksIHR6KS5tdWx0aXBseVNjYWxhcih0aGlzLnNjYWxlKTtcbiAgICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzX2pzbV9jb250cm9sc19PcmJpdENvbnRyb2xzX2pzLW5vZGVfbW9kdWxlc190b25lX2J1aWxkX2VzbS05ZThkODZcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=