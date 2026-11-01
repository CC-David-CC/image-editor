// Detect container-level animation before the browser decodes only one frame.
export function matchesImageFormat(bytes,mime){
 const is=(at,text)=>at+text.length<=bytes.length&&[...text].every((c,i)=>bytes[at+i]===c.charCodeAt(0));
 if(mime==='image/png')return bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
 if(mime==='image/jpeg')return bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(mime==='image/webp')return is(0,'RIFF')&&is(8,'WEBP');
 return false;
}
export function isAnimatedImage(bytes){
 const is=(at,text)=>at+text.length<=bytes.length&&[...text].every((c,i)=>bytes[at+i]===c.charCodeAt(0));
 const data=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n)){
  for(let at=8;at+12<=bytes.length;){const size=data.getUint32(at);if(size>bytes.length-at-12)break;if(is(at+4,'acTL'))return true;if(is(at+4,'IDAT')||is(at+4,'IEND'))break;at+=12+size;}
 }
 if(is(0,'RIFF')&&is(8,'WEBP')){
  for(let at=12;at+8<=bytes.length;){const size=data.getUint32(at+4,true);if(size>bytes.length-at-8)break;if(is(at,'ANIM')||(is(at,'VP8X')&&size>=1&&(bytes[at+8]&2)))return true;at+=8+size+(size&1);}
 }
 return false;
}

// Canvas export re-encodes pixels and does not preserve embedded metadata.
// Recognize common metadata containers before the image is decoded.
export function hasImageMetadata(bytes){
 const is=(at,text)=>at+text.length<=bytes.length&&[...text].every((c,i)=>bytes[at+i]===c.charCodeAt(0));
 const data=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n)){
  for(let at=8;at+12<=bytes.length;){const size=data.getUint32(at);if(size>bytes.length-at-12)break;const type=String.fromCharCode(...bytes.subarray(at+4,at+8));if(['tEXt','zTXt','iTXt','eXIf','iCCP','pHYs','tIME','cHRM','gAMA','sRGB'].includes(type))return true;if(type==='IEND')break;at+=12+size;}
 }
 if(bytes.length>=2&&bytes[0]===255&&bytes[1]===216){
  for(let at=2;at+1<bytes.length;){if(bytes[at++]!==255)break;while(at<bytes.length&&bytes[at]===255)at++;if(at>=bytes.length)break;const marker=bytes[at++];if(marker===0xda||marker===0xd9)break;if(marker===1||(marker>=0xd0&&marker<=0xd7))continue;if(at+2>bytes.length)break;const size=data.getUint16(at);if(size<2||size>bytes.length-at)break;if([0xe1,0xe2,0xed,0xfe].includes(marker))return true;at+=size;}
 }
 if(is(0,'RIFF')&&is(8,'WEBP')){
  for(let at=12;at+8<=bytes.length;){const size=data.getUint32(at+4,true);if(size>bytes.length-at-8)break;if(['EXIF','XMP ','ICCP'].some(type=>is(at,type)))return true;at+=8+size+(size&1);}
 }
 return false;
}
