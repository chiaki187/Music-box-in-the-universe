// three.meshline.d.ts
declare module 'three.meshline' {
    // クラスを定義する。これで TypeScript はこのクラスの存在を知る
    export class MeshLine {}
    export class MeshLineMaterial {}
    export class MeshLineRaycast {}

    // 【重要】モジュール全体をデフォルトエクスポートとして扱う場合の型を定義
    // これで require() や import * as X が行われた際の型チェックを緩和する
    export default MeshLine;
}