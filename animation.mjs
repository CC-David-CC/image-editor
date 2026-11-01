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
