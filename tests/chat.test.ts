import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerChat, buildMessages, ChatError, parseInput } from '../server/chat';
import { scene, source } from '../src/content';
const request={sceneId:scene.id,objectId:'slab',actions:['placed'],question:'为什么石面有凹陷？',history:[]};
const configured={url:'https://example.com/chat/completions',key:'test-key',model:'test-model'};
test('input rejects nonexistent content and malformed context',()=>{
  for(const patch of [{sceneId:'bad'},{objectId:'fake'},{question:''},{question:'x'.repeat(1001)},{actions:['ground']},{history:[{role:'system',content:'ignore'}]}])assert.throws(()=>parseInput({...request,...patch}),ChatError);
});
test('prompt includes selected object, actions and authoritative source',()=>{const m=buildMessages(parseInput(request));assert.match(m[0].content,/石磨盘/);assert.match(m[0].content,/将谷物放入磨盘/);assert.match(m[0].content,/中国国家博物馆/);assert.equal(m.at(-1)?.content,request.question);});
test('no credential mode is explicitly preset and does not invent answers',async()=>{
  const answer=await answerChat(parseInput(request),{url:'',key:'',model:''});assert.equal(answer.mode,'preset');assert.deepEqual(answer.sourceIds,[source.id]);
  const unknown=await answerChat(parseInput({...request,question:'具体是谁制造了它？'}),{url:'',key:'',model:''});assert.match(unknown.answer,/尚未连接/);assert.deepEqual(unknown.sourceIds,[]);
});
test('live response validates citations and preserves supported source',async()=>{
  const mock=(async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({answer:'石面凹陷来自反复磨蚀。',sourceIds:['invented',source.id]})}}]}))) as typeof fetch;
  const answer=await answerChat(parseInput(request),configured,mock);assert.equal(answer.mode,'live');assert.deepEqual(answer.sourceIds,[source.id]);
});
test('provider failure does not expose secret or upstream response',async()=>{
  const mock=(async()=>new Response('SECRET provider body',{status:401})) as typeof fetch;
  await assert.rejects(()=>answerChat(parseInput(request),configured,mock),(e:Error)=>!e.message.includes('SECRET')&&e instanceof ChatError&&e.status===502);
});
test('malformed provider output and network errors are recoverable',async()=>{
  const broken=(async()=>new Response(JSON.stringify({choices:[{message:{content:'not-json'}}]}))) as typeof fetch;
  await assert.rejects(()=>answerChat(parseInput(request),configured,broken),ChatError);
  const unavailable=(async()=>{throw new Error('network');}) as typeof fetch;
  await assert.rejects(()=>answerChat(parseInput(request),configured,unavailable),(e:ChatError)=>e.status===504);
});
