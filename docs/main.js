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
        if (event.key.toLowerCase() === 'z') {
            this.playSong();
        }
        else if (event.key.toLowerCase() === '1') {
            this.launchStar(25);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '2') {
            this.launchStar(24);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '3') {
            this.launchStar(23);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '4') {
            this.launchStar(22);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '5') {
            this.launchStar(21);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '6') {
            this.launchStar(19);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '7') {
            this.launchStar(18);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B5", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '8') {
            this.launchStar(17);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '9') {
            this.launchStar(16);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '0') {
            this.launchStar(15);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '-') {
            this.launchStar(14);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '^') {
            this.launchStar(13);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '\\') {
            this.launchStar(12);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'q') {
            this.launchStar(11);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B6", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'w') {
            this.launchStar(10);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'e') {
            this.launchStar(9);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'r') {
            this.launchStar(8);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 't') {
            this.launchStar(7);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'y') {
            this.launchStar(6);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("G7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'u') {
            this.launchStar(5);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("A7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'i') {
            this.launchStar(4);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("B7", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'o') {
            this.launchStar(3);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("C8", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === 'p') {
            this.launchStar(2);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("D8", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '@') {
            this.launchStar(1);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("E9", "100n");
            }, this.waitTime);
        }
        else if (event.key.toLowerCase() === '[') {
            this.launchStar(0);
            setTimeout(() => {
                // この中の処理が、指定したミリ秒後に実行されます
                synth.triggerAttackRelease("F9", "100n");
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
    let viewport = container.createRendererDOM(window.innerWidth, window.innerHeight, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(20, 20, 0)); //カメラの座標
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxJQUFJLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDcFYsTUFBTSxNQUFNLEdBQUUsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUNwVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxD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OztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgKiBhcyBUb25lIGZyb20gXCJ0b25lXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5cblxuLy/pn7Pjga7jg4bjgrnjg4jplqLmlbBcbmNvbnN0IHN5bnRoPW5ldyBUb25lLlBvbHlTeW50aChUb25lLlN5bnRoLHtcbiAgICBvc2NpbGxhdG9yOntcbiAgICAgICAgdHlwZTpcInNpbmVcIlxuICAgIH0sXG4gICAgZW52ZWxvcGU6e1xuICAgICAgICBhdHRhY2s6MC4wMSxcbiAgICAgICAgZGVjYXk6MC41LFxuICAgICAgICBzdXN0YWluOjAuMixcbiAgICAgICAgcmVsZWFzZTowLjlcbiAgICB9XG59KS50b0Rlc3RpbmF0aW9uKCk7XG5cblxuXG4vL+ikh+aVsOOBruWlieS7leOBruaDheWgseOCkuS/neaMgeOBmeOCi+OBn+OCgeOBruWumue+qVxudHlwZSBTdGFyQ29udGFpbmVyPXtcbsKgIMKgIG1lc2g6IFRIUkVFLk1lc2gsLy/mmJ/mnKzkvZPjga7jg6Hjg4Pjgrfjg6VcbsKgIMKgIHRyYWlsR3JvdXA6IFRIUkVFLkdyb3VwLC8v5aWH6Leh44Gu44K744Kw44Oh44Oz44OI5L+d5oyB44Gu44Kw44Or44O844OXXG7CoCDCoCB0cmFpbFBvaW50czogVEhSRUUuVmVjdG9yM1tdLC8v6LuM6Leh44Gu6aCC54K55bqn5qiZ44Gu6YWN5YiXXG7CoCDCoCB0cmFpbFNlZ21lbnRzOiBUSFJFRS5NZXNoW10sLy/ou4zot6Hjga7jg6Hjg4Pjgrfjg6Xkv53mjIHjga7phY3liJdcbsKgIMKgIHN0YXJ0VGltZTogbnVtYmVyLC8v6LuM6Leh56e75YuV6ZaL5aeL5pmC6ZaTXG7CoCDCoCBpc0ZpbmlzaGVkOiBib29sZWFuLC8v6LuM6YGT44KS57WC44GI44Gf44GLXG7CoCDCoCBpbnRlcnZhbDogbnVtYmVyLy/jganjga7pn7PjgYtcbn1cblxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbsKgIMKgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuwqAgwqAgcHJpdmF0ZSBjbG9jazogVEhSRUUuQ2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTsgLy8g5pmC6ZaT57WM6YGO44KS6L+96LehXG7CoCDCoCBwcml2YXRlIG1heFRyYWlsUG9pbnRzID0gMzA7IC8vIOi7jOi3oeOBruacgOWkp+eCueaVsCAo5bC+44Gu6ZW344GVKVxuXG7CoCDCoCBwcml2YXRlIGFjdGl2ZVN0YXJzOlN0YXJDb250YWluZXJbXT1bXTsvL+WLleOBhOOBpuOBhOOCi+mahuebm+OCkueuoeeQhuOBmeOCi+mFjeWIl1xuXG7CoCDCoCAvL+a1geOCjOaYn+OBruWwvuOBruOCu+OCsOODoeODs+ODiOOBruODmeODvOOCueOBruOCuOOCquODoeODiOODqlxuwqAgwqAgcHJpdmF0ZSBzZWdtZW50R2VvbWV0cnk9bmV3IFRIUkVFLkJveEdlb21ldHJ5KDEsMSwxKTtcblxuwqAgwqAgcHJpdmF0ZSBvcmJpdGVSYWRpdXM6bnVtYmVyPTI7IMKgLy/ou4zot6Hjga7ljYrlvoRcbsKgIMKgIHByaXZhdGUgb3JiaXRlU3BlZWQ6bnVtYmVyPTQ7IMKgLy/ou4zot6Hjga7np7vli5XpgJ/luqZcbsKgIMKgIHByaXZhdGUgc3RhckhlaWdodDpudW1iZXIgPSAxLjE7IC8vIOaYn+OBrui7jOmBk+mrmOOBleOCkuOCquODq+OCtOODvOODq+mDqOWTgeOBqOW5sua4ieOBl+OBquOBhOOCiOOBhuOBq+ioreWumlxuXG5cbiAgICAvLyDlkajlm7LjgavmlaPjgonjgZnpnZnmraLjgZfjgZ/mmJ9cbiAgICBwcml2YXRlIGNsb3VkU3RhdGljU21hbGw6IFRIUkVFLlBvaW50czsgXHQvLyDlsI/jgZXjgYTpnZnmraLmmJ9cbiAgICBwcml2YXRlIGNsb3VkU3RhdGljTWVkaXVtOiBUSFJFRS5Qb2ludHM7IFx0Ly8g5Lit44GP44KJ44GE44Gu6Z2Z5q2i5pifXG4gICAgcHJpdmF0ZSBjbG91ZFN0YXRpY0xhcmdlOiBUSFJFRS5Qb2ludHM7IFx0Ly8g5aSn44GN44GE6Z2Z5q2i5pifXG5cbsKgIMKgIHByaXZhdGUgc3Rhckdlb21ldHJ5PW5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjEsMTYsMTYpO1xuwqAgwqAgcHJpdmF0ZSBzdGFyTWF0ZXJpYWw9bmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIGNvbG9yOiAweGUwZjhmZmZmLFxuwqAgwqAgwqAgwqAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgXG7CoCDCoCB9KTtcblxuXG7CoCDCoCBcblxuwqAgwqAgY29uc3RydWN0b3IoKSB7XG7CoCDCoCDCoCDCoHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzLmhhbmRsZUtleURvd24pO1xuwqAgwqAgfVxuXG5cblxuICAgIC8v6Z+z44Go44Kt44O844Gu5aC05omA44Gu44Oe44OD44OXXG4gICAgcHJpdmF0ZSBtYXA6UmVjb3JkPHN0cmluZyxudW1iZXI+PXtcbiAgICAgICAgQzU6MjQsXG4gICAgICAgIFwiQyM1XCI6MjMsXG4gICAgICAgIEQ1OjIyLFxuICAgICAgICBcIkQjNVwiOjIxLFxuICAgICAgICBFNToyMCxcbiAgICAgICAgRjU6MTksXG4gICAgICAgIFwiRiM1XCI6MTgsXG4gICAgICAgIEc1OjE3LFxuICAgICAgICBcIkcjNVwiOjE2LFxuICAgICAgICBBNToxNSxcbiAgICAgICAgXCJBIzVcIjoxNCxcbiAgICAgICAgQjU6MTMsXG5cbiAgICAgICAgQzY6MTIsXG4gICAgICAgIFwiQyM2XCI6MTEsXG4gICAgICAgIEQ2OjEwLFxuICAgICAgICBcIkQjNlwiOjksXG4gICAgICAgIEU2OjgsXG4gICAgICAgIEY2OjcsXG4gICAgICAgIFwiRiM2XCI6NixcbiAgICAgICAgRzY6NSxcbiAgICAgICAgXCJHIzZcIjo0LFxuICAgICAgICBBNjozLFxuICAgICAgICBcIkEjNlwiOjIsXG4gICAgICAgIEI2OjEsXG5cblxuICAgICAgICBDNzoyNCxcbiAgICAgICAgXCJDIzdcIjoyMyxcbiAgICAgICAgRDc6MjIsXG4gICAgICAgIFwiRCM3XCI6MjEsXG4gICAgICAgIEU3OjIwLFxuICAgICAgICBGNzoxOSxcbiAgICAgICAgXCJGIzdcIjoxOCxcbiAgICAgICAgRzc6MTcsXG4gICAgICAgIFwiRyM3XCI6MTYsXG4gICAgICAgIEE3OjE1LFxuICAgICAgICBcIkEjN1wiOjE0LFxuICAgICAgICBCNzoxMyxcblxuICAgICAgICBDODoxMixcbiAgICAgICAgXCJDIzhcIjoxMSxcbiAgICAgICAgRDg6MTAsXG4gICAgICAgIFwiRCM4XCI6OSxcbiAgICAgICAgRTg6OCxcbiAgICAgICAgRjg6NyxcbiAgICAgICAgXCJGIzhcIjo2LFxuICAgICAgICBHODo1LFxuICAgICAgICBcIkcjOFwiOjQsXG4gICAgICAgIEE4OjMsXG4gICAgICAgIFwiQSM4XCI6MixcbiAgICAgICAgQjg6MSxcblxuICAgIH07XG5cbiAgICAvL2tleeOBjOaKvOOBleOCjOOBpuOBi+OCiemfs+OBjOmztOOCi+OBvuOBp+OBruaZgumWk1xuICAgIHByaXZhdGUgd2FpdFRpbWU9NDAwO1xuICAgIHByaXZhdGUgc2xlZXAgPSAobXM6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICAgIH07XG4gICAgLy9cIkU3XCIsXCJGN1wiLFwiRzdcIixudWxsLFwiRThcIixudWxsLFwiQzhcIixudWxsLFwiRDhcIixcIkM4XCIsXCJDOFwiLG51bGwsXCJCN1wiLG51bGwsXCJCN1wiLG51bGwsXCJEN1wiLFwiRTdcIixcIkY3XCIsbnVsbCxcIkQ4XCIsbnVsbCxcIkI3XCIsbnVsbCxcIkM4XCIsXCJCN1wiLFwiQTdcIixudWxsLFwiRzdcIixudWxsLFwiRzdcIixudWxsLFwiRTdcIixcIkY3XCIsXCJHN1wiLG51bGwsXCJDOFwiLFwiRDhcIixcIkU4XCIsIG51bGwsXCJEOFwiLCBcIkM4XCIsXCJBN1wiLG51bGwsXCJEOFwiLFwiRThcIixcIkY4XCIsIG51bGwsXCJFOFwiLCBcIkQ4XCIsXCJHN1wiLG51bGwsXCJGOFwiLG51bGwsXCJFOFwiLG51bGwsXCJEOFwiLG51bGwsXCJDOFwiLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF1cbiAgICAvL251bGwsbnVsbCxcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsXCJCIzZcIixcIkc4XCIsXCJCIzZcIixcIkM2XCIsXCJBNlwiLFwiRjZcIixcIkE2XCIsXCJDNlwiLFwiQSM2XCIsXCJFNlwiLFwiQSM2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLG51bGxcbiAgICBwcml2YXRlIHBsYXlTb25nPWFzeW5jKCk9PntcbiAgICAgICAgY29uc3Qgbm90ZXMgPSBbXCJFN1wiLFwiRjdcIixcIkc3XCIsbnVsbCxcIkU4XCIsbnVsbCxcIkM4XCIsbnVsbCxcIkQ4XCIsXCJDOFwiLFwiQzhcIixudWxsLFwiQjdcIixudWxsLFwiQjdcIixudWxsLFwiRDdcIixcIkU3XCIsXCJGN1wiLG51bGwsXCJEOFwiLG51bGwsXCJCN1wiLG51bGwsXCJDOFwiLFwiQjdcIixcIkE3XCIsbnVsbCxcIkc3XCIsbnVsbCxcIkc3XCIsbnVsbCxcIkU3XCIsXCJGN1wiLFwiRzdcIixudWxsLFwiQzhcIixcIkQ4XCIsXCJFOFwiLCBudWxsLFwiRDhcIiwgXCJDOFwiLFwiQTdcIixudWxsLFwiRDhcIixcIkU4XCIsXCJGOFwiLCBudWxsLFwiRThcIiwgXCJEOFwiLFwiRzdcIixudWxsLFwiRjhcIixudWxsLFwiRThcIixudWxsLFwiRDhcIixudWxsLFwiQzhcIixudWxsLG51bGwsbnVsbCxudWxsLG51bGxdO1xuICAgICAgICBjb25zdCBub3RlczIgPVtudWxsLG51bGwsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJCNVwiLFwiRzZcIixcIkY2XCIsXCJHNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixcIkc2XCIsXCJFNlwiLFwiRzZcIixcIkM2XCIsXCJHNlwiLFwiRTZcIixcIkc2XCIsXCJDNlwiLFwiQiM2XCIsXCJHOFwiLFwiQiM2XCIsXCJDNlwiLFwiQTZcIixcIkY2XCIsXCJBNlwiLFwiQzZcIixcIkEjNlwiLFwiRjZcIixcIkEjNlwiLFwiQjVcIixcIkc2XCIsXCJGNlwiLFwiRzZcIixcIkI1XCIsXCJHNlwiLFwiRjZcIixcIkc2XCIsXCJDNlwiLFwiRzZcIixcIkU2XCIsXCJHNlwiLFwiQzZcIixudWxsXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub3Rlcy5sZW5ndGg7IGkrKykgeyAgICBcbiAgICAgICAgICAgIGlmKG5vdGVzW2ldIT1udWxsKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxhdW5jaFN0YXIodGhpcy5tYXBbbm90ZXNbaV1dKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBpZihub3RlczJbaV0hPW51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMubGF1bmNoU3Rhcih0aGlzLm1hcFtub3RlczJbaV1dKTtcbiAgICAgICAgICAgIH0gICAgICBcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2xlZXAodGhpcy53YWl0VGltZSk7XG4gICAgICAgICAgICBpZihub3Rlc1tpXSE9bnVsbCl7XG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2Uobm90ZXNbaV0sIFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBpZihub3RlczJbaV0hPW51bGwpe1xuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKG5vdGVzMltpXSwgXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG7CoCDCoCAvL2tleeOBjOaKvOOBleOCjOOBn+OBqOOBjeOBruOCpOODmeODs+ODiOODj+ODs+ODieODqVxuwqAgwqAgcHJpdmF0ZSBoYW5kbGVLZXlEb3duPShldmVudDpLZXlib2FyZEV2ZW50KT0+e1xuICAgICAgICBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSd6Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnBsYXlTb25nKCk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PScxJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMjUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJDNVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nMicpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDI0KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRDVcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09JzMnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigyMyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkU1XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSc0Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMjIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJGNVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nNScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDIxKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRzVcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09JzYnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxOSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkE1XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSc3Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJCNVwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nOCcpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDE3KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQzZcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09JzknKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxNik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkQ2XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PScwJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJFNlwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0nLScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDE0KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRjZcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J14nKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxMyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkc2XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdcXFxcJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoMTIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g44GT44Gu5Lit44Gu5Yem55CG44GM44CB5oyH5a6a44GX44Gf44Of44Oq56eS5b6M44Gr5a6f6KGM44GV44KM44G+44GZXG4gICAgICAgICAgICAgICAgc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXCJBNlwiLFwiMTAwblwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMud2FpdFRpbWUpO1xuwqAgwqAgwqAgwqAgfWVsc2UgaWYoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk9PT0ncScpe1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5sYXVuY2hTdGFyKDExKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQjZcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J3cnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkM3XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdlJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoOSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkQ3XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSdyJyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoOCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkU3XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG7CoCDCoCDCoCDCoCB9ZWxzZSBpZihldmVudC5rZXkudG9Mb3dlckNhc2UoKT09PSd0Jyl7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLmxhdW5jaFN0YXIoNyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDjgZPjga7kuK3jga7lh6bnkIbjgYzjgIHmjIflrprjgZfjgZ/jg5/jg6rnp5Llvozjgavlrp/ooYzjgZXjgozjgb7jgZlcbiAgICAgICAgICAgICAgICBzeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcIkY3XCIsXCIxMDBuXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy53YWl0VGltZSk7XG4gICAgICAgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J3knKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig2KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRzdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J3UnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig1KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQTdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J2knKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3Rhcig0KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQjdcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J28nKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigzKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiQzhcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J3AnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigyKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRDhcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J0AnKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigxKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRTlcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1lbHNlIGlmKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpPT09J1snKXtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMubGF1bmNoU3RhcigwKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOOBk+OBruS4reOBruWHpueQhuOBjOOAgeaMh+WumuOBl+OBn+ODn+ODquenkuW+jOOBq+Wun+ihjOOBleOCjOOBvuOBmVxuICAgICAgICAgICAgICAgIHN5bnRoLnRyaWdnZXJBdHRhY2tSZWxlYXNlKFwiRjlcIixcIjEwMG5cIik7XG4gICAgICAgICAgICB9LCB0aGlzLndhaXRUaW1lKTtcbsKgIMKgIMKgIMKgIH1cbsKgIMKgIH1cblxuXG7CoCDCoCAvL+aYn+OBjOeZuuWwhOOBleOCjOOCi+OBqOOBjeOBruODreOCuOODg+OCr1xuwqAgwqAgcHJpdmF0ZSBsYXVuY2hTdGFyPShpbnRlcnZhbDpudW1iZXIpPT57XG7CoCDCoCDCoCDCoCAvL+e1jOmBjuaZgumWk1xuwqAgwqAgwqAgwqAgY29uc3QgY3VycmVudFRpbWU9dGhpcy5jbG9jay5nZXRFbGFwc2VkVGltZSgpO1xuXG7CoCDCoCDCoCDCoCAvLyAxLiDmlrDjgZfjgYTjg6Hjg4Pjgrfjg6XjgajjgrDjg6vjg7zjg5fjgpLnlJ/miJBcbsKgIMKgIMKgIMKgIC8vIOOAkOS/ruato+a4iOOBv+OAkeOCuOOCquODoeODiOODquOBqOODnuODhuODquOCouODq+OCkua4oeOBmVxuwqAgwqAgwqAgwqAgY29uc3QgbmV3U3Rhck1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLnN0YXJHZW9tZXRyeSwgdGhpcy5zdGFyTWF0ZXJpYWwuY2xvbmUoKSk7XG7CoCDCoCDCoCDCoCBjb25zdCBuZXdUcmFpbEdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG5ld1N0YXJNZXNoKTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG5ld1RyYWlsR3JvdXApO1xuXG7CoCDCoCDCoCDCoCBjb25zdCBuZXdTdGFyOlN0YXJDb250YWluZXI9e1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaDpuZXdTdGFyTWVzaCxcbsKgIMKgIMKgIMKgIMKgIMKgIHRyYWlsR3JvdXA6bmV3VHJhaWxHcm91cCxcbsKgIMKgIMKgIMKgIMKgIMKgIHRyYWlsUG9pbnRzOltdLFxuwqAgwqAgwqAgwqAgwqAgwqAgdHJhaWxTZWdtZW50czpbXSxcbsKgIMKgIMKgIMKgIMKgIMKgIHN0YXJ0VGltZTpjdXJyZW50VGltZSxcbsKgIMKgIMKgIMKgIMKgIMKgIGlzRmluaXNoZWQ6ZmFsc2UsXG7CoCDCoCDCoCDCoCDCoCDCoCBpbnRlcnZhbDppbnRlcnZhbFxuwqAgwqAgwqAgwqAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWIneacn+WNiuW+hOOCkuioreWumlxuICAgICAgICBjb25zdCBjdXJyZW50UmFkaXVzID0gMC41ICogaW50ZXJ2YWw7XG5cbsKgIMKgIMKgIMKgIC8vIOWIneacn+S9jee9ruOCkuioreWumiAoWD0wLCBZPXN0YXJIZWlnaHQsIFo9Y3VycmVudFJhZGl1cyDjgYvjgonjgrnjgr/jg7zjg4gpXG7CoCDCoCDCoCDCoCBuZXdTdGFyTWVzaC5wb3NpdGlvbi5zZXQoMCwgdGhpcy5zdGFySGVpZ2h0LCBjdXJyZW50UmFkaXVzKTtcbsKgIMKgIMKgIMKgIHRoaXMuYWN0aXZlU3RhcnMucHVzaChuZXdTdGFyKTtcbsKgIMKgIH1cblxuwqAgwqAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG7CoCDCoCBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuwqAgwqAgwqAgwqAgbGV0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbsKgIMKgIMKgIMKgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG7CoCDCoCDCoCDCoCByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwMDAwOSkpO1xuwqAgwqAgwqAgwqAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOyAvL+OCt+ODo+ODieOCpuODnuODg+ODl+OCkuacieWKueOBq+OBmeOCi1xuXG7CoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG7CoCDCoCDCoCDCoCBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTsvL+OBqeOBruanmOOBquOCq+ODoeODqeOCkuS9v+eUqOOBmeOCi+OBi1xuwqAgwqAgwqAgwqAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTsgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy/jgqvjg6Hjg6njga7kvY3nva7jga9cbsKgIMKgIMKgIMKgIGNhbWVyYS5sb29rQXQoMTUsIDAsIDApOyAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy/jgqvjg6Hjg6njga7ms6joppbngrlcblxuwqAgwqAgwqAgwqAgbGV0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG7CoCDCoCDCoCDCoCB0aGlzLmNyZWF0ZVNjZW5lKCk7XG7CoCDCoCDCoCDCoCAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcbsKgIMKgIMKgIMKgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuwqAgwqAgwqAgwqAgbGV0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuwqAgwqAgwqAgwqAgwqAgwqAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcbiAgICAgICAgICAgwqAgXG5cbsKgIMKgIMKgIMKgIMKgIMKgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuwqAgwqAgwqAgwqAgwqAgwqAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG7CoCDCoCDCoCDCoCB9XG7CoCDCoCDCoCDCoCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuwqAgwqAgwqAgwqAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuwqAgwqAgwqAgwqAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbsKgIMKgIMKgIMKgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuwqAgwqAgfVxuXG7CoCDCoCAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbsKgIMKgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAvLyAtLS0g44OR44O844OG44Kj44Kv44Or77yI5pif77yJ44Gu5L2c5oiQIC0tLVxuICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgY29uc3Qgc3RhcmR1c3RUZXh0dXJlMiA9IHRleHR1cmVMb2FkZXIubG9hZCgnc3BsdXNoU3Rhci5wbmcnKTtcbiAgICBcbiAgICAgY29uc3Qgc3BsdXNoTWF0ZXJpID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKHtcbiAgICAgICAgIHNpemU6IDAuMSwgLy8g5Zu65a6a44K144Kk44K6QVxuICAgICAgICAgbWFwOiBzdGFyZHVzdFRleHR1cmUyLFxuICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICBjb2xvcjogMHhmMGZmZmYsIC8vIOa3oeOBhOawtOiJslxuICAgICAgICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgfSk7XG5cbiAgICAgLy8g4piF44Od44Kk44Oz44OINTog5ZGo5Zuy44Gr5pWj44KJ44GZ6Z2Z5q2i44GX44Gf5pifIChjbG91ZFN0YXRpY0xhcmdlKVxuICAgICBsZXQgY3JlYXRlU3RhdGljTGFyZ2VQYXJ0aWNsZXMgPSAoKSA9PiB7XG4gICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgICAgY29uc3QgcGFydGljbGVOdW0gPSA1MDA7XG4gICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlTnVtICogMyk7XG4gICAgXG4gICAgICAgICBsZXQgcGFydGljbGVJbmRleCA9IDA7XG4gICAgICAgICBjb25zdCBzY2VuZVNwcmVhZCA9IDEyMDtcbiAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgcGFydGljbGVOdW07IHgrKykge1xuICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogc2NlbmVTcHJlYWQ7XG4gICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiBzY2VuZVNwcmVhZCAqIDAuNTtcbiAgICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCsrXSA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHNjZW5lU3ByZWFkO1xuICAgICAgICAgfVxuICAgICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUocG9zaXRpb25zLCAzKSk7XG4gICAgICAgICB0aGlzLmNsb3VkU3RhdGljTGFyZ2UgPSBuZXcgVEhSRUUuUG9pbnRzKGdlb21ldHJ5LCBzcGx1c2hNYXRlcmkpO1xuICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jbG91ZFN0YXRpY0xhcmdlKTtcbiAgICAgfTtcbiAgICBcbiAgICBjcmVhdGVTdGF0aWNMYXJnZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgXG5cblxuXG4gICAgICAgIFxuICAgICAgICAvL+mfs+OCkumztOOCieOBmea6luWCmVxuICAgICAgICBUb25lLnN0YXJ0KCk7XG4gICAgICAgIC8v5q2v6LuK44Gu5YuV44GN5Yi25b6h5aSJ5pWwXG4gICAgICAgIGxldCBpc1JvbGxpbmc6Ym9vbGVhbltdPVtdO1xuICAgICAgICBsZXQgcm9sbEFuZ2xlOm51bWJlcltdPVswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXTtcbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgbGV0IG9yZ2VsWCA9IDA7XG7CoCDCoCDCoCDCoCBsZXQgb3JnZWxZID0gMDtcbsKgIMKgIMKgIMKgIGxldCBvcmdlbFogPSAwO1xuwqAgwqAgwqAgwqAgbGV0IG9yZ2VsUyA9IDM7XG5cbsKgIMKgIMKgIMKgXG7CoCDCoCDCoCDCoCAvLyDjgqrjg6vjgrTjg7zjg6vpg6jlk4Hjga7ln7rmnKznmoTjgarjg57jg4bjg6rjgqLjg6tcbsKgIMKgIMKgIMKgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XG7CoCDCoCDCoCDCoCDCoCDCoCBjb2xvcjogMHg4MDgwODgsXG7CoCDCoCDCoCDCoCDCoCDCoCBzcGVjdWxhcjogMHhiYmJiYmIsXG7CoCDCoCDCoCDCoCDCoCDCoCBzaGluaW5lc3M6IDUwXG7CoCDCoCDCoCDCoCB9KTsgwqAgwqBcbsKgIMKgIMKgIMKgIGxldCBtYXRlcmlhbHVuZGVyID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweDc1NzI1MixcbsKgIMKgIMKgIMKgIMKgIMKgIHNwZWN1bGFyOiAweGNjY2NjYyxcbsKgIMKgIMKgIMKgIMKgIMKgIHNoaW5pbmVzczogMVxuwqAgwqAgwqAgwqAgfSk7IMKgIMKgXG7CoCDCoCDCoCDCoCBjb25zdCBtYXRlcmlhbHUgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgwqAgwqAgY29sb3I6IDB4MDAwZmZmLCAvLyDnt5HoibJcbsKgIMKgIMKgIMKgIMKgIMKgIHRyYW5zcGFyZW50OiB0cnVlLCAvLyDpgI/mmI7luqbjgpLmnInlirnjgavjgZnjgotcbsKgIMKgIMKgIMKgIMKgIMKgIG9wYWNpdHk6IDAuMiwgwqAgLy8g5Y2K6YCP5piO44Gr6Kit5a6aICg1MCXjga7kuI3pgI/mmI7luqYpXG7CoCDCoCDCoCDCoCDCoCDCoCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXG7CoCDCoCDCoCDCoCB9KTsgwqAgwqBcblxuICAgICAgIC8vICM3NTcyNTJmZlxuICAgICAgICAvL+mAmuW4uOOBruaMr+WLleeJiOOBruiJslxuwqAgwqAgwqAgwqAgbGV0IG1ldGFsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuwqAgwqAgwqAgwqAgwqAgwqAgY29sb3I6IDB4OWU5NjgzLFxuwqAgwqAgwqAgwqAgfSk7XG4gICAgICAgIC8v55m65YWJ5pmC44Gu5oyv5YuV54mI44Gu6ImyXG4gICAgICAgIGxldCBicmlnaHRNZXRhbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweGNjY2NjYywgICAvLyDniankvZPooajpnaLjga7lj43lsIToibLvvIjjg6njgqTjg4jjga7lvbHpn7/jgpLlj5fjgZHjgovvvIlcbsKgIMKgIMKgIMKgIMKgIMKgIHNwZWN1bGFyOiAweGZmZmZmZiwgLy8g6Y+h6Z2i5Y+N5bCE5YWJ44Gu6ImyXG7CoCDCoCDCoCDCoCDCoCDCoCBzaGluaW5lc3M6IDQwMCxcbiAgICAgICAgICAgIC8vIOiHquW3seeZuuWFieiJsuOCkuioreWumlxuICAgICAgICAgICAgZW1pc3NpdmU6IDB4NzVjNGZkZmYsIFxuICAgICAgICAgICAgLy8gZW1pc3NpdmUg44Gu5by344GV44KS44Kz44Oz44OI44Ot44O844OrXG4gICAgICAgICAgICBlbWlzc2l2ZUludGVuc2l0eTogMC44XG7CoCDCoCDCoCDCoCB9KTtcbsKgIMKgIMKgIMKgIC8vIOmHneOBruWPsFxuwqAgwqAgwqAgwqAgbGV0IEJpZ0RhaSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg3LCAwLjA1LCAyLjUpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2hCaWdEYWkgPSBuZXcgVEhSRUUuTWVzaChCaWdEYWksIG1ldGFsTWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaEJpZ0RhaS5wb3NpdGlvbi5zZXQoMy42ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFksIG9yZ2VsWiAtIDEgKiBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgbWVzaEJpZ0RhaS5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoQmlnRGFpLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaEJpZ0RhaSk7IMKgIMKgXG5cbsKgIMKgIMKgIMKgIC8v44Gt44GY44Gu6Iqv44Gu5LiL44Gu5Zub6KeSXG7CoCDCoCDCoCDCoCBsZXQgQmlnY2lyY2xlID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuNiwgMC4yLCAwLjYpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2gxID0gbmV3IFRIUkVFLk1lc2goQmlnY2lyY2xlLCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoMS5wb3NpdGlvbi5zZXQoNi44ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjA1ICogb3JnZWxTLC0wLjA1ICogb3JnZWxTKyBvcmdlbFopO1xuwqAgwqAgwqAgwqAgbWVzaDEuc2NhbGUuc2V0KG9yZ2VsUywgb3JnZWxTLCBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgbWVzaDEuY2FzdFNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChtZXNoMSk7IMKgIMKgIFxuXG7CoCDCoCDCoCDCoCBsZXQgbWlkZGxlY2lyY2xlID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4yNSwgMC4yNSwgMC4zLCAzMik7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDIgPSBuZXcgVEhSRUUuTWVzaChtaWRkbGVjaXJjbGUsIG1hdGVyaWFsKTtcbsKgIMKgIMKgIMKgIG1lc2gyLnBvc2l0aW9uLnNldCg2LjggKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMjUgKiBvcmdlbFMsIC0wLjA1ICogb3JnZWxTK29yZ2VsWik7XG7CoCDCoCDCoCDCoCBtZXNoMi5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoMi5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gyKTsgwqAgwqBcblxuwqAgwqAgwqAgwqAgbGV0IGNvdmVyY2lyY2xlID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4xNSwgMC4xNSwgMC4xLCAzMik7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDMgPSBuZXcgVEhSRUUuTWVzaChjb3ZlcmNpcmNsZSwgbWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaDMucG9zaXRpb24uc2V0KDYuOCAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC40NSAqIG9yZ2VsUywgLTAuMDUgKiBvcmdlbFMrIG9yZ2VsWik7XG7CoCDCoCDCoCDCoCBtZXNoMy5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoMy5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gzKTsgLy8g44K344O844Oz44Gr6L+95YqgXG5cbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgLy/mjK/li5Xmnb/jga7jgZnjgZDkuIvjga7lm5vop5Ljga7mnb9cbsKgIMKgIMKgIMKgIGxldCBuZWdpRGFpID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDQuNCwgMC4xLCAwLjUpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2g0ID0gbmV3IFRIUkVFLk1lc2gobmVnaURhaSwgbWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaDQucG9zaXRpb24uc2V0KDIuNDUgKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMTUgKiBvcmdlbFMsIG9yZ2VsWiArIG9yZ2VsWiAtIDEuOSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoNC5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCBtZXNoNC5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2g0KTtcblxuXG5cbiAgICAgICAgLy/lm57jgZnjgajjgZPjgo3jga7lj5bjgaPmiYvpg6jliIZcbiAgICAgICAgbGV0IHRvdHRlID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC42NiwgMC42NiwgMS41LCA2KTtcbiAgICAgICAgbGV0IG1lc2g3ID0gbmV3IFRIUkVFLk1lc2godG90dGUsIG1hdGVyaWFsKTtcbiAgICAgICAgbWVzaDcucG9zaXRpb24uc2V0KDcuNjUgKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDEuNSAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaLTAuMSk7XG4gICAgICAgIG1lc2g3LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoNyk7XG5cbiAgICAgICAgLy/mm7Lnt5rjga7jg5HjgqTjg5dcbiAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBDdXN0b21TaW5DdXJ2ZShvcmdlbFMgKiAwLjIpO1xuICAgICAgICBjb25zdCBnZW9tZXRyeTEgPSBuZXcgVEhSRUUuVHViZUdlb21ldHJ5KHBhdGgsIDIwLCAwLjUsIDgsIGZhbHNlKTtcbiAgICAgICAgY29uc3QgbWVzaDggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeTEsIG1hdGVyaWFsKTtcbiAgICAgICAgbWVzaDgucm90YXRlWihNYXRoLlBJLzQgKTtcbiAgICAgICAgbWVzaDgucG9zaXRpb24uc2V0KDcuNSAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMS4yICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFotMC4xKTtcbiAgICAgICAgXG4gICAgICAgIG1lc2g4LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoOCk7XG5cblxuICAgICAgICBjb25zdCB1dnMgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgICAgICAgICAgMC41LCAxLCAvLyDkuK3lv4NcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgICAvLyDlt6bkuItcbiAgICAgICAgICAgICAgICAgICAgMSwgMCAgICAvLyDlj7PkuItcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2lyY2xlR2VvbWV0cnnjga7poILngrnmlbDjgavlkIjjgo/jgZvjgabpganliIfjgapVVuW6p+aomeOCkuWumue+qeOBmeOCi+W/heimgeOBjOOBguOCiuOBvuOBmVxuICAgICAgICAgICAgICAgICAgICAvLyDnj77lnKjjga51dnPlrprnvqnjga/poILngrnmlbAz44Gu5LiJ6KeS5b2i55So44Gn44CBMzLjgrvjgrDjg6Hjg7Pjg4jjga7lhobjgavjga/lkIjjgYTjgb7jgZvjgpNcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHR1cmV0ID0gbG9hZGVyLmxvYWQoJ3Rlc3QucG5nJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYXRsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7XG4gICAgICAgICAgICAgICAgICAgICBtYXA6IHRleHR1cmV0LFxuICAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsIFx0Ly8g44GT44KM44KSICd0cnVlJyDjgavjgZfjgarjgYTjgaggJ29wYWNpdHknIOOBjOWKueOBjeOBvuOBm+OCk1xuICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zLCBcdFx0Ly8gNzAl44Gu5LiN6YCP5piO5bqm77yIMzAl6YCP5piO77yJ44Gr6Kit5a6a44GX44G+44GZXG4gICAgICAgICAgICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlICwvLyDlv4XopoHjgafjgYLjgozjgbDkuKHpnaLooajnpLrjgatcbiAgICAgICAgICAgICAgICAgICAgIC8vYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjgYzpgI/jgZHjgabopovjgYjjgovjgojjgYbjgatcbiAgICAgICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgICAgICAgY29uc3QgdGV4dHVyZXQyID0gbG9hZGVyLmxvYWQoJ3Rlc3QyLnBuZycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGVyaWF0bDIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgICAgICAgICAgIG1hcDogdGV4dHVyZXQyLFxuICAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsIFx0Ly8g44GT44KM44KSICd0cnVlJyDjgavjgZfjgarjgYTjgaggJ29wYWNpdHknIOOBjOWKueOBjeOBvuOBm+OCk1xuICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4wMjUsIFx0XHQvLyA3MCXjga7kuI3pgI/mmI7luqbvvIgzMCXpgI/mmI7vvInjgavoqK3lrprjgZfjgb7jgZlcbiAgICAgICAgICAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgLC8vIOW/heimgeOBp+OBguOCjOOBsOS4oemdouihqOekuuOBq1xuICAgICAgICAgICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjgYzpgI/jgZHjgabopovjgYjjgovjgojjgYbjgatcbiAgICAgICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0dXJldDMgPSBsb2FkZXIubG9hZCgndGVzdDMucG5nJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYXRsMyA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge1xuICAgICAgICAgICAgICAgICAgICAgbWFwOiB0ZXh0dXJldDMsXG4gICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSwgXHQvLyDjgZPjgozjgpIgJ3RydWUnIOOBq+OBl+OBquOBhOOBqCAnb3BhY2l0eScg44GM5Yq544GN44G+44Gb44KTXG4gICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjAyNSwgXHRcdC8vIDcwJeOBruS4jemAj+aYjuW6pu+8iDMwJemAj+aYju+8ieOBq+ioreWumuOBl+OBvuOBmVxuICAgICAgICAgICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSAsLy8g5b+F6KaB44Gn44GC44KM44Gw5Lih6Z2i6KGo56S644GrXG4gICAgICAgICAgICAgICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICAgICAgIGRlcHRoV3JpdGU6IGZhbHNlIC8vIOODkeODvOODhuOCo+OCr+ODq+OBjOmAj+OBkeOBpuimi+OBiOOCi+OCiOOBhuOBq1xuICAgICAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgICAgICAgICAvL+OCquODq+OCtOODvOODq+OBruS4i+OBruiJsuS7mOOBjeWGhuebpFxuICAgICAgICAgICAgICAgIGNvbnN0IGNpcmNsZWdlb21ldHJ5ID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KCAyMCwgMzIgKTtcbiAgICAgICAgICAgICAgICAvLyBDaXJjbGVHZW9tZXRyeeOBr+ODh+ODleOCqeODq+ODiOOBp+mBqeWIh+OBqlVW5bqn5qiZ44KS5oyB44Gk44Gf44KB44CB6YCa5bi444Gv5Lul5LiL44Gu6KGM44Gv5LiN6KaB44Gn44GZ44CCXG4gICAgICAgICAgICAgICAgLy8g44KC44GXYHAucG5nYOOBjOWGhuW9ouOBp+OAgeODh+ODleOCqeODq+ODiOOBrlVW44Gn5ZWP6aGM44Gq44GR44KM44Gw44GT44Gu6KGM44KS5YmK6Zmk44GX44Gm44GP44Gg44GV44GE44CCXG4gICAgICAgICAgICAgICAgLy8gY2lyY2xlZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCB1dnMsIDIpKTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlbWVzaD1uZXcgVEhSRUUuTWVzaChjaXJjbGVnZW9tZXRyeSwgbWF0ZXJpYXRsKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVtZXNoLnJvdGF0ZVgoLU1hdGguUEkvMik7XG4gICAgICAgICAgICAgICAgY2lyY2xlbWVzaC5wb3NpdGlvbi5zZXQoMCwtMSwwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGVtZXNoKTtcblxuXG4gICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlZ2VvbWV0cnkyID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KCAyMCwgMzIgKTtcbiAgICAgICAgICAgICAgICAvLyBDaXJjbGVHZW9tZXRyeeOBr+ODh+ODleOCqeODq+ODiOOBp+mBqeWIh+OBqlVW5bqn5qiZ44KS5oyB44Gk44Gf44KB44CB6YCa5bi444Gv5Lul5LiL44Gu6KGM44Gv5LiN6KaB44Gn44GZ44CCXG4gICAgICAgICAgICAgICAgLy8g44KC44GXYHAucG5nYOOBjOWGhuW9ouOBp+OAgeODh+ODleOCqeODq+ODiOOBrlVW44Gn5ZWP6aGM44Gq44GR44KM44Gw44GT44Gu6KGM44KS5YmK6Zmk44GX44Gm44GP44Gg44GV44GE44CCXG4gICAgICAgICAgICAgICAgLy8gY2lyY2xlZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCB1dnMsIDIpKTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlbWVzaDI9bmV3IFRIUkVFLk1lc2goY2lyY2xlZ2VvbWV0cnkyLCBtYXRlcmlhdGwyKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVtZXNoMi5yb3RhdGVYKC1NYXRoLlBJLzIpO1xuICAgICAgICAgICAgICAgIGNpcmNsZW1lc2gyLnBvc2l0aW9uLnNldCgwLC0wLjYsMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlbWVzaDIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY2lyY2xlZ2VvbWV0cnkxID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KCAyMCwgMzIgKTtcbiAgICAgICAgICAgICAgICAvLyBDaXJjbGVHZW9tZXRyeeOBr+ODh+ODleOCqeODq+ODiOOBp+mBqeWIh+OBqlVW5bqn5qiZ44KS5oyB44Gk44Gf44KB44CB6YCa5bi444Gv5Lul5LiL44Gu6KGM44Gv5LiN6KaB44Gn44GZ44CCXG4gICAgICAgICAgICAgICAgLy8g44KC44GXYHAucG5nYOOBjOWGhuW9ouOBp+OAgeODh+ODleOCqeODq+ODiOOBrlVW44Gn5ZWP6aGM44Gq44GR44KM44Gw44GT44Gu6KGM44KS5YmK6Zmk44GX44Gm44GP44Gg44GV44GE44CCXG4gICAgICAgICAgICAgICAgLy8gY2lyY2xlZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKCB1dnMsIDIpKTtcbiAgICAgICAgICAgICAgICBsZXQgY2lyY2xlbWVzaDE9bmV3IFRIUkVFLk1lc2goY2lyY2xlZ2VvbWV0cnkxLCBtYXRlcmlhdGwzKTtcbiAgICAgICAgICAgICAgICBjaXJjbGVtZXNoMS5yb3RhdGVYKC1NYXRoLlBJLzIpO1xuICAgICAgICAgICAgICAgIGNpcmNsZW1lc2gxLnBvc2l0aW9uLnNldCgwLDAsMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlbWVzaDEpO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTE7aTwxMDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2lyY2xlPWNpcmNsZW1lc2gyLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZS5wb3NpdGlvbi5zZXQoMCwtMS41KzAuMTUqaSwwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPDEwO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaXJjbGUxPWNpcmNsZW1lc2gxLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZTEucG9zaXRpb24uc2V0KDAsMC4xNSppLDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGUxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIFxuXG5cblxuICAgICAgICBcbsKgIFxuwqAgwqAgwqAgIMKgbGV0IG1lc2g6IFRIUkVFLk1lc2hbXT1bXTtcblxuwqAgwqAgwqAgwqAgLy/mjK/li5Xmnb9cbsKgIMKgIMKgIMKgIGZvciAobGV0IHggPSAwOyB4IDwgMjU7IHgrKykge1xuwqAgwqAgwqAgwqAgwqAgwqAgbGV0IGJveGVzID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuMTUsIDAuMDEsIDEuOSk7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoW3hdID0gbmV3IFRIUkVFLk1lc2goYm94ZXMsICBtYXRlcmlhbHVuZGVyKTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2hbeF0uY2FzdFNoYWRvdyA9IHRydWU7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoW3hdLnBvc2l0aW9uLnNldCh4ICogMC4yNSAqIG9yZ2VsUyArIDAuMyAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4yICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFogLSAxLjEgKiBvcmdlbFMpO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaFt4XS5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChtZXNoW3hdKTtcbsKgIMKgIMKgIMKgIH1cblxuXG7CoCDCoCDCoCDCoCAvL+aMr+WLleadv+OBrumWk1xuwqAgwqAgwqAgwqAgZm9yIChsZXQgeCA9IDA7IHggPCAyNDsgeCsrKSB7XG4gICAgICAgICAgICAvLzEuNjY1IC0geCAqMC4wNTUsMC40ICsgeCAqMC4wNTVcbsKgIMKgIMKgIMKgIMKgIMKgIGxldCBib3hlcyA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjE1LCAwLjAxLDEuNjY1IC0geCAqMC4wNSk7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGJveGVzLCAgbWF0ZXJpYWx1bmRlcik7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaC5wb3NpdGlvbi5zZXQoeCAqIDAuMjUgKiBvcmdlbFMgKyAwLjQyKiBvcmdlbFMgKyBvcmdlbFgsIG9yZ2VsWSArIDAuMTk5OSAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaIC0gMS45ICogb3JnZWxTICsoIDAuNTI1LTAuMDIgKiB4KSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xuwqAgwqAgwqAgwqAgfVxuXG7CoCDCoCDCoCDCoCAvL+aMr+WLleeJiOOBruOBmeOBkOS4iuOBruWbm+inklxuwqAgwqAgwqAgwqAgbGV0IG5lZ2lEYWkyID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDYsIDAuMDUsIDAuNSk7XG7CoCDCoCDCoCDCoCBsZXQgbWVzaDUgPSBuZXcgVEhSRUUuTWVzaChuZWdpRGFpMiwgbWF0ZXJpYWwpO1xuwqAgwqAgwqAgwqAgbWVzaDUucG9zaXRpb24uc2V0KDMuMyAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4yMSAqIG9yZ2VsUywgb3JnZWxaICsgb3JnZWxaIC0gMS45ICogb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2g1LnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIG1lc2g1LmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobWVzaDUpO1xuXG7CoCDCoCDCoCDCoCBsZXQgbWF0ZXJpYWwyID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbsKgIMKgIMKgIMKgIMKgIMKgIGNvbG9yOiAweGZmZmZmZixcbsKgIMKgIMKgIMKgIMKgIMKgIHNwZWN1bGFyOiAweGZmZmZmZixcbsKgIMKgIMKgIMKgIMKgIMKgIHNoaW5pbmVzczogMFxuwqAgwqAgwqAgwqAgfSk7XG5cbsKgIMKgIMKgIMKgIFxuwqAgwqAgwqAgwqAgLy/mjK/li5XniYjjgpLjgajjgoHjgovjga3jgZjvvJPjgaRcbsKgIMKgIMKgIMKgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgTmVnaSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuMiwgMC4yLCAwLjMsIDYpO1xuwqAgwqAgwqAgwqAgwqAgwqAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChOZWdpLCBtYXRlcmlhbDIpO1xuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIMKgIMKgIG1lc2gucG9zaXRpb24uc2V0KCgwLjcgKyBpICogMS4zKSAqIG9yZ2VsUyArIG9yZ2VsWCwgb3JnZWxZICsgMC4xNCAqIG9yZ2VsUywgwqAgb3JnZWxaICsgb3JnZWxaICsgKC0xLjg5KSAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCBtZXNoLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTtcbsKgIMKgIMKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xuwqAgwqAgwqAgwqAgfVxuXG7CoCDCoCDCoCDCoCAvL+OBreOBmOOBruiKr1xuwqAgwqAgwqAgwqAgbGV0IE5lZ2lDeWxpbmRlciA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuMDIsIDAuMDIsIDUsIDYpO1xuwqAgwqAgwqAgwqAgbGV0IG1lc2g2ID0gbmV3IFRIUkVFLk1lc2goTmVnaUN5bGluZGVyLCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCBtZXNoNi5wb3NpdGlvbi5zZXQoMi43ICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjE5ICogb3JnZWxTLCBvcmdlbFogKyBvcmdlbFopO1xuwqAgwqAgwqAgwqAgbWVzaDYucm90YXRlWihNYXRoLlBJIC8gMik7XG7CoCDCoCDCoCDCoCBtZXNoNi5jYXN0U2hhZG93ID0gdHJ1ZTtcbsKgIMKgIMKgIMKgIHRoaXMuc2NlbmUuYWRkKG1lc2g2KTtcblxuXG5cbsKgIMKgIMKgIMKgIC8v5q2v6LuKXG7CoCDCoCDCoCDCoCAvLyDliIPjga7pg6jliIblrqPoqIBcbsKgIMKgIMKgIMKgIGxldCBicmVlZCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjM1LCAwLjEsIDAuMDIpO1xuXG7CoCDCoCDCoCDCoCAvLyDimIVtZXNoQnJlZWTjgpLkuozmrKHlhYPphY3liJfjgajjgZfjgablrqPoqIDimIVcbsKgIMKgIMKgIMKgIGxldCBtZXNoQnJlZWQ6IFRIUkVFLk1lc2hbXVtdID0gW107IFxuXG7CoCDCoCDCoCDCoCBmb3IgKGxldCB4ID0gMDsgeCA8IDI1OyB4KyspIHtcbsKgIMKgIMKgIMKgIMKgIMKgIGxldCBib3hlc0N5bGluZGVyID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4xMiwgMC4xMiwgMC4xLCAzMik7XG7CoCDCoCDCoCDCoCDCoCDCoCBsZXQgY3lsaW5kZXJNZXNoID0gbmV3IFRIUkVFLk1lc2goYm94ZXNDeWxpbmRlciwgbWF0ZXJpYWwpOyBcbsKgIMKgIMKgIMKgIMKgIMKgIGN5bGluZGVyTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgLy8g44K344Oq44Oz44OA44O844Gu57W25a++5L2N572u44KS55u05o6l6Kit5a6aICjku6XliY3jga5nZWFyR3JvdXAucG9zaXRpb27jgahjeWxpbmRlck1lc2gucG9zaXRpb27jga7ntZDlkIjntZDmnpwpXG7CoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBjeWxpbmRlckFic1ggPSAoeCAqIDAuMjUgKiBvcmdlbFMgKyAwLjMgKiBvcmdlbFMgKyBvcmdlbFgpO1xuwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgY3lsaW5kZXJBYnNZID0gKG9yZ2VsWSArIDAuMiAqIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBjeWxpbmRlckFic1ogPSAob3JnZWxaICsgb3JnZWxaKTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgY3lsaW5kZXJNZXNoLnBvc2l0aW9uLnNldChjeWxpbmRlckFic1gsIGN5bGluZGVyQWJzWSwgY3lsaW5kZXJBYnNaKTtcbsKgIMKgIMKgIMKgIMKgIMKgIGN5bGluZGVyTWVzaC5yb3RhdGVaKE1hdGguUEkgLyAyKTsgLy8g44K344Oq44Oz44OA44O844KSWFrlubPpnaLjgavlr53jgYvjgZvjgotcbsKgIMKgIMKgIMKgIMKgIMKgIGN5bGluZGVyTWVzaC5zY2FsZS5zZXQob3JnZWxTLCBvcmdlbFMsIG9yZ2VsUyk7XG7CoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLmFkZChjeWxpbmRlck1lc2gpOyAvLyDimIXjgrfjg7zjg7Pjgavnm7TmjqXov73liqDimIVcblxuwqAgwqAgwqAgwqAgwqAgwqAgbWVzaEJyZWVkW3hdID0gW107IFxuXG7CoCDCoCDCoCDCoCDCoCDCoCBmb3IgKGxldCB5ID0gMDsgeSA8IDU7IHkrKykge1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgbGV0IGJsYWRlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGJyZWVkLCBtYXRlcmlhbCk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgYmxhZGVNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgYmxhZGVNZXNoLnNjYWxlLnNldChvcmdlbFMsIG9yZ2VsUywgb3JnZWxTKTsgXG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IGFuZ2xlID0gKE1hdGguUEkgLyA1KSAqIHk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGFkZU1lc2gucG9zaXRpb24uc2V0KHggKiAwLjI1ICogb3JnZWxTICsgMC4zICogb3JnZWxTICsgb3JnZWxYLCBvcmdlbFkgKyAwLjIgKiBvcmdlbFMsIG9yZ2VsWiArIG9yZ2VsWik7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGJsYWRlTWVzaC5yb3RhdGVaKE1hdGguUEkgLyAyKTsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGFkZU1lc2gucm90YXRlWShhbmdsZSk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDkuozmrKHlhYPphY3liJfjgavopoHntKDjgpLov73liqDjgZfjgIHjgrfjg7zjg7PjgavjgoLov73liqBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIG1lc2hCcmVlZFt4XS5wdXNoKGJsYWRlTWVzaCk7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQoYmxhZGVNZXNoKTsgLy8g44K344O844Oz6L+95YqgXG7CoCDCoCDCoCDCoCDCoCDCoCB9XG7CoCDCoCDCoCDCoCB9XG7CoCDCoCDCoCDCoFxuXG5cbsKgIMKgIFxuXG7CoCDCoCDCoCDCoCAvLyDlubPpnaLjga7nlJ/miJBcbsKgIMKgIMKgIMKgIFxuXG7CoCDCoCDCoCDCoCAvLyAtLS0g44Op44Kk44OI44Gu6Kit5a6aIC0tLVxuICAgICAgICBsZXQgbGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZWViYiwgMC44KTtcbiAgICAgICAgbGlnaHQucG9zaXRpb24uc2V0KG9yZ2VsWCAtIDEwLCBvcmdlbFkgKyAxNSwgb3JnZWxaIC0gMTApO1xuICAgICAgICBsaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBsaWdodFRhcmdldCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgICAgICBsaWdodFRhcmdldC5wb3NpdGlvbi5zZXQob3JnZWxYICsgMi41LCBvcmdlbFksIG9yZ2VsWik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0VGFyZ2V0KTtcbiAgICAgICAgbGlnaHQudGFyZ2V0ID0gbGlnaHRUYXJnZXQ7XG7CoCDCoCDCoCDCoCBcbsKgIMKgIMKgIMKgIGNvbnN0IHNoYWRvd01hcFNpemUgPSAyMDQ4O1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93Lm1hcFNpemUud2lkdGggPSBzaGFkb3dNYXBTaXplO1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93Lm1hcFNpemUuaGVpZ2h0ID0gc2hhZG93TWFwU2l6ZSDCoCDCoCBcbsKgIMKgIMKgIMKgIGNvbnN0IHNoYWRvd0NhbWVyYUhhbGZTaXplID0gMTA7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLmxlZnQgPSAtc2hhZG93Q2FtZXJhSGFsZlNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLnJpZ2h0ID0gc2hhZG93Q2FtZXJhSGFsZlNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLnRvcCA9IHNoYWRvd0NhbWVyYUhhbGZTaXplO1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93LmNhbWVyYS5ib3R0b20gPSAtc2hhZG93Q2FtZXJhSGFsZlNpemU7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLm5lYXIgPSAwLjE7XG7CoCDCoCDCoCDCoCBsaWdodC5zaGFkb3cuY2FtZXJhLmZhciA9IDQwO1xuwqAgwqAgwqAgwqAgbGlnaHQuc2hhZG93LmJpYXMgPSAtMC4wMDA1O1xuwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5hZGQobGlnaHQpO1xuwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCAvL+ODqeOCpOODiOOBruioreWumue1guOCj+OCilxuXG5cbsKgIMKgIMKgIMKgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jOabtOaWsFxuwqAgwqAgwqAgwqAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG7CoCDCoCDCoCDCoCBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICAvL+atr+i7iuOBruWLleOBjeOBq+OBpOOBhOOBplxuICAgICAgICAgICAgZm9yKGxldCBpPTA7aTwyNTtpKyspe1xuICAgICAgICAgICAgICAgIGlmKGlzUm9sbGluZ1tpXSl7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBtZXNoW2ldLm1hdGVyaWFsPWJyaWdodE1ldGFsTWF0ZXJpYWw7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8NTtqKyspe1xuICAgICAgICAgICAgICAgICAgICBtZXNoQnJlZWRbaV1bal0ucm90YXRlWSgwLjAyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb2xsQW5nbGVbaV0rPTAuMDI7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJvbGxBbmdsZVtpXT49TWF0aC5QSS81KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUm9sbGluZ1tpXT1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc2hbaV0ubWF0ZXJpYWw9bWF0ZXJpYWx1bmRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGxBbmdsZVtpXT0wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy/ntYLjgo/jgorjg7zmra/ou4rjga7li5XjgY3jgavjgaTjgYTjgaZcbiAgICAgICAgICAgIFxuXG5cbsKgIMKgIMKgIMKgIMKgIMKgIC8v5rWB44KM5pif44Gu5YuV44GN44Gr44Gk44GE44GmXG7CoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBlbGFwc2VkVGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTsgXG5cbsKgIMKgIMKgIMKgIMKgIMKgIC8vIOOCouOCr+ODhuOCo+ODluOBquaYn+OCkuOBmeOBueOBpuWHpueQhuOBmeOCi+ODq+ODvOODl1xuwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5hY3RpdmVTdGFycy5mb3JFYWNoKHN0YXI9PntcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGlmKHN0YXIuaXNGaW5pc2hlZClyZXR1cm47XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvL+WNiuW+hOOCkuaxuuOCgeOCi1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5vcmJpdGVSYWRpdXM9b3JnZWxTKigwLjI1KnN0YXIuaW50ZXJ2YWwrMC4wNSk7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8v55m65bCE44GV44KM44Gm44GL44KJ44Gu5pmC6ZaTXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCB0aW1lU2luZWNlTGF1bmNoPWVsYXBzZWRUaW1lLXN0YXIuc3RhcnRUaW1lO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgYW5nbGU9dGltZVNpbmVjZUxhdW5jaCp0aGlzLm9yYml0ZVNwZWVkO1xuXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyAx5ZGo77yJ44KS5Zue44Gj44Gf44KJ5pif44KS5raI5ruF44GV44Gb44KLXG4gICAgICAgICAgICAgICAgaWYoYW5nbGU+KE1hdGguUEkqKDQvOCkpJiZhbmdsZTwoTWF0aC5QSSooNS84KSkpe1xuICAgICAgICAgICAgICAgICAgICBpc1JvbGxpbmdbc3Rhci5pbnRlcnZhbC0xXSA9dHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoYW5nbGU+TWF0aC5QSSoxLjUpe1xuICAgICAgICAgICAgICAgICAgICBzdGFyLm1lc2guc2NhbGUuc2V0KHN0YXIubWVzaC5zY2FsZS54KjAuOSxzdGFyLm1lc2guc2NhbGUueSowLjksc3Rhci5tZXNoLnNjYWxlLnoqMC45KTtcbiAgICAgICAgICAgICAgICAgICAgc3Rhci50cmFpbFNlZ21lbnRzLmZvckVhY2goKG1lc2gpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoLnNjYWxlLnNldChtZXNoLnNjYWxlLngqMC45LG1lc2guc2NhbGUueSowLjksbWVzaC5zY2FsZS56KjAuOSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc3Rhci50cmFpbFNlZ21lbnRzWzBdLnNjYWxlLnNldChzdGFyLnRyYWlsR3JvdXAuc2NhbGUueCowLjksc3Rhci50cmFpbEdyb3VwLnNjYWxlLnkqMC45LHN0YXIudHJhaWxHcm91cC5zY2FsZS56KjAuOSk7XG4gICAgICAgICAgICAgICAgfVxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgaWYoYW5nbGU+MipNYXRoLlBJKXtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIuaXNGaW5pc2hlZD10cnVlO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44K344O844Oz44GL44KJ44Oh44OD44K344Ol44KS5YmK6ZmkXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB0aGlzLnNjZW5lLnJlbW92ZShzdGFyLm1lc2gpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgdGhpcy5zY2VuZS5yZW1vdmUoc3Rhci50cmFpbEdyb3VwKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHJldHVybjsgLy8g57WC5LqG44GX44Gf44KJ5qyh44Gu5pif44G4XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8v6LuM6YGT6KiI566XXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCB0cmFpbFRoaWNrbmVzcz0wLjA0Km9yZ2VsUztcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG5ld1g9TWF0aC5zaW4oYW5nbGUpKnRoaXMub3JiaXRlUmFkaXVzO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44CQ5L+u5q2j44CRWeW6p+aomeOCkuOCquODq+OCtOODvOODq+mDqOWTgeOCiOOCiumrmOOBhOS9jee9ruOBq+ioreWumlxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgbmV3WT10aGlzLnN0YXJIZWlnaHQ7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgbmV3Wj1NYXRoLmNvcyhhbmdsZSkqdGhpcy5vcmJpdGVSYWRpdXM7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBuZXdQb3NpdGlvbj1uZXcgVEhSRUUuVmVjdG9yMyhuZXdYLG5ld1ksbmV3Wik7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIubWVzaC5wb3NpdGlvbi5jb3B5KG5ld1Bvc2l0aW9uKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOi7jOi3oeOBrumggueCueOCkui/veWKoFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci50cmFpbFBvaW50cy5wdXNoKG5ld1Bvc2l0aW9uLmNsb25lKCkpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvLyDou4zot6Hjga7ngrnmlbDjgpLliLbpmZBcbiAgICAgICAgICAgICAgICAvLyDjgJDkv67mraMx44CRbWF4VHJhaWxQb2ludHPjgpLotoXjgYjjgZ/jgajjgY0gKD49IOOCkiA+IOOBq+WkieabtClcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHdoaWxlKHN0YXIudHJhaWxQb2ludHMubGVuZ3RoID4gdGhpcy5tYXhUcmFpbFBvaW50cyl7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzdGFyLnRyYWlsUG9pbnRzLnNoaWZ0KCk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOi7jOi3oeOCu+OCsOODoeODs+ODiOOBruabtOaWsFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgaWYoc3Rhci50cmFpbFBvaW50cy5sZW5ndGg+PTIpe1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgY29uc3QgcDE9c3Rhci50cmFpbFBvaW50c1tzdGFyLnRyYWlsUG9pbnRzLmxlbmd0aC0yXTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IHAyPXN0YXIudHJhaWxQb2ludHNbc3Rhci50cmFpbFBvaW50cy5sZW5ndGgtMV07XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb25zdCBkaXN0YW5jZT1wMS5kaXN0YW5jZVRvKHAyKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG1pZFBvaW50PXAxLmNsb25lKCkubGVycChwMiwwLjUpO1xuXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBsZXQgc2VnbWVudFRvVXBkYXRlOlRIUkVFLk1lc2g7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGlmKHN0YXIudHJhaWxTZWdtZW50cy5sZW5ndGg8IHRoaXMubWF4VHJhaWxQb2ludHMgLSAxKXtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOaWsOimj+S9nOaIkFxuICAgICAgICAgICAgICAgICAgICBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBjb2xvcjogMHg4OGJiZmYsXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB0cmFuc3BhcmVudDogdHJ1ZSwgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGRlcHRoV3JpdGU6IGZhbHNlLCBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9KTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZSA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuc2VnbWVudEdlb21ldHJ5LCBtYXRlcmlhbCk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCAvL+W5hSAoWClcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5zY2FsZS54PXRyYWlsVGhpY2tuZXNzO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44CQ5L+u5q2jMuOAkemrmOOBlSAoWSlcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5zY2FsZS55PXRyYWlsVGhpY2tuZXNzO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci50cmFpbEdyb3VwLmFkZChzZWdtZW50VG9VcGRhdGUpO1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc3Rhci50cmFpbFNlZ21lbnRzLnB1c2goc2VnbWVudFRvVXBkYXRlKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH1lbHNle1xuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g5YaN5Yip55So77yI5pyA44KC5Y+k44GE44KC44Gu44KS5YaN5Yip55So44GX44CB6YWN5YiX44Gu5pyA5b6M44G477yJXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzZWdtZW50VG9VcGRhdGU9c3Rhci50cmFpbFNlZ21lbnRzLnNoaWZ0KCkgYXMgVEhSRUUuTWVzaDtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHN0YXIudHJhaWxTZWdtZW50cy5wdXNoKHNlZ21lbnRUb1VwZGF0ZSk7XG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCB9XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIC8vIOOCueOCseODvOODq+OBqOS9jee9ruOAgeWbnui7ouOCkuabtOaWsFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgc2VnbWVudFRvVXBkYXRlLnNjYWxlLnogPSBkaXN0YW5jZTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5wb3NpdGlvbi5jb3B5KG1pZFBvaW50KTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG9yaWVudGF0aW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IG9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc3ViVmVjdG9ycyhwMiwgcDEpOyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIG9yaWVudGF0aW9uLnNldEZyb21Vbml0VmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKSwgb2Zmc2V0LmNsb25lKCkubm9ybWFsaXplKCkpOyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIHNlZ21lbnRUb1VwZGF0ZS5zZXRSb3RhdGlvbkZyb21RdWF0ZXJuaW9uKG9yaWVudGF0aW9uKTtcblxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgLy8g44OV44Kn44O844OJ44Ki44Km44OI5Yq55p6c44Gu6YGp55SoXG7CoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCDCoCBzdGFyLnRyYWlsU2VnbWVudHMuZm9yRWFjaCgobWVzaCwgaW5kZXgpID0+IHtcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIGNvbnN0IHJhdGlvID0gaW5kZXggLyBzdGFyLnRyYWlsU2VnbWVudHMubGVuZ3RoOyBcbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIChtZXNoLm1hdGVyaWFsIGFzIFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKS5vcGFjaXR5ID0gTWF0aC5wb3cocmF0aW8sIDEuNSkgKiAwLjg7IFxuwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgwqAgfSk7XG5cbsKgIMKgIMKgIMKgIMKgIMKgIMKgIMKgIH1cblxuwqAgwqAgwqAgwqAgwqAgwqAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIOe1guS6huOBl+OBn+aYn+OCkiBhY3RpdmVTdGFycyDphY3liJfjgYvjgonliYrpmaTjgZnjgosgKOODquOCveODvOOCueeuoeeQhilcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU3RhcnMgPSB0aGlzLmFjdGl2ZVN0YXJzLmZpbHRlcihzdGFyID0+ICFzdGFyLmlzRmluaXNoZWQpO1xuICAgICAgICAgICAgXG7CoCDCoCDCoCDCoCDCoCDCoCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbsKgIMKgIMKgIMKgIH1cbsKgIMKgIFxuwqAgwqAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG7CoCDCoCB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbsKgIMKgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG7CoCDCoCBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00od2luZG93LmlubmVyV2lkdGgsXG4gIHdpbmRvdy5pbm5lckhlaWdodCwgbmV3IFRIUkVFLlZlY3RvcjMoMjAsIDIwICwwKSk7Ly/jgqvjg6Hjg6njga7luqfmqJlcbsKgIMKgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufVxuXG5jbGFzcyBDdXN0b21TaW5DdXJ2ZSBleHRlbmRzIFRIUkVFLkN1cnZlPFRIUkVFLlZlY3RvcjM+IHtcbiAgICBwdWJsaWMgc2NhbGU6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHNjYWxlID0gMSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XG4gICAgfVxuXG4gICAgZ2V0UG9pbnQodDogbnVtYmVyLCBvcHRpb25hbFRhcmdldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCkpOiBUSFJFRS5WZWN0b3IzIHtcbiAgICAgICAgY29uc3QgdHggPSB0ICogNiAtIDU7XG4gICAgICAgIGNvbnN0IHR5ID0gTWF0aC5zaW4oMiAqIE1hdGguUEkgKiB0KTtcbiAgICAgICAgY29uc3QgdHogPSAwO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWxUYXJnZXQuc2V0KHR4LCB0eSwgdHopLm11bHRpcGx5U2NhbGFyKHRoaXMuc2NhbGUpO1xuICAgIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYml0Q29udHJvbHNfanMtbm9kZV9tb2R1bGVzX3RvbmVfYnVpbGRfZXNtLTllOGQ4NlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==