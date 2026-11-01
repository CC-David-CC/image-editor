import assert from 'node:assert/strict';import {matchesImageFormat} from '../apps/system/image-editor/animation.mjs';
const png=Uint8Array.from([137,80,78,71,13,10,26,10]),jpeg=Uint8Array.from([255,216,255]),webp=Uint8Array.from([82,73,70,70,0,0,0,0,87,69,66,80]),gif=new TextEncoder().encode('GIF89a');
for(const [bytes,mime] of [[png,'image/png'],[jpeg,'image/jpeg'],[webp,'image/webp']]){assert.equal(matchesImageFormat(bytes,mime),true);for(const other of ['image/png','image/jpeg','image/webp'].filter(x=>x!==mime))assert.equal(matchesImageFormat(bytes,other),false)}
for(const mime of ['image/png','image/jpeg','image/webp']){assert.equal(matchesImageFormat(gif,mime),false);assert.equal(matchesImageFormat(new Uint8Array(),mime),false)}
console.log('PASS PNG, JPEG and WebP signatures reject mismatches and short input');
